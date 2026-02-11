declare module "*.css";

type ResourceCatalogueSubfilter = Record<
	string,
	{
		name: string;
		limit?: number;
		showMore?: boolean;
		sortBy?: Array<SortByDirection<"name" | "count" | "isRefined">>;
	}
>;

interface ResourceCatalogueFilter {
	name: string;
	limit?: number;
	showMore?: boolean;
	sortBy?: Array<SortByDirection<"name" | "count" | "isRefined">>;
	subfilters?: ResourceCatalogueSubfilter;
}
