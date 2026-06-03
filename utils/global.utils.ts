import { env } from "@/config/env.config";
import type { MemberOrPartner, SpotlightArticle, WorkingGroup } from "@/lib/data/api-client";
import type { Person, RelatedContent, RelatedEntity, RelatedResource } from "@/types/global";

type AnyPerson =
	| Person
	| MemberOrPartner["contributors"][number]
	| WorkingGroup["chairs"][number]
	| SpotlightArticle["contributors"][number];

export const getGrouppedPersonMembers = (
	members: Array<AnyPerson>,
): Record<string, Array<AnyPerson>> => {
	return members.reduce<Record<string, Array<AnyPerson>>>((acc, person) => {
		acc[person.role] = [...(acc[person.role] ?? []), person];
		return acc;
	}, {});
};

const GOVERNANCE_VARIANTS_BY_SLUG = new Set([
	"general-assembly",
	"board-of-directors",
	"scientific-advisory-board",
	"senior-management-team",
	"dariah-coordination-office",
	"joint-research-committee",
	"national-coordinators-committee",
	"working-groups",
]);

export const getUrlForStaticPage = (slug: string): string | undefined => {
	switch (slug) {
		case "dariah-in-a-nutshell": {
			return `/about/dariah-in-a-nutshell`;
		}
		case "strategy": {
			return "/about/strategy";
		}
		case "regional-hubs": {
			return "/network/regional-hubs";
		}
		case "partnerships-and-collaborations": {
			return "/network/partnerships-and-collaborations";
		}
		case "join-dariah": {
			return "/get-involved/join-dariah";
		}
		default: {
			return undefined;
		}
	}
};

export const getUrlForGovernanceBody = (slug: string): string | undefined => {
	const organisationBaseUrl = "/about/organisation-and-governance";
	if (GOVERNANCE_VARIANTS_BY_SLUG.has(slug)) {
		return `${organisationBaseUrl}?selectedBody=${slug}#userList`;
	}

	return organisationBaseUrl;
};

export const getEntityUrl = (entity: RelatedEntity): string | undefined => {
	const { entityType, slug, id } = entity;
	const apiUrl = env.NEXT_PUBLIC_API_BASE_URL;

	switch (entityType) {
		case "documents_policies": {
			return `${apiUrl}/api/v1/documents-policies/${id}/document`;
		}
		case "events": {
			return `/events/${slug}`;
		}
		case "funding_calls": {
			return `/get-involved/funding-calls/${slug}`;
		}
		case "impact_case_studies": {
			return `/about/impact-case-studies/${slug}`;
		}
		case "news": {
			return `/news/${slug}`;
		}
		case "opportunities": {
			return undefined;
		}
		case "pages": {
			return getUrlForStaticPage(slug);
		}
		case "persons": {
			return undefined;
		}
		case "projects": {
			return `/projects/${slug}`;
		}
		case "spotlight_articles": {
			return `/spotlights/${slug}`;
		}
		case "governance_body": {
			return getUrlForGovernanceBody(slug);
		}
		case "national_consortium": {
			return undefined;
		}
		case "country": {
			return `/network/members-and-partners/${slug}`;
		}
		case "institution": {
			return undefined;
		}
		case "regional_hub": {
			return undefined;
		}
		case "eric": {
			return undefined;
		}
		case "working_group": {
			return `/network/working-groups/${slug}`;
		}
		default: {
			return undefined;
		}
	}
};

export const mergeEntitiesAndResources = (
	relatedEntities: Array<RelatedEntity>,
	relatedResources: Array<RelatedResource>,
): Array<RelatedContent> => {
	return [
		...relatedEntities.map((entity) => {
			return {
				id: entity.id,
				label: entity.label,
				slug: entity.slug,
				type: entity.entityType,
				link: getEntityUrl(entity),
			};
		}),
		...relatedResources.map((resource) => {
			return {
				id: resource.id,
				label: resource.label,
				type: resource.type,
				link: resource.links[0],
			};
		}),
	];
};

export const mergeQuickLinks = (
	relatedEntities: Array<RelatedEntity>,
	relatedResources: Array<RelatedResource>,
): Array<{ label: string; link: string | undefined }> => {
	return [
		...relatedEntities.map((entity) => {
			return {
				label: entity.label ?? entity.slug,
				link: getEntityUrl(entity),
			};
		}),
		...relatedResources.map((resource) => {
			return {
				label: resource.label,
				link: resource.links[0],
			};
		}),
	];
};
