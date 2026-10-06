import { timingSafeEqual } from "node:crypto";

import { log } from "@acdh-oeaw/lib";
import { revalidateTag } from "next/cache";

import { env } from "#/configs/env.config.ts";
import { parseRevalidationWebhookPayload } from "#/lib/api/cache-tags.ts";

function isAuthorized(request: Request, secret: string): boolean {
	const authorization = request.headers.get("authorization");
	const prefix = "Bearer ";

	if (authorization == null || !authorization.startsWith(prefix)) {
		return false;
	}

	const provided = Buffer.from(authorization.slice(prefix.length));
	const expected = Buffer.from(secret);

	return provided.length === expected.length && timingSafeEqual(provided, expected);
}

/**
 * Revalidation webhook, documented as `webhooks.revalidate` in the knowledge base api's openapi document. The payload
 * carries cache tags, each naming a slice of api data. Cached responses are tagged with the `x-cache-tags` each api
 * operation declares - see `cacheTags()` in `#/lib/api/endpoint.ts` - so nothing here needs to map content types to
 * pages.
 */
export async function POST(request: Request): Promise<Response> {
	const secret = env.REVALIDATION_WEBHOOK_SECRET;

	/** Without a shared secret the webhook cannot be authenticated, so it does not exist. */
	if (secret == null) {
		return new Response(null, { status: 404 });
	}

	if (!isAuthorized(request, secret)) {
		return Response.json({ message: "Unauthorized" }, { status: 401 });
	}

	const payload = parseRevalidationWebhookPayload(await request.json().catch(() => null));

	if (payload == null) {
		return Response.json({ message: "Bad Request" }, { status: 400 });
	}

	log.info("[revalidation webhook] received request", { tags: payload.tags });

	/**
	 * `expire: 0` makes the next request block on a refetch instead of serving the stale entry once. On a low-traffic
	 * site that next visitor is usually the editor who just published, and expects to see the change.
	 */
	for (const tag of payload.tags) {
		revalidateTag(tag, { expire: 0 });
	}

	return Response.json({ revalidated: true, tags: payload.tags });
}
