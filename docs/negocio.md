# Contexto del Negocio — Sonrisa Dental

## El problema

Un consultorio dental típico en México maneja:
- **200-500 pacientes** activos
- **15-30 citas diarias** entre varios doctores
- **Facturación manual** que genera errores y retrasos
- **Historiales clínicos en papel** que se pierden o duplican
- **Sin sistema de recordatorios** — alta tasa de inasistencia (20-30%)

El resultado: pérdida de tiempo, dinero y clientes.

## La solución

**Sonrisa Dental** es un dashboard web que centraliza toda la operación del consultorio:

```
Recepcionista                    Dentista
     │                              │
     ▼                              ▼
┌─────────────┐              ┌─────────────┐
│ Registra    │              │ Consulta    │
│ pacientes   │              │ historial   │
│ agenda citas│              │ agenda del  │
│ emite       │              │ día         │
│ facturas    │              │             │
└─────────────┘              └─────────────┘
         │                          │
         ▼                          ▼
    ┌──────────────────────────────────┐
    │     Sonrisa Dental Dashboard     │
    │  (Single source of truth)        │
    └──────────────────────────────────┘
```

## Usuarios y roles

### Recepcionista (rol principal)
- **Qué hace:** Registra pacientes, agenda/modifica citas, emite facturas
- **Frecuencia:** Todo el día, múltiples veces
- **Necesita:** Velocidad, interfaz simple, búsqueda rápida
- **Dolor:** Formularios largos, perder datos, no encontrar pacientes

### Dentista
- **Qué hace:** Consulta agenda del día, revisa historial antes de la cita
- **Frecuencia:** Entre citas (5-10 min de espera)
- **Necesita:** Vista rápida del día, acceso al historial del paciente
- **Dolor:** No tener la info del paciente antes de la consulta

### Administrador
- **Qué hace:** Revisa reportes de ingresos, actividad, disponibilidad
- **Frecuencia:** 1-2 veces por semana
- **Necesita:** Resúmenes, estadísticas, tendencias
- **Dolor:** No tener visibilidad de la operación

## Reglas de negocio

### Citas
- Una cita = 1 paciente + 1 doctor + 1 horario específico
- **No se pueden crear citas en el pasado**
- Las citas pasadas son **solo lectura** (no se editan ni cancelan)
- Duraciones disponibles: 30, 45, 60, 90, 120 minutos
- Estados: `pendiente` → `completada` | `cancelada`
- Las citas se pueden **arrastrar** en el calendario (solo futuras)

### Pacientes
- Estados: `activo` (asistió recientemente), `pendiente` (primera cita), `inactivo` (sin visitas en 3+ meses)
- Cada paciente tiene: nombre, email, teléfono, edad, última visita, próxima cita
- Se busca por nombre, email o teléfono (ignorando tildes)

### Facturación
- Cada factura está asociada a 1 paciente y 1 concepto de servicio
- Estados: `pagada`, `pendiente`, `vencida`
- Los montos van de $400 (revisión) a $12,500 (cirugía)

### Historial clínico
- Cada registro = 1 paciente + 1 doctor + 1 tratamiento + 1 diagnóstico
- Estados: `programado` (próximo), `en_curso` (tratamiento activo), `finalizado`
- Vínculo directo con las citas completadas

### Doctores
- Cada doctor tiene especialidad, horario, pacientes asignados y rating
- Disponibilidad: `disponible` / `no disponible`
- 6 especialidades: general, ortodoncia, endodoncia, cirugía, periodoncia, implantología

## Tipos de cita (servicios)

| Servicio | Duración típica | Precio estimado |
|---|---|---|
| Limpieza dental | 45 min | $800 - $1,200 |
| Consulta general | 30 min | $400 - $600 |
| Consulta de ortodoncia | 30 min | $600 - $900 |
| Endodoncia (conducto) | 90 min | $4,000 - $7,000 |
| Blanqueamiento dental | 60 min | $2,500 - $4,000 |
| Extracción de muela | 45 min | $1,500 - $3,000 |
| Revisión general | 30 min | $300 - $500 |
| Tratamiento periodontal | 50 min | $2,500 - $4,000 |

## Flujos principales

### 1. Agendar una cita
```
Recepcionista → Selecciona fecha/hora → Selecciona paciente →
Selecciona doctor → Selecciona tipo de cita → Confirma
```

### 2. Atender una cita
```
Dentista → Revisa agenda del día → Abre historial del paciente →
Realiza tratamiento → Marca como completada → Se genera registro en historial
```

### 3. Facturar
```
Recepcionista → Selecciona paciente → Describe concepto →
Genera factura → Estado: pendiente → Paciente paga → Estado: pagada
```

## Métricas que importan

- **Citas del día** — cuántas hay programadas
- **Tasa de asistencia** — citas completadas vs canceladas
- **Ingresos mensuales** — facturas pagadas
- **Pacientes activos** — los que tienen visita reciente
- **Citas pendientes** — las que faltan por atender
