"use client";

import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function ModalConfirmarEliminar({
  titulo,
  descripcion,
  onConfirmar,
  onCancelar,
}: {
  titulo: string;
  descripcion: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}) {
  useEffect(() => {
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") onCancelar();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancelar]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={onCancelar}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="modal-confirmar-titulo"
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50">
              <AlertTriangle className="h-5 w-5 text-rose-600" />
            </span>
            <h2
              id="modal-confirmar-titulo"
              className="text-base font-semibold text-slate-900"
            >
              {titulo}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancelar}
            aria-label="Cerrar"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm text-slate-600">{descripcion}</p>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
          <button
            type="button"
            onClick={onCancelar}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-rose-600/30 transition-colors hover:bg-rose-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
