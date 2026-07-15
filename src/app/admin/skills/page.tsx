import { prisma } from "@/lib/prisma";
import { SkillsManager } from "@/components/admin/SkillsManager";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const skills = process.env.DATABASE_URL
    ? await prisma.skill.findMany({ orderBy: [{ order: "asc" }] })
    : [];

  return <SkillsManager initialSkills={skills} />;
}
