import { describe, expect, test } from "bun:test";

import { isCacheTag, parseRevalidationWebhookPayload } from "#/lib/api/cache-tags.ts";
import { cacheTags } from "#/lib/api/schemas.ts";

describe("isCacheTag", () => {
	test("accepts every tag in the generated vocabulary", () => {
		expect(cacheTags.length).toBeGreaterThan(0);

		for (const tag of cacheTags) {
			expect(isCacheTag(tag)).toBe(true);
		}
	});

	test("rejects strings outside the vocabulary and non-strings", () => {
		expect(isCacheTag("home")).toBe(false);
		expect(isCacheTag("")).toBe(false);
		expect(isCacheTag(null)).toBe(false);
		expect(isCacheTag(["news"])).toBe(false);
	});
});

describe("parseRevalidationWebhookPayload", () => {
	test("returns the de-duplicated tags of a valid payload", () => {
		expect(parseRevalidationWebhookPayload({ tags: ["news", "events", "news"] })).toEqual({
			tags: ["news", "events"],
		});
	});

	test("rejects payloads without tags, with empty tags, or with unknown tags", () => {
		expect(parseRevalidationWebhookPayload(null)).toBeNull();
		expect(parseRevalidationWebhookPayload("news")).toBeNull();
		expect(parseRevalidationWebhookPayload({ type: "news" })).toBeNull();
		expect(parseRevalidationWebhookPayload({ tags: [] })).toBeNull();
		expect(parseRevalidationWebhookPayload({ tags: ["news", "home"] })).toBeNull();
		expect(parseRevalidationWebhookPayload({ tags: "news" })).toBeNull();
	});
});
