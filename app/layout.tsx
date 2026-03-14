import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { Providers } from "@/app/providers";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Northstar QMS",
  description: "Production-ready SaaS Quality Management System scaffold built with Next.js, Tailwind, and Supabase.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={`${manrope.variable} ${ibmPlexMono.variable}`} lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
