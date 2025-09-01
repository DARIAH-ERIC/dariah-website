import { request } from "@acdh-oeaw/lib";

import { createDariahKnowledgeBaseUrl } from "@/config/kb.config";
import type { Country, KBApiResponse, WorkingGroup } from "@/types/kb";

export async function getMembersAndPartners() {
	const url = createDariahKnowledgeBaseUrl("countries", 50);
	const response: KBApiResponse<Country> = (await request(url, {})) as KBApiResponse<Country>;
	return response.data;
}

export async function getWorkingGroups() {
	const url = createDariahKnowledgeBaseUrl("working-groups", 50);
	const response: KBApiResponse<WorkingGroup> = (await request(
		url,
		{},
	)) as KBApiResponse<WorkingGroup>;
	return response.data;
}
