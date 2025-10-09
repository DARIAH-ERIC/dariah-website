import { glob } from "node:fs/promises";
import { join } from "node:path";

import { createUrl } from "@acdh-oeaw/lib";
import type { MetadataRoute } from "next";

import { env } from "@/config/env.config";

const baseUrl = env.NEXT_PUBLIC_APP_BASE_URL;

/**
 * Google supports up to 50.000 entries per sitemap file. Apps which need more than that can use
 * `generateSitemaps` to generate multiple sitemap files.
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap#generating-a-sitemap-using-code-js-ts}
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps}
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const routes: Array<string> = [];

	for await (const path of glob("./**/page.tsx", {
		cwd: join(process.cwd(), "app", "(app)"),
	})) {
		const route = path.slice(0, -"/page.tsx".length);

		const segments = [];

		for (const segment of route.split("/")) {
			/** Dynamic routes. */
			if (segment.startsWith("[") && segment.endsWith("]")) {
				break;
			}

			/** Route groups. */
			if (segment.startsWith("(") && segment.endsWith(")")) {
				continue;
			}

			segments.push(segment);
		}

		routes.push(`/${segments.join("/")}`);
	}

	const entries = routes.map((pathname) => {
		return {
			url: String(createUrl({ baseUrl, pathname })),
			/**
			 * Only add `lastmod` when the publication date is actually known.
			 * Don't use the build date instead.
			 */
			// lastModified: new Date(),
		};
	});

	return entries;
}
