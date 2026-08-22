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
      className="modal-base"
      onClick={onCancelar}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="modal-confirmar-titulo"
    >
      <div
        className="modal-content w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(244, 63, 94, 0.1)" }}>
              <AlertTriangle className="h-5 w-5 text-rose-600" />
            </span>
            <h2 id="modal-confirmar-titulo">
              {titulo}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancelar}
            aria-label="Cerrar"
            className="rounded-lg p-1.5 transition-colors hover:opacity-70"
            style={{ color: "var(--text-secondary)" }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="modal-body">
          <p>{descripcion}</p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={onCancelar}
            className="btn-base btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            className="btn-base btn-danger"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
