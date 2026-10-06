import cn from "clsx/lite";
import type { ReactNode } from "react";

import { ApiImage } from "#/components/api-image.tsx";
import { Caption } from "#/components/caption.tsx";
import type { Image } from "#/lib/api/schemas.ts";
import { getImageAssetKind } from "#/lib/images/variants.ts";

interface FeaturedImageProps {
	/** An entity's `image`, which most entity types leave optional - nothing renders when there is none. */
	image: Image | null | undefined;
	/**
	 * `"banner"` breaks out of the reading column to fill the container, cropped to the design's 1652x620 (the
	 * container's width in a 1920px frame) and never taller than 620px - or, below `sm`, to 4:3, as the mobile design
	 * does: at a phone's width, 1652x620 leaves a strip about 120px tall. A logo takes the same box but is fitted into it
	 * rather than cropped; a portrait keeps its compact slot either way. `"wide-banner"` keeps 1652x620 at every width,
	 * for an image which often has text set in it, e.g. an event's title and dates, which 4:3 cuts apart.
	 */
	variant?: "default" | "banner" | "wide-banner";
	/** `false` for an image placed below the content, which is not the page's largest contentful paint. */
	isPriority?: boolean;
}

/**
 * The image an entity leads with, above its content.
 *
 * Eager and high priority, unlike every image inside the content: this one sits at the top of the page and is therefore
 * its largest contentful paint, so waiting on the lazy-loading heuristic only delays the paint the page is measured by.
 * An image placed further down the page opts out with `isPriority={false}`.
 *
 * `Image` carries a caption of its own, so this renders a `figure` rather than a bare image; an entity whose image is
 * only decoration simply carries no caption, and the `figcaption` disappears with it.
 */
export function FeaturedImage(props: Readonly<FeaturedImageProps>): ReactNode {
	const { image, variant = "default", isPriority = true } = props;

	const loading = isPriority ? ({ fetchPriority: "high", loading: "eager" } as const) : ({ loading: "lazy" } as const);

	if (image == null) {
		return null;
	}

	/**
	 * A portrait and an organisation's mark are not an article's lead image, and the api says which is which through the
	 * prefix it serves the asset under. They get a slot of their own: capped, and aligned to the start rather than
	 * centred, so a person's page reads as a portrait beside its heading instead of a banner.
	 *
	 * The cap is what the slot is actually for. An image is drawn at its natural width here - the endpoint does not
	 * enlarge, so a 270px logo renders at 270px whatever the column does - but an avatar uploaded at 4252px would
	 * otherwise fill the reading column simply because the source is large.
	 */
	const kind = getImageAssetKind(image.srcUrl);
	const isCompact = kind === "avatars" || kind === "logos";

	/**
	 * A logo in a banner keeps the banner's box, so an article led by one lines up with its siblings, but is fitted into
	 * it whole: cropping a mark to 1652x620 cuts it apart. This also gives a vector without dimensions of its own - which
	 * would otherwise be drawn at whatever width its slot happens to have - a box to be sized by.
	 */
	if (variant !== "default" && kind !== "avatars") {
		return (
			<figure>
				<ApiImage
					className={cn(
						"border border-stroke-weak inline-full max-block-155",
						variant === "wide-banner" ? "aspect-1652/620" : "aspect-4/3 sm:aspect-1652/620",
						kind === "logos" ? "object-contain" : "object-cover",
					)}
					{...loading}
					image={image}
					sizes="min(90vw, 104rem)"
				/>
				<Caption content={image.caption} license={image.license} />
			</figure>
		);
	}

	return (
		<figure className={isCompact ? "me-auto max-inline-[min(18rem,100%)]" : undefined}>
			<ApiImage
				className="ms-auto me-auto inline-auto border border-stroke-weak"
				{...loading}
				image={image}
				/**
				 * Drawn at its natural width, capped by the container every caller renders it in - `min(90vw, 104rem)` is close
				 * to the container from `md`, the page's padding being about 5% of it on each side, and below it the padding is
				 * a fixed 1.5rem a side - and a compact one by its 18rem slot.
				 */
				sizes={isCompact ? "18rem" : "(min-width: 48rem) min(90vw, 104rem), calc(100vw - 3rem)"}
			/>
			<Caption content={image.caption} license={image.license} />
		</figure>
	);
}
