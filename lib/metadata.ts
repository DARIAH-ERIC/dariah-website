import "server-only";

import type { Metadata } from "next";

import type { Image } from "#/lib/api/schemas.ts";
import { getFeedLinks } from "#/lib/data/feeds.ts";
import { getSiteMetadata } from "#/lib/data/site-metadata.ts";
import { defaultLocale } from "#/lib/i18n/locales.ts";
import { openGraphImageSize } from "#/lib/images/open-graph.tsx";
import { appendSearchParams, getImageAssetKind, isSvgImage, parseImageAssetUrl } from "#/lib/images/variants.ts";
import { type InternalHref, serializeHref } from "#/lib/navigation/href.ts";

type Alternates = NonNullable<Metadata["alternates"]>;
type OpenGraph = NonNullable<Metadata["openGraph"]>;
type OpenGraphImage = Exclude<NonNullable<OpenGraph["images"]>, ReadonlyArray<unknown>>;

/** `og:locale` wants `en_GB`, not the bcp 47 `en-GB`. */
const openGraphLocale = defaultLocale.replace("-", "_");

/** About what search results show of a description before they cut it off. */
const maxDescriptionLength = 160;

/**
 * A summary as `description`: whitespace collapsed, and cut at a word boundary when it runs past what a search result
 * would show anyway, so the cut is ours rather than a crawler's.
 */
export function toDescription(text: string): string {
	const normalized = text.replaceAll(/\s+/gu, " ").trim();

	if (normalized.length <= maxDescriptionLength) {
		return normalized;
	}

	const cut = normalized.slice(0, maxDescriptionLength - 1);
	const boundary = cut.lastIndexOf(" ");

	return `${(boundary > 0 ? cut.slice(0, boundary) : cut).replace(/[\s,.;:–—-]+$/u, "")}…`;
}

/**
 * An api image as `og:image`: a 16:9 crop wide enough for a large link preview. Portraits and logos are only scaled,
 * since a crop would cut into a face or a mark. No `width`/`height`, because the endpoint does not upscale, so the
 * rendition of a small source would not match them.
 *
 * An svg is passed through by the endpoint as it is, and crawlers do not render one, so it goes through the
 * `/og-images` route instead, which renders it to a png of a known size - see `createSvgOpenGraphImage`.
 */
export function toOpenGraphImage(image: Image): OpenGraphImage {
	const alt = image.alt ?? undefined;
	const asset = parseImageAssetUrl(image.srcUrl);

	if (asset != null && isSvgImage(image)) {
		return {
			url: `/og-images/${asset.prefix}/${encodeURIComponent(asset.name)}/${asset.version}`,
			...openGraphImageSize,
			type: "image/png",
			alt,
		};
	}

	const kind = getImageAssetKind(image.srcUrl);
	const params: Record<string, string> = kind === "images" ? { w: "1280", ar: "16x9" } : { w: "1280" };

	return { url: appendSearchParams(image.srcUrl, params), alt };
}

/**
 * The `openGraph` fields every route shares, with a page's own on top.
 *
 * Metadata merges shallowly: a segment which sets `openGraph` replaces the root layout's object as a whole, so any page
 * that needs its own (an image, `type: "article"`, a `url`) builds it through here to keep `og:site_name`, `og:locale`
 * and the fallback image. Leave `title` and `description` out unless they should differ from the page's own - Next
 * fills them in from those, and passes all of it on to the `twitter` card.
 */
export async function createOpenGraph(openGraph: OpenGraph = {}): Promise<OpenGraph> {
	const site = await getSiteMetadata();

	return {
		type: "website",
		siteName: site.title,
		locale: openGraphLocale,
		...(site.ogImage != null ? { images: [toOpenGraphImage(site.ogImage)] } : {}),
		...openGraph,
	};
}

/**
 * The `alternates` every route shares - the rss feeds, for browsers and feed readers to discover - with a page's own on
 * top, e.g. its `canonical`.
 *
 * Like `openGraph`, a segment which sets `alternates` replaces the root layout's object as a whole, so any page that
 * needs its own builds it through here to keep the feeds.
 */
export async function createAlternates(alternates: Alternates = {}): Promise<Alternates> {
	const feeds = await getFeedLinks();

	return {
		types: { "application/rss+xml": feeds },
		...alternates,
	};
}

interface CreateMetadataOptions {
	/**
	 * The route itself, as `canonical` and `og:url`. Pass the search params the page's own codec re-encodes from the
	 * request, and only those which select distinct, indexable content - a page of a list, a tab - so the canonical is
	 * normalised: defaults dropped, a fixed order, unknown parameters like `utm_*` gone.
	 */
	href: InternalHref;
	/** The page's own title; the root layout's template appends the site name. */
	title: string;
	/**
	 * Plain text, shortened here. Without one, the site description applies, so no page goes without: it says little
	 * about the page itself, so a page whose content may lack a summary should pass a description of its own instead.
	 */
	description?: string | null;
	/** Without one, the site's `ogImage` applies. */
	image?: Image | null;
	/** Marks dated editorial content - news, spotlight articles, impact case studies - as `og:type` `article`. */
	publishedTime?: string;
	/**
	 * Keeps the route out of the index - search results, filtered views, a calendar with no end of months. Such a route
	 * gets no canonical, since pointing one at an indexable url is a mixed signal.
	 */
	noindex?: boolean;
}

/**
 * A route's metadata: title, description, canonical url and the link preview, on top of the root layout's.
 *
 * Next merges a segment's metadata key by key, including keys set to `undefined`, which would blank what the layout
 * provides - so a missing value is left out rather than passed on.
 */
export async function createMetadata(options: CreateMetadataOptions): Promise<Metadata> {
	const { image, noindex = false, publishedTime, title } = options;

	const url = serializeHref(options.href);
	const description = toDescription(options.description ?? "");

	return {
		title,
		description: description !== "" ? description : toDescription((await getSiteMetadata()).description),
		...(noindex ? { robots: { index: false } } : {}),
		alternates: await createAlternates(noindex ? {} : { canonical: url }),
		openGraph: await createOpenGraph({
			url,
			...(publishedTime != null ? { type: "article", publishedTime } : {}),
			...(image != null ? { images: [toOpenGraphImage(image)] } : {}),
		}),
	};
}
