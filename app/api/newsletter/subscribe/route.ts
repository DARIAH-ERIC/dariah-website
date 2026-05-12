import { type NextRequest, NextResponse } from "next/server";

import { env } from "@/config/env.config";
import { client } from "@/lib/data/api-client";

export async function POST(request: NextRequest): Promise<NextResponse> {
	const access_token = env.API_ACCESS_TOKEN;
	if (access_token === undefined) {
		return new NextResponse(null, { status: 404 });
	}

	const body = (await request.json()) as { email?: string };
	const { email } = body;

	if (email == null) {
		return NextResponse.json({ message: "Email is required" }, { status: 400 });
	}

	try {
		const response = await client.newsletters.subscribe({ email });
		return NextResponse.json({ response });
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return NextResponse.json({ message }, { status: 400 });
	}
}
