import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { type ReactNode, Suspense } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import { SearchBenchmark } from "#/app/(app)/(default)/search-benchmark/_components/search-benchmark.tsx";
import { env } from "#/configs/env.config.ts";

export const metadata: Metadata = {
	title: "Search benchmark",
	robots: { index: false, follow: false },
};

/**
 * Measures search latency on a real deployment, from the visitor's browser: search through the server (the search pages
 * as built) against the browser querying typesense directly. Only served when `SEARCH_BENCHMARK` is enabled.
 * Deliberately untranslated, as an internal tool.
 *
 * The flag is read per request, since `SEARCH_BENCHMARK` is runtime-only, and the build would otherwise prerender the
 * page with the build's value. The whole page waits for it, so a disabled benchmark is a plain not found page.
 */
export default function SearchBenchmarkPage(): ReactNode {
	return (
		<Suspense fallback={null}>
			<SearchBenchmarkContent />
		</Suspense>
	);
}

async function SearchBenchmarkContent(): Promise<ReactNode> {
	await connection();

	const apiKey = env.NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY;

	if (env.SEARCH_BENCHMARK !== "enabled" || apiKey == null) {
		notFound();
	}

	return (
		<Main className="px-main">
			<h1>Search benchmark</h1>
			<p>
				Compares search through the server - the search pages as deployed, typing into their search form - with the
				browser querying typesense directly. Each query is new, so neither the server&apos;s nor the browser&apos;s
				result cache applies, except in the &quot;cached&quot; row. Run it from the places your visitors are, and copy
				the results.
			</p>
			<SearchBenchmark
				connection={{
					apiKey,
					host: env.NEXT_PUBLIC_TYPESENSE_HOST,
					port: env.NEXT_PUBLIC_TYPESENSE_PORT,
					protocol: env.NEXT_PUBLIC_TYPESENSE_PROTOCOL,
					collections: {
						resources: env.NEXT_PUBLIC_TYPESENSE_COLLECTION_NAME_RESOURCES,
						website: env.NEXT_PUBLIC_TYPESENSE_COLLECTION_NAME_WEBSITE,
					},
				}}
			/>
		</Main>
	);
}
