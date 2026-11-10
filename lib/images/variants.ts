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

/**
 * How much wider than its box an `object-cover` image is drawn: a source proportionally wider than the box is scaled to
 * the box's height, and the overflow cropped off its sides. `1` for one as wide or narrower, which fills the box's
 * width exactly and is cropped top and bottom instead - and for one whose dimensions the api does not know.
 *
 * Rounded up, so the width a `sizes` scaled by it describes is never short of the drawn one.
 */
export function getCoverScale(
	image: Readonly<{ width: number | null; height: number | null }>,
	boxAspectRatio: number,
): number {
	const { width, height } = image;

	if (width == null || height == null || width <= 0 || height <= 0 || boxAspectRatio <= 0) {
		return 1;
	}

	return Math.max(1, Math.ceil((width / height / boxAspectRatio) * 100) / 100);
}

/**
 * Multiply every slot width in a `sizes` attribute, leaving its media conditions alone - `(min-width: 40rem) 45vw,
 * 90vw` by `2` is `(min-width: 40rem) calc(45vw * 2), calc(90vw * 2)`.
 *
 * Commas and spaces only separate entries, and an entry's condition from its width, outside parentheses: `min(90vw,
 * 104rem)` and `calc(100vw - 3rem)` are each one width. The width is an entry's last such token.
 */
export function scaleSizes(sizes: string, factor: number): string {
	if (factor === 1) {
		return sizes;
	}

	return splitTopLevel(sizes, ",")
		.map((entry) => {
			const tokens = splitTopLevel(entry.trim(), " ").filter((token) => token !== "");
			const length = tokens.pop();

			if (length == null) {
				return entry;
			}

			return [...tokens, `calc(${length} * ${String(factor)})`].join(" ");
		})
		.join(", ");
}

/** Split on a separator wherever it occurs outside parentheses. */
function splitTopLevel(value: string, separator: string): Array<string> {
	const parts: Array<string> = [];
	let depth = 0;
	let start = 0;

	for (let index = 0; index < value.length; index++) {
		const char = value[index];

		if (char === "(") {
			depth++;
		} else if (char === ")") {
			depth = Math.max(0, depth - 1);
		} else if (char === separator && depth === 0) {
			parts.push(value.slice(start, index));
			start = index + 1;
		}
	}

	parts.push(value.slice(start));

	return parts;
}
