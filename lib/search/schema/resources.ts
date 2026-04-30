import { env } from "@/config/env.config";
import { createCollection } from "@/lib/search/create-collection";

export const resources = createCollection({
	name: env.NEXT_PUBLIC_TYPESENSE_RESOURCE_COLLECTION_NAME,
	fields: [
		{ name: "type", type: "string" },
		{ name: "type_kind", type: "string[]", optional: true },
		{ name: "label", type: "string" },
		{ name: "source", type: "string" },
		{ name: "kind", type: "string", optional: true },
		{ name: "description", type: "string" },
		{ name: "keywords", type: "string[]" },
		{ name: "links", type: "string[]" },
		{ name: "actor_ids", type: "string[]", optional: true },
	],
	queryableFields: ["label", "description", "actor_ids"],
	facetableFields: ["type", "keywords", "actor_ids", "source", "kind", "type_kind"],
	sortableFields: ["label"],
});

export type ResourceCollectionField = (typeof resources)["fields"][number];
export type ResourceCollectionQueryField = (typeof resources)["queryableFields"][number];
export type ResourceCollectionFacetField = (typeof resources)["facetableFields"][number];
export type ResourceCollectionSortField = (typeof resources)["sortableFields"][number];

export const resourceTypes = [
	"publication",
	"tool-or-service",
	"training-material",
	"workflow",
] as const;
export type ResourceType = (typeof resourceTypes)[number];

export const toolOrServiceKinds = ["community", "core"] as const;
export type ToolOrServiceKind = (typeof toolOrServiceKinds)[number];

interface ResourceCollectionDocumentBase {
	id: string;
	type: ResourceType;
	source: "open-aire" | "ssh-open-marketplace" | "zotero";
	source_id: string;
	imported_at: number;
	label: string;
	description: string;
	keywords: Array<string>;
	links: Array<string>;
}

interface PublicationResourceDocument extends ResourceCollectionDocumentBase {
	type: "publication";
	source: "open-aire" | "zotero";
	authors: Array<string>;
	year: number | null;
	pid: string | null;
}

interface ToolOrServiceResourceDocument extends ResourceCollectionDocumentBase {
	type: "tool-or-service";
	source: "ssh-open-marketplace";
	kind: ToolOrServiceKind;
	actor_ids: Array<string>;
	type_kind: Array<string>;
}

interface TrainingMaterialResourceDocument extends ResourceCollectionDocumentBase {
	type: "training-material";
	source: "ssh-open-marketplace";
	actor_ids: Array<string>;
}

interface WorkflowResourceDocument extends ResourceCollectionDocumentBase {
	type: "workflow";
	source: "ssh-open-marketplace";
	actor_ids: Array<string>;
}

export type ResourceCollectionDocument =
	| PublicationResourceDocument
	| ToolOrServiceResourceDocument
	| TrainingMaterialResourceDocument
	| WorkflowResourceDocument;

export interface SearchCollectionItem {
	id: string;
	description: string;
	kind: string;
	label: string;
	link: string;
	objectID: string;
	source: string;
	source_id: string;
	type:
		| "country"
		| "document-or-policy"
		| "event"
		| "funding-call"
		| "impact-case-study"
		| "institution"
		| "national-consortium"
		| "news-item"
		| "opportunity"
		| "page"
		| "person"
		| "project"
		| "spotlight-article"
		| "working-group"
		| "publication"
		| "service"
		| "software"
		| "training-material"
		| "workflow";
	imported_at: number;
}
