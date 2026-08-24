# Estrategia Offline y Persistencia — Sonrisa Dental

## Contexto

La app es una **PWA** (service worker + manifest). Actualmente el SW cachea assets y páginas, pero **no persiste la data de la app**. Si el usuario pierde conexión:
- ✅ La interfaz se carga (desde caché)
- ❌ Los datos son los del último build, no los cambios del usuario
- ❌ No puede crear/editar nada sin conexión

Este documento define cómo resolver eso.

---

## Arquitectura objetivo

```
┌─────────────────────────────────────────────────┐
│                  CAPA DE UI                       │
│         React Components (ya existen)            │
├─────────────────────────────────────────────────┤
│              CAPA DE ESTADO                       │
│          TanStack Query (server state)           │
│     ┌──────────────┐   ┌──────────────────┐     │
│     │  Online mode  │   │  Offline mode    │     │
│     │  → fetch API  │   │  → IndexedDB     │     │
│     └──────────────┘   └──────────────────┘     │
├─────────────────────────────────────────────────┤
│              CAPA DE PERSISTENCIA LOCAL           │
│              Dexie.js (IndexedDB)                │
│     Cache offline + cola de sync                 │
├─────────────────────────────────────────────────┤
│              SERVICE WORKER                       │
│     Cache de assets + intercept fetch            │
└─────────────────────────────────────────────────┘
```

---

## Stack de persistencia

| Componente | Tecnología | Tamaño | Por qué |
|---|---|---|---|
| **IndexedDB wrapper** | Dexie.js | ~12 KB | API simple, tipada, soporte completo |
| **Server state** | TanStack Query | ~12 KB | Caché de API, sync, retry, optimistic updates |
| **Service Worker** | nativo (sw.js) | 0 KB | Ya implementado |

### ¿Por qué Dexie.js y no localStorage?

| Característica | localStorage | Dexie.js (IndexedDB) |
|---|---|---|
| Capacidad | ~5 MB | ~50% del disco |
| Tipo de datos | Strings | Objetos, arrays, binario |
| Consultas | Clave-valor simple | Índices, rangos, búsquedas |
| Async | No (bloquea main thread) | Sí (no bloquea) |
| Para 1000+ registros | Lento | Rápido |

---

## Schema de IndexedDB (Dexie.js)

```typescript
// src/lib/db.ts
import Dexie, { type EntityTable } from "dexie";

interface PacienteDB {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  edad: number;
  estado: "activo" | "pendiente" | "inactivo";
  ultimaVisita: string;
  proximaCita: string;
  _syncedAt?: number;    // Timestamp del último sync con server
  _dirty?: boolean;      // true = tiene cambios sin sincronizar
}

interface CitaDB {
  id: string;
  pacienteId: string;
  doctorId: string;
  fechaISO: string;
  hora: string;
  tipo: string;
  duracion: number;
  estado: "pendiente" | "completada" | "cancelada";
  _syncedAt?: number;
  _dirty?: boolean;
}

interface FacturaDB {
  id: string;
  numero: string;
  pacienteId: string;
  concepto: string;
  fecha: string;
  monto: number;
  estado: "pagada" | "pendiente" | "vencida";
  _syncedAt?: number;
  _dirty?: boolean;
}

interface RegistroHistorialDB {
  id: string;
  pacienteId: string;
  doctorId: string;
  fecha: string;
  tratamiento: string;
  diagnostico: string;
  estado: "finalizado" | "en_curso" | "programado";
  _syncedAt?: number;
  _dirty?: boolean;
}

interface SyncQueueItem {
  id?: number;
  entity: string;
  entityId: string;
  action: "create" | "update" | "delete";
  payload: unknown;
  timestamp: number;
  retries: number;
}

const db = new Dexie("SonrisaDentalDB") as Dexie & {
  pacientes: EntityTable<PacienteDB, "id">;
  citas: EntityTable<CitaDB, "id">;
  facturas: EntityTable<FacturaDB, "id">;
  historial: EntityTable<RegistroHistorialDB, "id">;
  syncQueue: EntityTable<SyncQueueItem, "id">;
};

db.version(1).stores({
  pacientes: "id, email, estado, _dirty",
  citas: "id, pacienteId, doctorId, fechaISO, estado, _dirty",
  facturas: "id, pacienteId, estado, _dirty",
  historial: "id, pacienteId, doctorId, estado, _dirty",
  syncQueue: "++id, entity, entityId, action, timestamp",
});

export default db;
```

---

## Flujo offline → online

### Crear algo offline

```
1. Usuario crea una cita (sin conexión)
2. Se guarda en IndexedDB con _dirty = true
3. Se agrega a syncQueue: { entity: "citas", action: "create", payload: {...} }
4. UI muestra la cita como "pendiente de sincronización" (icono de sync)
```

### Reconexión

```
1. Se detecta reconexión (addEventListener("online") o poll)
2. Se procesa syncQueue en orden FIFO
3. Para cada item:
   a. Se intenta enviar al backend (POST/PUT/PATCH/DELETE)
   b. Si éxito: se marca _dirty = false, se elimina de syncQueue
   c. Si error: se incrementa retries (máx 3), se reintenta después
4. Se hace fetch de datos actualizados del backend
5. Se actualiza IndexedDB con la data fresca
```

### Conflictos

Estrategia: **Last Write Wins (LWW)** con timestamp

```
Si el servidor tiene una versión más reciente → usar la del servidor
Si el cliente tiene la versión más reciente → enviar la del cliente
Si hay conflicto real (ej: 2 doctores agendaron la misma hora) → mostrar warning al usuario
```

---

## Integración con TanStack Query

```typescript
// hooks/useCitas.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import db from "@/lib/db";

export function useCitas(filtro?: string) {
  return useQuery({
    queryKey: ["citas", filtro],
    queryFn: async () => {
      const res = await fetch(`/api/citas?estado=${filtro || ""}`);
      const { data } = await res.json();
      // Actualizar IndexedDB con data fresca
      await db.citas.bulkPut(data.map((c: any) => ({ ...c, _syncedAt: Date.now(), _dirty: false })));
      return data;
    },
    // Si falla la red, usar IndexedDB como fallback
    placeholderData: () => db.citas.toArray(),
  });
}

export function useCrearCita() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (nuevaCita: CitaDB) => {
      if (navigator.onLine) {
        const res = await fetch("/api/citas", {
          method: "POST",
          body: JSON.stringify(nuevaCita),
        });
        return res.json();
      } else {
        // Offline: guardar en IndexedDB + queue
        await db.citas.add({ ...nuevaCita, _dirty: true });
        await db.syncQueue.add({
          entity: "citas",
          entityId: nuevaCita.id,
          action: "create",
          payload: nuevaCita,
          timestamp: Date.now(),
          retries: 0,
        });
        return nuevaCita;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["citas"] });
    },
  });
}
```

---

## Migración de data.ts → IndexedDB

### Paso 1: Seed inicial

```typescript
// src/lib/seed.ts
import db from "./db";
import { pacientes, citas, facturas, historial, doctores } from "./data";

export async function seedDatabase() {
  const count = await db.pacientes.count();
  if (count > 0) return; // Ya tiene data
  
  await db.pacientes.bulkAdd(pacientes.map(p => ({
    ...p,
    _syncedAt: Date.now(),
    _dirty: false,
  })));
  
  await db.citas.bulkAdd(citas.map(c => ({
    ...c,
    _syncedAt: Date.now(),
    _dirty: false,
  })));
  
  // ... similar para facturas, historial, doctores
}
```

### Paso 2: Cargar en layout

```typescript
// src/app/layout.tsx
import { seedDatabase } from "@/lib/seed";

// En un useEffect o en la inicialización de la app
await seedDatabase();
```

### Paso 3: Reemplazar imports

```typescript
// Antes
import { pacientes } from "@/lib/data";

// Después
import db from "@/lib/db";
const pacientes = await db.pacientes.toArray();
```

---

## Offline Queue Manager

```typescript
// src/lib/sync.ts
import db from "./db";

export async function processSyncQueue() {
  if (!navigator.onLine) return;
  
  const items = await db.syncQueue.orderBy("id").toArray();
  
  for (const item of items) {
    try {
      const method = {
        create: "POST",
        update: "PUT",
        delete: "DELETE",
      }[item.action];
      
      const url = `/api/${item.entity}/${item.action === "create" ? "" : item.entityId}`;
      
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: item.action !== "delete" ? JSON.stringify(item.payload) : undefined,
      });
      
      // Éxito: limpiar
      await db.syncQueue.delete(item.id!);
      await db[item.entity].update(item.entityId, { _dirty: false });
      
    } catch (error) {
      // Error: reintentar
      if (item.retries >= 3) {
        console.error(`Sync failed for ${item.entity}/${item.entityId}, giving up`);
        await db.syncQueue.delete(item.id!);
      } else {
        await db.syncQueue.update(item.id!, { retries: item.retries + 1 });
      }
    }
  }
}

// Escuchar reconexión
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    processSyncQueue();
  });
}
```

---

## Indicador de estado offline

```tsx
// src/components/offline-indicator.tsx
"use client";

import { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  
  useEffect(() => {
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  
  if (isOnline) return null;
  
  return (
    <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-lg">
      <WifiOff className="mr-2 inline h-4 w-4" />
      Sin conexión — Los cambios se sincronizarán al reconectar
    </div>
  );
}
```

---

## Limitaciones conocidas

1. **iOS Safari:** IndexedDB tiene un límite de ~50MB y puede ser borrado por el sistema si el dispositivo queda sin espacio
2. **Sync queue:** Si el usuario crea 1000 registros offline, la cola puede crecer mucho → considerar límite o compresión
3. **Conflictos complejos:** LWW funciona para casos simples, pero para casos como "dos doctores agendaron la misma hora" se necesita lógica de negocio específica
4. **Primer load:** La primera vez que abre la app sin conexión, no tiene data (aún no se ha synciado) → necesita al menos 1 load online
