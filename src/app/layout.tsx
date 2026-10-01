import type { Metadata } from "next";
import { Inter, Lato } from "next/font/google";
import "./globals.css";
import { ThemeScript } from "@/components/theme/ThemeScript";

/**
 * Lato ships 400/700/900 only — requesting 500 or 600 here would make the browser
 * synthesise them, which is the exact failure the token layer exists to prevent.
 */
const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

/** Inter carries tabular figures for specs and prices. Never for prose. */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SMS Perkasa — Design System",
  description:
    "Sistem desain untuk PT. Sumber Makmur Surya Perkasa, distributor baja struktural.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // lang="id": all user-facing copy is Bahasa Indonesia. Token names stay English.
    <html lang="id" className={`${lato.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
