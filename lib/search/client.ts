import { assert } from "@acdh-oeaw/lib";
import { Client } from "typesense";
import TypesenseInstantSearchAdapter, { type SearchClient } from "typesense-instantsearch-adapter";

import { env } from "@/config/env.config";
import { cacheSearchResultsForSeconds } from "@/config/search.config";

export function createClient(): Client {
	const apiKey = env.NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY;
	assert(apiKey, "Missing `NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY` environment variable.");

	const client = new Client({
		apiKey,
		cacheSearchResultsForSeconds,
		connectionTimeoutSeconds: 3,
		nodes: [
			{
				host: env.NEXT_PUBLIC_TYPESENSE_HOST,
				port: env.NEXT_PUBLIC_TYPESENSE_PORT,
				protocol: env.NEXT_PUBLIC_TYPESENSE_PROTOCOL,
			},
		],
	});

	return client;
}

export const client = createClient();

export function createInstantClient(query_by: string): SearchClient {
	const apiKey = env.NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY;
	assert(apiKey, "Missing `NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY` environment variable.");
	const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
		server: {
			apiKey,
			cacheSearchResultsForSeconds,
			connectionTimeoutSeconds: 3,
			nodes: [
				{
					host: env.NEXT_PUBLIC_TYPESENSE_HOST,
					port: env.NEXT_PUBLIC_TYPESENSE_PORT,
					protocol: env.NEXT_PUBLIC_TYPESENSE_PROTOCOL,
				},
			],
		},
		additionalSearchParameters: {
			query_by,
		},
	});

	return typesenseInstantsearchAdapter.searchClient;
}

export const searchResourceClient = createInstantClient("label,description,keywords");

export const searchSearchClient = createInstantClient("label,description");
