import Image from "next/image";
import { ExternalLink, Code2, Folder } from "lucide-react";
import type { Project } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  LIVE: "en producción",
  IN_PROGRESS: "en desarrollo",
  ARCHIVED: "archivado",
};

const STATUS_VARIANT: Record<string, "green" | "amber" | "outline"> = {
  LIVE: "green",
  IN_PROGRESS: "amber",
  ARCHIVED: "outline",
};

export function ProjectCard({ project, delay = 0 }: { project: Project; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <article className="group relative h-full flex flex-col rounded-lg border border-border bg-panel/60 overflow-hidden transition-all duration-300 hover:border-cyan/40 hover:-translate-y-1">
        <div className="flex items-center gap-2 border-b border-border bg-panel-2 px-4 py-2.5">
          <Folder className="h-3.5 w-3.5 text-amber" />
          <span className="font-mono text-xs text-text-dim truncate">
            /projects/{project.slug}
          </span>
          <span className="ml-auto">
            <Badge variant={STATUS_VARIANT[project.status] ?? "outline"}>
              {STATUS_LABEL[project.status] ?? project.status.toLowerCase()}
            </Badge>
          </span>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border-strong bg-panel-2 overflow-hidden"
              )}
            >
              {project.logoUrl ? (
                <Image
                  src={project.logoUrl}
                  alt={`Logo de ${project.name}`}
                  width={44}
                  height={44}
                  className="object-cover h-full w-full"
                />
              ) : (
                <span className="font-display text-lg font-bold text-cyan">
                  {project.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-text truncate">{project.name}</h3>
              <p className="text-xs text-text-faint truncate">{project.tagline}</p>
            </div>
          </div>

          <p className="text-sm text-text-dim leading-relaxed mb-5 flex-1">
            {project.description}
          </p>

          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {(project.repoUrl || project.liveUrl) && (
            <div className="flex items-center gap-4 pt-4 border-t border-border font-mono text-xs">
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-text-dim hover:text-cyan transition-colors"
                >
                  <Code2 className="h-3.5 w-3.5" /> código
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-text-dim hover:text-cyan transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> visitar
                </a>
              )}
            </div>
          )}
        </div>
      </article>
    </Reveal>
  );
}
