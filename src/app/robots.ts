import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/games", "/materials", "/inclusive"],
        disallow: ["/dashboard", "/student", "/admin", "/api", "/play"],
      },
    ],
    sitemap: "/sitemap.xml",
  };
}
