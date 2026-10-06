import { createSvgOpenGraphImage, getSvgImage } from "#/lib/images/open-graph.tsx";

const prefixes = new Set(["avatars", "documents", "images", "logos"] as const);

function isPrefix(value: string): value is "avatars" | "documents" | "images" | "logos" {
	return prefixes.has(value as never);
}

/**
 * An svg from the api as a png, for `og:image` - crawlers do not render an svg there. `toOpenGraphImage` points here
 * only for an image it found to be an svg; anything else is a `404`, so the route cannot be used to render arbitrary
 * assets. The path mirrors the variant endpoint's, version included, so a replaced asset gets a new url.
 */
export async function GET(
	_request: Request,
	context: RouteContext<"/og-images/[prefix]/[name]/[version]">,
): Promise<Response> {
	const { prefix, name, version } = await context.params;

	if (!isPrefix(prefix) || version !== "v1") {
		return new Response(null, { status: 404 });
	}

	const svg = await getSvgImage({ prefix, name, version });

	if (svg == null) {
		return new Response(null, { status: 404 });
	}

	return createSvgOpenGraphImage(svg);
}
