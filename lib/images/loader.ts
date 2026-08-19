import type { ImageLoaderProps } from "next/image";

import { imageQuality, sourceWidthParam } from "@/config/image.config";
import { createImageVariantUrl, isApiImageSrc } from "@/lib/images/variants";

/**
 * The `images.loaderFile` for the whole site.
 *
 * Registering a loader replaces the built-in one everywhere, so this has to serve both kinds of
 * image the site has: renditions from the api's variant endpoint, and the static imports and
 * `/public` files that still belong to the built-in optimizer. Which one a `src` is decides the
 * branch; nothing else about the two paths is shared.
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/components/image#loaderfile}
 */
// eslint-disable-next-line import-x/no-default-export -- next resolves `images.loaderFile` by its default export.
export default function imageLoader(props: Readonly<ImageLoaderProps>): string {
	const { quality, src, width } = props;

	/**
	 * Locally served images keep going through `/_next/image`. The url is assembled by hand because
	 * a custom loader is deliberately not handed the image config — the default loader's own
	 * `basePath`, `path` and `qualities` are not reachable from here, so the two values this app
	 * actually diverges from the defaults on live in `image.config.ts` instead.
	 */
	if (!isApiImageSrc(src)) {
		/**
		 * Except vectors, which the optimizer rejects outright without `dangerouslyAllowSVG` — there
		 * is nothing to resize in one anyway. `Image` marks these `unoptimized`, so in practice they
		 * do not reach here; the guard is what keeps a call site that forgets from emitting a url that
		 * 400s.
		 */
		if (src.split("?", 1)[0]?.endsWith(".svg") === true) {
			return src;
		}

		return `/_next/image?url=${encodeURIComponent(src)}&w=${String(width)}&q=${String(quality ?? imageQuality)}`;
	}

	/**
	 * imgproxy does not enlarge. A candidate wider than the source comes back at the source's size
	 * while its `srcset` descriptor claims otherwise — and the browser, believing the descriptor,
	 * picks it. Clamping collapses every such candidate onto the same url, which the browser then
	 * fetches once.
	 */
	const sourceWidth = Number(new URL(src).searchParams.get(sourceWidthParam));
	const isKnownSourceWidth = Number.isFinite(sourceWidth) && sourceWidth > 0;

	return createImageVariantUrl(src, isKnownSourceWidth ? Math.min(width, sourceWidth) : width);
}
