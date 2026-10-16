import {
  FileCode2,
  Braces,
  Atom,
  Layers,
  Palette,
  Server,
  Bot,
  Database,
  GitBranch,
  Smartphone,
  Code2,
  Cpu,
  Terminal,
  Binary,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  FileCode2,
  Braces,
  Atom,
  Layers,
  Palette,
  Server,
  Bot,
  Database,
  GitBranch,
  Smartphone,
  Cpu,
  Terminal,
  Binary,
  Zap,
};

export function resolveIcon(name?: string | null): LucideIcon {
  if (!name) return Code2;
  return ICON_MAP[name] ?? Code2;
}
