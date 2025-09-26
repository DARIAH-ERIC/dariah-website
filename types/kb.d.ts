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
	consortiumName: string;
	description: string;
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
	nationalCoordinatorDeputies: Array<string>;
	outreachUrl: string;
	partnerInstitutions: Array<Institution>;
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

export interface Institution {
	endDate: string;
	name: string;
	startDate: string;
	website: Array<string>;
}
