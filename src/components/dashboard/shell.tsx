"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bell, Menu, Moon, Search, Stethoscope, Sun, X } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";
import { useTheme } from "@/context/theme-context";

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
        <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>Consultorio odontológico</p>
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
                : "hover:bg-white/5 hover:text-white"
            }`}
            style={{ color: active ? "white" : "var(--text-secondary)" }}
          >
            <Icon
              className={`h-[18px] w-[18px] ${active ? "text-white" : ""}`}
              style={{ color: active ? "white" : "var(--text-tertiary)" }}
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
            <p className="truncate text-[11px]" style={{ color: "var(--text-tertiary)" }}>
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
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  // Asegurar que el componente está montado antes de renderizar tema
  useEffect(() => {
    setMounted(true);
  }, []);

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
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      {/* Fondo oscuro al abrir el menú en móvil */}
      {open ? (
        <div
          className="fixed inset-0 z-40 backdrop-blur-sm md:hidden"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      {/* Sidebar escritorio */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r md:flex" style={{ backgroundColor: "var(--sidebar-bg)", borderColor: "var(--card-border)" }}>
        <SidebarBody />
      </aside>

      {/* Sidebar móvil (drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 transform flex-col transition-transform duration-200 ease-out md:hidden`}
        style={{
          backgroundColor: "var(--sidebar-bg)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
        }}
        aria-hidden={!open}
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="Cerrar menú"
          className="absolute top-4 right-4 rounded-lg p-1.5 transition-colors hover:bg-white/10"
          style={{ color: "var(--sidebar-text)" }}
        >
          <X className="h-5 w-5" />
        </button>
        <SidebarBody />
      </aside>

      <div className="md:pl-64">
        {/* Encabezado */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 px-4 backdrop-blur md:px-8" style={{ backgroundColor: `var(--card-bg)`, borderColor: "var(--card-border)", borderBottom: "1px solid var(--card-border)" }}>
          <button
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
            className="rounded-lg p-2 transition-colors md:hidden"
            style={{ color: "var(--text-primary)" }}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 md:hidden">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 text-white">
              <Stethoscope className="h-4 w-4" />
            </span>
            <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              Sonrisa Dental
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2 md:gap-3">
            <label className="relative hidden lg:block">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" style={{ color: "var(--text-tertiary)" }} />
              <input
                type="search"
                placeholder="Buscar pacientes, citas…"
                className="h-10 w-64 rounded-xl border pr-3 pl-9 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--card-border)",
                  color: "var(--text-primary)",
                }}
              />
            </label>

            <button
              aria-label="Notificaciones"
              className="relative rounded-xl border p-2.5 transition-colors hover:opacity-80"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--card-border)",
                color: "var(--text-secondary)",
              }}
            >
              <Bell className="h-4 w-4" />
              <span
                className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500"
                style={{ boxShadow: `0 0 0 2px var(--card-bg)` }}
              />
            </button>

            <button
              onClick={toggleTheme}
              aria-label={`Cambiar a tema ${theme === "light" ? "oscuro" : "claro"}`}
              className="rounded-xl border p-2.5 transition-colors hover:opacity-80"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--card-border)",
                color: "var(--text-secondary)",
              }}
            >
              {mounted && (theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              ))}
            </button>

            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-xs font-bold text-white ring-2 ring-white">
              DL
            </span>
          </div>
        </header>

        <main className="px-4 py-6 md:px-8 md:py-8" style={{ backgroundColor: "var(--background)", color: "var(--text-primary)" }}>{children}</main>
      </div>
    </div>
  );
}
