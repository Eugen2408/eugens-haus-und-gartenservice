"use client";

import { useState } from "react";
import type { FormEvent } from "react";

// Versand über FormSubmit (kostenlos, kein Account). Web3Forms meldete zwar
// success, hat aber nachweislich nie zugestellt (2026-07-11). FormSubmit
// verlangt einmalig einen Aktivierungsklick per Mail an das Zielpostfach —
// danach werden Anfragen zugestellt. Ziel vorerst Gmail (zuverlässige
// Zustellung); nach Aktivierung auf den anonymisierten Alias umstellbar.
const FORMSUBMIT_ENDPOINT = "https://formsubmit.co/ajax/eugenwermter200@gmail.com";
const WHATSAPP_PHONE = "4915560691797";

type Status = "idle" | "sending" | "success" | "error";

const inputClass =
  "w-full rounded-lg border border-forest-900/10 bg-sand-50 px-4 py-2.5 text-sm text-forest-950 outline-none transition-colors focus:border-leaf-500";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: von Bots ausgefüllt, von Menschen nie gesehen
    if (data.get("botcheck")) return;

    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    setStatus("sending");
    try {
      const res = await fetch(FORMSUBMIT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          message,
          _subject: `Neue Anfrage über die Website von ${name}`,
          _template: "table",
          _captcha: "false",
        }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json && (json.success === true || json.success === "true")) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      // Versand fehlgeschlagen: als Rettungsanker WhatsApp mit der
      // ausgefüllten Nachricht öffnen, damit die Anfrage nicht verloren geht
      const lines = [
        "Hallo! Ich interessiere mich für Ihren Haus- und Gartenservice.",
        "",
        `Name: ${name}`,
      ];
      if (phone) lines.push(`Telefon: ${phone}`);
      if (email) lines.push(`E-Mail: ${email}`);
      lines.push("", message);
      window.open(
        `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(lines.join("\n"))}`,
        "_blank",
        "noopener"
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl border border-leaf-500/30 bg-leaf-200/40 p-8 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-leaf-500 text-sand-50">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="mt-5 font-display text-2xl font-semibold text-forest-950">
          Vielen Dank für Ihre Nachricht!
        </p>
        <p className="mt-2 max-w-sm text-sm text-forest-800/70">
          Ich melde mich in der Regel innerhalb eines Werktags bei Ihnen.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-forest-900/5 bg-white/70 p-6 shadow-sm sm:p-8"
    >
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-forest-900">
            Name *
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            required
            autoComplete="name"
            className={inputClass}
            placeholder="Ihr Name"
          />
        </div>
        <div className="sm:col-span-1">
          <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-medium text-forest-900">
            Telefon
          </label>
          <input
            id="contact-phone"
            type="tel"
            name="phone"
            autoComplete="tel"
            className={inputClass}
            placeholder="Ihre Telefonnummer"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-forest-900">
            E-Mail *
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            className={inputClass}
            placeholder="ihre@email.de"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-forest-900">
            Nachricht *
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={4}
            className={`${inputClass} resize-none`}
            placeholder="Beschreiben Sie kurz Ihr Anliegen…"
          />
        </div>
      </div>

      {status === "error" && (
        <p className="mt-4 rounded-lg bg-terracotta-500/10 px-4 py-3 text-sm text-terracotta-600">
          Das hat leider nicht geklappt. Bitte versuchen Sie es erneut oder
          rufen Sie mich direkt an: 0155 60691797.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 w-full rounded-full bg-leaf-500 px-6 py-3.5 text-sm font-semibold text-sand-50 transition-transform duration-300 hover:scale-[1.02] hover:bg-forest-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "Wird gesendet…" : "Nachricht senden"}
      </button>
    </form>
  );
}
