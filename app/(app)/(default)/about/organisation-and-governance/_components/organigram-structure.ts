/**
 * How DARIAH's governance bodies relate to each other, as the statutes set it out. The api has the bodies' names,
 * summaries and members, but nothing of their kind or relations, and these only change with the statutes, so they are
 * kept here, by the bodies' slugs. A body the api does not publish is left out of the organigram, with its relations.
 */

export type GovernanceBodyKind = "governing" | "executive" | "advisory" | "operational" | "other";

export type GovernanceBodySlug =
	| "general-assembly"
	| "scientific-advisory-board"
	| "board-of-directors"
	| "senior-management-team"
	| "dariah-coordination-office"
	| "joint-research-committee"
	| "national-coordinator-committee"
	| "working-groups";

export type RelationKind = "appoints" | "advises" | "supports" | "oversees" | "represented-in";

interface GovernanceBodyStructure {
	kind: GovernanceBodyKind;
	/** For a body the api has no acronym for. */
	acronym?: string;
}

/** The bodies in reading order: from the top down, the advisory bodies after the Board of Directors they advise. */
export const governanceBodies: Record<GovernanceBodySlug, GovernanceBodyStructure> = {
	"general-assembly": { kind: "governing" },
	"board-of-directors": { kind: "executive" },
	"scientific-advisory-board": { kind: "advisory" },
	"senior-management-team": { kind: "advisory" },
	"dariah-coordination-office": { kind: "operational" },
	"joint-research-committee": { kind: "operational" },
	"national-coordinator-committee": { kind: "operational" },
	"working-groups": { kind: "other", acronym: "WG" },
};

export interface Relation {
	from: GovernanceBodySlug;
	kind: RelationKind;
	to: GovernanceBodySlug;
}

/**
 * Every relation, each listed as a tag on the body it starts from. Only some are drawn as arrows as well (see
 * `connectors`): the representation in the Senior Management Team, and the Coordination Office's support of the Board
 * of Directors and the working groups, would cross the others.
 */
export const relations: Array<Relation> = [
	{ from: "general-assembly", kind: "appoints", to: "board-of-directors" },
	{ from: "general-assembly", kind: "appoints", to: "scientific-advisory-board" },
	{ from: "scientific-advisory-board", kind: "advises", to: "board-of-directors" },
	{ from: "scientific-advisory-board", kind: "represented-in", to: "senior-management-team" },
	{ from: "board-of-directors", kind: "appoints", to: "dariah-coordination-office" },
	{ from: "board-of-directors", kind: "appoints", to: "joint-research-committee" },
	{ from: "senior-management-team", kind: "advises", to: "board-of-directors" },
	{ from: "dariah-coordination-office", kind: "supports", to: "board-of-directors" },
	{ from: "dariah-coordination-office", kind: "supports", to: "national-coordinator-committee" },
	{ from: "dariah-coordination-office", kind: "supports", to: "joint-research-committee" },
	{ from: "dariah-coordination-office", kind: "supports", to: "working-groups" },
	{ from: "joint-research-committee", kind: "represented-in", to: "senior-management-team" },
	{ from: "joint-research-committee", kind: "oversees", to: "working-groups" },
	{ from: "national-coordinator-committee", kind: "represented-in", to: "senior-management-team" },
];
