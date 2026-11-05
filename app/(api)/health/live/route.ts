import { connection } from "next/server";

/** Rendered per request, so that a response shows the server is up, rather than being a file from the build. */
export async function GET(): Promise<Response> {
	await connection();

	return Response.json({ status: "ok" });
}
