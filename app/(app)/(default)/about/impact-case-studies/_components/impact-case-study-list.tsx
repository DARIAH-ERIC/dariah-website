import { groupByToMap } from "@acdh-oeaw/lib";
import cn from "clsx/lite";
import { BookOpenTextIcon } from "lucide-react";
import { useExtracted as useTranslations } from "next-intl";
import { getExtracted as getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Fragment, type ReactNode } from "react";

import { Pagination } from "#/app/(app)/(default)/_components/pagination.tsx";
import { ApiImage } from "#/components/api-image.tsx";
import { Skeleton, SkeletonShape, SkeletonText } from "#/components/ui/skeleton.tsx";
import type { ImpactCaseStudyBase } from "#/lib/api/schemas.ts";
import { getImpactCaseStudiesPage } from "#/lib/data/impact-case-studies.ts";
import { type Href, href } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";

/** The url of a page of the list: the first is the list's own. */
function impactCaseStudiesPageHref(page: number): Href {
	return page === 1
		? href({ pathname: "/about/impact-case-studies" })
		: href({ pathname: "/about/impact-case-studies/page/[page]", params: { page: String(page) } });
}

interface ImpactCaseStudyListProps {
	page: number;
}

/**
 * One page of the case studies, grouped by year; a year whose case studies span two pages is headed on both - see
 * `app/(app)/(default)/about/impact-case-studies/(list)/layout.tsx`.
 */
export async function ImpactCaseStudyList(props: Readonly<ImpactCaseStudyListProps>): Promise<ReactNode> {
	const t = await getTranslations();
	const results = await getImpactCaseStudiesPage(props.page);

	if (results == null) {
		notFound();
	}

	const itemsByYear = groupByYear(results.items);

	return (
		<Fragment>
			{/** 74px from a year's last row of cards to the next year's heading. */}
			<div className="mbs-16 flex flex-col gap-y-18.5">
				{itemsByYear.map(([year, items]) => (
					<section key={year}>
						<h2 className="flex flex-wrap items-baseline gap-x-3 font-heading">
							<span className="text-figure-4 font-light text-text-weak sm:text-figure-3">{year}</span>
							<span className="text-title-3 font-light text-text-strong uppercase sm:text-title-2">
								{t("Case studies")}
							</span>
						</h2>
						{/**
						 * `auto-fill`, so the cards wrap to as many columns as fit, without a breakpoint per count - but no more than the
						 * design's three: a track is never narrower than a third of the row, less its two gaps. The `min(…, 100%)` guard keeps
						 * a track from overflowing a column narrower than its minimum.
						 */}
						<ul
							className="mbs-10 grid grid-cols-[repeat(auto-fill,minmax(max(min(22rem,100%),(100%_-_2.5rem)/3),1fr))] gap-x-5 gap-y-8"
							role="list"
						>
							{items.map((item) => (
								<li key={item.id} className="flex shadow-card">
									<ImpactCaseStudyCard item={item} />
								</li>
							))}
						</ul>
					</section>
				))}
			</div>
			{results.pages > 1 ? (
				<Pagination
					className="mbs-24"
					hrefFor={impactCaseStudiesPageHref}
					page={results.page}
					pages={results.pages}
					prefetch={true}
				/>
			) : null}
		</Fragment>
	);
}

/**
 * The same layout as `ImpactCaseStudyList` while a page loads - a page which was not prerendered, see
 * `app/(app)/(default)/about/impact-case-studies/(list)/page/[page]/page.tsx`: a year's heading, whose "Case studies"
 * does not depend on the list, and a row of placeholder cards.
 */
export function ImpactCaseStudyListSkeleton(): ReactNode {
	const t = useTranslations();

	return (
		<Skeleton className="mbs-16" label={t("Loading case studies…")}>
			<p className="flex flex-wrap items-baseline gap-x-3 font-heading">
				<SkeletonText className="inline-[2.5em] text-figure-4 sm:text-figure-3" />
				<span className="text-title-3 font-light text-text-strong uppercase sm:text-title-2">{t("Case studies")}</span>
			</p>
			<div className="mbs-10 grid grid-cols-[repeat(auto-fill,minmax(max(min(22rem,100%),(100%_-_2.5rem)/3),1fr))] gap-x-5 gap-y-8">
				{[0, 1, 2].map((index) => (
					<div key={index} className="flex shadow-card">
						<ImpactCaseStudyCard item={null} />
					</div>
				))}
			</div>
		</Skeleton>
	);
}

/**
 * A card image's width, close enough: the list fits as many 22rem cards as the container allows, up to three - one
 * below a viewport of about 50rem, two below about 76rem - and the container is about 90% of the viewport, up to
 * 104rem.
 */
const cardImageSizes = "(min-width: 120rem) 34rem, (min-width: 76rem) 30vw, (min-width: 50rem) 45vw, 90vw";

interface ImpactCaseStudyCardProps {
	/** Without a case study, the card is a placeholder while the list loads. */
	item: ImpactCaseStudyBase | null;
}

/**
 * The title's link stretches over the whole card, so its focus outline is drawn on the card's box. The card draws its
 * edge shadow, its list item the soft one (see `--shadow-card` in `styles/index.css`).
 *
 * Without a case study, the card is its own loading skeleton: the same boxes, with the "Case study" label, which does
 * not depend on the case study, and placeholders for the image and a title of three lines.
 */
function ImpactCaseStudyCard(props: Readonly<ImpactCaseStudyCardProps>): ReactNode {
	const { item } = props;

	const t = useTranslations();

	const Root = item != null ? "article" : "div";

	return (
		<Root
			className={cn(
				"group relative flex flex-col bg-background-base shadow-card-edge inline-full",
				item != null && "hover:bg-background-card-hover",
			)}
		>
			{/** Taller on a phone, where a card is narrow and alone in its row. */}
			<div className="relative aspect-4/3 border border-stroke-weak bg-background-base sm:aspect-5/3">
				{item != null ? (
					<ApiImage alt="" className="object-cover" fill={true} image={item.image} sizes={cardImageSizes} />
				) : (
					<SkeletonShape className="absolute inset-0 rounded-none" />
				)}
			</div>
			<div className="flex flex-col gap-y-3 px-4 pbs-5 pbe-8">
				<p className="flex items-center gap-x-3">
					<BookOpenTextIcon aria-hidden={true} className="size-4 shrink-0 text-icon-accent" />
					<span className="text-small font-bold text-text-accent uppercase">{t("Case study")}</span>
				</p>
				<h3 className="font-heading text-title-4 group-hover:text-text-accent">
					{item != null ? (
						<Link
							className="underline-offset-4 outline-none group-hover:underline after:absolute after:inset-0 focus-visible:after:outline-3 focus-visible:after:outline-offset-4 focus-visible:after:outline-focus-outline focus-visible:after:outline-solid"
							href={href({
								pathname: "/about/impact-case-studies/[slug]",
								params: { slug: item.entity.slug },
							})}
							prefetch="intent"
						>
							{item.title}
						</Link>
					) : (
						<SkeletonText lines={3} />
					)}
				</h3>
			</div>
		</Root>
	);
}

/** Groups case studies by publication year, most recent year first. */
function groupByYear(items: Array<ImpactCaseStudyBase>): Array<[number, Array<ImpactCaseStudyBase>]> {
	const groups = groupByToMap(items, (item) => new Date(item.publishedAt).getUTCFullYear());

	// oxlint-disable-next-line unicorn/no-array-sort -- `Array.from` already returns a fresh array
	return Array.from(groups).sort(([a], [b]) => b - a);
}
