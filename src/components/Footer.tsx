export function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-text-faint">
        <p>© {new Date().getFullYear()} Miguel García — Todos los derechos reservados.</p>
        <p className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-green animate-pulse" />
          construido con Next.js, Tailwind &amp; PostgreSQL
        </p>
      </div>
    </footer>
  );
}
