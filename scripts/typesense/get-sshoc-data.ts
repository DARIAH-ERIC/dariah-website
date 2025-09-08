import { writeFile } from "node:fs/promises";
import path from "node:path";

import { createUrl, createUrlSearchParams } from "@acdh-oeaw/lib";

import {
	SSHOC_FRONTEND,
	SSHOC_ITEM_CATEGORIES,
	SSHOC_ITEMS_FILE_NAME,
	SSHOC_KEYWORD,
	TYPESENSE_DOCUMENTS_DIR,
} from "@/lib/typesense/constants";
import type {
	Item,
	Link,
	Resource,
	SShocItemCategory,
	SShocItemSearchResponse,
} from "@/types/resources";

class TypesenseDocument implements Resource {
	title: string;
	description: string;
	kind: SShocItemCategory;
	keywords: Array<string>;
	links: Array<Link>;
	importedAt: number;
	constructor(
		title: string,
		description: string,
		kind: SShocItemCategory,
		keywords: Array<string>,
		links: Array<Link>,
		importedAt: number,
	) {
		this.title = title;
		this.description = description;
		this.kind = kind;
		this.keywords = keywords;
		this.links = links;
		this.importedAt = importedAt;
	}
}

const baseUrl = "https://marketplace-api.sshopencloud.eu/api/";

const sshocEndpoints: Record<SShocItemCategory | "item-search", string> = {
	"tool-or-service": "tools-services",
	"training-material": "training-materials",
	workflow: "workflows",
	"item-search": "item-search",
};

async function getSSHOCItemsByKeyword(page = 1) {
	const searchParams = createUrlSearchParams({
		"f.keyword": SSHOC_KEYWORD,
		perpage: 25,
		page: page,
	});
	SSHOC_ITEM_CATEGORIES.forEach((category) => {
		searchParams.append("categories", category);
	});
	const url = createUrl({
		baseUrl,
		pathname: sshocEndpoints["item-search"],
		searchParams,
	});
	//console.log(url)
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${String(response.status)}`);
	}
	return response;
}

async function getAndStoreAllSSHOCItems() {
	const sshocItems: Array<Item> = [];
	const requests: Array<Promise<Response>> = [];

	const response = await getSSHOCItemsByKeyword();
	const searchResponse = (await response.json()) as SShocItemSearchResponse;

	sshocItems.push(...searchResponse.items);
	const numberOfResultPages = searchResponse.pages;

	if (numberOfResultPages > 1) {
		for (let i = 2; i <= numberOfResultPages; i++) {
			requests.push(getSSHOCItemsByKeyword(i));
		}
		const responses = await Promise.allSettled(requests);
		const results = responses.map((r) => {
			return (r as PromiseFulfilledResult<Response>).value.json();
		});
		const responsesData = (await Promise.all(results)) as Array<SShocItemSearchResponse>;
		sshocItems.push(
			...responsesData.flatMap((responseItem) => {
				return responseItem.items;
			}),
		);
	}

	const typesenseDocuments = sshocItems.map((item) => {
		return sshocItemToTypesenseDocument(item);
	});

	await writeFile(
		path.join(import.meta.dirname, TYPESENSE_DOCUMENTS_DIR, SSHOC_ITEMS_FILE_NAME),
		JSON.stringify(typesenseDocuments),
		{ encoding: "utf-8" },
	);
}

function sshocItemToTypesenseDocument(item: Item) {
	const keywords = item.properties
		.filter((property) => {
			return property.type.code === "keyword";
		})
		.map((prop) => {
			return prop.concept.label;
		});
	const links: Array<Link> = (item.accessibleAt ?? []).map((link, idx) => {
		return {
			href: link,
			label: "Accessable at",
			order: idx + 1,
			isExternal: true,
		};
	});
	links.push({
		label: "Visit at SSHOC",
		href: `${SSHOC_FRONTEND}/${item.category}/${item.persistentId}`,
		order: 0,
		isExternal: true,
	});
	const importedAt = Date.now();
	return new TypesenseDocument(
		item.label,
		item.description,
		item.category as SShocItemCategory,
		keywords,
		links,
		importedAt,
	);
}

await getAndStoreAllSSHOCItems();
