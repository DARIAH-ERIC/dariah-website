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
			| "is_director_of"
			| "is_president_of"
			| "is_contact_for"
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
