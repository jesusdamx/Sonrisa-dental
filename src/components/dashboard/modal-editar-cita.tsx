"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CalendarClock, Trash2, X } from "lucide-react";
import {
  DURACIONES_CITA,
  TIPOS_CITA,
  formatearFechaCita,
  type Cita,
  type EstadoCita,
} from "@/lib/data";

const inputCls = "w-full input-base";
const labelCls = "mb-1.5 block text-xs font-medium";

const ESTADOS: { value: EstadoCita; label: string }[] = [
  { value: "pendiente", label: "Pendiente" },
  { value: "completada", label: "Completada" },
  { value: "cancelada", label: "Cancelada" },
];

export default function ModalEditarCita({
  cita,
  onGuardar,
  onCerrar,
  onEliminar,
}: {
  cita: Cita;
  onGuardar: (cita: Cita) => void;
  onCerrar: () => void;
  onEliminar?: (id: string) => void;
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
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

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

  function handleEliminar() {
    onEliminar?.(cita.id);
    onCerrar();
  }

  return (
    <div
      className="modal-base"
      onClick={onCerrar}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-editar-cita-titulo"
    >
      <div
        className="modal-content w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="modal-editar-cita-titulo">
            Editar cita
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="rounded-lg p-1.5 transition-colors hover:opacity-70"
            style={{ color: "var(--text-secondary)" }}
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
          <div className="modal-body space-y-4">
            <div className="rounded-xl border px-4 py-3" style={{ backgroundColor: "var(--hover-bg)", borderColor: "var(--card-border)" }}>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {cita.paciente}
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
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

          <div className="modal-footer" style={{ justifyContent: "space-between" }}>
            {onEliminar ? (
              <button
                type="button"
                onClick={() => setMostrarConfirmacion(true)}
                className="btn-base" style={{ backgroundColor: "rgba(244, 63, 94, 0.1)", color: "#f43f5e", border: "1px solid rgba(244, 63, 94, 0.3)" }}
              >
                <Trash2 className="h-4 w-4" style={{ display: "inline", marginRight: "0.5rem" }} />
                Eliminar
              </button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onCerrar}
                className="btn-base btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-base btn-primary"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </form>

        {mostrarConfirmacion && (
          <div
            className="modal-base"
            onClick={() => setMostrarConfirmacion(false)}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="modal-confirmar-titulo"
          >
            <div
              className="modal-content w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(244, 63, 94, 0.1)" }}>
                    <AlertTriangle className="h-5 w-5 text-rose-600" />
                  </span>
                  <h3>
                    Eliminar cita
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setMostrarConfirmacion(false)}
                  aria-label="Cerrar"
                  className="rounded-lg p-1.5 transition-colors hover:opacity-70"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="modal-body">
                <p>
                  ¿Estás seguro de que deseas eliminar esta cita de{" "}
                  <span className="font-medium">{cita.paciente}</span> con el{" "}
                  <span className="font-medium">{cita.doctor}</span>? Esta acción no se puede deshacer.
                </p>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setMostrarConfirmacion(false)}
                  className="btn-base btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleEliminar}
                  className="btn-base btn-danger"
                >
                  <Trash2 className="h-4 w-4" style={{ display: "inline", marginRight: "0.5rem" }} />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
