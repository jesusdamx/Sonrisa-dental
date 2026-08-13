"use client";

import { useMemo, useState } from "react";
import { Search, UserPlus } from "lucide-react";
import { normalizarTexto, pacientes, type EstadoPaciente } from "@/lib/data";
import { Avatar } from "@/components/ui/avatar";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const estadoBadge: Record<EstadoPaciente, { variant: BadgeVariant; label: string }> = {
  activo: { variant: "success", label: "Activo" },
  pendiente: { variant: "warning", label: "Pendiente" },
  inactivo: { variant: "neutral", label: "Inactivo" },
};

export default function PacientesPage() {
  const [query, setQuery] = useState("");

  const filtrados = useMemo(() => {
    const q = normalizarTexto(query);
    if (!q) return pacientes;
    return pacientes.filter(
      (p) =>
        normalizarTexto(p.nombre).includes(q) ||
        normalizarTexto(p.email).includes(q) ||
        p.telefono.includes(q)
    );
  }, [query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Pacientes
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {pacientes.length} pacientes registrados en el consultorio.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-teal-600/30 transition-colors hover:bg-teal-700">
          <UserPlus className="h-4 w-4" />
          Nuevo paciente
        </button>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3 pb-4">
          <label className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, email o teléfono…"
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pr-3 pl-9 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
            />
          </label>
          <p className="text-xs text-slate-400">
            Mostrando {filtrados.length} de {pacientes.length}
          </p>
        </CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-t border-slate-100 text-xs text-slate-500">
                <th className="px-5 py-3 font-medium">Paciente</th>
                <th className="px-5 py-3 font-medium">Teléfono</th>
                <th className="px-5 py-3 font-medium">Edad</th>
                <th className="px-5 py-3 font-medium">Última visita</th>
                <th className="px-5 py-3 font-medium">Próxima cita</th>
                <th className="px-5 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtrados.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar iniciales={p.iniciales} color={p.color} />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-900">
                          {p.nombre}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {p.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-slate-600">
                    {p.telefono}
                  </td>
                  <td className="px-5 py-3 text-slate-600">{p.edad}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-slate-600">
                    {p.ultimaVisita}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-slate-600">
                    {p.proximaCita}
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={estadoBadge[p.estado].variant} dot>
                      {estadoBadge[p.estado].label}
                    </Badge>
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-sm text-slate-400"
                  >
                    No se encontraron pacientes con «{query}».
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
