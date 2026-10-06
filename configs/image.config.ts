/**
 * The widths the api's image-variant endpoint will render - the `w` parameter of `getAssetImage` in the openapi
 * document.
 *
 * The endpoint answers any other width with `400`, so this list also has to be the ladder `next/image` draws its
 * `srcset` candidates from, which is why `images.deviceSizes` and `images.imageSizes` in `next.config.ts` are derived
 * from it rather than left at their defaults - of whose rungs the endpoint would accept only 640, 2048 and 3840.
 */
export const imageVariantWidths = [320, 480, 640, 960, 1280, 1600, 2048, 2560, 3200, 3840] as const;

/** The last rung, named so that clamping does not have to index into the tuple. */
export const maxImageVariantWidth = 3840;

/**
 * Query parameter carrying an image's source width through to the loader.
 *
 * A `next/image` loader is handed only `src`, `width` and `quality`, so anything else it needs in order to decide has
 * to ride along inside the `src`. Stripped again before the url is emitted.
 */
export const sourceWidthParam = "sw";

/**
 * The one quality the built-in optimizer is configured to serve (`images.qualities`).
 *
 * Applies to locally served images only - the variant endpoint takes no quality parameter, and imgproxy decides for
 * itself.
 *
 * Next's own default. The hero is the page's largest contentful paint, and at 90 its webp is about 45% heavier - 353KB
 * against 199KB at the 2048 rung - with no difference visible in the photo, which is busy enough to hide the artefacts.
 * AVIF does worse on it at either quality, and takes 20-40s to encode.
 */
export const imageQuality = 75;
