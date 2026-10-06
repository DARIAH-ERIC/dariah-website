import { type CacheTag, type RevalidationWebhookPayload, cacheTags } from "#/lib/api/schemas.ts";

const cacheTagSet: ReadonlySet<string> = new Set(cacheTags);

export function isCacheTag(value: unknown): value is CacheTag {
	return typeof value === "string" && cacheTagSet.has(value);
}

/**
 * Parses an untrusted revalidation webhook body. Returns `null` when it is not a `{ tags }` object, or any tag is
 * outside the vocabulary the api client was generated from, so a website built against an older vocabulary fails loudly
 * instead of silently ignoring an unknown tag.
 */
export function parseRevalidationWebhookPayload(value: unknown): RevalidationWebhookPayload | null {
	if (typeof value !== "object" || value === null || !("tags" in value)) {
		return null;
	}

	const { tags } = value;

	if (!Array.isArray(tags) || tags.length === 0 || !tags.every((tag) => isCacheTag(tag))) {
		return null;
	}

	return { tags: [...new Set(tags)] };
}
