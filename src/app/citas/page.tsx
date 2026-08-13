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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Citas
          </h1>
          <p className="mt-1 text-sm text-slate-500">
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

      <div className="flex w-fit items-center gap-1 rounded-xl border border-slate-200 bg-white p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setVista(tab.key)}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              vista === tab.key
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
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
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filtro === f.key
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
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
                <tr className="text-xs text-slate-500">
                  <th className="px-5 py-3 font-medium">Paciente</th>
                  <th className="px-5 py-3 font-medium">Doctor(a)</th>
                  <th className="px-5 py-3 font-medium">Fecha</th>
                  <th className="px-5 py-3 font-medium">Hora</th>
                  <th className="px-5 py-3 font-medium">Tipo</th>
                  <th className="px-5 py-3 font-medium">Duración</th>
                  <th className="px-5 py-3 font-medium">Estado</th>
                  <th className="px-5 py-3 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibles.map((cita) => {
                  const pasada = esCitaPasada(cita.fechaISO);
                  return (
                  <tr
                    key={cita.id}
                    className={pasada ? "opacity-60" : "hover:bg-slate-50/70"}
                  >
                    <td className="px-5 py-3 font-medium text-slate-900">
                      {cita.paciente}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-slate-600">
                      {cita.doctor}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-slate-600">
                      {cita.fecha}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-slate-600">
                      {cita.hora}
                    </td>
                    <td className="px-5 py-3 text-slate-600">{cita.tipo}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-slate-600">
                      {cita.duracion}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={estadoBadge[cita.estado].variant} dot>
                        {estadoBadge[cita.estado].label}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      {pasada ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                          <Lock className="h-3.5 w-3.5" />
                          Pasada
                        </span>
                      ) : (
                        <button
                          onClick={() => setCitaEnEdicion(cita)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
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
                      className="px-5 py-10 text-center text-sm text-slate-400"
                    >
                      No hay citas con ese estado.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          <CardContent className="border-t border-slate-100 text-xs text-slate-400">
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
