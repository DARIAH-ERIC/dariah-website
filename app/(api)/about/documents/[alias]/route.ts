import type * as api from "#/lib/api/endpoints.ts";
import { getDocumentOrPolicyByAlias } from "#/lib/data/documents-policies.ts";

/** The url segment of each stable document url, and the api alias it resolves. */
const aliases: Record<string, api.getDocumentOrPolicyByAlias.Params["key"]> = {
	irp: "internal-rules-of-procedure",
	statutes: "statutes",
};

/**
 * A stable url for the current version of a document, e.g. `/about/documents/statutes`, which editors point to a
 * documents-policies entry in the knowledge base. Temporary, so browsers and search engines do not cache the target,
 * which changes when a new version is published.
 */
export async function GET(_request: Request, context: RouteContext<"/about/documents/[alias]">): Promise<Response> {
	const { alias } = await context.params;

	const key = Object.hasOwn(aliases, alias) ? aliases[alias] : undefined;

	if (key == null) {
		return new Response(null, { status: 404 });
	}

	const entry = await getDocumentOrPolicyByAlias(key);
	const url = entry?.document?.url ?? entry?.link?.url;

	if (url == null) {
		return new Response(null, { status: 404 });
	}

	return Response.redirect(url, 307);
}
