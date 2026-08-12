"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bell, Menu, Search, Stethoscope, X } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";

function Brand() {
  return (
    <div className="flex items-center gap-3 px-5 pt-6 pb-5">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 text-white shadow-lg shadow-teal-900/40">
        <Stethoscope className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm font-bold tracking-tight text-white">
          Sonrisa Dental
        </p>
        <p className="text-[11px] text-slate-400">Consultorio odontológico</p>
      </div>
    </div>
  );
}

function NavLinks({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 space-y-1 px-3">
      {NAV_ITEMS.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-teal-600/90 text-white shadow-sm shadow-teal-950/40"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon
              className={`h-[18px] w-[18px] ${active ? "text-white" : "text-slate-400"}`}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBody() {
  return (
    <>
      <Brand />
      <NavLinks />
      <div className="m-3 rounded-xl bg-white/5 p-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-xs font-bold text-white">
            DL
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-white">
              Dra. Diana López
            </p>
            <p className="truncate text-[11px] text-slate-400">
              Administradora
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Shell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Cierra el menú automáticamente al cambiar de ruta
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  // Cierra el menú al presionar Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Fondo oscuro al abrir el menú en móvil */}
      {open ? (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      {/* Sidebar escritorio */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-800 bg-slate-900 md:flex">
        <SidebarBody />
      </aside>

      {/* Sidebar móvil (drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 transform flex-col bg-slate-900 transition-transform duration-200 ease-out md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="Cerrar menú"
          className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        <SidebarBody />
      </aside>

      <div className="md:pl-64">
        {/* Encabezado */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-8">
          <button
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 md:hidden">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 text-white">
              <Stethoscope className="h-4 w-4" />
            </span>
            <span className="text-sm font-bold text-slate-900">
              Sonrisa Dental
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2 md:gap-3">
            <label className="relative hidden lg:block">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Buscar pacientes, citas…"
                className="h-10 w-64 rounded-xl border border-slate-200 bg-slate-50 pr-3 pl-9 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
              />
            </label>

            <button
              aria-label="Notificaciones"
              className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition-colors hover:bg-slate-50"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-xs font-bold text-white ring-2 ring-white">
              DL
            </span>
          </div>
        </header>

        <main className="px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
