import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { FALLBACK_PROJECTS, FALLBACK_SKILLS } from "../src/lib/fallback-content";

const prisma = new PrismaClient();

async function main() {
  console.log("Sembrando proyectos...");
  for (const project of FALLBACK_PROJECTS) {
    const { id, ...data } = project;
    void id;
    await prisma.project.upsert({
      where: { slug: data.slug },
      update: data,
      create: data,
    });
  }

  console.log("Sembrando habilidades...");
  for (const skill of FALLBACK_SKILLS) {
    const { id, ...data } = skill;
    void id;
    await prisma.skill.upsert({
      where: { name: data.name },
      update: data,
      create: data,
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    console.log(`Creando usuario admin (${adminEmail})...`);
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.adminUser.upsert({
      where: { email: adminEmail },
      update: { passwordHash },
      create: { email: adminEmail, passwordHash },
    });
  } else {
    console.warn(
      "ADMIN_EMAIL / ADMIN_PASSWORD no están definidos en .env — omite la creación del usuario admin. " +
        "Defínelos y vuelve a correr `npm run db:seed` para poder entrar a /admin."
    );
  }

  console.log("Listo ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
