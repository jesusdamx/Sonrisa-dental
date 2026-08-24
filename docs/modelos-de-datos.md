# Modelos de Datos — Sonrisa Dental

## Tipos TypeScript (actuales)

Los tipos están definidos en `src/lib/data.ts` y son la fuente de verdad para la data.

---

### Paciente

```typescript
type EstadoPaciente = "activo" | "pendiente" | "inactivo";

type Paciente = {
  id: string;           // Formato: "P-001", "P-002", ...
  nombre: string;       // Nombre completo
  email: string;        // Correo electrónico
  telefono: string;     // Teléfono de contacto
  edad: number;         // Edad en años
  ultimaVisita: string; // Fecha formateada: "05 ago 2026"
  proximaCita: string;  // "Hoy, 10:30" | "Mañana, 09:00" | "14 ago, 16:30" | "—"
  estado: EstadoPaciente;
  iniciales: string;    // Iniciales para avatar: "ML", "CR", ...
  color: string;        // Clase Tailwind para avatar: "bg-teal-100 text-teal-700"
};
```

**Reglas:**
- `activo`: tuvo visita en los últimos 3 meses
- `pendiente`: tiene primera cita pendiente
- `inactivo`: sin visitas en 3+ meses

---

### Cita

```typescript
type EstadoCita = "pendiente" | "completada" | "cancelada";

type Cita = {
  id: string;       // Formato: "C-101", "C-102", ...
  paciente: string; // Nombre del paciente (referencia por nombre, no ID)
  doctor: string;   // Nombre del doctor
  fecha: string;    // Formateada: "Hoy", "Mañana", "14 ago"
  fechaISO: string; // ISO para calendario: "2026-08-14"
  hora: string;     // "10:30", "12:00"
  tipo: string;     // Tipo de servicio (ver TIPOS_CITA)
  duracion: string; // "30 min", "45 min", "60 min", "90 min", "120 min"
  estado: EstadoCita;
};
```

**Tipos de cita disponibles:**
```typescript
const TIPOS_CITA = [
  "Limpieza dental",
  "Consulta general",
  "Consulta de ortodoncia",
  "Endodoncia (conducto)",
  "Blanqueamiento dental",
  "Extracción de muela",
  "Revisión general",
  "Tratamiento periodontal",
];
```

**Duraciones disponibles:**
```typescript
const DURACIONES_CITA = [30, 45, 60, 90, 120];
```

**Reglas de negocio:**
- Las citas pasadas son de solo lectura (no se editan)
- Se pueden arrastrar en el calendario para reagendar
- Una cita se asocia a 1 paciente + 1 doctor + 1 horario

---

### Factura

```typescript
type EstadoFactura = "pagada" | "pendiente" | "vencida";

type Factura = {
  id: string;       // Formato: "F-501", "F-502", ...
  numero: string;   // Número de factura: "F-2026-0481"
  paciente: string; // Nombre del paciente
  concepto: string; // Descripción del servicio
  fecha: string;    // Formateada: "11 ago 2026"
  monto: number;    // En MXN: 400 - 12,500
  estado: EstadoFactura;
};
```

**Rangos de monto típicos:**
| Concepto | Rango |
|---|---|
| Revisión general | $300 - $500 |
| Limpieza dental | $800 - $1,200 |
| Consulta especializada | $600 - $900 |
| Blanqueamiento | $2,500 - $4,000 |
| Endodoncia | $4,000 - $7,000 |
| Cirugía | $10,000 - $12,500 |

---

### Historial Clínico

```typescript
type EstadoHistorial = "finalizado" | "en_curso" | "programado";

type RegistroClinico = {
  id: string;         // Formato: "H-201", "H-202", ...
  paciente: string;   // Nombre del paciente
  doctor: string;     // Nombre del doctor
  fecha: string;      // Formateada: "11 ago 2026"
  tratamiento: string; // Descripción del procedimiento
  diagnostico: string; // Diagnóstico médico
  estado: EstadoHistorial;
};
```

**Vínculo con citas:** Cuando una cita se marca como `completada`, se debería generar un registro en historial clínico.

---

### Doctor

```typescript
type Doctor = {
  id: string;          // Formato: "D-1", "D-2", ...
  nombre: string;      // "Dra. Elena Vargas"
  especialidad: string; // Ver especialidades
  telefono: string;
  email: string;
  horario: string;     // "Lun – Vie · 08:00 – 17:00"
  pacientes: number;   // Total de pacientes atendidos
  rating: number;      // 1.0 - 5.0
  disponible: boolean;
  iniciales: string;
  color: string;
};
```

**Especialidades:**
- Odontología general
- Ortodoncia
- Endodoncia
- Cirugía oral y maxilofacial
- Periodoncia
- Implantología

---

## Relaciones entre entidades

```
Paciente ──1:N──> Cita (paciente: nombre)
Paciente ──1:N──> Factura (paciente: nombre)
Paciente ──1:N──> Historial (paciente: nombre)
Doctor ──1:N──> Cita (doctor: nombre)
Doctor ──1:N──> Historial (doctor: nombre)
Cita ──1:1──> Historial (cuando se completa)
```

**⚠️ Nota importante:** Actualmente las relaciones se hacen por **nombre de texto**, no por ID. Esto es un problema conocido que se debe resolver al crear el backend (usar foreign keys con IDs).

---

## Utilidades de fecha

```typescript
// Normaliza texto quitando acentos (para búsquedas)
normalizarTexto("María") → "maria"

// Fecha ISO local (YYYY-MM-DD)
fechaLocalISO(new Date()) → "2026-08-12"

// Etiqueta legible
formatearFechaCita("2026-08-12") → "Hoy" (si es hoy)
formatearFechaCita("2026-08-13") → "Mañana" (si es mañana)
formatearFechaCita("2026-08-14") → "14 ago"

// ¿La cita ya pasó?
esCitaPasada("2026-08-10") → true
esCitaPasada("2026-08-15") → false
```

---

## Data hardcodeada actual

| Entidad | Registros | IDs |
|---|---|---|
| Pacientes | 10 | P-001 a P-010 |
| Citas | 12 | C-101 a C-112 |
| Facturas | 10 | F-501 a F-510 |
| Historial | 10 | H-201 a H-210 |
| Doctores | 6 | D-1 a D-6 |

**Pendiente para backend:** Migrar IDs a UUIDs o auto-increment, y usar foreign keys en lugar de nombres.
