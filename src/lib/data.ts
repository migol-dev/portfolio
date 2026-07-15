import { prisma } from "@/lib/prisma";
import { FALLBACK_PROJECTS, FALLBACK_SKILLS } from "@/lib/fallback-content";
import type { Project, Skill } from "@prisma/client";

// Si DATABASE_URL no está configurado o Postgres no responde (p. ej. durante
// el primer despliegue antes de crear la base de datos), el sitio sigue
// funcionando mostrando el contenido por defecto en vez de romperse.

export async function getProjects(): Promise<Project[]> {
  if (!process.env.DATABASE_URL) return FALLBACK_PROJECTS as Project[];

  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ featured: "desc" }, { order: "asc" }],
    });
    return projects.length > 0 ? projects : (FALLBACK_PROJECTS as Project[]);
  } catch (error) {
    console.error("[getProjects] fallback a contenido estático:", error);
    return FALLBACK_PROJECTS as Project[];
  }
}

export async function getSkills(): Promise<Skill[]> {
  if (!process.env.DATABASE_URL) return FALLBACK_SKILLS as Skill[];

  try {
    const skills = await prisma.skill.findMany({
      orderBy: [{ order: "asc" }],
    });
    return skills.length > 0 ? skills : (FALLBACK_SKILLS as Skill[]);
  } catch (error) {
    console.error("[getSkills] fallback a contenido estático:", error);
    return FALLBACK_SKILLS as Skill[];
  }
}
