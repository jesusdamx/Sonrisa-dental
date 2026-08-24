"use client";

import { useEffect } from "react";

/**
 * Registra el service worker para habilitar la PWA.
 * Este componente debe montarse una sola vez en el layout raíz.
 */
export default function PWARegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[PWA] Service Worker registrado:", reg.scope);
        })
        .catch((err) => {
          console.error("[PWA] Error al registrar Service Worker:", err);
        });
    }
  }, []);

  return null;
}
