import Reveal from "./Reveal";

const GOOGLE_PROFILE_URL =
  "https://www.google.com/search?q=Eugens+Haus-+und+Gartenservice+Hamburg";

// Google Place ID: ChIJ-zWuHHua_6sR6OOZXKBzgX0 ("Eugens Haus- und Gartenservice")
const FEATURABLE_API_URL =
  "https://api.featurable.com/v2/widgets/4232857a-9a67-4d53-89a8-89313d81dc99";

type FeaturableReview = {
  id: string;
  author: { name: string; avatarUrl: string | null };
  text: string | null;
  originalText: string | null;
  rating: { value: number; max: number };
  publishedAt: string;
};

type FeaturableResponse = {
  success: boolean;
  widget: {
    reviews: FeaturableReview[];
    gbpLocationSummary: { reviewsCount: number; rating: number } | null;
  };
};

// Relative deutsche Zeitangabe ("vor 3 Monaten"); wird beim (Re-)Build
// berechnet – die Seite revalidiert täglich, das reicht für Monatsangaben.
function relativeDate(iso: string): string {
  const rtf = new Intl.RelativeTimeFormat("de", { numeric: "auto" });
  const days = Math.round((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days < 7) return rtf.format(-days, "day");
  if (days < 31) return rtf.format(-Math.round(days / 7), "week");
  if (days < 365) return rtf.format(-Math.round(days / 30), "month");
  return rtf.format(-Math.round(days / 365), "year");
}

function Stars({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5 text-terracotta-500" aria-label={`${value} von 5 Sternen`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < value ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

async function fetchReviews(): Promise<FeaturableResponse["widget"] | null> {
  try {
    const res = await fetch(FEATURABLE_API_URL, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const data: FeaturableResponse = await res.json();
    if (!data.success || !data.widget?.reviews?.length) return null;
    return data.widget;
  } catch {
    return null;
  }
}

export default async function ReviewsSection() {
  const widget = await fetchReviews();
  const reviews = widget?.reviews ?? [];
  const summary = widget?.gbpLocationSummary;

  return (
    <section id="bewertungen" className="bg-sand-100 px-5 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-leaf-500">
            Kundenstimmen
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <h2 className="max-w-xl font-display text-3xl font-semibold text-forest-950 sm:text-4xl">
              Was meine Kunden sagen
            </h2>
            {summary && (
              <p className="flex items-center gap-2 text-sm font-semibold text-forest-800">
                <Stars value={Math.round(summary.rating)} />
                {summary.rating.toLocaleString("de-DE")} · {summary.reviewsCount} Google-Bewertungen
              </p>
            )}
          </div>
        </Reveal>

        {reviews.length > 0 ? (
          <Reveal delay={0.1} className="mt-10">
            <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="mb-6 break-inside-avoid rounded-2xl border border-white/70 bg-white p-6 shadow-sm shadow-forest-900/5"
                >
                  <div className="flex items-center gap-3">
                    {review.author.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={review.author.avatarUrl}
                        alt=""
                        width={40}
                        height={40}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-leaf-200 font-display font-semibold text-forest-900">
                        {review.author.name.charAt(0)}
                      </span>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-forest-950">{review.author.name}</p>
                      <p className="text-xs text-forest-800/60">{relativeDate(review.publishedAt)}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Stars value={review.rating.value} />
                  </div>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-forest-800/85">
                    {review.originalText || review.text}
                  </p>
                </article>
              ))}
            </div>
          </Reveal>
        ) : (
          <p className="mt-10 text-forest-800/70">
            Die Bewertungen konnten gerade nicht geladen werden – auf Google finden Sie alle
            Kundenstimmen.
          </p>
        )}

        <Reveal delay={0.15} className="mt-8 flex justify-center">
          <a
            href={GOOGLE_PROFILE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-forest-900/10 bg-white px-6 py-3 text-sm font-semibold text-forest-900 shadow-sm transition-colors hover:bg-leaf-200"
          >
            Alle Bewertungen auf Google ansehen
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
