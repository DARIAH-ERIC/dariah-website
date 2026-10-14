import "server-only";

import type {
	Article,
	BreadcrumbList,
	Event,
	NewsArticle,
	Organization,
	Person,
	WebSite,
	WithContext,
} from "schema-dts";

import { env } from "#/configs/env.config.ts";
import type { Event as EventItem, Image, ImpactCaseStudy, SiteMetadata } from "#/lib/api/schemas.ts";
import { getSiteMetadata } from "#/lib/data/site-metadata.ts";
import { toDescription, toOpenGraphImage } from "#/lib/metadata.ts";
import { type Href, type InternalHref, href, serializeHref } from "#/lib/navigation/href.ts";

/**
 * Structured data for search engines - see https://developers.google.com/search/docs/appearance/structured-data.
 *
 * The site's organisation and the website itself are described once, on the landing page, under fixed `@id`s; every
 * other page's data refers to them by those ids rather than repeating them.
 */

/** A url as json-ld wants it: absolute, since it is read without the page's base url. */
function toAbsoluteUrl(url: string): string {
	return new URL(url, env.NEXT_PUBLIC_APP_BASE_URL).href;
}

function toPageUrl(value: Href): string {
	return toAbsoluteUrl(serializeHref(value));
}

const organizationId = toAbsoluteUrl("/#organization");
const websiteId = toAbsoluteUrl("/#website");

/**
 * The organisation as a reference, for an article's `publisher` or an event's `organizer`. Its name and url are
 * repeated beside the `@id`, since the page with the full description is a different one.
 */
function toOrganizationRef(site: SiteMetadata): Organization {
	return { "@type": "Organization", "@id": organizationId, name: site.title, url: toAbsoluteUrl("/") };
}

/** The same 16:9 rendition, cropped around the focal point, which the link preview uses - see `toOpenGraphImage`. */
function toImageUrl(image: Image): string {
	const openGraphImage = toOpenGraphImage(image);
	const url = typeof openGraphImage === "string" || openGraphImage instanceof URL ? openGraphImage : openGraphImage.url;

	return toAbsoluteUrl(url.toString());
}

/**
 * The organisation behind the site, with its social media profiles as `sameAs`. The `website` entry is this site
 * itself, which is already its `url`.
 */
export function createOrganization(site: SiteMetadata): WithContext<Organization> {
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		"@id": organizationId,
		name: site.title,
		description: site.description,
		url: toAbsoluteUrl("/"),
		logo: toAbsoluteUrl("/android-chrome-512x512.png"),
		...(site.email != null ? { email: site.email } : {}),
		sameAs: site.socialMedia.filter((link) => link.type !== "website").map((link) => link.url),
	};
}

/**
 * The website, which gives search results the site's name. No `SearchAction`: Google no longer shows a sitelinks search
 * box.
 */
export function createWebSite(site: SiteMetadata): WithContext<WebSite> {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		"@id": websiteId,
		name: site.title,
		description: site.description,
		url: toAbsoluteUrl("/"),
		publisher: { "@id": organizationId },
	};
}

type Contributor = ImpactCaseStudy["contributors"][number];

interface CreateArticleOptions {
	/** `NewsArticle` for news items, `Article` for anything else dated and editorial. */
	type: "Article" | "NewsArticle";
	href: InternalHref;
	item: {
		title: string;
		summary: string;
		image: Image;
		publishedAt: string;
		/** Without a named author, the organisation is the article's author. */
		contributors?: Array<Contributor>;
	};
}

/** A dated, editorial page - a news item, a spotlight article, an impact case study. */
export async function createArticle(options: CreateArticleOptions): Promise<WithContext<Article | NewsArticle>> {
	const { item, type } = options;

	const organization = toOrganizationRef(await getSiteMetadata());

	const authors: Array<Person> = (item.contributors ?? [])
		.filter((contributor) => contributor.role === "author")
		.map((contributor) => {
			return {
				"@type": "Person",
				name: contributor.name,
				url: toPageUrl(href({ pathname: "/persons/[slug]", params: { slug: contributor.slug } })),
			};
		});

	return {
		"@context": "https://schema.org",
		"@type": type,
		headline: item.title,
		description: toDescription(item.summary),
		url: toPageUrl(options.href),
		mainEntityOfPage: toPageUrl(options.href),
		image: toImageUrl(item.image),
		datePublished: item.publishedAt,
		author: authors.length > 0 ? authors : organization,
		publisher: organization,
		isPartOf: { "@id": websiteId },
	};
}

/**
 * An event's date as schema.org wants it. Event dates are UTC standing in for the event's own timezone (see
 * `EventBase["duration"]`), so the offset is dropped rather than converted: a date-time without one is read in the
 * timezone of the event's location. A full-day event has a date only.
 */
export function toEventDate(value: string, isFullDay: boolean): string {
	const date = new Date(value).toISOString();

	return isFullDay ? date.slice(0, 10) : date.slice(0, 16);
}

/**
 * The api has an event's venue as free text only. "Online" makes it a virtual event, at its website if it has one;
 * anything else stands in for both the place's name and its address. An event without one gets no `location`.
 */
function toEventLocation(item: EventItem, pageUrl: string): Pick<Event & object, "eventAttendanceMode" | "location"> {
	const location = item.location.trim();

	if (location.length === 0) {
		return {};
	}

	if (location.toLowerCase() === "online") {
		return {
			eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
			location: { "@type": "VirtualLocation", url: item.website ?? pageUrl },
		};
	}

	return {
		eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
		location: { "@type": "Place", name: location, address: location },
	};
}

interface CreateEventOptions {
	href: InternalHref;
	item: EventItem;
}

/** An event, with its venue as `toEventLocation` reads it. */
export async function createEvent(options: CreateEventOptions): Promise<WithContext<Event>> {
	const { item } = options;

	const organization = toOrganizationRef(await getSiteMetadata());

	const { start, end } = item.duration;

	return {
		"@context": "https://schema.org",
		"@type": "Event",
		name: item.title,
		description: toDescription(item.summary),
		url: toPageUrl(options.href),
		image: toImageUrl(item.image),
		startDate: toEventDate(start, item.isFullDay),
		...(end != null ? { endDate: toEventDate(end, item.isFullDay) } : {}),
		eventStatus: "https://schema.org/EventScheduled",
		...toEventLocation(item, toPageUrl(options.href)),
		organizer: organization,
		...(item.website != null ? { sameAs: item.website } : {}),
	};
}

interface BreadcrumbListItem {
	name: string;
	href: Href;
}

/**
 * The trail of links to the current page, as `Breadcrumbs` shows it. Only linked entries belong in it: a menu section,
 * which has no page of its own, is left out.
 */
export function createBreadcrumbList(items: Array<BreadcrumbListItem>): WithContext<BreadcrumbList> {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => {
			return { "@type": "ListItem", position: index + 1, name: item.name, item: toPageUrl(item.href) };
		}),
	};
}
