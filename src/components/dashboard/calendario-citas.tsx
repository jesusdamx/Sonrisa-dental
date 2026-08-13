"use client";

import FullCalendar from "@fullcalendar/react";
import themePlugin from "@fullcalendar/react/themes/classic";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import esLocale from "@fullcalendar/react/locales/es";
import { Lock } from "lucide-react";
import {
  esCitaPasada,
  fechaLocalISO,
  type Cita,
  type EstadoCita,
} from "@/lib/data";

// Colores alineados con los badges de estado de la app.
const COLOR_ESTADO: Record<EstadoCita, string> = {
  pendiente: "#f59e0b", // amber-500 (warning)
  completada: "#10b981", // emerald-500 (success)
  cancelada: "#f43f5e", // rose-500 (danger)
};

const ETIQUETA_ESTADO: Record<EstadoCita, string> = {
  pendiente: "Pendiente",
  completada: "Completada",
  cancelada: "Cancelada",
};

function duracionEnMinutos(duracion: string): number {
  const match = duracion.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 30;
}

/**
 * Calcula el fin de la cita como fecha-hora local (sin zona horaria)
 * para que FullCalendar la interprete en el horario del navegador.
 */
function finCitaLocal(fechaISO: string, hora: string, minutos: number): string {
  const [year, month, day] = fechaISO.split("-").map(Number);
  const [hours, mins] = hora.split(":").map(Number);
  const fin = new Date(year, month - 1, day, hours, mins + minutos);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${fin.getFullYear()}-${pad(fin.getMonth() + 1)}-${pad(
    fin.getDate()
  )}T${pad(fin.getHours())}:${pad(fin.getMinutes())}:00`;
}

function aEventoCalendario(cita: Cita) {
  const pasada = esCitaPasada(cita.fechaISO);
  return {
    id: cita.id,
    title: `${cita.paciente} · ${cita.tipo}`,
    start: `${cita.fechaISO}T${cita.hora}:00`,
    end: finCitaLocal(cita.fechaISO, cita.hora, duracionEnMinutos(cita.duracion)),
    color: COLOR_ESTADO[cita.estado],
    extendedProps: { estado: cita.estado, pasada },
    className: pasada ? "fc-cita-pasada" : "fc-cita-editable",
    // Solo las citas de hoy o futuras se pueden arrastrar.
    startEditable: !pasada,
  };
}

export default function CalendarioCitas({
  citas,
  onEditarCita,
  onMoverCita,
  onNuevaCita,
}: {
  citas: Cita[];
  onEditarCita?: (cita: Cita) => void;
  onMoverCita?: (id: string, fechaISO: string, hora: string) => void;
  onNuevaCita?: (fechaISO: string, hora: string) => void;
}) {
  return (
    <div>
      <FullCalendar
        plugins={[themePlugin, dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        locale={esLocale}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={citas.map(aEventoCalendario)}
        editable
        eventAllow={(span) =>
          // Solo se puede soltar en hoy o días futuros.
          span.startStr >= fechaLocalISO(new Date())
        }
        eventDrop={(info) => {
          // Si el destino quedó en el pasado (p. ej. por arrastrar sobre
          // un día prohibido), se revierte el movimiento.
          const cita = citas.find((c) => c.id === info.event.id);
          const start = info.event.start;
          if (!cita || !start) return;
          const fechaISO = fechaLocalISO(start);
          if (fechaISO < fechaLocalISO(new Date())) {
            info.revert();
            return;
          }
          const pad = (n: number) => String(n).padStart(2, "0");
          onMoverCita?.(
            cita.id,
            fechaISO,
            `${pad(start.getHours())}:${pad(start.getMinutes())}`
          );
        }}
        eventClick={(info) => {
          // Las citas pasadas no se pueden modificar.
          if (info.event.extendedProps.pasada || !onEditarCita) return;
          const cita = citas.find((c) => c.id === info.event.id);
          if (cita) onEditarCita(cita);
        }}
        dateClick={(info) => {
          // Solo permite crear cita en hoy o días futuros
          const fechaISO = fechaLocalISO(info.date);
          if (fechaISO < fechaLocalISO(new Date())) return;
          const pad = (n: number) => String(n).padStart(2, "0");
          const hora = `${pad(info.date.getHours())}:${pad(info.date.getMinutes())}`;
          onNuevaCita?.(fechaISO, hora);
        }}
        height={680}
        slotMinTime="07:00:00"
        slotMaxTime="20:00:00"
        scrollTime="08:00:00"
        allDaySlot={false}
        nowIndicator
        eventDisplay="block"
      />

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
        <span className="font-medium text-slate-700">Estado:</span>
        {(
          Object.keys(COLOR_ESTADO) as EstadoCita[]
        ).map((estado) => (
          <span key={estado} className="inline-flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: COLOR_ESTADO[estado] }}
            />
            {ETIQUETA_ESTADO[estado]}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5">
          <Lock className="h-3 w-3 text-slate-400" />
          <span className="text-slate-400">Pasadas: solo lectura</span>
        </span>
        <span className="ml-auto hidden text-slate-400 sm:block">
          {citas.length} cita(s) en la vista actual
        </span>
      </div>
    </div>
  );
}
