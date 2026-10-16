import Link from "next/link";
import { Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-10 bg-[var(--color-panel)] font-mono text-xs select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[var(--color-text-faint)]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[var(--color-text)] font-semibold">
            <Terminal className="w-4 h-4 text-[var(--color-accent)]" strokeWidth={1.5} />
            <span>[0xMIGOL]</span>
          </div>
          <span>·</span>
          <span>Colima, MX · UTC-6</span>
          <span>·</span>
          <span>© {new Date().getFullYear()} Miguel García</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <a
            href="https://github.com/migol-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-text)] transition-colors"
          >
            GitHub
          </a>
          <a
            href="#contact"
            className="hover:text-[var(--color-text)] transition-colors"
          >
            Contacto
          </a>
          <Link
            href="/admin"
            className="text-[var(--color-text-dim)] hover:text-[var(--color-accent)] transition-colors"
          >
            /admin
          </Link>
          <span className="flex items-center gap-1.5 text-[var(--color-status-live)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-status-live)] animate-pulse" />
            SYS.READY
          </span>
        </div>
      </div>
    </footer>
  );
}
