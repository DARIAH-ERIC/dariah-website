import type { GovernanceBodyList } from "@/lib/data/api-client";
import type { GovernanceBody, GovernanceVariants, RelationshipType } from "@/types/governance-body";

const GOVERNANCE_VARIANTS_BY_SLUG: Record<GovernanceBody, GovernanceVariants> = {
	"general-assembly": "governing-body",
	"board-of-directors": "executive-body",
	"scientific-advisory-board": "advisory-body",
	"senior-management-team": "advisory-body",
	"dariah-coordination-office": "operational-body",
	"joint-research-committee": "operational-body",
	"national-coordinators-committee": "operational-body",
	"working-groups": "working-groups",
};

const GOVERNANCE_RELATIONSHIPS_BY_SLUG: Record<GovernanceBody, Array<RelationshipType>> = {
	"general-assembly": ["appoints-bod", "appoints-sab"],
	"board-of-directors": ["appoints-dco-and-jrc"],
	"scientific-advisory-board": ["advises-bod", "represented-in-smt"],
	"senior-management-team": ["advises-bod"],
	"dariah-coordination-office": ["supports-ncc-and-jrc", "supports-wg"],
	"joint-research-committee": ["represented-in-smt", "oversees-wg"],
	"national-coordinators-committee": ["represented-in-smt"],
	"working-groups": [],
};

const COLORS_FOR_VARIANTS = {
	"governing-body": {
		bg: "bg-primary-700",
		border: "border-primary-700",
		borderFocus: "group-focus:border-primary-700",
		text: "text-primary-700",
	},
	"executive-body": {
		bg: "bg-governance-body-card-executive-body",
		border: "border-governance-body-card-executive-body",
		borderFocus: "group-focus:border-governance-body-card-executive-body",
		text: "text-governance-body-card-executive-body",
	},
	"advisory-body": {
		bg: "bg-governance-body-card-advisory-body",
		border: "border-governance-body-card-advisory-body",
		borderFocus: "group-focus:border-governance-body-card-advisory-body",
		text: "text-governance-body-card-advisory-body",
	},
	"operational-body": {
		bg: "bg-governance-body-card-operational-body",
		border: "border-governance-body-card-operational-body",
		borderFocus: "group-focus:border-governance-body-card-operational-body",
		text: "text-governance-body-card-operational-body",
	},
	"working-groups": {
		bg: "bg-governance-body-card-working-groups",
		border: "border-governance-body-card-working-groups",
		borderFocus: "group-focus:border-governance-body-card-working-groups",
		text: "text-governance-body-card-working-groups",
	},
};

export const getColorsForGovernanceVariant = (
	variant: GovernanceVariants,
): {
	bg: string;
	border: string;
	borderFocus: string;
	text: string;
} => {
	return COLORS_FOR_VARIANTS[variant];
};

export const getGovernanceVariant = (slug: GovernanceBody): GovernanceVariants | undefined => {
	return GOVERNANCE_VARIANTS_BY_SLUG[slug];
};

export const getGovernanceRelationships = (slug: GovernanceBody): Array<RelationshipType> => {
	return GOVERNANCE_RELATIONSHIPS_BY_SLUG[slug];
};

export const getNameAcronym = (name: string): string => {
	return name.match(/\b\w/g)?.join("").toUpperCase() ?? "";
};

export const sortGovernanceBodiesForMobile = (
	bodies: Array<GovernanceBodyList["data"][number]>,
): Array<GovernanceBodyList["data"][number]> => {
	const orderedBodies = [
		bodies.find((body) => {
			return body.entity.slug === "general-assembly";
		}),
		bodies.find((body) => {
			return body.entity.slug === "board-of-directors";
		}),
		bodies.find((body) => {
			return body.entity.slug === "scientific-advisory-board";
		}),
		bodies.find((body) => {
			return body.entity.slug === "senior-management-team";
		}),
		bodies.find((body) => {
			return body.entity.slug === "dariah-coordination-office";
		}),
		bodies.find((body) => {
			return body.entity.slug === "joint-research-committee";
		}),
		bodies.find((body) => {
			return body.entity.slug === "national-coordinators-committee";
		}),
		bodies.find((body) => {
			return body.entity.slug === "working-groups";
		}),
	];

	return orderedBodies.filter((body) => {
		return body !== undefined;
	});
};

export const getGovernanceBodiesForDesktop = (
	bodies: Array<GovernanceBodyList["data"][number]>,
): Record<string, GovernanceBodyList["data"][number] | undefined> => {
	return {
		generalAssembly: bodies.find((body) => {
			return body.entity.slug === "general-assembly";
		}),
		boardOfDirectors: bodies.find((body) => {
			return body.entity.slug === "board-of-directors";
		}),
		coordinationOffice: bodies.find((body) => {
			return body.entity.slug === "dariah-coordination-office";
		}),
		researchComitee: bodies.find((body) => {
			return body.entity.slug === "joint-research-committee";
		}),
		nationalComitee: bodies.find((body) => {
			return body.entity.slug === "national-coordinators-committee";
		}),
		workingGroup: bodies.find((body) => {
			return body.entity.slug === "working-groups";
		}),
		scientificAdvisoryBoard: bodies.find((body) => {
			return body.entity.slug === "scientific-advisory-board";
		}),
		seniorManagementTeam: bodies.find((body) => {
			return body.entity.slug === "senior-management-team";
		}),
	};
};
