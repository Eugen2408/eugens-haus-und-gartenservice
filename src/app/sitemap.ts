import type { MetadataRoute } from "next";

const SITE_URL = "https://www.eugens-hausundgartenservice.de";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: SITE_URL, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/impressum`, lastModified, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/datenschutz`, lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];
}
