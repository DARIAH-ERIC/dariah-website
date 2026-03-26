declare module "*.css";

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

export interface Event {
	id: string;
	title: string;
	summary: string;
	image: {
		readonly id: string;
		readonly url: string;
		readonly license: {
			id: string;
			name: string;
			url: string;
		};
	};
	slug: string;
	publishedAt: Date;
	startDate: Date;
	endDate: Date | undefined;
	location: string;
}
