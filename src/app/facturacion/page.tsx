import type { Metadata } from "next";
import {
  CircleDollarSign,
  FilePlus2,
  ReceiptText,
  Wallet,
} from "lucide-react";
import { facturas, type EstadoFactura } from "@/lib/data";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Facturación" };

const estadoBadge: Record<EstadoFactura, { variant: BadgeVariant; label: string }> = {
  pagada: { variant: "success", label: "Pagada" },
  pendiente: { variant: "warning", label: "Pendiente" },
  vencida: { variant: "danger", label: "Vencida" },
};

const formato = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

const totalFacturado = facturas.reduce((sum, f) => sum + f.monto, 0);
const totalPagado = facturas
  .filter((f) => f.estado === "pagada")
  .reduce((sum, f) => sum + f.monto, 0);
const totalPendiente = facturas
  .filter((f) => f.estado !== "pagada")
  .reduce((sum, f) => sum + f.monto, 0);

function ResumenCard({
  icon,
  iconBg,
  label,
  value,
  nota,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  nota: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}
        >
          {icon}
        </span>
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
      <p className="mt-0.5 text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-xs text-slate-400">{nota}</p>
    </Card>
  );
}

export default function FacturacionPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Facturación
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Control de cobros y facturas del consultorio.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-teal-600/30 transition-colors hover:bg-teal-700">
          <FilePlus2 className="h-4 w-4" />
          Nueva factura
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ResumenCard
          icon={<ReceiptText className="h-5 w-5" />}
          iconBg="bg-violet-50 text-violet-600"
          label="Total facturado"
          value={formato.format(totalFacturado)}
          nota={`${facturas.length} facturas emitidas`}
        />
        <ResumenCard
          icon={<CircleDollarSign className="h-5 w-5" />}
          iconBg="bg-emerald-50 text-emerald-600"
          label="Cobrado"
          value={formato.format(totalPagado)}
          nota="Pagos recibidos a tiempo"
        />
        <ResumenCard
          icon={<Wallet className="h-5 w-5" />}
          iconBg="bg-amber-50 text-amber-600"
          label="Pendiente de cobro"
          value={formato.format(totalPendiente)}
          nota="Incluye facturas vencidas"
        />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="text-xs text-slate-500">
                <th className="px-5 py-3 font-medium">Factura</th>
                <th className="px-5 py-3 font-medium">Paciente</th>
                <th className="px-5 py-3 font-medium">Concepto</th>
                <th className="px-5 py-3 font-medium">Fecha</th>
                <th className="px-5 py-3 font-medium">Monto</th>
                <th className="px-5 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {facturas.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3 font-medium text-slate-900">
                    {f.numero}
                  </td>
                  <td className="px-5 py-3 text-slate-600">{f.paciente}</td>
                  <td className="px-5 py-3 text-slate-600">{f.concepto}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-slate-600">
                    {f.fecha}
                  </td>
                  <td className="px-5 py-3 font-medium whitespace-nowrap text-slate-900">
                    {formato.format(f.monto)}
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={estadoBadge[f.estado].variant} dot>
                      {estadoBadge[f.estado].label}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CardContent className="border-t border-slate-100 text-xs text-slate-400">
          Los montos se muestran en pesos mexicanos (MXN) a modo de ejemplo.
        </CardContent>
      </Card>
    </div>
  );
}
