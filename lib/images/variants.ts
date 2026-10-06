import { imageVariantWidths, maxImageVariantWidth, sourceWidthParam } from "#/configs/image.config.ts";

/**
 * Round a requested width up to a rung the endpoint will accept.
 *
 * With the ladder mirrored into `images.deviceSizes`/`images.imageSizes` this is a no-op for anything `next/image` asks
 * for; it exists so that a rung dropped from one of those lists degrades into a slightly larger image rather than a
 * `400` from the endpoint.
 */
export function toVariantWidth(width: number): number {
	return imageVariantWidths.find((rung) => rung >= width) ?? maxImageVariantWidth;
}

/**
 * The endpoint url for one rendition, with the loader's own bookkeeping stripped back out.
 *
 * Only the loader calls this, and only `ApiImage` hands it a src, so the url is known to be absolute here.
 */
export function createImageVariantUrl(srcUrl: string, width: number): string {
	const url = new URL(srcUrl);

	url.searchParams.delete(sourceWidthParam);
	url.searchParams.set("w", String(toVariantWidth(width)));

	return url.href;
}

/**
 * Append query parameters to a `src` without assuming it is absolute - a fixture's `srcUrl` may be a plain path, which
 * is enough for `next/image` but not for `new URL`.
 */
export function appendSearchParams(srcUrl: string, params: Record<string, string>): string {
	const query = new URLSearchParams(params).toString();

	return srcUrl.includes("?") ? `${srcUrl}&${query}` : `${srcUrl}?${query}`;
}

/**
 * What kind of asset an image is, by the `prefix` segment of the variant endpoint's path - `avatars`, `documents`,
 * `images` or `logos`, as `getAssetImage` enumerates them in the openapi document. `null` for a url which is not one of
 * the endpoint's, or one whose prefix is unknown.
 *
 * Reading it off the url rather than taking it from a caller is what lets a layout decision follow the asset itself: a
 * portrait and an organisation's mark want a different slot from an article's lead image, and every entity carrying one
 * points at the prefix which says which it is.
 */
export function getImageAssetKind(srcUrl: string): "avatars" | "documents" | "images" | "logos" | null {
	const kind = /\/assets\/(?<kind>avatars|documents|images|logos)\//u.exec(srcUrl)?.groups?.kind;

	return kind === "avatars" || kind === "documents" || kind === "images" || kind === "logos" ? kind : null;
}

/**
 * The variant endpoint's path parameters for an image, read back off its `srcUrl` - the prefix, the asset's name and
 * the version. `null` for a url which is not one of the endpoint's, e.g. a fixture's plain path.
 */
export function parseImageAssetUrl(
	srcUrl: string,
): { prefix: NonNullable<ReturnType<typeof getImageAssetKind>>; name: string; version: "v1" } | null {
	const prefix = getImageAssetKind(srcUrl);
	const name = /\/assets\/[^/]+\/(?<name>[^/?#]+)\/image\/v1(?:[?#]|$)/u.exec(srcUrl)?.groups?.name;

	return prefix != null && name != null ? { prefix, name, version: "v1" } : null;
}

/**
 * Whether an api image is an svg, by the media type the api records for it. A vector has no resolution to request
 * renditions against, and no pixel size - only an aspect ratio - so it takes a different path wherever a raster would
 * be scaled.
 */
export function isSvgImage(image: Readonly<{ mimeType: string }>): boolean {
	return image.mimeType === "image/svg+xml";
}
