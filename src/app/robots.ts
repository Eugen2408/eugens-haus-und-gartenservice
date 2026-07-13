import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://eugens-haus-und-gartenservice.vercel.app/sitemap.xml",
  };
}
