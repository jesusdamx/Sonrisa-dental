import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Shell from "@/components/dashboard/shell";
import { ThemeProvider } from "@/context/theme-context";

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

export const metadata: Metadata = {
  title: {
    default: "Sonrisa Dental · Dashboard",
    template: "%s · Sonrisa Dental",
  },
  description:
    "Panel de administración del consultorio dental: pacientes, citas, facturación e historial clínico.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="font-sans">
        <ThemeProvider>
          <Shell>{children}</Shell>
        </ThemeProvider>
      </body>
    </html>
  );
}
