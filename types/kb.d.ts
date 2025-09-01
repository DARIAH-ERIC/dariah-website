export interface KBApiResponse<T> {
	data: Array<T>;
	pagination: {
		limit: number;
		offset: number;
		total: number;
	};
}

export interface Country {
	code: string;
	endDate: string;
	name: string;
	nationalRepresentativeInstitution: {
		name?: string;
		urls?: Array<string>;
	} | null;
	nationalRepresentatives: Array<string>;
	nationalCoordinatingInstitution: {
		name: string;
		urls: Array<string>;
	} | null;
	nationalCoordinators: Array<string>;
	startDate: string;
	type: CountryType;
}

export enum CountryType {
	"cooperating_partnership",
	"member_country",
	"other",
}

export interface WorkingGroup {
	endDate: string;
	name: string;
	startDate: string;
}
