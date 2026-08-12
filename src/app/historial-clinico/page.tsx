import type { Metadata } from "next";
import { FilePlus2, Files } from "lucide-react";
import { historial, type EstadoHistorial } from "@/lib/data";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Historial clínico" };

const estadoBadge: Record<EstadoHistorial, { variant: BadgeVariant; label: string }> = {
  finalizado: { variant: "success", label: "Finalizado" },
  en_curso: { variant: "info", label: "En curso" },
  programado: { variant: "warning", label: "Programado" },
};

export default function HistorialClinicoPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Historial clínico
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Expedientes y tratamientos de {historial.length} pacientes.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-teal-600/30 transition-colors hover:bg-teal-700">
          <FilePlus2 className="h-4 w-4" />
          Nuevo registro
        </button>
      </div>

      <Card>
        <CardContent className="flex items-start gap-3 border-b border-slate-100 bg-sky-50/50 pb-4">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
            <Files className="h-4 w-4" />
          </span>
          <p className="text-sm text-slate-600">
            Los expedientes contienen el detalle de cada tratamiento: diagnóstico,
            procedimiento y médico responsable. Los registros <b>en curso</b>{" "}
            requieren seguimiento en la próxima consulta.
          </p>
        </CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="text-xs text-slate-500">
                <th className="px-5 py-3 font-medium">Paciente</th>
                <th className="px-5 py-3 font-medium">Doctor(a)</th>
                <th className="px-5 py-3 font-medium">Fecha</th>
                <th className="px-5 py-3 font-medium">Tratamiento</th>
                <th className="px-5 py-3 font-medium">Diagnóstico</th>
                <th className="px-5 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {historial.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3 font-medium text-slate-900">
                    {h.paciente}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-slate-600">
                    {h.doctor}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-slate-600">
                    {h.fecha}
                  </td>
                  <td className="px-5 py-3 text-slate-600">{h.tratamiento}</td>
                  <td className="px-5 py-3 text-slate-600">{h.diagnostico}</td>
                  <td className="px-5 py-3">
                    <Badge variant={estadoBadge[h.estado].variant} dot>
                      {estadoBadge[h.estado].label}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
