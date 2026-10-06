import type { Result } from "better-result";

import { searchParams as resourcesSearchParams } from "#/app/(app)/(default)/resources/resource-catalogue/search-params.ts";
import { searchParams as websiteSearchParams } from "#/app/(app)/(default)/search/search-params.ts";
import { href, serializeHref } from "#/lib/navigation/href.ts";
import type { SearchService } from "#/lib/search/index.ts";
import { createResourcesSearchParams, createWebsiteSearchParams } from "#/lib/search/queries.ts";

/**
 * A search page state to benchmark: the page url whose search form is driven for the server path, and the same search
 * run with a `SearchService` for the direct path and the server leg - both build their params with the functions the
 * pages use, so all three send identical requests to typesense.
 */
export interface SearchBenchmarkScenario {
	id: string;
	label: string;
	url: string;
	search: (service: SearchService, query: string) => Promise<Result<unknown, unknown>>;
}

export const scenarios: ReadonlyArray<SearchBenchmarkScenario> = [
	{
		id: "website",
		label: "Site search",
		url: serializeHref(href({ pathname: "/search" })),
		search(service, query) {
			return service.collections.website.search(createWebsiteSearchParams({ query, page: 1 }));
		},
	},
	{
		id: "website-project",
		label: "Site search, type: project",
		url: serializeHref(
			href({ pathname: "/search", searchParams: websiteSearchParams.encode({ q: "", type: "project", page: 1 }) }),
		),
		search(service, query) {
			return service.collections.website.search(createWebsiteSearchParams({ query, type: "project", page: 1 }));
		},
	},
	{
		id: "resources",
		label: "Resource catalogue",
		url: serializeHref(href({ pathname: "/resources/resource-catalogue" })),
		search(service, query) {
			return service.collections.resources.search(
				createResourcesSearchParams({ query, types: [], nationalConsortia: [], workingGroups: [], page: 1 }),
			);
		},
	},
	{
		id: "resources-filtered",
		label: "Resource catalogue, type: service, consortium: clariah-nl",
		url: serializeHref(
			href({
				pathname: "/resources/resource-catalogue",
				searchParams: resourcesSearchParams.encode({
					q: "",
					type: ["service"],
					consortium: ["clariah-nl"],
					"working-group": [],
					page: 1,
				}),
			}),
		),
		search(service, query) {
			return service.collections.resources.search(
				createResourcesSearchParams({
					query,
					types: ["service"],
					nationalConsortia: ["clariah-nl"],
					workingGroups: [],
					page: 1,
				}),
			);
		},
	},
];
