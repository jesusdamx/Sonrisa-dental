# Sonrisa Dental — Documentación del Proyecto

## Qué es

**Sonrisa Dental** es un sistema de administración para consultorios odontológicos. Permite gestionar pacientes, citas, facturación, historial clínico y doctores desde una única interfaz web.

La aplicación está diseñada para ser usada por:
- **Recepcionistas** — agendan citas, registran pacientes, emiten facturas
- **Dentistas** — consultan historiales clínico, revisan agenda del día
- **Administradores** — ven reportes de ingresos, actividad reciente

## Estado actual

| Aspecto | Estado |
|---|---|
| Frontend | ✅ Funcional (Next.js 16 + React 19 + Tailwind CSS 4) |
| Backend | ❌ No existe — data hardcodeada en `src/lib/data.ts` |
| Base de datos | ❌ No existe |
| Autenticación | ❌ No existe |
| PWA | ✅ Implementada (manifest, service worker, iconos) |
| Responsive | ✅ Implementado (tab bar móvil, safe areas, cards) |
| Offline | ✅ Parcial (service worker cachea assets, pero no hay persistencia de data) |

## Estructura del proyecto

```
sonrisa-dental/
├── src/
│   ├── app/                    # Pages (App Router)
│   │   ├── layout.tsx          # Layout raíz + PWA meta tags
│   │   ├── page.tsx            # Dashboard principal
│   │   ├── pacientes/          # Gestión de pacientes
│   │   ├── citas/              # Agenda + calendario
│   │   ├── proximas-citas/     # Vista de próximas citas
│   │   ├── facturacion/        # Facturación
│   │   ├── historial-clinico/  # Historial clínico
│   │   └── doctores/           # Catálogo de doctores
│   ├── components/
│   │   ├── dashboard/          # Shell, calendario, modales
│   │   └── ui/                 # Card, Badge, Avatar
│   ├── context/                # ThemeContext (light/dark)
│   └── lib/
│       ├── data.ts             # Data hardcodeada + tipos
│       └── nav.ts              # Items de navegación
├── public/
│   ├── manifest.json           # PWA manifest
│   ├── sw.js                   # Service Worker
│   ├── icon-192.png            # Icono PWA
│   └── icon-512.png            # Icono PWA grande
└── docs/                       # Esta documentación
    ├── README.md               # Este archivo
    ├── negocio.md              # Contexto del negocio
    ├── arquitectura.md         # Arquitectura técnica
    ├── modelos-de-datos.md     # Entidades y tipos
    ├── api-backend.md          # Plan de integración backend
    ├── offline-persistencia.md # Estrategia offline
    └── modulos.md              # Flujo por módulo
```

## Documentación

| Documento | Para qué sirve |
|---|---|
| [negocio.md](negocio.md) | Contexto del negocio dental, reglas, usuarios |
| [arquitectura.md](arquitectura.md) | Stack técnico, estructura de archivos, decisiones |
| [modelos-de-datos.md](modelos-de-datos.md) | Entidades, tipos TypeScript, relaciones |
| [api-backend.md](api-backend.md) | Plan de API REST, endpoints, autenticación |
| [offline-persistencia.md](offline-persistencia.md) | Estrategia IndexedDB, sync offline, Dexie.js |
| [modulos.md](modulos.md) | Flujo de usuario por cada módulo |
