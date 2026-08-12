"use client";

import { useState } from "react";
import { CalendarPlus } from "lucide-react";
import { citas, type EstadoCita } from "@/lib/data";
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

export default function CitasPage() {
  const [filtro, setFiltro] = useState<(typeof FILTROS)[number]["key"]>("todas");

  const visibles =
    filtro === "todas"
      ? citas
      : citas.filter((c) => c.estado === filtro);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Citas
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Agenda completa del consultorio: {citas.length} registros.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-teal-600/30 transition-colors hover:bg-teal-700">
          <CalendarPlus className="h-4 w-4" />
          Nueva cita
        </button>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibles.map((cita) => (
                <tr key={cita.id} className="hover:bg-slate-50/70">
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
                </tr>
              ))}
              {visibles.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
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
    </div>
  );
}
