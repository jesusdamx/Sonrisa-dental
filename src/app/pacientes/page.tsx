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
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            Pacientes
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
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
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" style={{ color: "var(--text-tertiary)" }} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, email o teléfono…"
              className="input-base h-10 w-full pl-9"
            />
          </label>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Mostrando {filtrados.length} de {pacientes.length}
          </p>
        </CardContent>
        <div className="overflow-x-auto">
          <table className="table-mobile-cards w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-t text-xs" style={{ borderColor: "var(--card-border)", color: "var(--text-tertiary)" }}>
                <th className="px-5 py-3 font-medium">Paciente</th>
                <th className="px-5 py-3 font-medium">Teléfono</th>
                <th className="px-5 py-3 font-medium">Edad</th>
                <th className="px-5 py-3 font-medium">Última visita</th>
                <th className="px-5 py-3 font-medium">Próxima cita</th>
                <th className="px-5 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--card-border)" }}>
              {filtrados.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3" data-label="Paciente">
                    <div className="flex items-center gap-3">
                      <Avatar iniciales={p.iniciales} color={p.color} />
                      <div className="min-w-0">
                        <p className="truncate font-medium" style={{ color: "var(--text-primary)" }}>
                          {p.nombre}
                        </p>
                        <p className="truncate text-xs" style={{ color: "var(--text-secondary)" }}>
                          {p.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap" style={{ color: "var(--text-secondary)" }} data-label="Teléfono">
                    {p.telefono}
                  </td>
                  <td className="px-5 py-3" style={{ color: "var(--text-secondary)" }} data-label="Edad">{p.edad}</td>
                  <td className="px-5 py-3 whitespace-nowrap" style={{ color: "var(--text-secondary)" }} data-label="Última visita">
                    {p.ultimaVisita}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap" style={{ color: "var(--text-secondary)" }} data-label="Próxima cita">
                    {p.proximaCita}
                  </td>
                  <td className="px-5 py-3" data-label="Estado">
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
                    className="px-5 py-10 text-center text-sm"
                    style={{ color: "var(--text-tertiary)" }}
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
