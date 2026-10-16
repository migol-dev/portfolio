import type { Metadata } from "next";
import { Syne, Instrument_Serif, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CommandPaletteProvider } from "@/components/CommandPalette";
import { CustomCursor } from "@/components/CustomCursor";
import { ArchitecturalBackground } from "@/components/ArchitecturalBackground";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://migol.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Miguel García (MIGOL) — C/C++ & Full Stack Web Developer (React · TypeScript · Vite · PostgreSQL)",
    template: "%s · MIGOL.DEV",
  },
  description:
    "Desarrollador enfocado en C/C++, React, TypeScript, Vite y PostgreSQL. Bilingüe español/inglés. De la gestión manual de memoria a interfaces web reactivas y escalables.",
  keywords: [
    "Miguel García",
    "MIGOL",
    "C/C++",
    "Full Stack Web",
    "React",
    "TypeScript",
    "Vite",
    "PostgreSQL",
    "Discord.js",
    "Zustand",
    "Junior Software Engineer",
    "INFP",
  ],
  authors: [{ name: "Miguel García (MIGOL)" }],
  openGraph: {
    title: "Miguel García (MIGOL) — C/C++ & Full Stack Web Developer",
    description:
      "Del control de memoria en C/C++ a interfaces reactivas en la web. Portfolio técnico, proyectos, habilidades y matriz cognitiva.",
    url: siteUrl,
    siteName: "MIGOL.DEV",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Miguel García (MIGOL) — C/C++ & Full Stack Web Developer",
    description:
      "Del control de memoria en C/C++ a interfaces reactivas en la web. Portfolio técnico, proyectos, habilidades y matriz cognitiva.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      data-theme="crimson"
      suppressHydrationWarning
      className={`${syne.variable} ${instrumentSerif.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("migol_theme");if(t==="cryo"||t==="crimson"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col relative z-[1] bg-[var(--color-void)] text-[var(--color-text-dim)] font-[family-name:var(--font-body)]">
        <ThemeProvider>
          <CommandPaletteProvider>
            <ArchitecturalBackground />
            <CustomCursor />
            {children}
            <Toaster
              theme="dark"
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "var(--color-panel-2)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                  borderRadius: "6px",
                },
              }}
            />
          </CommandPaletteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
