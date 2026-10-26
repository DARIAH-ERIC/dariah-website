import { describe, expect, test } from "bun:test";

import { resourcesCollection } from "#/lib/search/collections/resources.ts";
import { websiteCollection } from "#/lib/search/collections/website.ts";
import { getFieldTypes } from "#/lib/search/filters.ts";
import { createResourcesSearchParams, createWebsiteSearchParams } from "#/lib/search/queries.ts";
import { createSearchPlan } from "#/lib/search/search.ts";

describe("website search", () => {
	test("keeps partial matches whether or not a type is selected", () => {
		for (const type of [undefined, "news-item"] as const) {
			const params = createWebsiteSearchParams({ query: "small grants 2026", type, page: 1 });
			const plan = createSearchPlan(websiteCollection, getFieldTypes(websiteCollection.fields), params);

			expect(plan.main.drop_tokens_threshold).toBe(plan.main.per_page);
		}
	});
});

describe("resources search", () => {
	test("counts facets over the same documents as the hits", () => {
		const params = createResourcesSearchParams({
			query: "small grants 2026",
			types: ["publication"],
			nationalConsortia: [],
			workingGroups: [],
			page: 1,
		});
		const plan = createSearchPlan(resourcesCollection, getFieldTypes(resourcesCollection.fields), params);

		expect(plan.facetRequests.length).toBeGreaterThan(0);
		for (const { params: facetParams } of plan.facetRequests) {
			expect(facetParams.drop_tokens_threshold).toBe(plan.main.drop_tokens_threshold);
		}
	});
});
