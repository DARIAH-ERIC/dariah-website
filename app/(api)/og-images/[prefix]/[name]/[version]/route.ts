import { getSvgOpenGraphImage } from "#/lib/images/open-graph.tsx";

const prefixes = new Set(["avatars", "documents", "images", "logos"] as const);

function isPrefix(value: string): value is "avatars" | "documents" | "images" | "logos" {
	return prefixes.has(value as never);
}

/**
 * An svg from the api as a png, for `og:image` - crawlers do not render an svg there. `toOpenGraphImage` points here
 * only for an image it found to be an svg; anything else is a `404`, so the route cannot be used to render arbitrary
 * assets. The path mirrors the variant endpoint's, version included, so a replaced asset gets a new url - which is why
 * the response can be cached as immutable.
 *
 * A name of `.` or `..` is refused: `encodeURIComponent` leaves dots alone, so it would step out of the asset's path in
 * the upstream url.
 */
export async function GET(
	_request: Request,
	context: RouteContext<"/og-images/[prefix]/[name]/[version]">,
): Promise<Response> {
	const { prefix, name, version } = await context.params;

	if (!isPrefix(prefix) || version !== "v1" || name === "." || name === "..") {
		return new Response(null, { status: 404 });
	}

	const png = await getSvgOpenGraphImage({ prefix, name, version });

	if (png == null) {
		return new Response(null, { status: 404 });
	}

	return new Response(png, {
		headers: {
			"cache-control": "public, immutable, no-transform, max-age=31536000",
			"content-type": "image/png",
		},
	});
}
