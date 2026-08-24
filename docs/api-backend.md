# Integración Backend — Sonrisa Dental

## Visión general

La app actual no tiene backend. Todo está hardcodeado en `src/lib/data.ts`. Este documento define el plan para crear una API REST que reemplace esa data estática.

---

## Stack recomendado

| Componente | Tecnología | Por qué |
|---|---|---|
| **Runtime** | Node.js (Next.js API Routes) | Ya usas Next.js, no necesitas otro server |
| **Base de datos** | PostgreSQL | Relacional, robusto, ideal para datos estructurados |
| **ORM** | Prisma | Type-safe, migraciones, excelente DX |
| **Auth** | NextAuth.js (Auth.js) | Integración nativa con Next.js |
| **Validación** | Zod | Validación de request + tipos TypeScript |
| **API style** | REST + JSON | Simple, ampliamente soportado |

---

## Estructura de la API

### Rutas principales

```
/api/
├── auth/                  # Autenticación
│   ├── login/
│   ├── logout/
│   └── session/
├── pacientes/             # CRUD pacientes
│   ├── GET /              # Listar (con búsqueda, paginación)
│   ├── POST /             # Crear
│   ├── GET /[id]          # Detalle
│   ├── PUT /[id]          # Actualizar
│   └── DELETE /[id]       # Eliminar (soft delete)
├── citas/                 # CRUD citas
│   ├── GET /              # Listar (con filtros de fecha, doctor, estado)
│   ├── POST /             # Crear
│   ├── GET /[id]          # Detalle
│   ├── PUT /[id]          # Actualizar
│   ├── PATCH /[id]/estado # Cambiar estado (completar, cancelar)
│   ├── PATCH /[id]/mover  # Reagendar (cambiar fecha/hora)
│   └── DELETE /[id]       # Eliminar
├── facturacion/           # CRUD facturas
│   ├── GET /              # Listar (con filtros de estado, fecha)
│   ├── POST /             # Crear
│   ├── GET /[id]          # Detalle
│   ├── PUT /[id]          # Actualizar
│   ├── PATCH /[id]/pago   # Registrar pago
│   └── DELETE /[id]       # Eliminar
├── historial/             # CRUD historial clínico
│   ├── GET /              # Listar (por paciente, doctor)
│   ├── POST /             # Crear registro
│   ├── GET /[id]          # Detalle
│   ├── PUT /[id]          # Actualizar
│   └── DELETE /[id]       # Eliminar
├── doctores/              # CRUD doctores
│   ├── GET /              # Listar
│   ├── POST /             # Crear
│   ├── GET /[id]          # Detalle
│   ├── PUT /[id]          # Actualizar
│   └── DELETE /[id]       # Eliminar
└── dashboard/             # Datos agregados
    ├── GET /stats         # Estadísticas del dashboard
    ├── GET /actividad     # Actividad reciente
    └── GET /proximas-citas # Próximas citas (agregado)
```

---

## Ejemplo: Endpoints de Citas

### GET /api/citas

```typescript
// Query params
{
  page?: number;          // Default: 1
  limit?: number;         // Default: 20
  estado?: "pendiente" | "completada" | "cancelada";
  doctor?: string;        // ID del doctor
  paciente?: string;      // ID del paciente
  fechaDesde?: string;    // ISO date: "2026-08-01"
  fechaHasta?: string;    // ISO date: "2026-08-31"
}

// Response
{
  data: Cita[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### POST /api/citas

```typescript
// Request body
{
  pacienteId: string;
  doctorId: string;
  fechaISO: string;    // "2026-08-15"
  hora: string;        // "10:30"
  tipo: string;        // "Limpieza dental"
  duracion: number;    // 45
}

// Validaciones:
// - pacienteId debe existir
// - doctorId debe existir y estar disponible
// - fechaISO no puede ser en el pasado
// - No puede haber conflicto de horario (mismo doctor, misma fecha/hora)
// - La duración debe estar en DURACIONES_CITA

// Response: 201 Created
{
  id: "C-113",
  ...campos,
  estado: "pendiente"
}
```

### PATCH /api/citas/:id/estado

```typescript
// Request body
{
  estado: "completada" | "cancelada";
}

// Side effects:
// - Si se marca como "completada", se crea un registro en historial clínico
// - Se actualiza la "ultimaVisita" del paciente
// - Se dispara notificación (futuro)
```

### PATCH /api/citas/:id/mover

```typescript
// Request body (para drag & drop en calendario)
{
  fechaISO: string;
  hora: string;
}

// Validaciones:
// - No puede mover citas pasadas
// - Verificar disponibilidad del doctor en el nuevo horario
```

---

## Ejemplo: Dashboard Stats

### GET /api/dashboard/stats

```typescript
// Response
{
  totalPacientes: number;
  pacientesActivos: number;
  citasHoy: number;
  citasPendientes: number;
  facturacionMes: {
    total: number;
    cobrado: number;
    pendiente: number;
  };
  tasaAsistencia: number;  // Porcentaje (0-100)
}
```

---

## Autenticación

### Roles y permisos

| Rol | Pacientes | Citas | Facturación | Historial | Doctores | Dashboard |
|---|---|---|---|---|---|---|
| **Admin** | CRUD | CRUD | CRUD | CRUD | CRUD | Ver todo |
| **Recepcionista** | CRUD | CRUD | CRUD | Solo lectura | Solo lectura | Ver todo |
| **Dentista** | Solo lectura | CRUD (propias) | Solo lectura | CRUD | Solo lectura | Ver propio |

### flujo de auth

```
1. Login → /api/auth/login (email + password)
2. Response → JWT token (httpOnly cookie)
3. Requests → Authorization: Bearer <token>
4. Middleware Next.js → Verifica token, inyecta user en request
5. Cada endpoint → Verifica permisos del rol
```

---

## Migración de data.ts → Backend

### Fase 1: Schemas Prisma

```prisma
model Paciente {
  id          String   @id @default(uuid())
  nombre      String
  email       String   @unique
  telefono    String
  edad        Int
  estado      EstadoPaciente @default(pendiente)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  citas       Cita[]
  facturas    Factura[]
  historial   RegistroClinico[]
}

model Cita {
  id          String   @id @default(uuid())
  pacienteId  String
  doctorId    String
  fechaISO    String
  hora        String
  tipo        String
  duracion    Int
  estado      EstadoCita @default(pendiente)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  paciente    Paciente @relation(fields: [pacienteId], references: [id])
  doctor      Doctor   @relation(fields: [doctorId], references: [id])
}

// ... similar para Factura, RegistroClinico, Doctor
```

### Fase 2: Seed data

Migrar los 10 pacientes, 12 citas, etc. de `data.ts` a un script de seed de Prisma.

### Fase 3: Reemplazar fetch

```typescript
// Antes (data hardcodeada)
import { pacientes } from "@/lib/data";
const lista = pacientes;

// Después (API)
const res = await fetch("/api/pacientes");
const { data: lista } = await res.json();
```

---

## Rate limiting

- **General:** 100 requests/min por usuario
- **Búsqueda:** 30 requests/min
- **Dashboard stats:** 10 requests/min (data cacheada en servidor)

---

## Logging y auditoría

Cada operación CRUD debe registrar:
- Quién hizo la operación (user ID)
- Qué operación (CREATE, UPDATE, DELETE)
- Qué entidad y ID
- Timestamp
- Payload anterior (para updates)
