import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarClock,
  CalendarPlus,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  FileText,
  ReceiptText,
  Stethoscope,
  UserPlus,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import { actividadReciente, citas, pacientes } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const metadata: Metadata = { title: "Inicio" };

const estadoCita = {
  pendiente: { variant: "warning" as const, label: "Pendiente" },
  completada: { variant: "success" as const, label: "Completada" },
  cancelada: { variant: "danger" as const, label: "Cancelada" },
};

const iconoActividad: Record<string, React.ReactNode> = {
  cita: <CalendarClock className="h-4 w-4" />,
  factura: <ReceiptText className="h-4 w-4" />,
  paciente: <UserPlus className="h-4 w-4" />,
  historial: <FileText className="h-4 w-4" />,
  pago: <CheckCircle2 className="h-4 w-4" />,
};

const colorActividad: Record<string, string> = {
  cita: "bg-teal-50 text-teal-600",
  factura: "bg-violet-50 text-violet-600",
  paciente: "bg-sky-50 text-sky-600",
  historial: "bg-amber-50 text-amber-600",
  pago: "bg-emerald-50 text-emerald-600",
};

function StatCard({
  icon,
  iconBg,
  label,
  value,
  delta,
  trend,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
}) {
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}
        >
          {icon}
        </span>
        <span
          className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium ${
            trend === "up"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-rose-50 text-rose-600"
          }`}
        >
          <TrendIcon className="h-3.5 w-3.5" />
          {delta}
        </span>
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
      <p className="mt-0.5 text-sm text-slate-500">{label}</p>
    </Card>
  );
}

export default function DashboardPage() {
  const hoy = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const proximas = citas.filter((c) => c.estado === "pendiente").slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm capitalize text-slate-500">{hoy}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Buen día, Dra. López 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Este es el resumen de tu consultorio hoy.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/pacientes"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <UserPlus className="h-4 w-4" />
            Nuevo paciente
          </Link>
          <Link
            href="/citas"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-teal-600/30 transition-colors hover:bg-teal-700"
          >
            <CalendarPlus className="h-4 w-4" />
            Nueva cita
          </Link>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Users className="h-5 w-5" />}
          iconBg="bg-teal-50 text-teal-600"
          label="Pacientes registrados"
          value="1,284"
          delta="+12%"
          trend="up"
        />
        <StatCard
          icon={<CalendarClock className="h-5 w-5" />}
          iconBg="bg-sky-50 text-sky-600"
          label="Citas para hoy"
          value="24"
          delta="+3"
          trend="up"
        />
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          iconBg="bg-amber-50 text-amber-600"
          label="Citas pendientes"
          value="7"
          delta="-2"
          trend="down"
        />
        <StatCard
          icon={<CircleDollarSign className="h-5 w-5" />}
          iconBg="bg-emerald-50 text-emerald-600"
          label="Ingresos del mes"
          value="$48,500"
          delta="+8%"
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Próximas citas */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Próximas citas"
            subtitle="Las próximas 5 citas programadas"
            action={
              <Link
                href="/proximas-citas"
                className="rounded-lg px-2 py-1 text-xs font-medium text-teal-600 transition-colors hover:bg-teal-50"
              >
                Ver todas →
              </Link>
            }
          />
          <CardContent className="px-0 pt-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="text-xs text-slate-500">
                    <th className="px-5 py-3 font-medium">Paciente</th>
                    <th className="px-5 py-3 font-medium">Doctor(a)</th>
                    <th className="px-5 py-3 font-medium">Fecha</th>
                    <th className="px-5 py-3 font-medium">Tipo</th>
                    <th className="px-5 py-3 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {proximas.map((cita) => (
                    <tr key={cita.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-3 font-medium text-slate-900">
                        {cita.paciente}
                      </td>
                      <td className="px-5 py-3 text-slate-600">{cita.doctor}</td>
                      <td className="px-5 py-3 whitespace-nowrap text-slate-600">
                        {cita.fecha} · {cita.hora}
                      </td>
                      <td className="px-5 py-3 text-slate-600">{cita.tipo}</td>
                      <td className="px-5 py-3">
                        <Badge
                          variant={estadoCita[cita.estado].variant}
                          dot
                        >
                          {estadoCita[cita.estado].label}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Actividad reciente */}
        <Card>
          <CardHeader title="Actividad reciente" />
          <CardContent className="px-0 pt-0">
            <ul className="divide-y divide-slate-100">
              {actividadReciente.map((act) => (
                <li key={act.id} className="flex items-start gap-3 px-5 py-3">
                  <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colorActividad[act.tipo]}`}
                  >
                    {iconoActividad[act.tipo]}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm leading-snug text-slate-700">
                      {act.texto}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">{act.detalle}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Aviso de disponibilidad */}
      <Card className="flex flex-wrap items-center gap-4 border-teal-100 bg-gradient-to-r from-teal-50 to-cyan-50 p-5">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600/10 text-teal-600">
          <Stethoscope className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">
            El Dr. Marco Salazar no atenderá el viernes
          </p>
          <p className="mt-0.5 text-sm text-slate-600">
            Sus citas de cirugía oral se reprogramaron para la próxima semana.
            {` `}
            <Link
              href="/citas"
              className="font-medium text-teal-600 hover:underline"
            >
              Revisar agenda
            </Link>
          </p>
        </div>
        <span className="hidden text-xs text-slate-400 sm:block">
          {pacientes.length} pacientes de ejemplo cargados
        </span>
      </Card>
    </div>
  );
}
