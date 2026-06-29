export type RelationshipType =
	| "appoints-bod"
	| "appoints-sab"
	| "appoints-dco-and-jrc"
	| "advises-bod"
	| "represented-in-smt"
	| "oversees-wg"
	| "supports-wg"
	| "supports-ncc-and-jrc";

export type GovernanceVariants =
	| "governing-body"
	| "executive-body"
	| "advisory-body"
	| "operational-body"
	| "working-groups";

export type GovernanceBody =
	| "general-assembly"
	| "board-of-directors"
	| "scientific-advisory-board"
	| "senior-management-team"
	| "dariah-coordination-office"
	| "joint-research-committee"
	| "national-coordinator-committee"
	| "working-groups";
