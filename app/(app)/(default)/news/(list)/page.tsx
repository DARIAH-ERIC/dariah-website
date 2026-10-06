import type { Metadata } from "next";
import { useFormatter } from "next-intl";
import { getExtracted as getTranslations } from "next-intl/server";
import { Fragment, type ReactNode, useId } from "react";

import { ContinueReadingLink, NewsList, NewsListFrame } from "#/app/(app)/(default)/news/_components/news-list.tsx";
import { ApiImage } from "#/components/api-image.tsx";
import { SectionErrorBoundary } from "#/components/section-error-boundary.tsx";
import type { Announcement } from "#/lib/api/schemas.ts";
import { getFeaturedNewsItem } from "#/lib/data/news.ts";
import { createMetadata } from "#/lib/metadata.ts";
import { href } from "#/lib/navigation/href.ts";

interface NewsPageProps extends PageProps<"/news"> {}

/**
 * Nothing on this page depends on the request, so it is prerendered whole, and `next build` fails if a change makes any
 * of it render per request.
 */
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations();

	return createMetadata({
		href: href({ pathname: "/news" }),
		title: t("News"),
		description: t("News, announcements and stories from DARIAH-EU and its community across Europe."),
	});
}

/**
 * The first page leads with the featured announcement; the list follows under the page's title. The featured item is
 * not listed again below it (see `getNewsPage`).
 */
export default function NewsPage(_props: Readonly<NewsPageProps>): ReactNode {
	return (
		<Fragment>
			<SectionErrorBoundary isHidden={true}>
				<FeaturedNews />
			</SectionErrorBoundary>
			<NewsListFrame>
				<NewsList page={1} />
			</NewsListFrame>
		</Fragment>
	);
}

async function FeaturedNews(): Promise<ReactNode> {
	const item = await getFeaturedNewsItem();

	if (item == null) {
		return null;
	}

	return (
		<div className="px-main pbs-12 pbe-17">
			<FeaturedNewsCard item={item} />
		</div>
	);
}

/**
 * From `lg`, the text sits in a box which overlaps the image's end edge and is inset from its top and bottom, in the
 * design's proportions (980px of image, 120px of it overlapped, at a 1920px viewport). The image fills its grid row,
 * 456px tall at least, so a long summary makes it taller rather than overflowing it. Below `lg` the text follows the
 * image.
 *
 * The link stretches over the whole card, so its focus outline is drawn on the card's box. The text box is raised over
 * the image with a z-index rather than `relative`, which would make it the stretched link's containing block, leaving
 * the image outside the link.
 */
function FeaturedNewsCard(props: Readonly<{ item: Announcement }>): ReactNode {
	const { item } = props;

	const format = useFormatter();
	const headingId = useId();

	return (
		<article
			aria-labelledby={headingId}
			className="group relative grid lg:grid-cols-[43fr_6fr_39fr] lg:grid-rows-[minmax(28.5rem,auto)]"
		>
			<div className="relative aspect-2/1 overflow-hidden border border-stroke-weak lg:col-[1/3] lg:row-1 lg:aspect-auto">
				<ApiImage
					alt=""
					className="object-cover transition-transform duration-200 ease-out motion-safe:group-hover:scale-105 motion-safe:group-has-focus-visible:scale-105"
					fetchPriority="high"
					fill={true}
					image={item.image}
					loading="eager"
					sizes="(min-width: 120rem) 57rem, (min-width: 64rem) 55vw, 90vw"
				/>
			</div>
			<div className="z-1 flex flex-col gap-y-5 bg-background-base pbs-8 lg:col-[2/4] lg:row-1 lg:self-center lg:px-7 lg:py-8 lg:my-14">
				<time className="text-caption" dateTime={item.publishedAt}>
					{format.dateTime(new Date(item.publishedAt), { dateStyle: "long" })}
				</time>
				<h2 className="font-heading text-title-3 leading-heading text-balance" id={headingId}>
					{item.title}
				</h2>
				<p className="line-clamp-5 leading-reading">{item.summary}</p>
				<ContinueReadingLink headingId={headingId} item={item} />
			</div>
		</article>
	);
}
