import Link from "next/link";
import type { Metadata } from "next";
import {
  CalendarDays,
  Clock,
  MapPin,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { citas } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Próximas citas" };

export default function ProximasCitasPage() {
  const proximas = citas.filter((c) => c.estado === "pendiente");
  const [primera, ...resto] = proximas;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Próximas citas
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {proximas.length} citas programadas a partir de hoy.
        </p>
      </div>

      {/* Próxima cita destacada */}
      <Card className="overflow-hidden border-teal-100">
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                PRÓXIMA CITA
              </p>
              <h2 className="mt-3 text-xl font-bold">
                {primera.paciente}
              </h2>
              <p className="mt-1 text-sm text-teal-50">
                {primera.tipo} · {primera.duracion} · {primera.doctor}
              </p>
            </div>
            <div className="rounded-2xl bg-white/15 p-4 text-center backdrop-blur">
              <p className="text-2xl font-bold">{primera.hora}</p>
              <p className="text-xs text-teal-50">{primera.fecha}</p>
            </div>
          </div>
        </div>
        <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-slate-400" />
            Comienza en 45 minutos
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-slate-400" />
            Consultorio 2 · Planta baja
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-slate-400" />
            {primera.fecha} · {primera.hora}
          </span>
        </CardContent>
      </Card>

      {/* Agenda */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {resto.map((cita) => (
          <Card key={cita.id} className="p-5 transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <Stethoscope className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    {cita.fecha} · {cita.hora}
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {cita.paciente}
                  </p>
                </div>
              </div>
              <Badge variant="warning" dot>
                {cita.duracion}
              </Badge>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
              <span className="text-slate-600">{cita.tipo}</span>
              <span className="text-xs text-slate-400">{cita.doctor}</span>
            </div>
          </Card>
        ))}
      </div>

      <p className="text-center text-sm text-slate-400">
        ¿Necesitas reordenar la agenda?{" "}
        <Link href="/citas" className="font-medium text-teal-600 hover:underline">
          Administrar citas
        </Link>
      </p>
    </div>
  );
}
