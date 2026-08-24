# Flujo de Usuario y Módulos — Sonrisa Dental

## Mapa de la app

```
┌─────────────────────────────────────────────────┐
│                    HEADER                         │
│  Logo + Búsqueda + Toggle tema + Avatar usuario  │
├──────────┬──────────────────────────────────────┤
│          │                                        │
│ SIDEBAR  │          CONTENIDO                    │
│ (desktop)│          (pages)                      │
│          │                                        │
│ Inicio   │  ┌──────────────────────────────┐    │
│ Pacientes│  │                              │    │
│ Citas    │  │      Page content here       │    │
│ Próximas │  │                              │    │
│ Factur.  │  │                              │    │
│ Historial│  └──────────────────────────────┘    │
│ Doctores │                                        │
│          │                                        │
├──────────┴──────────────────────────────────────┤
│        TAB BAR (móvil) - fijo abajo              │
│  Inicio | Pacientes | Citas | Historial | Más    │
└─────────────────────────────────────────────────┘
```

---

## Módulo 1: Dashboard (Inicio)

**Ruta:** `/`
**Tipo:** Server Component (con `use client` para interactividad)

### Qué muestra
- **4 stat cards:** Pacientes activos, Citas hoy, Facturación del mes, Tasa de asistencia
- **Calendario de citas:** FullCalendar embebido con las citas del mes
- **Actividad reciente:** Últimos 6 eventos (citas, facturas, pacientes nuevos)

### Interacciones
- Click en stat card → navega al módulo correspondiente
- Click en evento del calendario → abre modal de editar cita
- Click en día del calendario → abre modal de nueva cita (con fecha preseleccionada)

### Data necesaria
```typescript
{
  pacientes: Paciente[];    // Para contar activos
  citas: Cita[];            // Para contar las de hoy + calendario
  facturas: Factura[];      // Para sumar facturación del mes
  actividadReciente: [];    // Para la lista de actividad
}
```

---

## Módulo 2: Pacientes

**Ruta:** `/pacientes`
**Tipo:** Server Component

### Qué muestra
- **Tabla de pacientes** con columnas: Avatar+Nombre, Email, Teléfono, Edad, Última visita, Próxima cita, Estado
- **Búsqueda** por nombre, email o teléfono (ignorando tildes)
- **Filtros** por estado: Todos | Activos | Pendientes | Inactivos

### Interacciones
- Buscar → filtra en tiempo real
- Click en estado → filtra
- Click "Nuevo paciente" → abre formulario (futuro)
- En móvil: la tabla se muestra como **cards** con labels

### Reglas de negocio
- `activo`: tuvo visita en los últimos 3 meses
- `pendiente`: tiene primera cita pendiente
- `inactivo`: sin visitas en 3+ meses

### Data necesaria
```typescript
{
  pacientes: Paciente[];
}
```

---

## Módulo 3: Citas

**Ruta:** `/citas`
**Tipo:** Client Component (`"use client"`)

### Qué muestra
- **Dos vistas:** Lista | Calendario (toggle)
- **Vista Lista:** Tabla con todas las citas (paciente, doctor, fecha, hora, tipo, duración, estado, acciones)
- **Vista Calendario:** FullCalendar con drag & drop para reagendar
- **Filtros:** Todas | Pendientes | Completadas | Canceladas

### Interacciones
- **Crear cita:** Botón "Nueva cita" → abre `ModalNuevaCita`
- **Editar cita:** Click "Editar" → abre `ModalEditarCita` (solo citas futuras)
- **Eliminar cita:** Dentro del modal de edición
- **Reagendar:** Drag & drop en vista calendario
- **Cambiar estado:** Dentro del modal de edición (completar, cancelar)

### Modal Nueva Cita
Campos:
1. **Paciente** → select con búsqueda (de la lista de pacientes)
2. **Doctor** → select con disponibilidad
3. **Fecha** → date picker
4. **Hora** → time picker
5. **Tipo de cita** → select (de TIPOS_CITA)
6. **Duración** → select (30, 45, 60, 90, 120 min)

Validaciones:
- No se puede crear en el pasado
- No puede haber conflicto de horario (mismo doctor + fecha/hora)
- Todos los campos son obligatorios

### Modal Editar Cita
- Mismos campos que "Nueva cita" pero prellenados
- Botones: Guardar cambios | Completar | Cancelar | Eliminar
- **Citas pasadas:** modal de solo lectura (campos disabled)

### Reglas de negocio
- Las citas pasadas son **solo lectura** (no se editan, cancelan ni eliminan)
- Las citas futuras se pueden editar, cancelar o reagendar
- Completar una cita → debería crear registro en historial clínico
- Cancelar una cita → libera el horario del doctor

### Data necesaria
```typescript
{
  citas: Cita[];
  pacientes: Paciente[];  // Para el select de paciente
  doctores: Doctor[];     // Para el select de doctor + disponibilidad
}
```

---

## Módulo 4: Próximas Citas

**Ruta:** `/proximas-citas`
**Tipo:** Server Component

### Qué muestra
- **Cita destacada:** La más próxima (con gradiente teal, hora, ubicación)
- **Grid de cards:** Todas las demás citas pendientes

### Interacciones
- Click "Administrar citas" → navega a `/citas`
- Las cards son informativas (sin acción directa)

### Data necesaria
```typescript
{
  citas: Cita[];  // Filtradas por estado === "pendiente"
}
```

---

## Módulo 5: Facturación

**Ruta:** `/facturacion`
**Tipo:** Server Component

### Qué muestra
- **3 stat cards:** Total facturado, Cobrado, Pendiente de cobro
- **Tabla de facturas:** Número, Paciente, Concepto, Fecha, Monto, Estado
- **Formato MXN:** Todos los montos en pesos mexicanos

### Interacciones
- Click "Nueva factura" → formulario (futuro)
- Tabla informativa (sin acciones de edición por ahora)

### Reglas de negocio
- Estados: `pagada`, `pendiente`, `vencida`
- Montos: $300 (revisión) a $12,500 (cirugía)
- Cada factura se asocia a 1 paciente

### Data necesaria
```typescript
{
  facturas: Factura[];
}
```

---

## Módulo 6: Historial Clínico

**Ruta:** `/historial-clinico`
**Tipo:** Server Component

### Qué muestra
- **Info banner:** Explica qué contienen los expedientes
- **Tabla de registros:** Paciente, Doctor, Fecha, Tratamiento, Diagnóstico, Estado

### Interacciones
- Click "Nuevo registro" → formulario (futuro)
- Tabla informativa

### Reglas de negocio
- Estados: `programado` (próximo), `en_curso` (tratamiento activo), `finalizado`
- Cada registro está vinculado a 1 paciente + 1 doctor
- Los registros "en curso" requieren seguimiento

### Data necesaria
```typescript
{
  historial: RegistroClinico[];
}
```

---

## Módulo 7: Doctores

**Ruta:** `/doctores`
**Tipo:** Server Component

### Qué muestra
- **Grid de cards:** Cada doctor con avatar, nombre, especialidad, horario, teléfono, email, pacientes atendidos, rating
- **Badge de disponibilidad:** Disponible (verde) / Ocupado (gris)
- **Info banner:** Invitación a consultar la sección de citas

### Interacciones
- Click "Nuevo doctor" → formulario (futuro)
- Cards informativas

### Data necesaria
```typescript
{
  doctores: Doctor[];
}
```

---

## Flujo típico del día

### Recepcionista (mañana)
1. Abre la app → ve Dashboard con citas de hoy
2. Revisa Próximas Citas → confirma que todo está en orden
3. Llega un paciente → busca en Pacientes → registra nueva cita
4. Se va un paciente → marca la cita como completada
5. Al final del día → revisa Facturación

### Dentista
1. Abre la app → ve su agenda del día en Dashboard
2. Antes de cada cita → abre Historial Clínico del paciente
3. Durante la consulta → actualiza diagnóstico en Historial
4. Después → marca la cita como completada

---

## Navegación

### Desktop (sidebar)
```
Inicio → Dashboard
Pacientes → /pacientes
Citas → /citas
Próximas citas → /proximas-citas
Facturación → /facturacion
Historial clínico → /historial-clinico
Doctores → /doctores
```

### Móvil (tab bar)
```
[Inicio] [Pacientes] [Citas] [Historial] [Más →]
                                                 ├→ Próximas citas
                                                 ├→ Facturación
                                                 └→ Doctores
```
