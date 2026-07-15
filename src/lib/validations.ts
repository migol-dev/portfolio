import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Tu nombre es muy corto").max(80),
  email: z.string().trim().email("Correo inválido").max(120),
  message: z
    .string()
    .trim()
    .min(10, "Cuéntame un poco más (mínimo 10 caracteres)")
    .max(2000),
  // Honeypot: los bots suelen rellenar todos los campos, los humanos lo dejan vacío.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(200),
});

export const projectSchema = z.object({
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  name: z.string().trim().min(2).max(80),
  tagline: z.string().trim().min(2).max(140),
  description: z.string().trim().min(10).max(4000),
  logoUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
  coverUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
  tags: z.array(z.string().trim().min(1).max(30)).max(12),
  status: z.enum(["LIVE", "IN_PROGRESS", "ARCHIVED"]),
  repoUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
  liveUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
  featured: z.boolean(),
  order: z.number().int().min(0).max(999),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export const skillSchema = z.object({
  name: z.string().trim().min(1).max(50),
  category: z.enum([
    "LANGUAGE",
    "FRONTEND",
    "BACKEND",
    "DATABASE",
    "TOOLING",
    "OTHER",
  ]),
  level: z.enum(["APRENDIENDO", "INTERMEDIO", "AVANZADO"]),
  summary: z.string().trim().min(2).max(220),
  icon: z.string().trim().max(40).optional().or(z.literal("")),
  order: z.number().int().min(0).max(999),
});

export type SkillInput = z.infer<typeof skillSchema>;
