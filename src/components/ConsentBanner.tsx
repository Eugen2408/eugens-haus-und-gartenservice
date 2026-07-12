"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Schlanker, kostenloser Datenschutz-Hinweis ohne Fremd-Dienst.
// Die Website setzt keine Tracking-Cookies – gespeichert wird nur die
// Entscheidung selbst (localStorage), damit der Hinweis nicht erneut kommt.
const STORAGE_KEY = "ehg-consent-v1";

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // localStorage nicht verfügbar (z. B. blockiert) → Hinweis zeigen
      setVisible(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // Speichern nicht möglich – Banner trotzdem schließen
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Datenschutz-Hinweis"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-2xl border border-forest-900/10 bg-white p-5 shadow-2xl shadow-forest-900/20 sm:inset-x-5 sm:bottom-5"
    >
      <p className="text-sm leading-relaxed text-forest-800">
        Diese Website verwendet <strong>keine Tracking-Cookies</strong>. Es
        werden nur technisch notwendige Daten verarbeitet; beim Anzeigen der
        Google-Bewertungen kann Ihr Browser Profilbilder von Google-Servern
        laden. Details in der{" "}
        <Link href="/datenschutz" className="underline hover:text-leaf-500">
          Datenschutzerklärung
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={accept}
          className="rounded-full bg-leaf-500 px-6 py-2.5 text-sm font-semibold text-sand-50 transition-colors hover:bg-forest-600"
        >
          Alles klar
        </button>
        <Link
          href="/datenschutz"
          className="rounded-full border border-forest-900/15 px-6 py-2.5 text-sm font-semibold text-forest-800 transition-colors hover:bg-sand-100"
        >
          Mehr erfahren
        </Link>
      </div>
    </div>
  );
}
