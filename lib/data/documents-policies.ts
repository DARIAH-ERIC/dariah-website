import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import * as api from "#/lib/api/endpoints.ts";
import type { DocumentOrPolicyAlias, DocumentOrPolicyTree } from "#/lib/api/schemas.ts";

/** Documents and policies as the grouped tree the dashboard orders them in. */
export async function getDocumentsPoliciesTree(): Promise<DocumentOrPolicyTree> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getDocumentsPoliciesTree.cacheTags());

	const result = await api.getDocumentsPoliciesTree.request();

	return result.unwrap().data.data;
}

/**
 * The published entry an alias points to, e.g. the current statutes, or `null` when the alias is not set or its entry
 * has no published version.
 */
export async function getDocumentOrPolicyByAlias(
	key: api.getDocumentOrPolicyByAlias.Params["key"],
): Promise<DocumentOrPolicyAlias | null> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getDocumentOrPolicyByAlias.cacheTags());

	const result = await api.getDocumentOrPolicyByAlias.request({ params: { key } });

	if (result.isErr() && result.error._tag === "HttpError" && result.error.response.status === 404) {
		return null;
	}

	return result.unwrap().data;
}
