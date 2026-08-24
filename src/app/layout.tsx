import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Shell from "@/components/dashboard/shell";
import { ThemeProvider } from "@/context/theme-context";
import PWARegister from "@/components/pwa-register";

// CSS global de FullCalendar (v7). Debe importarse antes que los estilos de app
// para que nuestras sobreescrituras dark mode tengan prioridad.
import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/classic/theme.css";
import "@fullcalendar/react/themes/classic/palette.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#1e293b",
};

export const metadata: Metadata = {
  title: {
    default: "Sonrisa Dental · Dashboard",
    template: "%s · Sonrisa Dental",
  },
  description:
    "Panel de administración del consultorio dental: pacientes, citas, facturación e historial clínico.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sonrisa Dental",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="msapplication-TileColor" content="#1e293b" />
      </head>
      <body className="font-sans">
        <PWARegister />
        <ThemeProvider>
          <Shell>{children}</Shell>
        </ThemeProvider>
      </body>
    </html>
  );
}
