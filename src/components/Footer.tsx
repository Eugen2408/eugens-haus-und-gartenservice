export default function Footer() {
  return (
    <footer className="bg-forest-950 px-5 py-12 text-sand-100/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 text-center sm:flex-row sm:text-left">
        <div>
          <p className="font-display text-xl font-semibold text-sand-50">
            Eugens Haus- &amp; Gartenservice
          </p>
          <p className="mt-1 text-sm">Reembroden 14, 22339 Hamburg</p>
        </div>

        <div className="flex flex-col items-center gap-2 text-sm sm:items-end">
          <a
            href="tel:+4915560691797"
            className="rounded px-1 py-1 transition-colors hover:text-leaf-300"
          >
            0155 60691797
          </a>
          <a
            href="tel:+494036935718"
            className="rounded px-1 py-1 transition-colors hover:text-leaf-300"
          >
            040 36935718
          </a>
          <a
            href="mailto:kontakt@eugens-hausundgartenservice.de"
            className="rounded px-1 py-1 transition-colors hover:text-leaf-300"
          >
            kontakt@eugens-hausundgartenservice.de
          </a>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-6xl flex-col items-center gap-3 border-t border-sand-50/10 pt-6 text-center text-xs sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} Eugens Haus- und Gartenservice · Eugen
          Wermter
        </p>
        <p className="flex gap-4">
          <a href="/impressum" className="transition-colors hover:text-leaf-300">
            Impressum
          </a>
          <a href="/datenschutz" className="transition-colors hover:text-leaf-300">
            Datenschutz
          </a>
        </p>
      </div>
    </footer>
  );
}
