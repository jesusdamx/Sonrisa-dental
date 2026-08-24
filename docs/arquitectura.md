# Arquitectura Técnica — Sonrisa Dental

## Stack actual

```
┌─────────────────────────────────────────────────┐
│                  FRONTEND                         │
├─────────────────────────────────────────────────┤
│  Next.js 16.3    │ App Router, Server Components │
│  React 19.2      │ UI library                    │
│  TypeScript 5    │ Tipado estático               │
│  Tailwind CSS 4  │ Utility-first styles          │
│  FullCalendar 7  │ Calendario de citas           │
│  Lucide React    │ Iconos                        │
├─────────────────────────────────────────────────┤
│                  PWA                              │
├─────────────────────────────────────────────────┤
│  manifest.json   │ Declaración PWA               │
│  sw.js           │ Service Worker (caché)        │
│  Iconos          │ 192px + 512px                 │
├─────────────────────────────────────────────────┤
│                  BACKEND                          │
├─────────────────────────────────────────────────┤
│  ❌ No existe    │ Data hardcodeada en data.ts   │
└─────────────────────────────────────────────────┘
```

## Decisiones arquitectónicas

### Next.js App Router
- **Por qué:** Server Components para performance, metadata API para SEO/PWA, file-based routing
- **Consecuencia:** Los pages son Server Components por defecto, los que necesitan interactividad usan `"use client"`

### Tailwind CSS (no CSS Modules)
- **Por qué:** Consistencia visual, rapididad de desarrollo, theming con CSS variables
- **Consecuencia:** Estilos en className, theming via `var(--color)` en globals.css

### FullCalendar (no calendario custom)
- **Por qué:** Drag & drop, vistas month/week/day, locale español, maduro y probado
- **Consecuencia:** ~150KB de bundle, pero es el core de la app

### Data hardcodeada (temporal)
- **Por qué:** Prototipo rápido sin backend
- **Consecuencia:** La app funciona pero no persiste datos. Todo se pierde al recargar.

## Sistema de theming

La app usa CSS variables para soporte light/dark:

```css
:root {
  --background: #f8fafc;
  --card-bg: #ffffff;
  --card-border: #e2e8f0;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --sidebar-bg: #1e293b;
}

html.dark {
  --background: #0f172a;
  --card-bg: #1e293b;
  --text-primary: #f1f5f9;
  --sidebar-bg: #020617;
}
```

El toggle se maneja via `ThemeContext` que agrega/quita la clase `dark` al `<html>`.

## PWA

### Service Worker (sw.js)
- **Cache First** para assets estáticos (CSS, JS, fuentes, iconos)
- **Network First** para páginas HTML (fallback a caché si offline)
- Cache name versionado: `sonrisa-dental-v1`

### Meta tags
- `manifest.json` → nombre, colores, iconos, display standalone
- `apple-mobile-web-app-capable` → iOS full screen
- `viewport-fit=cover` → notch support
- `theme-color: #1e293b` → status bar

### Limitación actual
El SW cachea assets pero **no persiste la data de la app**. Si el usuario pierde conexión, la app carga pero muestra la data del último build, no los cambios que haya hecho.

## Componentes principales

```
src/components/
├── dashboard/
│   ├── shell.tsx              # Layout: sidebar + header + tab bar móvil
│   ├── calendario-citas.tsx   # Wrapper de FullCalendar
│   ├── modal-nueva-cita.tsx   # Modal para crear cita
│   └── modal-editar-cita.tsx  # Modal para editar/eliminar cita
└── ui/
    ├── card.tsx               # Card, CardHeader, CardContent
    ├── badge.tsx              # Badge con variantes de color
    └── avatar.tsx             # Avatar con iniciales
```

## Responsive design

### Breakpoints
- `sm:` 640px — 2 columnas de stats
- `md:` 768px — sidebar visible, tab bar oculta
- `lg:` 1024px — 3 columnas en grid
- `xl:` 1280px — 4 stats en fila

### Móvil (< 768px)
- Sidebar se convierte en drawer (hamburger menu)
- Tab bar inferior con 4 módulos principales + "Más"
- Tablas muestran cards con `table-mobile-cards`
- Safe areas para notch y barra del sistema

### Desktop (≥ 768px)
- Sidebar fijo de 64px
- Tab bar oculta
- Tablas con scroll horizontal

## Próximos pasos arquitectónicos

1. **Backend API** → Reemplazar data hardcodeada con fetch a API REST
2. **Base de datos** → PostgreSQL o SQLite (según escala)
3. **Autenticación** → NextAuth.js o similar
4. **Persistencia offline** → IndexedDB con Dexie.js
5. **State management** → TanStack Query para server state
