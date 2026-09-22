import { log } from "@acdh-oeaw/lib";
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

import { env } from "@/config/env.config";
import { cacheTags } from "@/lib/data/api-client";

/**
 * Cache-tag vocabulary of the upstream api (`@dariah-eric/cache-tags`). A tag names a slice of the
 * data the api serves, not a website page: the knowledge base dispatches the tags a content change
 * touched, and every api operation declares the tags it reads under `x-cache-tags` in the openapi
 * document.
 */
const apiCacheTags = [
	"documents-policies",
	"events",
	"featured-entities",
	"funding-calls",
	"governance-bodies",
	"impact-case-studies",
	"members-partners",
	"navigation",
	"news",
	"opportunities",
	"pages",
	"persons",
	"projects",
	"site-metadata",
	"spotlight-articles",
	"working-groups",
] as const;

type ApiCacheTag = (typeof apiCacheTags)[number];

const apiCacheTagSet: ReadonlySet<string> = new Set(apiCacheTags);

function isApiCacheTag(value: unknown): value is ApiCacheTag {
	return typeof value === "string" && apiCacheTagSet.has(value);
}

/** Body of the `POST` the knowledge base sends to the registered revalidation webhook url. */
interface RevalidationWebhookPayload {
	tags: Array<ApiCacheTag>;
}

/**
 * Parses an untrusted webhook body. Returns `null` when it is not a `{ tags }` object or any tag is
 * outside the vocabulary, so we fail loudly when built against an older vocabulary instead of
 * silently ignoring an unknown tag.
 */
function parseRevalidationWebhookPayload(value: unknown): RevalidationWebhookPayload | null {
	if (typeof value !== "object" || value === null || !("tags" in value)) {
		return null;
	}

	const { tags } = value;

	if (!Array.isArray(tags) || tags.length === 0 || !tags.every(isApiCacheTag)) {
		return null;
	}

	return { tags: [...new Set(tags)] };
}

/**
 * Api cache tags to the cache tags our fetches are tagged with. Mostly identical, except where we
 * aggregate several api slices under one tag (announcements), or name one differently
 * (dariah-projects).
 */
const apiCacheTagToCacheTags: Record<
	ApiCacheTag,
	Array<(typeof cacheTags)[keyof typeof cacheTags]>
> = {
	"documents-policies": [cacheTags.documentsPolicies],
	events: [cacheTags.events],
	"featured-entities": [cacheTags.featuredEntities, cacheTags.announcements],
	"funding-calls": [cacheTags.fundingCalls, cacheTags.announcements],
	"governance-bodies": [cacheTags.governanceBodies],
	"impact-case-studies": [cacheTags.impactCaseStudies],
	"members-partners": [cacheTags.membersAndPartners],
	navigation: [cacheTags.navigation],
	news: [cacheTags.news, cacheTags.announcements],
	opportunities: [cacheTags.opportunities, cacheTags.announcements],
	pages: [cacheTags.pages],
	persons: [cacheTags.persons],
	projects: [cacheTags.dariahProjects],
	"site-metadata": [cacheTags.siteMetadata],
	"spotlight-articles": [cacheTags.spotlightArticles],
	"working-groups": [cacheTags.workingGroups],
};

export async function POST(request: NextRequest): Promise<NextResponse> {
	const secret = env.REVALIDATION_WEBHOOK_SECRET;
	if (secret == null) {
		return new NextResponse(null, { status: 404 });
	}

	const authorization = request.headers.get("authorization");
	if (authorization !== `Bearer ${secret}`) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const payload = parseRevalidationWebhookPayload(
		await request.json().catch(() => {
			return null;
		}),
	);

	if (payload == null) {
		return NextResponse.json({ message: "Bad Request" }, { status: 400 });
	}

	const tags = new Set<string>();

	for (const apiCacheTag of payload.tags) {
		for (const tag of apiCacheTagToCacheTags[apiCacheTag]) {
			tags.add(tag);
		}
	}

	for (const tag of tags) {
		revalidateTag(tag, "max");
	}

	log.info(`[revalidation webhook] received request for cache tags: ${[...tags].join(", ")}.`);

	return NextResponse.json({ revalidated: true });
}
