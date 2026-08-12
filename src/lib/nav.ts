import {
  CalendarClock,
  CalendarDays,
  FileText,
  LayoutDashboard,
  ReceiptText,
  Stethoscope,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Inicio", icon: LayoutDashboard },
  { href: "/pacientes", label: "Pacientes", icon: Users },
  { href: "/citas", label: "Citas", icon: CalendarDays },
  { href: "/proximas-citas", label: "Próximas citas", icon: CalendarClock },
  { href: "/facturacion", label: "Facturación", icon: ReceiptText },
  { href: "/historial-clinico", label: "Historial clínico", icon: FileText },
  { href: "/doctores", label: "Doctores", icon: Stethoscope },
];
