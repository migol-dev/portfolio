import { prisma } from "@/lib/prisma";
import { ProjectsManager } from "@/components/admin/ProjectsManager";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = process.env.DATABASE_URL
    ? await prisma.project.findMany({ orderBy: [{ featured: "desc" }, { order: "asc" }] })
    : [];

  return <ProjectsManager initialProjects={projects} />;
}
