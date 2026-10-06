import type { MetadataRoute } from "next";

import { env } from "#/configs/env.config.ts";

/** Crawlers are disallowed unless explicitly enabled, so preview deployments are never indexed. */
export default function robots(): MetadataRoute.Robots {
	if (env.NEXT_PUBLIC_APP_BOTS !== "enabled") {
		return {
			rules: {
				disallow: "/",
				userAgent: "*",
			},
		};
	}

	return {
		rules: {
			allow: "/",
			userAgent: "*",
		},
		sitemap: new URL("/sitemap.xml", env.NEXT_PUBLIC_APP_BASE_URL).href,
	};
}
