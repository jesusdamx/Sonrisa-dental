import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Shell from "@/components/dashboard/shell";
import "./globals.css";

// CSS global de FullCalendar (v7). Debe importarse desde el layout raíz.
import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/classic/theme.css";
import "@fullcalendar/react/themes/classic/palette.css";

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
      <body className="font-sans">{<Shell>{children}</Shell>}</body>
    </html>
  );
}
