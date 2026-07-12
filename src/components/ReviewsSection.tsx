import ReviewsWheel, { type WheelReview } from "./ReviewsWheel";

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

  if (!widget) {
    return (
      <section id="bewertungen" className="bg-white px-5 py-24 md:py-32">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-leaf-500">
            Kundenstimmen
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-forest-950 sm:text-5xl">
            Was meine Kunden sagen
          </h2>
          <p className="mt-10 text-forest-800/70">
            Die Bewertungen konnten gerade nicht geladen werden – auf Google
            finden Sie alle Kundenstimmen.
          </p>
          <a
            href={GOOGLE_PROFILE_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-forest-900/10 bg-white px-6 py-3 text-sm font-semibold text-forest-900 shadow-sm transition-colors hover:bg-leaf-200"
          >
            Alle Bewertungen auf Google ansehen
          </a>
        </div>
      </section>
    );
  }

  // Auf schlanke Props mappen; Datums-Label serverseitig berechnen, damit
  // Server- und Client-Render identisch sind (kein Hydration-Mismatch).
  const reviews: WheelReview[] = widget.reviews.map((review) => ({
    id: review.id,
    name: review.author.name,
    avatarUrl: review.author.avatarUrl,
    rating: review.rating.value,
    dateLabel: relativeDate(review.publishedAt),
    text: review.originalText || review.text || "",
  }));

  const summary = widget.gbpLocationSummary
    ? { rating: widget.gbpLocationSummary.rating, count: widget.gbpLocationSummary.reviewsCount }
    : null;

  return <ReviewsWheel reviews={reviews} summary={summary} googleUrl={GOOGLE_PROFILE_URL} />;
}
