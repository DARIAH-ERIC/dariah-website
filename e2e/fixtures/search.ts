import type { ResourceDocument } from "#/lib/search/collections/resources.ts";
import type { WebsiteDocument } from "#/lib/search/collections/website.ts";

/**
 * The search indexes e2e tests run against, loaded with `search:fixtures:load`. Labels use words the knowledge base's
 * content is unlikely to contain, so each query below matches exactly the documents listed for it.
 */

/** A fixed date, so results which show one render the same on every run. */
const date = Date.UTC(2026, 0, 15);

/** Matched by "lexicography": one document each of four types. */
const lexicography: Array<WebsiteDocument> = [
	{
		id: "e2e-working-group-lexicography",
		kind: "entity",
		source: "dariah-knowledge-base",
		source_id: "e2e-working-group-lexicography",
		entity_id: "e2e-working-group-lexicography",
		source_updated_at: date,
		imported_at: date,
		type: "working-group",
		label: "Lexicography working group",
		description: "Brings together researchers working on dictionaries.",
		link: "/network/working-groups/lexicography",
	},
	{
		id: "e2e-event-lexicography",
		kind: "entity",
		source: "dariah-knowledge-base",
		source_id: "e2e-event-lexicography",
		entity_id: "e2e-event-lexicography",
		source_updated_at: date,
		imported_at: date,
		type: "event",
		label: "Lexicography summer school",
		description: "A week of hands-on sessions on building dictionaries.",
		link: "/events/lexicography-summer-school",
	},
	{
		id: "e2e-news-item-lexicography",
		kind: "entity",
		source: "dariah-knowledge-base",
		source_id: "e2e-news-item-lexicography",
		entity_id: "e2e-news-item-lexicography",
		source_updated_at: date,
		imported_at: date,
		type: "news-item",
		label: "New lexicography resources",
		description: "Three new dictionaries have been published.",
		link: "/news/new-lexicography-resources",
	},
	{
		id: "e2e-training-material-lexicography",
		kind: "resource",
		source: "dariah-campus",
		source_id: "e2e-training-material-lexicography",
		source_updated_at: date,
		imported_at: date,
		type: "training-material",
		label: "Introduction to digital lexicography",
		description: "A self-paced course.",
		link: "https://campus.dariah.eu/resources/introduction-to-digital-lexicography",
	},
];

/** Matched by "palaeography": more documents than fit on one page of results, which holds 20. */
const palaeography: Array<WebsiteDocument> = Array.from({ length: 25 }, (_, index) => {
	const n = String(index + 1).padStart(2, "0");

	return {
		id: `e2e-event-palaeography-${n}`,
		kind: "entity",
		source: "dariah-knowledge-base",
		source_id: `e2e-event-palaeography-${n}`,
		entity_id: `e2e-event-palaeography-${n}`,
		/** Newest first among equal matches, so session 25 leads the first page, and session 01 ends the second. */
		source_updated_at: date + index * 86_400_000,
		imported_at: date,
		type: "event",
		label: `Palaeography workshop, session ${n}`,
		description: "Reading medieval manuscripts together.",
		link: `/events/palaeography-workshop-session-${n}`,
	};
});

export const websiteDocuments: Array<WebsiteDocument> = [...lexicography, ...palaeography];

/**
 * Fields a resource of each type leaves empty. Consortia and working groups are slugs the api does not know, which the
 * resource catalogue shows as they are, so its facet labels do not depend on the api's content.
 */
const resource = {
	source_updated_at: date,
	imported_at: date,
	keywords: [],
	institutions: [],
	upstream_sources: null,
	authors: null,
	year: null,
	pid: null,
};

/**
 * Matched by "stemmatology": five resources of four types, in two national consortia and one working group.
 *
 * | resource              | type              | consortia                | working group |
 * | --------------------- | ----------------- | ------------------------ | ------------- |
 * | stemmatology handbook | publication       | e2e-austria              | e2e-wg-texts  |
 * | stemmatology reader   | publication       | e2e-austria, e2e-croatia |               |
 * | stemmatology toolkit  | software          | e2e-austria              | e2e-wg-texts  |
 * | stemmatology service  | service (core)    | e2e-croatia              |               |
 * | stemmatology course   | training-material |                          |               |
 */
const stemmatology: Array<ResourceDocument> = [
	{
		...resource,
		id: "e2e-publication-stemmatology-handbook",
		source: "zenodo",
		source_id: "e2e-publication-stemmatology-handbook",
		type: "publication",
		kind: null,
		label: "Stemmatology handbook",
		description: "Methods for reconstructing the history of a text.",
		links: ["https://zenodo.org/records/e2e-stemmatology-handbook"],
		source_url: null,
		national_consortia: ["e2e-austria"],
		working_groups: ["e2e-wg-texts"],
		authors: [],
		year: 2025,
		source_updated_at: date + 4,
	},
	{
		...resource,
		id: "e2e-publication-stemmatology-reader",
		source: "zenodo",
		source_id: "e2e-publication-stemmatology-reader",
		type: "publication",
		kind: null,
		label: "Stemmatology reader",
		description: "Collected essays.",
		links: ["https://zenodo.org/records/e2e-stemmatology-reader"],
		source_url: null,
		national_consortia: ["e2e-austria", "e2e-croatia"],
		working_groups: [],
		authors: [],
		year: 2024,
		source_updated_at: date + 3,
	},
	{
		...resource,
		id: "e2e-software-stemmatology-toolkit",
		source: "ssh-open-marketplace",
		source_id: "e2e-software-stemmatology-toolkit",
		type: "software",
		kind: null,
		label: "Stemmatology toolkit",
		description: "Builds a stemma from collated witnesses.",
		links: [],
		source_url: "https://marketplace.sshopencloud.eu/tool-or-service/e2e-stemmatology-toolkit",
		national_consortia: ["e2e-austria"],
		working_groups: ["e2e-wg-texts"],
		source_updated_at: date + 2,
	},
	{
		...resource,
		id: "e2e-service-stemmatology",
		source: "ssh-open-marketplace",
		source_id: "e2e-service-stemmatology",
		type: "service",
		kind: "core",
		label: "Stemmatology service",
		description: "Hosted collation.",
		links: ["https://stemmatology.example.com"],
		source_url: null,
		national_consortia: ["e2e-croatia"],
		working_groups: [],
		source_updated_at: date + 1,
	},
	{
		...resource,
		id: "e2e-training-material-stemmatology",
		source: "dariah-campus",
		source_id: "e2e-training-material-stemmatology",
		type: "training-material",
		kind: null,
		label: "Stemmatology course",
		description: "An introduction in five lessons.",
		links: ["https://campus.dariah.eu/resources/e2e-stemmatology-course"],
		source_url: null,
		national_consortia: [],
		working_groups: [],
		upstream_sources: [],
	},
];

/** Matched by "papyrology": more publications than fit on one page of results, which holds 20. */
const papyrology: Array<ResourceDocument> = Array.from({ length: 22 }, (_, index) => {
	const n = String(index + 1).padStart(2, "0");

	return {
		...resource,
		id: `e2e-publication-papyrology-${n}`,
		source: "zenodo",
		source_id: `e2e-publication-papyrology-${n}`,
		type: "publication",
		kind: null,
		label: `Papyrology working paper ${n}`,
		description: "Notes on documentary papyri.",
		links: [`https://zenodo.org/records/e2e-papyrology-${n}`],
		source_url: null,
		national_consortia: [],
		working_groups: [],
		authors: [],
		/** Newest first among equal matches, so paper 22 leads the first page, and paper 01 ends the second. */
		source_updated_at: date + index * 86_400_000,
	};
});

export const resourceDocuments: Array<ResourceDocument> = [...stemmatology, ...papyrology];
