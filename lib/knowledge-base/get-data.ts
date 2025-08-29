import { request } from "@acdh-oeaw/lib";

import { createDariahKnowledgeBaseUrl } from "@/config/kb.config";
import type { Country, KBApiResponse } from "@/types/kb";

export async function getMembersAndPartners() {
	const url = createDariahKnowledgeBaseUrl("countries", 50);
	const response: KBApiResponse<Country> = (await request(url, {})) as KBApiResponse<Country>;
	return response.data;
}
