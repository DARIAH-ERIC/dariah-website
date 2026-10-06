import type { MetadataRoute, Pathname } from "next";

import { env } from "#/configs/env.config.ts";
import { getContentSitemapEntries } from "#/lib/data/sitemap.ts";

type StaticPathname = Exclude<Pathname, `${string}[${string}`>;

/**
 * Whether each route without dynamic segments is listed. Exhaustive, so a new route fails type checking until it has
 * been decided on here. Routes backed by content are listed by the api as well, and its entry - which has a last
 * modified date - takes precedence.
 */
const staticPathnames = {
	"/": true,
	"/about/dariah-in-a-nutshell": true,
	"/about/documents": true,
	"/about/impact-case-studies": true,
	"/about/organisation-and-governance": true,
	"/about/strategy": true,
	/** Not indexed, nor linked: a url for stakeholders, see the page's metadata. */
	"/analytics": false,
	"/events": true,
	/** Not indexed, see the page's metadata: the months never run out, and `/events` lists the same events. */
	"/events/calendar": false,
	"/get-involved/funding-calls": true,
	"/get-involved/join-dariah": true,
	"/get-involved/opportunities": true,
	"/network/members-and-partners": true,
	"/network/partnerships-and-collaborations": true,
	"/network/regional-hubs": true,
	"/network/working-groups": true,
	"/network/working-groups/inactive": true,
	"/news": true,
	"/newsletters": true,
	"/privacy-and-legal/accessibility-declaration": true,
	"/privacy-and-legal/legal-notice": true,
	"/projects": true,
	"/projects/inactive": true,
	"/resources/dariah-campus": true,
	"/resources/resource-catalogue": true,
	"/resources/ssh-open-marketplace": true,
	"/resources/transformations": true,
	/** Search result pages are not meant to be indexed. */
	"/search": false,
	"/search-benchmark": false,
	"/spotlight": true,
} satisfies Record<StaticPathname, boolean>;

function absoluteUrl(pathname: string): string {
	return new URL(pathname, env.NEXT_PUBLIC_APP_BASE_URL).href;
}

/** Google supports up to 50,000 urls per sitemap, beyond which `generateSitemaps` can split it into several files. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const entries = new Map<string, MetadataRoute.Sitemap[number]>();

	for (const [pathname, isListed] of Object.entries(staticPathnames)) {
		if (isListed) {
			const url = absoluteUrl(pathname);
			entries.set(url, { url });
		}
	}

	for (const entry of await getContentSitemapEntries()) {
		const url = absoluteUrl(entry.href);
		entries.set(url, { url, lastModified: entry.lastModified });
	}

	return Array.from(entries.values());
}
