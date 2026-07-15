// Contenido por defecto. Se usa como fallback si la base de datos aún no está
// conectada/sembrada, para que el sitio nunca se rompa ni quede vacío.
// En cuanto DATABASE_URL esté configurado y corras `npm run db:seed`, estos
// mismos datos quedan en Postgres y los podrás editar desde /admin.

import type { Project, Skill } from "@prisma/client";

type FallbackProject = Omit<Project, "createdAt" | "updatedAt">;
type FallbackSkill = Omit<Skill, "createdAt" | "updatedAt">;

export const FALLBACK_PROJECTS: FallbackProject[] = [
  {
    id: "fallback-automod",
    slug: "automod-bot",
    name: "AutoMod Sentinel",
    tagline: "Bot de moderación automática para Discord a gran escala",
    description:
      "Bot de Discord construido con Discord.js v14 y TypeScript que detecta spam, raids, enlaces maliciosos e insultos en tiempo real. Incluye sistema de niveles de infracción, tickets de soporte y panel de logs configurable. En producción en comunidades de más de 5,000 miembros.",
    logoUrl: null,
    coverUrl: null,
    tags: ["TypeScript", "Discord.js", "Node.js", "MongoDB"],
    status: "LIVE",
    repoUrl: null,
    liveUrl: null,
    featured: true,
    order: 0,
  },
  {
    id: "fallback-financepal",
    slug: "finance-pal",
    name: "Finance Pal",
    tagline: "App integral de finanzas personales, 100% local y privada",
    description:
      "Aplicación de gestión financiera personal construida con React, TypeScript y Capacitor. Incluye dashboard con gráficas (Recharts), conceptos fijos recurrentes, metas de ahorro, control de deudas y vista anual — todo almacenado localmente en el dispositivo, sin servidores externos.",
    logoUrl: null,
    coverUrl: null,
    tags: ["React", "TypeScript", "Capacitor", "Zustand", "Tailwind CSS"],
    status: "LIVE",
    repoUrl: null,
    liveUrl: null,
    featured: true,
    order: 1,
  },
];

export const FALLBACK_SKILLS: FallbackSkill[] = [
  {
    id: "fb-ts",
    name: "TypeScript",
    category: "LANGUAGE",
    level: "INTERMEDIO",
    summary: "Tipado estático, interfaces y desarrollo escalable para aplicaciones robustas.",
    icon: "FileCode2",
    order: 0,
  },
  {
    id: "fb-js",
    name: "JavaScript",
    category: "LANGUAGE",
    level: "INTERMEDIO",
    summary: "Base sólida en ES2023+, con énfasis en Discord.js para sistemas complejos.",
    icon: "Braces",
    order: 1,
  },
  {
    id: "fb-react",
    name: "React",
    category: "FRONTEND",
    level: "INTERMEDIO",
    summary: "Componentes, hooks y estado global (Zustand) para interfaces reactivas.",
    icon: "Atom",
    order: 2,
  },
  {
    id: "fb-next",
    name: "Next.js",
    category: "FRONTEND",
    level: "APRENDIENDO",
    summary: "App Router, server components y rutas API para aplicaciones full stack.",
    icon: "Layers",
    order: 3,
  },
  {
    id: "fb-tailwind",
    name: "Tailwind CSS",
    category: "FRONTEND",
    level: "INTERMEDIO",
    summary: "Diseño de interfaces consistentes y responsivas con utilidades atómicas.",
    icon: "Palette",
    order: 4,
  },
  {
    id: "fb-node",
    name: "Node.js",
    category: "BACKEND",
    level: "INTERMEDIO",
    summary: "APIs REST, autenticación y lógica de negocio del lado del servidor.",
    icon: "Server",
    order: 5,
  },
  {
    id: "fb-discordjs",
    name: "Discord.js",
    category: "BACKEND",
    level: "AVANZADO",
    summary: "Bots con sistemas de moderación, tickets, niveles y gamificación.",
    icon: "Bot",
    order: 6,
  },
  {
    id: "fb-postgres",
    name: "PostgreSQL",
    category: "DATABASE",
    level: "APRENDIENDO",
    summary: "Modelado de datos relacional con Prisma ORM para apps full stack.",
    icon: "Database",
    order: 7,
  },
  {
    id: "fb-git",
    name: "Git",
    category: "TOOLING",
    level: "INTERMEDIO",
    summary: "Control de versiones, ramas y flujos de colaboración eficientes.",
    icon: "GitBranch",
    order: 8,
  },
  {
    id: "fb-capacitor",
    name: "Capacitor",
    category: "TOOLING",
    level: "INTERMEDIO",
    summary: "Empaquetado de apps web como aplicaciones nativas para Android.",
    icon: "Smartphone",
    order: 9,
  },
];
