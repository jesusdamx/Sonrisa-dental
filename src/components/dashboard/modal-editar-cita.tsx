"use client";

import { useEffect, useState } from "react";
import { CalendarClock, X } from "lucide-react";
import {
  DURACIONES_CITA,
  TIPOS_CITA,
  formatearFechaCita,
  type Cita,
  type EstadoCita,
} from "@/lib/data";

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20";
const labelCls = "mb-1.5 block text-xs font-medium text-slate-600";

const ESTADOS: { value: EstadoCita; label: string }[] = [
  { value: "pendiente", label: "Pendiente" },
  { value: "completada", label: "Completada" },
  { value: "cancelada", label: "Cancelada" },
];

export default function ModalEditarCita({
  cita,
  onGuardar,
  onCerrar,
}: {
  cita: Cita;
  onGuardar: (cita: Cita) => void;
  onCerrar: () => void;
}) {
  const [fecha, setFecha] = useState(cita.fechaISO);
  const [hora, setHora] = useState(cita.hora);
  const [tipo, setTipo] = useState(cita.tipo);
  const [duracion, setDuracion] = useState(() => {
    const match = cita.duracion.match(/(\d+)/);
    return match ? Number(match[1]) : 30;
  });
  const [estado, setEstado] = useState<EstadoCita>(cita.estado);
  const [error, setError] = useState("");

  useEffect(() => {
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") onCerrar();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCerrar]);

  function guardar() {
    if (!fecha || !hora) {
      setError("Indica la fecha y la hora de la cita.");
      return;
    }
    onGuardar({
      ...cita,
      fecha: formatearFechaCita(fecha),
      fechaISO: fecha,
      hora,
      tipo,
      duracion: `${duracion} min`,
      estado,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={onCerrar}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-editar-cita-titulo"
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2
            id="modal-editar-cita-titulo"
            className="text-base font-semibold text-slate-900"
          >
            Editar cita
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            guardar();
          }}
        >
          <div className="space-y-4 px-6 py-5">
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-sm font-medium text-slate-900">
                {cita.paciente}
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                <CalendarClock className="h-3.5 w-3.5" />
                {cita.doctor} · {cita.fecha}, {cita.hora}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className={labelCls}>Fecha</span>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className={inputCls}
                />
              </label>
              <label className="block">
                <span className={labelCls}>Hora</span>
                <input
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  className={inputCls}
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className={labelCls}>Tipo de cita</span>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className={inputCls}
                >
                  {TIPOS_CITA.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className={labelCls}>Duración</span>
                <select
                  value={duracion}
                  onChange={(e) => setDuracion(Number(e.target.value))}
                  className={inputCls}
                >
                  {DURACIONES_CITA.map((d) => (
                    <option key={d} value={d}>
                      {d} min
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className={labelCls}>Estado</span>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value as EstadoCita)}
                className={inputCls}
              >
                {ESTADOS.map((e) => (
                  <option key={e.value} value={e.value}>
                    {e.label}
                  </option>
                ))}
              </select>
            </label>

            {error ? (
              <p className="text-xs font-medium text-rose-600">{error}</p>
            ) : null}
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
            <button
              type="button"
              onClick={onCerrar}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-teal-600/30 transition-colors hover:bg-teal-700"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
