declare module "*.css";

export interface Person {
	id: string;
	name: string;
	position: Array<{
		role:
			| "is_affiliated_with"
			| "is_chair_of"
			| "is_vice_chair_of"
			| "is_member_of"
			| "national_coordinator"
			| "national_coordinator_deputy"
			| "national_representative"
			| "national_representative_deputy";
		name: string;
		type:
			| "governance_body"
			| "national_consortium"
			| "country"
			| "institution"
			| "regional_hub"
			| "eric"
			| "working_group";
		description: string | null;
	}> | null;
	image: {
		url: string;
	};
	slug: string;
	role:
		| "national_coordinator"
		| "national_coordinator_deputy"
		| "national_representative"
		| "national_representative_deputy";
}

export interface RelatedEntity {
	id: string;
	slug: string;
	entityType:
		| "governance_body"
		| "national_consortium"
		| "country"
		| "institution"
		| "regional_hub"
		| "eric"
		| "working_group"
		| "events"
		| "news"
		| "opportunities"
		| "pages"
		| "persons"
		| "projects"
		| "documents_policies"
		| "funding_calls"
		| "impact_case_studies"
		| "spotlight_articles";
	label: string | null;
}

export interface RelatedResource {
	id: string;
	label: string;
	type: string | null;
	links: Array<string>;
}

export interface RelatedContent {
	id: string;
	label: string | null;
	slug?: string;
	type: string | null;
	link?: string;
}
