"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { Stethoscope, UserPlus, X } from "lucide-react";
import {
  DURACIONES_CITA,
  TIPOS_CITA,
  doctores,
  fechaLocalISO,
  formatearFechaCita,
  normalizarTexto,
  pacientes,
  type Cita,
  type Paciente,
} from "@/lib/data";

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20";
const labelCls = "mb-1.5 block text-xs font-medium text-slate-600";

function doctorAleatorio(): string {
  const disponibles = doctores.filter((d) => d.disponible);
  const pool = disponibles.length > 0 ? disponibles : doctores;
  return pool[Math.floor(Math.random() * pool.length)].nombre;
}

export default function ModalNuevaCita({
  onGuardar,
  onCerrar,
  fechaInicial,
  horaInicial,
}: {
  onGuardar: (cita: Cita) => void;
  onCerrar: () => void;
  fechaInicial?: string;
  horaInicial?: string;
}) {
  const [busqueda, setBusqueda] = useState("");
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [abierto, setAbierto] = useState(false);
  const [resaltado, setResaltado] = useState(-1);
  const [tipo, setTipo] = useState(TIPOS_CITA[0]);
  const [fecha, setFecha] = useState(() => fechaInicial ?? fechaLocalISO(new Date()));
  const [hora, setHora] = useState(horaInicial ?? "09:00");
  const [duracion, setDuracion] = useState(45);
  const [error, setError] = useState("");

  // El doctor se asigna automáticamente al abrir el modal.
  const doctorAsignado = useMemo(() => doctorAleatorio(), []);

  // Ref para que Escape cierre el dropdown (no el modal) cuando está abierto.
  const abiertoRef = useRef(abierto);
  useEffect(() => {
    abiertoRef.current = abierto;
  }, [abierto]);

  useEffect(() => {
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape" && !abiertoRef.current) onCerrar();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCerrar]);

  const coincidencias = useMemo(() => {
    const q = normalizarTexto(busqueda);
    if (!q) return pacientes;
    return pacientes.filter((p) => normalizarTexto(p.nombre).includes(q));
  }, [busqueda]);

  const hayNombreExacto = pacientes.some(
    (p) => normalizarTexto(p.nombre) === normalizarTexto(busqueda)
  );
  const mostrarNuevo = busqueda.trim().length > 0 && !hayNombreExacto;

  function onBusqueda(v: string) {
    setBusqueda(v);
    setAbierto(true);
    setResaltado(-1);
    setError("");
    const exacto = pacientes.find(
      (p) => normalizarTexto(p.nombre) === normalizarTexto(v)
    );
    setPaciente(exacto ?? null);
  }

  function elegirPaciente(p: Paciente) {
    setPaciente(p);
    setBusqueda(p.nombre);
    setAbierto(false);
    setResaltado(-1);
  }

  function usarNuevo() {
    // Mantiene el texto escrito como nombre del paciente.
    setPaciente(null);
    setAbierto(false);
    setResaltado(-1);
  }

  function onTecla(e: ReactKeyboardEvent<HTMLInputElement>) {
    const total = coincidencias.length + (mostrarNuevo ? 1 : 0);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setAbierto(true);
      setResaltado((r) => (total === 0 ? r : (r + 1) % total));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setResaltado((r) => (r <= 0 ? total - 1 : r - 1));
    } else if (e.key === "Enter") {
      if (abierto && resaltado >= 0 && resaltado < coincidencias.length) {
        e.preventDefault();
        elegirPaciente(coincidencias[resaltado]);
      } else if (abierto && mostrarNuevo && resaltado === coincidencias.length) {
        e.preventDefault();
        usarNuevo();
      }
      // Si no hay opción resaltada, Enter envía el formulario normalmente.
    } else if (e.key === "Escape" && abierto) {
      setAbierto(false);
      setResaltado(-1);
    }
  }

  function guardar() {
    const nombre = (paciente?.nombre ?? busqueda).trim();
    if (!nombre) {
      setError("Selecciona un paciente o escribe su nombre.");
      return;
    }
    if (!fecha || !hora) {
      setError("Indica la fecha y la hora de la cita.");
      return;
    }
    onGuardar({
      id: `C-${Date.now()}`,
      paciente: nombre,
      doctor: doctorAsignado,
      fecha: formatearFechaCita(fecha),
      fechaISO: fecha,
      hora,
      tipo,
      duracion: `${duracion} min`,
      estado: "pendiente",
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={onCerrar}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-nueva-cita-titulo"
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2
            id="modal-nueva-cita-titulo"
            className="text-base font-semibold text-slate-900"
          >
            Nueva cita
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
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className={labelCls}>Fecha</span>
                <input
                  autoFocus
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

            <div className="relative">
              <label className="block">
                <span className={labelCls}>Paciente</span>
                <input
                  type="search"
                  role="combobox"
                  aria-expanded={abierto}
                  aria-controls="lista-pacientes"
                  value={busqueda}
                  onChange={(e) => onBusqueda(e.target.value)}
                  onFocus={() => setAbierto(true)}
                  onBlur={() => setAbierto(false)}
                  onKeyDown={onTecla}
                  placeholder="Busca un paciente…"
                  className={inputCls}
                />
              </label>

              {abierto ? (
                <div
                  id="lista-pacientes"
                  role="listbox"
                  className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5"
                >
                  {coincidencias.length > 0 ? (
                    <ul className="max-h-56 overflow-auto py-1">
                      {coincidencias.slice(0, 8).map((p, i) => (
                        <li key={p.id}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={resaltado === i}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => elegirPaciente(p)}
                            onMouseEnter={() => setResaltado(i)}
                            className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm transition-colors ${
                              resaltado === i
                                ? "bg-teal-50 text-teal-900"
                                : "text-slate-700"
                            }`}
                          >
                            <span
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${p.color}`}
                            >
                              {p.iniciales}
                            </span>
                            {p.nombre}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="px-3.5 py-3 text-sm text-slate-400">
                      Sin coincidencias
                    </p>
                  )}

                  {mostrarNuevo ? (
                    <div className="border-t border-slate-100">
                      <button
                        type="button"
                        role="option"
                        aria-selected={resaltado === coincidencias.length}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={usarNuevo}
                        onMouseEnter={() => setResaltado(coincidencias.length)}
                        className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm transition-colors ${
                          resaltado === coincidencias.length
                            ? "bg-teal-50 text-teal-900"
                            : "text-slate-600"
                        }`}
                      >
                        <UserPlus className="h-4 w-4 shrink-0 text-slate-400" />
                        <span>
                          Usar{" "}
                          <span className="font-medium text-slate-900">
                            «{busqueda.trim()}»
                          </span>{" "}
                          como nuevo
                        </span>
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>

            <label className="block">
              <span className={labelCls}>Doctor(a)</span>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700">
                <Stethoscope className="h-4 w-4 text-slate-400" />
                {doctorAsignado}
                <span className="ml-auto text-[11px] text-slate-400">
                  asignación automática
                </span>
              </div>
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
              Guardar cita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
