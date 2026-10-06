import "server-only";

import { cacheLife } from "next/cache";
import { connection } from "next/server";

import { env } from "#/configs/env.config.ts";
import {
	type ResourceItem,
	type ResourceSearchResult,
	type ResourceSource,
	type SearchService,
	type SearchServiceConfig,
	type WebsiteSearchResult,
	createSearchService,
} from "#/lib/search/index.ts";
import {
	type ResourcesSearchOptions,
	type WebsiteSearchOptions,
	createResourcesSearchParams,
	createWebsiteSearchParams,
} from "#/lib/search/queries.ts";

/**
 * A search service for the app's collections. Only the search-only key is used here, never the admin key. Throws when
 * the key is missing, which is optional at build time: it can only be generated once the collections exist.
 */
export function createAppSearchService(config?: SearchServiceConfig): SearchService {
	const apiKey = env.NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY;

	if (apiKey == null) {
		throw new Error("Missing search api key. Set `NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY`.");
	}

	return createSearchService({
		apiKey,
		nodes: [
			{
				host: env.NEXT_PUBLIC_TYPESENSE_HOST,
				port: env.NEXT_PUBLIC_TYPESENSE_PORT,
				protocol: env.NEXT_PUBLIC_TYPESENSE_PROTOCOL,
			},
		],
		collections: {
			resources: env.NEXT_PUBLIC_TYPESENSE_COLLECTION_NAME_RESOURCES,
			website: env.NEXT_PUBLIC_TYPESENSE_COLLECTION_NAME_WEBSITE,
		},
		config,
	});
}

let service: SearchService | undefined;

/** Created lazily and shared, so the typesense client's in-memory result cache is shared by all requests. */
function getSearchService(): SearchService {
	service ??= createAppSearchService();

	return service;
}

/**
 * Searches all website content. Not wrapped in `"use cache"`: queries are unbounded user input, and the typesense
 * client already caches identical requests in memory - see `configs/search.config.ts`. That cache reads the clock, so
 * this opts out of prerendering explicitly. A failed search throws.
 */
export async function searchWebsite(options: WebsiteSearchOptions): Promise<WebsiteSearchResult> {
	await connection();

	const result = await getSearchService().collections.website.search(createWebsiteSearchParams(options));

	return result.unwrap();
}

/**
 * Searches the resource catalogue, with counts for the resource type, national consortium and working group facets. Not
 * cached for the same reasons as `searchWebsite`.
 */
export async function searchResources(options: ResourcesSearchOptions): Promise<ResourceSearchResult> {
	await connection();

	const result = await getSearchService().collections.resources.search(createResourcesSearchParams(options));

	return result.unwrap();
}

/**
 * The most recently updated resources from a single ingest source. Unlike the searches above, the inputs are bounded,
 * so this is cached and can be part of a prerendered page. There is no revalidation tag for the resources collection,
 * which is re-synced by the knowledge base on its own schedule, so the entry simply expires.
 */
export async function getLatestResources(source: ResourceSource, limit = 6): Promise<Array<ResourceItem>> {
	"use cache";
	cacheLife("hours");

	const result = await getSearchService().collections.resources.search({
		query: "*",
		filters: [{ operator: "equals", field: "source", value: source }],
		sortBy: [{ field: "source_updated_at", direction: "desc" }],
		perPage: limit,
	});

	return result.unwrap().items;
}
