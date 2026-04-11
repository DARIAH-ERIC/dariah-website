type SortByDirection<TCriterion extends string> =
	| TCriterion
	| `${TCriterion}:asc`
	| `${TCriterion}:desc`;

export type ResourceCatalogueSubfilter = Record<
	string,
	{
		name: string;
		limit?: number;
		showMore?: boolean;
		sortBy?: Array<SortByDirection<"name" | "count" | "isRefined">>;
	}
>;

export interface ResourceCatalogueFilter {
	name: string;
	limit?: number;
	showMore?: boolean;
	sortBy?: Array<SortByDirection<"name" | "count" | "isRefined">>;
	subfilters?: ResourceCatalogueSubfilter;
}
