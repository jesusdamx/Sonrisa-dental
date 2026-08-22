# Sistema de Temas - Documentación

## Descripción General

El sistema de temas permite cambiar entre modo claro (Light) y modo oscuro (Dark) en toda la aplicación. La preferencia se persiste en localStorage y se carga automáticamente al iniciar.

## Componentes Principales

### 1. ThemeProvider (`src/context/theme-context.tsx`)

Proporciona el contexto global para el tema.

**Features:**
- Detecta preferencia del sistema operativo (`prefers-color-scheme`)
- Persiste la selección en localStorage
- Hook `useTheme()` defensivo que no falla en SSR
- Aplica la clase `dark` al elemento `<html>`

**Uso:**
```tsx
import { useTheme } from "@/context/theme-context";

export function MiComponente() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Tema actual: {theme}
    </button>
  );
}
```

### 2. Paleta de Colores (`src/app/globals.css`)

Define variables CSS que cambian según el tema:

**Light Theme (`:root`):**
- `--background`: #f8fafc (fondo claro)
- `--foreground`: #0f172a (texto oscuro)
- `--card-bg`: #ffffff (tarjetas blancas)
- `--sidebar-bg`: #1e293b (sidebar gris oscuro)

**Dark Theme (`html.dark`):**
- `--background`: #0f172a (fondo muy oscuro)
- `--foreground`: #f8fafc (texto claro)
- `--card-bg`: #1e293b (tarjetas gris oscuro)
- `--sidebar-bg`: #020617 (sidebar casi negro)

**Transición:**
```css
body {
  transition: background-color 0.2s, color 0.2s;
}
```

### 3. Botón Toggle

Ubicado en el header (entre notificaciones y avatar):
- Muestra icono 🌙 Moon en light mode
- Muestra icono ☀️ Sun en dark mode

## Arquitectura

```
Layout (RootLayout)
  └── ThemeProvider
      └── Shell
          ├── Header (con botón toggle)
          ├── Sidebar
          └── Main (contenido)
```

## SSR / Prerendering

El sistema está optimizado para Next.js:

1. **ThemeProvider** se renderiza en el servidor (retorna children sin temas aplicados)
2. **En el cliente**, un `useEffect` detecta tema y aplica clase `dark`
3. **Shell** verifica `mounted` antes de renderizar contenido dependiente del tema
4. **useTheme()** retorna valores por defecto en SSR (no falla)

Esto evita flash de contenido incorrecto y permite prerendering exitoso.

## Cómo Extender

### Agregar más colores a la paleta

Edita `src/app/globals.css`:

```css
:root {
  /* ... colores existentes ... */
  --mi-color-nuevo: #color-light;
}

html.dark {
  /* ... colores existentes ... */
  --mi-color-nuevo: #color-dark;
}
```

### Usar los colores en componentes

```tsx
export default function MiComponente() {
  return (
    <div style={{ color: "var(--text-primary)", background: "var(--card-bg)" }}>
      Contenido
    </div>
  );
}
```

## Storage

- **Clave localStorage:** `"theme"`
- **Valores:** `"light"` | `"dark"`
- **Persistencia:** Automática en `applyTheme()`
- **Lectura:** Automática en `useEffect` de ThemeProvider

## Testing Local

Para probar localmente con Node.js 16+ (no en sandbox):

```bash
npm run dev
```

Luego:
1. Abre la app en http://localhost:3000
2. Click en botón Moon/Sun en el header
3. Verifica que cambia el tema
4. Actualiza la página → preferencia se mantiene
5. Abre DevTools → Verifica clase `dark` en `<html>`
6. Abre localStorage → Verifica clave `theme`
