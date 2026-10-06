import { log } from "@acdh-oeaw/lib";

import { resourceDocuments, websiteDocuments } from "#/e2e/fixtures/search.ts";
import { createSearchAdminService } from "#/lib/search/admin.ts";
import { env } from "#/scripts/search/env.ts";

/**
 * Replaces the documents of both collections with the e2e fixtures, see `#/e2e/fixtures/search.ts`. Everything else in
 * them is deleted, so only run this against a typesense instance which exists for testing.
 */
const admin = createSearchAdminService({
	apiKey: env.TYPESENSE_ADMIN_API_KEY,
	nodes: [
		{
			host: env.NEXT_PUBLIC_TYPESENSE_HOST,
			port: env.NEXT_PUBLIC_TYPESENSE_PORT,
			protocol: env.NEXT_PUBLIC_TYPESENSE_PROTOCOL,
		},
	],
	collections: {
		resources: env.NEXT_PUBLIC_TYPESENSE_COLLECTION_NAME_RESOURCES,
		website: env.NEXT_PUBLIC_TYPESENSE_COLLECTION_NAME_WEBSITE,
	},
});

async function main() {
	(await admin.collections.resources.reset()).unwrap();
	(await admin.collections.resources.ingest(resourceDocuments)).unwrap();
	log.success(
		`Successfully loaded ${String(resourceDocuments.length)} fixtures into collection "${env.NEXT_PUBLIC_TYPESENSE_COLLECTION_NAME_RESOURCES}".`,
	);

	(await admin.collections.website.reset()).unwrap();
	(await admin.collections.website.ingest(websiteDocuments)).unwrap();
	log.success(
		`Successfully loaded ${String(websiteDocuments.length)} fixtures into collection "${env.NEXT_PUBLIC_TYPESENSE_COLLECTION_NAME_WEBSITE}".`,
	);
}

main().catch((error: unknown) => {
	log.error("Failed to load search fixtures.\n", error);
	process.exitCode = 1;
});
