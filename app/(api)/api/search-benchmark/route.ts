import { type NextRequest, connection } from "next/server";

import { scenarios } from "#/app/(app)/(default)/search-benchmark/scenarios.ts";
import { env } from "#/configs/env.config.ts";
import { createAppSearchService } from "#/lib/data/search.ts";
import type { SearchService } from "#/lib/search/index.ts";

export interface SearchBenchmarkResponse {
	/** Time spent in the function on the search - i.e. the function to typesense round trip plus typesense itself. */
	duration: number;
	region: string | null;
}

/**
 * Its own service without the in-memory result cache, so every request reaches typesense; kept across requests like the
 * app's, so connections are reused the same way.
 */
let service: SearchService | undefined;

/** The server leg of the search benchmark at `/search-benchmark`: times one search from inside the function. */
export async function GET(request: NextRequest): Promise<Response> {
	/**
	 * Runs per request: otherwise the build prerenders the route, which reads the runtime-only `SEARCH_BENCHMARK` - and
	 * would serve the build's answer, a `404`, from then on.
	 */
	await connection();

	if (env.SEARCH_BENCHMARK !== "enabled") {
		return new Response(null, { status: 404 });
	}

	const scenario = scenarios.find((scenario) => scenario.id === request.nextUrl.searchParams.get("scenario"));
	const query = request.nextUrl.searchParams.get("q") ?? "";

	if (scenario == null) {
		return new Response(null, { status: 400 });
	}

	service ??= createAppSearchService({ cacheSearchResultsForSeconds: 0 });

	const start = performance.now();
	const result = await scenario.search(service, query);
	const duration = performance.now() - start;

	if (result.isErr()) {
		return new Response(null, { status: 502 });
	}

	const body: SearchBenchmarkResponse = { duration, region: env.VERCEL_REGION ?? null };

	return Response.json(body, { headers: { "cache-control": "no-store" } });
}
