import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import * as api from "#/lib/api/endpoints.ts";
import type { DocumentOrPolicyTree } from "#/lib/api/schemas.ts";

/** Documents and policies as the grouped tree the dashboard orders them in. */
export async function getDocumentsPoliciesTree(): Promise<DocumentOrPolicyTree> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getDocumentsPoliciesTree.cacheTags());

	const result = await api.getDocumentsPoliciesTree.request();

	return result.unwrap().data.data;
}
