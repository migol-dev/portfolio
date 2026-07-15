import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://migol.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Miguel García (MIGOL) — Desarrollador Full Stack & Discord Bots",
    template: "%s · MIGOL",
  },
  description:
    "Desarrollador full stack especializado en TypeScript, Next.js y bots de Discord. Creador de Finance Pal y de sistemas de automoderación para comunidades grandes.",
  keywords: [
    "Miguel García",
    "MIGOL",
    "Desarrollador Full Stack",
    "TypeScript",
    "Next.js",
    "Discord Bot Developer",
    "React",
    "PostgreSQL",
  ],
  authors: [{ name: "Miguel García" }],
  openGraph: {
    title: "Miguel García (MIGOL) — Desarrollador Full Stack & Discord Bots",
    description:
      "Portfolio de Miguel García: proyectos, habilidades y experiencia en desarrollo full stack y bots de Discord.",
    url: siteUrl,
    siteName: "MIGOL",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Miguel García (MIGOL) — Desarrollador Full Stack",
    description:
      "Portfolio de Miguel García: proyectos, habilidades y experiencia en desarrollo full stack y bots de Discord.",
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
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative z-[1]">
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--color-panel-2)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
              fontFamily: "var(--font-body)",
            },
          }}
        />
      </body>
    </html>
  );
}
