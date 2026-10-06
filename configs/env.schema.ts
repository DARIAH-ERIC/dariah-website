import { addTrailingSlash, removeTrailingSlash } from "@acdh-oeaw/lib";
import * as v from "valibot";

/**
 * Schemas for the app's environment variables, separate from the validated environment in `./env.config.ts`, which
 * validates on import. Scripts which only need a subset of these values - and must be able to run before a local
 * `.env.local` exists - can therefore reuse single entries, without validating the full environment.
 *
 * Values which are identical in every environment have a default, so they neither need to be provided in a local
 * `.env.local`, nor by the ci pipeline. Values which differ per environment - and would silently be baked into the
 * client bundle with a development value if they had one - intentionally have no default, and must be provided.
 */
/** Inlined into the client bundle at build time, so these must be correct when `next build` runs. */
export const client = v.object({
	NEXT_PUBLIC_API_BASE_URL: v.optional(
		v.pipe(v.string(), v.url(), v.transform(removeTrailingSlash)),
		"https://knowledgebase-api.dariah.eu",
	),
	NEXT_PUBLIC_API_OPENAPI_PATHNAME: v.optional(
		v.pipe(v.string(), v.nonEmpty(), v.transform(removeTrailingSlash)),
		"/docs/openapi.json",
	),
	NEXT_PUBLIC_APP_BASE_URL: v.pipe(v.string(), v.url(), v.transform(removeTrailingSlash)),
	NEXT_PUBLIC_APP_BOTS: v.optional(v.picklist(["disabled", "enabled"]), "disabled"),
	NEXT_PUBLIC_APP_GOOGLE_SITE_VERIFICATION: v.optional(v.pipe(v.string(), v.nonEmpty())),
	NEXT_PUBLIC_APP_MATOMO_BASE_URL: v.optional(
		v.pipe(v.string(), v.url(), v.transform(addTrailingSlash)),
		"https://matomo.acdh.oeaw.ac.at",
	),
	NEXT_PUBLIC_APP_MATOMO_ID: v.optional(v.pipe(v.string(), v.toNumber(), v.integer(), v.minValue(1))),
	NEXT_PUBLIC_TYPESENSE_COLLECTION_NAME_RESOURCES: v.optional(v.pipe(v.string(), v.nonEmpty()), "dariah-resources"),
	NEXT_PUBLIC_TYPESENSE_COLLECTION_NAME_WEBSITE: v.optional(v.pipe(v.string(), v.nonEmpty()), "dariah-website"),
	NEXT_PUBLIC_TYPESENSE_HOST: v.pipe(v.string(), v.nonEmpty()),
	NEXT_PUBLIC_TYPESENSE_PORT: v.pipe(v.string(), v.toNumber(), v.integer(), v.minValue(1)),
	NEXT_PUBLIC_TYPESENSE_PROTOCOL: v.optional(v.picklist(["http", "https"]), "https"),
	/**
	 * Optional, because we need to be able to create a collection, before we create a search-only api key for that
	 * collection.
	 */
	NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY: v.optional(v.pipe(v.string(), v.nonEmpty())),
});

/**
 * Not exposed to the client, but required while building the app, so these must stay available in the `build`
 * validation mode. Currently only build tooling configuration. A secret belongs here only if a prerendered route
 * genuinely needs it at build time - which makes every build, including the container image build, require that secret.
 * Make that choice deliberately; do not move an item here to silence a throw from the `build` mode.
 */
export const serverBuild = v.object({
	/**
	 * Sent as `x-api-access-token` to bypass the knowledge base api's rate limits. Prerendered routes fetch at build
	 * time, so every build needs it - see `#/lib/api/endpoint.ts`.
	 */
	API_ACCESS_TOKEN: v.pipe(v.string(), v.nonEmpty()),
	BUILD_MODE: v.optional(v.picklist(["export", "standalone"])),
	/**
	 * Where the api's image variant endpoint redirects to, so that a page's high priority image can preconnect to it -
	 * see `#/components/api-image.tsx`. Pairs with `NEXT_PUBLIC_API_BASE_URL`, and defaults to the production instance
	 * like it. A wrong value costs no more than an unused connection.
	 */
	IMGPROXY_BASE_URL: v.optional(
		v.pipe(v.string(), v.url(), v.transform(removeTrailingSlash)),
		"https://imgproxy.acdh.oeaw.ac.at",
	),
});

/** Not exposed to the client, and only required once a server is running. */
export const serverRuntime = v.object({
	/**
	 * A matomo auth token with `view` access to the site `NEXT_PUBLIC_APP_MATOMO_ID`, for the visitor numbers at
	 * `/analytics`. Use a dedicated user with view access only, since anything the token can read, the page could show.
	 * Without it, the page says that analytics are not configured.
	 */
	MATOMO_API_TOKEN: v.optional(v.pipe(v.string(), v.nonEmpty())),
	PORT: v.optional(v.pipe(v.string(), v.toNumber(), v.integer(), v.minValue(1))),
	REVALIDATION_WEBHOOK_SECRET: v.optional(v.pipe(v.string(), v.nonEmpty())),
	/**
	 * Serves the search latency benchmark at `/search-benchmark`. Keep disabled in production, except while measuring:
	 * its api route sends uncached searches to typesense on every request.
	 */
	SEARCH_BENCHMARK: v.optional(v.picklist(["disabled", "enabled"]), "disabled"),
	/** Set by vercel in functions, e.g. `fra1`. Reported by the search benchmark. */
	VERCEL_REGION: v.optional(v.pipe(v.string(), v.nonEmpty())),
});

/**
 * Only needed by the scripts in `#/scripts/`, never by the app itself, so these are not part of the validated
 * environment in `./env.config.ts` - a deployed server must not need, nor have, e.g. admin access to the search index.
 */
export const scripts = v.object({
	TYPESENSE_ADMIN_API_KEY: v.pipe(v.string(), v.nonEmpty()),
});
