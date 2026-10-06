import { isNonEmptyString } from "@acdh-oeaw/lib";

import { client, serverBuild, serverRuntime } from "#/configs/env.schema.ts";
import { define } from "#/lib/env/index.ts";

const validate = define({ clientPrefix: "NEXT_PUBLIC_", client, serverBuild, serverRuntime });

/**
 * Preview deployments on vercel get a unique url per deployment, which cannot be configured ahead of time. Production
 * must still be set explicitly, because the canonical url should not silently change with the project's domains.
 *
 * Requires "Enable access to System Environment Variables" in the vercel project settings. These are prefixed with
 * `NEXT_PUBLIC_`, and are therefore inlined into the client bundle, just like the value they fall back to.
 */
function getAppBaseUrl(): string | undefined {
	const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL;
	if (isNonEmptyString(baseUrl)) {
		return baseUrl;
	}

	const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
	if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" && isNonEmptyString(vercelUrl)) {
		return `https://${vercelUrl}`;
	}

	return undefined;
}

export const env = validate({
	environment: {
		API_ACCESS_TOKEN: process.env.API_ACCESS_TOKEN,
		BUILD_MODE: process.env.BUILD_MODE,
		IMGPROXY_BASE_URL: process.env.IMGPROXY_BASE_URL,
		MATOMO_API_TOKEN: process.env.MATOMO_API_TOKEN,
		NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
		NEXT_PUBLIC_API_OPENAPI_PATHNAME: process.env.NEXT_PUBLIC_API_OPENAPI_PATHNAME,
		NEXT_PUBLIC_APP_BASE_URL: getAppBaseUrl(),
		NEXT_PUBLIC_APP_BOTS: process.env.NEXT_PUBLIC_APP_BOTS,
		NEXT_PUBLIC_APP_GOOGLE_SITE_VERIFICATION: process.env.NEXT_PUBLIC_APP_GOOGLE_SITE_VERIFICATION,
		NEXT_PUBLIC_APP_MATOMO_BASE_URL: process.env.NEXT_PUBLIC_APP_MATOMO_BASE_URL,
		NEXT_PUBLIC_APP_MATOMO_ID: process.env.NEXT_PUBLIC_APP_MATOMO_ID,
		NEXT_PUBLIC_TYPESENSE_COLLECTION_NAME_RESOURCES: process.env.NEXT_PUBLIC_TYPESENSE_COLLECTION_NAME_RESOURCES,
		NEXT_PUBLIC_TYPESENSE_COLLECTION_NAME_WEBSITE: process.env.NEXT_PUBLIC_TYPESENSE_COLLECTION_NAME_WEBSITE,
		NEXT_PUBLIC_TYPESENSE_HOST: process.env.NEXT_PUBLIC_TYPESENSE_HOST,
		NEXT_PUBLIC_TYPESENSE_PORT: process.env.NEXT_PUBLIC_TYPESENSE_PORT,
		NEXT_PUBLIC_TYPESENSE_PROTOCOL: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL,
		NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY,
		PORT: process.env.PORT,
		REVALIDATION_WEBHOOK_SECRET: process.env.REVALIDATION_WEBHOOK_SECRET,
		SEARCH_BENCHMARK: process.env.SEARCH_BENCHMARK,
		VERCEL_REGION: process.env.VERCEL_REGION,
	},
}).unwrap();
