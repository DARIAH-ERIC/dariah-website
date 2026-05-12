"use server";

import { client } from "@/lib/data/api-client";
import type { ResponseInfo } from "@/lib/utils/request";

export async function subscribeNewsletter(email: string): Promise<ResponseInfo<{ email: string }>> {
	return await client.newsletters.subscribe({ email });
}
