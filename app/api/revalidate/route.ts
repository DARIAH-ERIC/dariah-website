import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

import { env } from "@/config/env.config";
import { cacheTags } from "@/lib/data/api-client";

export async function POST(request: NextRequest): Promise<NextResponse> {
	if (env.REVALIDATION_SECRET == null) {
		return new NextResponse(null, { status: 404 });
	}

	const authHeader = request.headers.get("authorization");
	if (authHeader !== `Bearer ${env.REVALIDATION_SECRET}`) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	let tag: string | undefined;
	try {
		const body = (await request.json()) as { tag?: string };
		if (typeof body.tag === "string") {
			tag = body.tag;
		}
	} catch {
		/** No body or invalid JSON - revalidate all tags. */
	}

	const tags = tag != null ? [tag] : Object.values(cacheTags);
	for (const t of tags) {
		revalidateTag(t, {});
	}

	return NextResponse.json({ revalidated: tags, now: Date.now() });
}
