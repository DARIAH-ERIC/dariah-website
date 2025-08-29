import { createUrl, createUrlSearchParams } from "@acdh-oeaw/lib";

export function createDariahKnowledgeBaseUrl(contentType: string, limit: number): URL {
	return createUrl({
		baseUrl: "https://dariah-unr.acdh-ch-dev.oeaw.ac.at/",
		pathname: `api/v1/${contentType}`,
		searchParams: createUrlSearchParams({ limit }),
	});
}
