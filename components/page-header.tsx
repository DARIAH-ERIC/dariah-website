import cn from "clsx/lite";
import { useFormatter, useExtracted as useTranslations } from "next-intl";
import type { ComponentProps, ReactNode } from "react";

import { Breadcrumbs } from "#/components/breadcrumbs.tsx";
import { FeaturedImage } from "#/components/featured-image.tsx";
import { Image } from "#/components/image.tsx";
import {
	Skeleton,
	type SkeletonLines,
	type SkeletonRange,
	SkeletonShape,
	SkeletonText,
	getSkeletonLineCounts,
	skeletonRanges,
} from "#/components/ui/skeleton.tsx";
import type { Image as ApiImage } from "#/lib/api/schemas.ts";
import type { Href } from "#/lib/navigation/href.ts";

type ImageVariant = NonNullable<ComponentProps<typeof FeaturedImage>["variant"]>;

interface PageHeaderProps {
	/** The page's own `href`, for its breadcrumbs. */
	current: Href;
	/** The page which lists the current one, for a page the menu does not list itself - see `Breadcrumbs`. */
	parent?: Href;
	title: string;
	/** A category above the title, e.g. a member's status - set as a card's type label is, not as part of the title. */
	label?: string;
	/**
	 * Shown below the title, for an item dated by when it was published, e.g. a news item. Not read from the item: a
	 * spotlight article or an impact case study carries a `publishedAt` too, but is not dated on its page.
	 */
	publishedAt?: string;
	image: ApiImage | null | undefined;
	/** See `FeaturedImage`: a banner by default, or a `"wide-banner"` for an image with text set in it, e.g. an event's. */
	imageVariant?: ImageVariant;
	/** A brand logo beside the title, e.g. on the page for one of the resource catalogue's sources. */
	logo?: ComponentProps<typeof Image>["src"];
}

/**
 * A content page's or a detail page's breadcrumbs, title and featured image, above its content, which follows in a
 * layout of its own (see `ContentLayout`).
 *
 * The title keeps to the design's 1100px column (`max-inline-title`). The image is a banner which bleeds out of the
 * main area's inset (`-mx-inset`, see `styles/index.css`) to the container's edges, across the related content's column
 * too. The content starts 48px below the header, at every width - as much space as above the image.
 *
 * A logo sits at the end edge, top-aligned with the title, from `lg` up; narrower than that there is no room beside the
 * title, and the title already names what the logo shows. Its box has no height, so a logo taller than a one-line title
 * reaches into the space below the header rather than pushing the content down.
 */
export function PageHeader(props: Readonly<PageHeaderProps>): ReactNode {
	const { current, parent, title, label, publishedAt, image, imageVariant = "banner", logo } = props;

	const format = useFormatter();

	return (
		<div className="pbs-8 pbe-12">
			<Breadcrumbs current={current} label={title} parent={parent} />
			{label != null ? <p className="mbs-14 text-small font-bold text-text-accent uppercase">{label}</p> : null}
			<div className={cn(label != null ? "mbs-2" : "mbs-14", "flex items-start justify-between gap-x-columns")}>
				<h1 className="min-inline-0 max-inline-title text-title-1">{title}</h1>
				{logo != null ? (
					<div className="hidden shrink-0 block-0 lg:block">
						<Image alt="" className="block-22 inline-auto" src={logo} />
					</div>
				) : null}
			</div>
			{publishedAt != null ? (
				<p className="mbs-6 text-caption">
					<time dateTime={publishedAt}>{format.dateTime(new Date(publishedAt), { dateStyle: "long" })}</time>
				</p>
			) : null}
			{image != null ? (
				<div className="-mx-inset mbs-12">
					<FeaturedImage image={image} variant={imageVariant} />
				</div>
			) : null}
		</div>
	);
}

/** The banner's box while its image loads - see `FeaturedImage`. */
/** A title of one line is shorter than the column, as most are; written out in full, for tailwind to find. */
const singleLineTitleClassName: Record<SkeletonRange, string> = {
	base: "max-sm:inline-2/3",
	sm: "sm:max-lg:inline-2/3",
	lg: "lg:inline-2/3",
};

const imagePlaceholderClassName: Record<Exclude<ImageVariant, "default">, string> = {
	banner: "aspect-4/3 sm:aspect-1652/620",
	"wide-banner": "aspect-1652/620",
};

interface PageHeaderSkeletonProps {
	/** The page which lists the current one, whose place in the menu gives the breadcrumbs' trail - see `Breadcrumbs`. */
	parent: Href;
	/** Whether the header has a label, as a member's status is. */
	hasLabel?: boolean;
	/** Whether the page is dated, as a news item is - see `PageHeaderProps["publishedAt"]`. */
	isDated?: boolean;
	/**
	 * How many lines the title is expected to take, at each width if it varies - see `SkeletonText`. An article's title
	 * usually runs to four lines on a phone, three from `sm`, and two from `lg`.
	 */
	titleLines?: SkeletonLines;
	/**
	 * The banner's box, for a page which always leads with a banner. No placeholder otherwise, since most pages do not
	 * show an image in their header.
	 */
	image?: Exclude<ImageVariant, "default">;
	/** A placeholder for the start of the content - by default, the first lines of a lead-in. */
	children?: ReactNode;
	/** What is loading, for a screen reader - by default, a page. */
	label?: string;
	className?: string;
}

/**
 * The same layout as `PageHeader` while a detail page loads, for its suspense fallback: the breadcrumbs' trail up to
 * the parent, which is known without the page, and placeholders for the title and whatever else the page is known to
 * show, followed by one for the start of the content.
 *
 * It is at least as tall as the screen, so the footer stays below the fold until the page arrives, rather than showing
 * below the placeholders and then being pushed away by the content.
 */
export function PageHeaderSkeleton(props: Readonly<PageHeaderSkeletonProps>): ReactNode {
	const { parent, hasLabel = false, isDated = false, titleLines = 1, image, children, label, className } = props;

	const t = useTranslations();

	const titleLineCounts = getSkeletonLineCounts(titleLines);

	return (
		<Skeleton className={cn("min-block-svh", className)} label={label ?? t("Loading page…")}>
			<div className="pbs-8 pbe-12">
				<Breadcrumbs current={parent} label={null} parent={parent} />
				{hasLabel ? <SkeletonText className="mbs-14 inline-24 text-small" /> : null}
				<SkeletonText
					className={cn(
						hasLabel ? "mbs-2" : "mbs-14",
						"text-title-1 max-inline-title",
						...skeletonRanges
							.filter((range) => titleLineCounts[range] === 1)
							.map((range) => singleLineTitleClassName[range]),
					)}
					lines={titleLines}
				/>
				{isDated ? <SkeletonText className="mbs-6 inline-40 text-caption" /> : null}
				{image != null ? (
					<div className="-mx-inset mbs-12">
						<SkeletonShape className={cn("rounded-none inline-full max-block-155", imagePlaceholderClassName[image])} />
					</div>
				) : null}
			</div>
			{children ?? <SkeletonText className="lead-in max-inline-measure pbe-24" lines={4} />}
		</Skeleton>
	);
}
