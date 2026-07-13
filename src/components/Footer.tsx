export default function Footer() {
  return (
    <footer className="border-t border-forest-900/10 bg-white text-forest-800/80">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid grid-cols-1 gap-10 text-center sm:grid-cols-3 sm:text-left">
          {/* Marke */}
          <div>
            <p className="font-display text-xl font-semibold text-forest-950">
              Eugens Haus- &amp; Gartenservice
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed sm:mx-0 mx-auto">
              Ihr zuverlässiger Partner für Haus und Garten in Hamburg – von der
              Gartenpflege bis zur Badsanierung.
            </p>
          </div>

          {/* Kontakt */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest-900">
              Kontakt
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href="tel:+4915560691797"
                  className="transition-colors hover:text-leaf-500"
                >
                  0155 60691797
                </a>
              </li>
              <li>
                <a
                  href="tel:+494036935718"
                  className="transition-colors hover:text-leaf-500"
                >
                  040 36935718
                </a>
              </li>
              <li>
                <a
                  href="mailto:kontakt@eugens-hausundgartenservice.de"
                  className="break-all transition-colors hover:text-leaf-500"
                >
                  kontakt@eugens-hausundgartenservice.de
                </a>
              </li>
            </ul>
          </div>

          {/* Adresse + Rechtliches */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest-900">
              Adresse
            </p>
            <p className="mt-4 text-sm leading-relaxed">
              Reembroden 14
              <br />
              22339 Hamburg
            </p>
            <p className="mt-4 flex justify-center gap-4 text-sm sm:justify-start">
              <a href="/impressum" className="transition-colors hover:text-leaf-500">
                Impressum
              </a>
              <a href="/datenschutz" className="transition-colors hover:text-leaf-500">
                Datenschutz
              </a>
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-forest-900/10 pt-6 text-center text-xs text-forest-800/60">
          © {new Date().getFullYear()} Eugens Haus- und Gartenservice · Eugen
          Wermter
        </div>
      </div>
    </footer>
  );
}
