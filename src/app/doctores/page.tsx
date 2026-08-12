import type { Metadata } from "next";
import { Clock, Mail, Phone, Star, Stethoscope, UserPlus } from "lucide-react";
import { doctores } from "@/lib/data";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Doctores" };

export default function DoctoresPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Doctores
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {doctores.length} especialistas que atienden en el consultorio.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-teal-600/30 transition-colors hover:bg-teal-700">
          <UserPlus className="h-4 w-4" />
          Nuevo doctor
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {doctores.map((d) => (
          <Card key={d.id} className="p-5 transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar iniciales={d.iniciales} color={d.color} size="lg" />
                <div>
                  <p className="font-semibold text-slate-900">{d.nombre}</p>
                  <p className="text-xs text-slate-500">{d.especialidad}</p>
                </div>
              </div>
              <Badge variant={d.disponible ? "success" : "neutral"} dot>
                {d.disponible ? "Disponible" : "Ocupado"}
              </Badge>
            </div>

            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0 text-slate-400" />
                {d.horario}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                {d.telefono}
              </p>
              <p className="flex items-center gap-2 truncate">
                <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="truncate">{d.email}</span>
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
              <span className="inline-flex items-center gap-1.5 text-slate-600">
                <Stethoscope className="h-4 w-4 text-slate-400" />
                {d.pacientes.toLocaleString("es-MX")} pacientes
              </span>
              <span className="inline-flex items-center gap-1 font-medium text-amber-500">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {d.rating.toFixed(1)}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <Card className="border-teal-100 bg-gradient-to-r from-teal-50 to-cyan-50 p-5">
        <p className="text-sm text-slate-600">
          <b className="text-slate-900">¿Buscas un especialista?</b> El equipo
          cubre odontología general, ortodoncia, endodoncia, cirugía oral,
          periodoncia e implantología. Consulta la disponibilidad en la sección
          de citas.
        </p>
      </Card>
    </div>
  );
}
