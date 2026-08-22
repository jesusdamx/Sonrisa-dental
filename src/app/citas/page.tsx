"use client";

import { useState } from "react";
import { CalendarDays, CalendarPlus, List, Lock, Pencil } from "lucide-react";
import {
  citas as citasIniciales,
  esCitaPasada,
  formatearFechaCita,
  type Cita,
  type EstadoCita,
} from "@/lib/data";
import CalendarioCitas from "@/components/dashboard/calendario-citas";
import ModalEditarCita from "@/components/dashboard/modal-editar-cita";
import ModalNuevaCita from "@/components/dashboard/modal-nueva-cita";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const estadoBadge: Record<EstadoCita, { variant: BadgeVariant; label: string }> = {
  pendiente: { variant: "warning", label: "Pendiente" },
  completada: { variant: "success", label: "Completada" },
  cancelada: { variant: "danger", label: "Cancelada" },
};

const FILTROS = [
  { key: "todas", label: "Todas" },
  { key: "pendiente", label: "Pendientes" },
  { key: "completada", label: "Completadas" },
  { key: "cancelada", label: "Canceladas" },
] as const;

const TABS = [
  { key: "lista", label: "Lista", icon: List },
  { key: "calendario", label: "Calendario", icon: CalendarDays },
] as const;

type Vista = (typeof TABS)[number]["key"];

export default function CitasPage() {
  const [vista, setVista] = useState<Vista>("lista");
  const [filtro, setFiltro] = useState<(typeof FILTROS)[number]["key"]>("todas");
  const [listaCitas, setListaCitas] = useState<Cita[]>(citasIniciales);
  const [modalAbierta, setModalAbierta] = useState(false);
  const [citaEnEdicion, setCitaEnEdicion] = useState<Cita | null>(null);
  const [fechaModalNueva, setFechaModalNueva] = useState<string | undefined>();
  const [horaModalNueva, setHoraModalNueva] = useState<string | undefined>();

  const visibles =
    filtro === "todas"
      ? listaCitas
      : listaCitas.filter((c) => c.estado === filtro);

  function agregarCita(nueva: Cita) {
    setListaCitas((prev) => [nueva, ...prev]);
    setModalAbierta(false);
  }

  function actualizarCita(actualizada: Cita) {
    setListaCitas((prev) =>
      prev.map((c) => (c.id === actualizada.id ? actualizada : c))
    );
    setCitaEnEdicion(null);
  }

  function moverCita(id: string, fechaISO: string, hora: string) {
    setListaCitas((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, fechaISO, hora, fecha: formatearFechaCita(fechaISO) }
          : c
      )
    );
  }

  function eliminarCita(id: string) {
    setListaCitas((prev) => prev.filter((c) => c.id !== id));
  }

  function abrirModalNueva(fechaISO: string, hora: string) {
    setFechaModalNueva(fechaISO);
    setHoraModalNueva(hora);
    setModalAbierta(true);
  }

  function cerrarModalNueva() {
    setModalAbierta(false);
    setFechaModalNueva(undefined);
    setHoraModalNueva(undefined);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            Citas
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            Agenda completa del consultorio: {listaCitas.length} registros.
          </p>
        </div>
        <button
          onClick={() => setModalAbierta(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-teal-600/30 transition-colors hover:bg-teal-700"
        >
          <CalendarPlus className="h-4 w-4" />
          Nueva cita
        </button>
      </div>

      <div
        className="flex w-fit items-center gap-1 rounded-xl border p-1"
        style={{
          borderColor: "var(--card-border)",
          backgroundColor: "var(--card-bg)",
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setVista(tab.key)}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              vista === tab.key ? "bg-slate-900 text-white" : ""
            }`}
            style={
              vista === tab.key
                ? {
                    backgroundColor: "var(--sidebar-bg)",
                    color: "white",
                  }
                : {
                    color: "var(--text-secondary)",
                  }
            }
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTROS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFiltro(f.key)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              filtro === f.key ? "text-white" : ""
            }`}
            style={
              filtro === f.key
                ? {
                    backgroundColor: "var(--sidebar-bg)",
                    borderColor: "var(--card-border)",
                    color: "white",
                  }
                : {
                    backgroundColor: "var(--card-bg)",
                    borderColor: "var(--card-border)",
                    color: "var(--text-secondary)",
                  }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {vista === "calendario" ? (
        <Card className="overflow-hidden p-4">
          <CalendarioCitas
            citas={visibles}
            onEditarCita={setCitaEnEdicion}
            onMoverCita={moverCita}
            onNuevaCita={abrirModalNueva}
          />
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr style={{ color: "var(--text-secondary)" }}>
                  <th className="px-5 py-3 font-medium" style={{ color: "var(--text-secondary)" }}>Paciente</th>
                  <th className="px-5 py-3 font-medium" style={{ color: "var(--text-secondary)" }}>Doctor(a)</th>
                  <th className="px-5 py-3 font-medium" style={{ color: "var(--text-secondary)" }}>Fecha</th>
                  <th className="px-5 py-3 font-medium" style={{ color: "var(--text-secondary)" }}>Hora</th>
                  <th className="px-5 py-3 font-medium" style={{ color: "var(--text-secondary)" }}>Tipo</th>
                  <th className="px-5 py-3 font-medium" style={{ color: "var(--text-secondary)" }}>Duración</th>
                  <th className="px-5 py-3 font-medium" style={{ color: "var(--text-secondary)" }}>Estado</th>
                  <th className="px-5 py-3 font-medium" style={{ color: "var(--text-secondary)" }}>Acciones</th>
                </tr>
              </thead>
              <tbody style={{ borderColor: "var(--card-border)" }} className="divide-y">
                {visibles.map((cita) => {
                  const pasada = esCitaPasada(cita.fechaISO);
                  return (
                    <tr
                      key={cita.id}
                      className={pasada ? "opacity-60" : ""}
                      style={pasada ? undefined : { backgroundColor: "transparent" }}
                    >
                      <td className="px-5 py-3 font-medium" style={{ color: "var(--text-primary)" }}>
                        {cita.paciente}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
                        {cita.doctor}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
                        {cita.fecha}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
                        {cita.hora}
                      </td>
                      <td className="px-5 py-3" style={{ color: "var(--text-secondary)" }}>{cita.tipo}</td>
                      <td className="px-5 py-3 whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
                        {cita.duracion}
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant={estadoBadge[cita.estado].variant} dot>
                          {estadoBadge[cita.estado].label}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        {pasada ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
                            <Lock className="h-3.5 w-3.5" />
                            Pasada
                          </span>
                        ) : (
                          <button
                            onClick={() => setCitaEnEdicion(cita)}
                            className="btn-base btn-secondary inline-flex items-center gap-1.5 px-3 py-1.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-400 hover:bg-teal-500/10 hover:text-teal-200"
                            style={{
                              boxShadow: "0 0 0 1px rgba(45, 212, 191, 0.12)",
                            }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Editar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {visibles.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-10 text-center text-sm"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      No hay citas con ese estado.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          <CardContent
            className="border-t text-xs"
            style={{ borderTopColor: "var(--card-border)", color: "var(--text-tertiary)" }}
          >
            Consejo: las citas marcadas como «pendiente» se muestran también en
            la sección de próximas citas.
          </CardContent>
        </Card>
      )}

      {modalAbierta && (
        <ModalNuevaCita
          onGuardar={agregarCita}
          onCerrar={cerrarModalNueva}
          fechaInicial={fechaModalNueva}
          horaInicial={horaModalNueva}
        />
      )}

      {citaEnEdicion && (
        <ModalEditarCita
          cita={citaEnEdicion}
          onGuardar={actualizarCita}
          onCerrar={() => setCitaEnEdicion(null)}
          onEliminar={eliminarCita}
        />
      )}
    </div>
  );
}
