/**
 * Quita acentos y diacríticos y pasa a minúsculas, para que las búsquedas
 * por nombre ignoren tildes (p. ej. «maria» encuentra «María»).
 */
export function normalizarTexto(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Fecha local en formato ISO (YYYY-MM-DD). */
export function fechaLocalISO(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Etiqueta corta de una fecha («Hoy», «Mañana» o «14 ago»). */
export function formatearFechaCita(fechaISO: string): string {
  const hoy = new Date();
  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1);
  if (fechaISO === fechaLocalISO(hoy)) return "Hoy";
  if (fechaISO === fechaLocalISO(manana)) return "Mañana";
  return new Date(`${fechaISO}T00:00:00`).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
  });
}

/**
 * True si la cita ya pasó (su fecha es anterior al día de hoy).
 * Las citas de hoy o futuras se consideran modificables.
 */
export function esCitaPasada(fechaISO: string): boolean {
  return fechaISO < fechaLocalISO(new Date());
}

export const TIPOS_CITA = [
  "Limpieza dental",
  "Consulta general",
  "Consulta de ortodoncia",
  "Endodoncia (conducto)",
  "Blanqueamiento dental",
  "Extracción de muela",
  "Revisión general",
  "Tratamiento periodontal",
];

export const DURACIONES_CITA = [30, 45, 60, 90, 120];

export type EstadoPaciente = "activo" | "pendiente" | "inactivo";
export type EstadoCita = "pendiente" | "completada" | "cancelada";
export type EstadoFactura = "pagada" | "pendiente" | "vencida";
export type EstadoHistorial = "finalizado" | "en_curso" | "programado";

export type Paciente = {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  edad: number;
  ultimaVisita: string;
  proximaCita: string;
  estado: EstadoPaciente;
  iniciales: string;
  color: string;
};

export type Cita = {
  id: string;
  paciente: string;
  doctor: string;
  fecha: string;
  /** Fecha en formato ISO (YYYY-MM-DD) para el calendario. */
  fechaISO: string;
  hora: string;
  tipo: string;
  duracion: string;
  estado: EstadoCita;
};

function toISODate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const HOY = new Date();
const MANANA = new Date(HOY);
MANANA.setDate(MANANA.getDate() + 1);

const hoyISO = toISODate(HOY);
const mananaISO = toISODate(MANANA);

export type Factura = {
  id: string;
  numero: string;
  paciente: string;
  concepto: string;
  fecha: string;
  monto: number;
  estado: EstadoFactura;
};

export type RegistroClinico = {
  id: string;
  paciente: string;
  doctor: string;
  fecha: string;
  tratamiento: string;
  diagnostico: string;
  estado: EstadoHistorial;
};

export type Doctor = {
  id: string;
  nombre: string;
  especialidad: string;
  telefono: string;
  email: string;
  horario: string;
  pacientes: number;
  rating: number;
  disponible: boolean;
  iniciales: string;
  color: string;
};

export const pacientes: Paciente[] = [
  { id: "P-001", nombre: "María Fernanda López", email: "maria.lopez@gmail.com", telefono: "555-0101", edad: 34, ultimaVisita: "05 ago 2026", proximaCita: "Hoy, 10:30", estado: "activo", iniciales: "ML", color: "bg-teal-100 text-teal-700" },
  { id: "P-002", nombre: "Carlos Andrés Ramírez", email: "carlos.ramirez@outlook.com", telefono: "555-0102", edad: 47, ultimaVisita: "28 jul 2026", proximaCita: "Hoy, 12:00", estado: "activo", iniciales: "CR", color: "bg-sky-100 text-sky-700" },
  { id: "P-003", nombre: "Valentina Gómez", email: "valen.gomez@gmail.com", telefono: "555-0103", edad: 25, ultimaVisita: "10 ago 2026", proximaCita: "Mañana, 09:00", estado: "activo", iniciales: "VG", color: "bg-violet-100 text-violet-700" },
  { id: "P-004", nombre: "Jorge Luis Mendoza", email: "jorge.mendoza@yahoo.com", telefono: "555-0104", edad: 58, ultimaVisita: "15 jul 2026", proximaCita: "14 ago, 16:30", estado: "pendiente", iniciales: "JM", color: "bg-amber-100 text-amber-700" },
  { id: "P-005", nombre: "Ana Sofía Torres", email: "anasofia.torres@gmail.com", telefono: "555-0105", edad: 31, ultimaVisita: "02 ago 2026", proximaCita: "15 ago, 11:00", estado: "activo", iniciales: "AT", color: "bg-rose-100 text-rose-700" },
  { id: "P-006", nombre: "Luis Miguel Herrera", email: "luisherrera@gmail.com", telefono: "555-0106", edad: 42, ultimaVisita: "20 jun 2026", proximaCita: "—", estado: "inactivo", iniciales: "LH", color: "bg-emerald-100 text-emerald-700" },
  { id: "P-007", nombre: "Camila Rodríguez", email: "camila.rod@gmail.com", telefono: "555-0107", edad: 29, ultimaVisita: "11 ago 2026", proximaCita: "18 ago, 13:00", estado: "activo", iniciales: "CR", color: "bg-indigo-100 text-indigo-700" },
  { id: "P-008", nombre: "Pedro Sánchez", email: "pedro.sanchez@gmail.com", telefono: "555-0108", edad: 52, ultimaVisita: "30 jul 2026", proximaCita: "19 ago, 10:00", estado: "pendiente", iniciales: "PS", color: "bg-orange-100 text-orange-700" },
  { id: "P-009", nombre: "Daniela Cruz", email: "daniela.cruz@gmail.com", telefono: "555-0109", edad: 38, ultimaVisita: "08 ago 2026", proximaCita: "20 ago, 09:30", estado: "activo", iniciales: "DC", color: "bg-cyan-100 text-cyan-700" },
  { id: "P-010", nombre: "Roberto Díaz", email: "roberto.diaz@gmail.com", telefono: "555-0110", edad: 61, ultimaVisita: "12 jun 2026", proximaCita: "—", estado: "inactivo", iniciales: "RD", color: "bg-fuchsia-100 text-fuchsia-700" },
];

export const citas: Cita[] = [
  { id: "C-101", paciente: "María Fernanda López", doctor: "Dra. Elena Vargas", fecha: "Hoy", fechaISO: hoyISO, hora: "10:30", tipo: "Limpieza dental", duracion: "45 min", estado: "pendiente" },
  { id: "C-102", paciente: "Carlos Andrés Ramírez", doctor: "Dr. Ricardo Peña", fecha: "Hoy", fechaISO: hoyISO, hora: "12:00", tipo: "Consulta de ortodoncia", duracion: "30 min", estado: "pendiente" },
  { id: "C-103", paciente: "Ana Sofía Torres", doctor: "Dra. Lucía Fernández", fecha: "Hoy", fechaISO: hoyISO, hora: "15:00", tipo: "Endodoncia (conducto)", duracion: "90 min", estado: "pendiente" },
  { id: "C-104", paciente: "Valentina Gómez", doctor: "Dra. Elena Vargas", fecha: "Mañana", fechaISO: mananaISO, hora: "09:00", tipo: "Blanqueamiento dental", duracion: "60 min", estado: "pendiente" },
  { id: "C-105", paciente: "Camila Rodríguez", doctor: "Dr. Marco Salazar", fecha: "Mañana", fechaISO: mananaISO, hora: "11:30", tipo: "Extracción de muela", duracion: "45 min", estado: "pendiente" },
  { id: "C-106", paciente: "Jorge Luis Mendoza", doctor: "Dr. Andrés Molina", fecha: "14 ago", fechaISO: "2026-08-14", hora: "16:30", tipo: "Consulta de implantes", duracion: "40 min", estado: "pendiente" },
  { id: "C-107", paciente: "Daniela Cruz", doctor: "Dra. Paola Ríos", fecha: "15 ago", fechaISO: "2026-08-15", hora: "09:30", tipo: "Tratamiento periodontal", duracion: "50 min", estado: "pendiente" },
  { id: "C-108", paciente: "Pedro Sánchez", doctor: "Dra. Elena Vargas", fecha: "15 ago", fechaISO: "2026-08-15", hora: "12:00", tipo: "Revisión general", duracion: "30 min", estado: "pendiente" },
  { id: "C-109", paciente: "Luis Miguel Herrera", doctor: "Dr. Ricardo Peña", fecha: "10 ago", fechaISO: "2026-08-10", hora: "10:00", tipo: "Ajuste de brackets", duracion: "30 min", estado: "completada" },
  { id: "C-110", paciente: "Roberto Díaz", doctor: "Dr. Marco Salazar", fecha: "08 ago", fechaISO: "2026-08-08", hora: "13:30", tipo: "Cirugía de terceros molares", duracion: "120 min", estado: "completada" },
  { id: "C-111", paciente: "María Fernanda López", doctor: "Dra. Elena Vargas", fecha: "07 ago", fechaISO: "2026-08-07", hora: "09:00", tipo: "Resina estética", duracion: "60 min", estado: "completada" },
  { id: "C-112", paciente: "Valentina Gómez", doctor: "Dra. Paola Ríos", fecha: "06 ago", fechaISO: "2026-08-06", hora: "17:00", tipo: "Limpieza dental", duracion: "45 min", estado: "cancelada" },
];

export const facturas: Factura[] = [
  { id: "F-501", numero: "F-2026-0481", paciente: "María Fernanda López", concepto: "Limpieza dental + pulido", fecha: "11 ago 2026", monto: 1200, estado: "pagada" },
  { id: "F-502", numero: "F-2026-0482", paciente: "Carlos Andrés Ramírez", concepto: "Consulta de ortodoncia", fecha: "11 ago 2026", monto: 850, estado: "pendiente" },
  { id: "F-503", numero: "F-2026-0483", paciente: "Valentina Gómez", concepto: "Blanqueamiento dental", fecha: "10 ago 2026", monto: 3500, estado: "pagada" },
  { id: "F-504", numero: "F-2026-0484", paciente: "Camila Rodríguez", concepto: "Extracción de muela del juicio", fecha: "09 ago 2026", monto: 2400, estado: "pendiente" },
  { id: "F-505", numero: "F-2026-0485", paciente: "Luis Miguel Herrera", concepto: "Ajuste de brackets", fecha: "10 ago 2026", monto: 980, estado: "pagada" },
  { id: "F-506", numero: "F-2026-0486", paciente: "Jorge Luis Mendoza", concepto: "Consulta de implantes", fecha: "08 ago 2026", monto: 500, estado: "vencida" },
  { id: "F-507", numero: "F-2026-0487", paciente: "Ana Sofía Torres", concepto: "Endodoncia molar", fecha: "07 ago 2026", monto: 6800, estado: "pagada" },
  { id: "F-508", numero: "F-2026-0488", paciente: "Roberto Díaz", concepto: "Cirugía terceros molares", fecha: "08 ago 2026", monto: 12500, estado: "pendiente" },
  { id: "F-509", numero: "F-2026-0489", paciente: "Pedro Sánchez", concepto: "Revisión general", fecha: "05 ago 2026", monto: 400, estado: "pagada" },
  { id: "F-510", numero: "F-2026-0490", paciente: "Daniela Cruz", concepto: "Tratamiento periodontal", fecha: "04 ago 2026", monto: 3200, estado: "vencida" },
];

export const historial: RegistroClinico[] = [
  { id: "H-201", paciente: "María Fernanda López", doctor: "Dra. Elena Vargas", fecha: "11 ago 2026", tratamiento: "Limpieza dental y pulido", diagnostico: "Gingivitis leve", estado: "finalizado" },
  { id: "H-202", paciente: "Ana Sofía Torres", doctor: "Dra. Lucía Fernández", fecha: "07 ago 2026", tratamiento: "Endodoncia molar inferior", diagnostico: "Pulpitis irreversible", estado: "en_curso" },
  { id: "H-203", paciente: "Carlos Andrés Ramírez", doctor: "Dr. Ricardo Peña", fecha: "01 ago 2026", tratamiento: "Colocación de brackets", diagnostico: "Maloclusión clase II", estado: "en_curso" },
  { id: "H-204", paciente: "Luis Miguel Herrera", doctor: "Dr. Ricardo Peña", fecha: "10 ago 2026", tratamiento: "Ajuste de ortodoncia", diagnostico: "Seguimiento de tratamiento", estado: "finalizado" },
  { id: "H-205", paciente: "Roberto Díaz", doctor: "Dr. Marco Salazar", fecha: "08 ago 2026", tratamiento: "Exodoncia de terceros molares", diagnostico: "Muelas retenidas", estado: "en_curso" },
  { id: "H-206", paciente: "Valentina Gómez", doctor: "Dra. Elena Vargas", fecha: "05 ago 2026", tratamiento: "Blanqueamiento con peróxido", diagnostico: "Discoloración dental", estado: "finalizado" },
  { id: "H-207", paciente: "Daniela Cruz", doctor: "Dra. Paola Ríos", fecha: "03 ago 2026", tratamiento: "Raspado y alisado radicular", diagnostico: "Periodontitis moderada", estado: "programado" },
  { id: "H-208", paciente: "Jorge Luis Mendoza", doctor: "Dr. Andrés Molina", fecha: "30 jul 2026", tratamiento: "Evaluación pre-implante", diagnostico: "Pérdida de pieza 36", estado: "programado" },
  { id: "H-209", paciente: "Pedro Sánchez", doctor: "Dra. Elena Vargas", fecha: "25 jul 2026", tratamiento: "Restauración con resina", diagnostico: "Caries proximal", estado: "finalizado" },
  { id: "H-210", paciente: "Camila Rodríguez", doctor: "Dr. Marco Salazar", fecha: "22 jul 2026", tratamiento: "Obturación temporal", diagnostico: "Fractura dental", estado: "finalizado" },
];

export const doctores: Doctor[] = [
  { id: "D-1", nombre: "Dra. Elena Vargas", especialidad: "Odontología general", telefono: "555-0201", email: "e.vargas@sonrisadental.mx", horario: "Lun – Vie · 08:00 – 17:00", pacientes: 1284, rating: 4.9, disponible: true, iniciales: "EV", color: "bg-teal-100 text-teal-700" },
  { id: "D-2", nombre: "Dr. Ricardo Peña", especialidad: "Ortodoncia", telefono: "555-0202", email: "r.pena@sonrisadental.mx", horario: "Lun, Mié, Vie · 09:00 – 18:00", pacientes: 987, rating: 4.8, disponible: true, iniciales: "RP", color: "bg-sky-100 text-sky-700" },
  { id: "D-3", nombre: "Dra. Lucía Fernández", especialidad: "Endodoncia", telefono: "555-0203", email: "l.fernandez@sonrisadental.mx", horario: "Mar – Jue · 10:00 – 19:00", pacientes: 654, rating: 4.9, disponible: true, iniciales: "LF", color: "bg-violet-100 text-violet-700" },
  { id: "D-4", nombre: "Dr. Marco Salazar", especialidad: "Cirugía oral y maxilofacial", telefono: "555-0204", email: "m.salazar@sonrisadental.mx", horario: "Lun – Vie · 08:30 – 15:30", pacientes: 812, rating: 4.7, disponible: false, iniciales: "MS", color: "bg-amber-100 text-amber-700" },
  { id: "D-5", nombre: "Dra. Paola Ríos", especialidad: "Periodoncia", telefono: "555-0205", email: "p.rios@sonrisadental.mx", horario: "Lun – Jue · 09:00 – 17:00", pacientes: 743, rating: 4.8, disponible: true, iniciales: "PR", color: "bg-rose-100 text-rose-700" },
  { id: "D-6", nombre: "Dr. Andrés Molina", especialidad: "Implantología", telefono: "555-0206", email: "a.molina@sonrisadental.mx", horario: "Mar, Jue, Sáb · 09:00 – 14:00", pacientes: 521, rating: 4.9, disponible: true, iniciales: "AM", color: "bg-emerald-100 text-emerald-700" },
];

export const actividadReciente = [
  { id: "A-1", texto: "María Fernanda López reservó una cita de limpieza", detalle: "Hace 12 min", tipo: "cita" },
  { id: "A-2", texto: "Factura F-2026-0482 generada para Carlos Ramírez", detalle: "Hace 45 min", tipo: "factura" },
  { id: "A-3", texto: "Nuevo paciente registrado: Camila Rodríguez", detalle: "Hace 2 h", tipo: "paciente" },
  { id: "A-4", texto: "Historial clínico actualizado para Ana Sofía Torres", detalle: "Hace 3 h", tipo: "historial" },
  { id: "A-5", texto: "Cita de Valentina Gómez cancelada", detalle: "Hace 5 h", tipo: "cita" },
  { id: "A-6", texto: "Pago recibido de Luis Miguel Herrera ($980)", detalle: "Ayer", tipo: "pago" },
];
