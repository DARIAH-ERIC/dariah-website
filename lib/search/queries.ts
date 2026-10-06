import type { ResourceSearchField, ResourceType, SearchResourcesParams } from "#/lib/search/collections/resources.ts";
import type { SearchWebsiteParams, WebsiteDocumentType, WebsiteSearchField } from "#/lib/search/collections/website.ts";

/**
 * The typesense search params behind the website's search pages. Kept free of server-only dependencies, so the same
 * requests can be built wherever a search runs - see `#/lib/data/search.ts` and the search benchmark.
 */

/** Only the human-readable fields; `source`, `type` and ids are indexed for filtering and faceting, not for matching. */
const websiteQueryBy: ReadonlyArray<WebsiteSearchField> = ["label", "description"];
const resourcesQueryBy: ReadonlyArray<ResourceSearchField> = ["label", "description", "keywords"];

const perPage = 20;

/**
 * Best match first, and the most recent `source_updated_at` among equally good matches - which, without a query, is
 * every document, so browsing lists the newest first. What "newest" means depends on the type, e.g. events sort by
 * their event date, furthest in the future first - see the field in `./collections/website.ts`. Documents without a
 * date go last.
 */
const sortBy = [
	{ field: "_text_match", direction: "desc" },
	{ field: "source_updated_at", direction: "desc", missingValues: "last" },
] as const;

export interface WebsiteSearchOptions {
	/** An empty query matches every document, e.g. to browse all documents of one type. */
	query: string;
	type?: WebsiteDocumentType;
	page: number;
}

export function createWebsiteSearchParams(options: WebsiteSearchOptions): SearchWebsiteParams {
	const { query, type, page } = options;

	return {
		query: query.length > 0 ? query : "*",
		queryBy: websiteQueryBy,
		filters: type != null ? [{ operator: "equals", field: "type", value: type }] : [],
		sortBy,
		page,
		perPage,
	};
}

export interface ResourcesSearchOptions {
	/** An empty query matches every resource, so the catalogue can be browsed by facets alone. */
	query: string;
	types: ReadonlyArray<ResourceType>;
	nationalConsortia: ReadonlyArray<string>;
	workingGroups: ReadonlyArray<string>;
	page: number;
}

/**
 * Includes counts for the resource type, national consortium and working group facets. Each facet is disjunctive, so
 * its counts ignore its own selection.
 */
export function createResourcesSearchParams(options: ResourcesSearchOptions): SearchResourcesParams {
	const { query, types, nationalConsortia, workingGroups, page } = options;

	return {
		query: query.length > 0 ? query : "*",
		queryBy: resourcesQueryBy,
		facets: {
			type: { values: types },
			national_consortia: { values: nationalConsortia },
			working_groups: { values: workingGroups },
		},
		/** Enough to list every consortium and working group, which the facets are rendered as checkboxes for. */
		maxFacetValues: 250,
		sortBy,
		page,
		perPage,
	};
}
