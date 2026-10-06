import { ChevronRightIcon, NewspaperIcon } from "lucide-react";
import type { Metadata } from "next";
import { useFormatter, useExtracted as useTranslations } from "next-intl";
import { getExtracted as getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { type ReactNode, Suspense, useId } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import { AnnouncementType } from "#/components/announcement-type.tsx";
import { ApiImage } from "#/components/api-image.tsx";
import { Article } from "#/components/article.tsx";
import { PageHeaderSkeleton } from "#/components/page-header.tsx";
import { SectionErrorBoundary } from "#/components/section-error-boundary.tsx";
import { Skeleton, SkeletonShape, SkeletonText } from "#/components/ui/skeleton.tsx";
import type { Announcement } from "#/lib/api/schemas.ts";
import { announcementHref } from "#/lib/data/announcements.ts";
import { getLatestNews, getNewsItemBySlug, getNewsItemSlugs, latestNewsCount } from "#/lib/data/news.ts";
import { createMetadata } from "#/lib/metadata.ts";
import { href } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";

interface NewsItemPageProps extends PageProps<"/news/[slug]"> {}

/**
 * Reference example for a detail route: every published slug is prerendered at build time, a slug published later is
 * served as app shell on first visit and then upgraded.
 */
/**
 * A link's prefetch of this page - see `Link`'s `prefetch="intent"` - is served from static output, never rendered per
 * request. Every slug known at build time is prerendered; for one that is not, the prefetch holds the skeleton.
 */
export const ensureStatic = "prefetch";

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
	const slugs = await getNewsItemSlugs();

	return slugs.map((slug) => {
		return { slug };
	});
}

/**
 * An unknown slug is answered with `notFound()` here as well as in the page: html-limited bots (see `htmlLimitedBots`)
 * get metadata before the response starts, so for them that is a real `404` status, where the page's own call, inside a
 * Suspense boundary, comes too late for anything but a `noindex`.
 */
export async function generateMetadata(props: Readonly<NewsItemPageProps>): Promise<Metadata> {
	const { slug } = await props.params;

	const item = await getNewsItemBySlug(slug);

	if (item == null) {
		notFound();
	}

	return createMetadata({
		href: href({ pathname: "/news/[slug]", params: { slug } }),
		title: item.title,
		description: item.summary,
		image: item.image,
		publishedTime: item.publishedAt,
	});
}

/**
 * The article depends on the slug, so it streams in behind its skeleton. The skeleton is the route's app shell, which a
 * link to any article prefetches, so following one shows it at once; a slug known at build time is prerendered whole.
 *
 * The latest news follow the article in a band of their own, which streams in separately: they are not the article's,
 * and a failure to load them leaves the article whole.
 */
export default function NewsItemPage(props: Readonly<NewsItemPageProps>): ReactNode {
	const t = useTranslations();

	return (
		<Main>
			<Suspense
				fallback={
					<PageHeaderSkeleton
						label={t("Loading article…")}
						className="px-main"
						image="banner"
						isDated={true}
						parent={href({ pathname: "/news" })}
						titleLines={{ base: 4, sm: 3, lg: 2 }}
					/>
				}
			>
				<NewsItem params={props.params} />
			</Suspense>
			<SectionErrorBoundary isHidden={true}>
				<Suspense fallback={<LatestNewsSkeleton />}>
					<LatestNews params={props.params} />
				</Suspense>
			</SectionErrorBoundary>
		</Main>
	);
}

async function NewsItem(props: Pick<NewsItemPageProps, "params">): Promise<ReactNode> {
	const { slug } = await props.params;

	const item = await getNewsItemBySlug(slug);

	if (item == null) {
		notFound();
	}

	return (
		<Article
			current={href({ pathname: "/news/[slug]", params: { slug } })}
			item={item}
			parent={href({ pathname: "/news" })}
			publishedAt={item.publishedAt}
		/>
	);
}

/** The band's grid: one column, two from `sm`, all four in a row from `xl`. */
const latestNewsGridClassName = "mbs-10 grid gap-x-8 sm:grid-cols-2 xl:grid-cols-4 2xl:gap-x-16";

/**
 * Each card spans three rows of the grid - image, title, link - which it shares with the cards beside it, so their
 * titles and links line up however long a title runs. The space between cards is a margin rather than a row gap, which
 * would open between a card's own rows too.
 */
const latestNewsItemClassName = "row-span-3 grid grid-rows-subgrid max-sm:not-first:mbs-12 sm:max-xl:nth-[n+3]:mbs-12";

/**
 * The newest announcements - news, opportunities and funding calls, as on the news list (see `getLatestNews`) - below
 * the article, as the design has them: a band of its own which spans the page, on the subtle background the
 * contributors' band has (see `Article`). The article's own item is left out, so the band only ever points elsewhere.
 */
async function LatestNews(props: Pick<NewsItemPageProps, "params">): Promise<ReactNode> {
	const { slug } = await props.params;

	const t = await getTranslations();

	const items = (await getLatestNews())
		.filter((item) => item.type !== "news" || item.entity.slug !== slug)
		.slice(0, latestNewsCount);

	if (items.length === 0) {
		return null;
	}

	return (
		<LatestNewsFrame title={t("Latest news")}>
			<ul className={latestNewsGridClassName} role="list">
				{items.map((item) => (
					<li key={item.id} className={latestNewsItemClassName}>
						<LatestNewsCard item={item} />
					</li>
				))}
			</ul>
		</LatestNewsFrame>
	);
}

interface LatestNewsFrameProps {
	title: string;
	children: ReactNode;
}

function LatestNewsFrame(props: Readonly<LatestNewsFrameProps>): ReactNode {
	const { title, children } = props;

	const headingId = useId();

	return (
		<section
			aria-labelledby={headingId}
			className="border-bs border-stroke-weak bg-background-subtle px-main pbs-16 pbe-20"
		>
			<h2 className="text-title-1" id={headingId}>
				{title}
			</h2>
			{children}
		</section>
	);
}

/** The same band as `LatestNews` while it loads, with a placeholder for each card. */
function LatestNewsSkeleton(): ReactNode {
	const t = useTranslations();

	return (
		<LatestNewsFrame title={t("Latest news")}>
			<Skeleton className={latestNewsGridClassName} label={t("Loading news…")}>
				{Array.from({ length: latestNewsCount }, (_, index) => (
					<div key={index} className={latestNewsItemClassName}>
						<LatestNewsCard item={null} />
					</div>
				))}
			</Skeleton>
		</LatestNewsFrame>
	);
}

interface LatestNewsCardProps {
	item: Announcement | null;
}

/**
 * The image, with the announcement's type and date in a box at its bottom start corner, as the landing page's news
 * cards have them; then the title and a "Continue reading" link, stretched over the whole card. No summary: the design
 * leaves it out, so four cards fit in a row.
 *
 * Without an item, the card is its own loading skeleton, as the news list's cards are.
 */
function LatestNewsCard(props: Readonly<LatestNewsCardProps>): ReactNode {
	const { item } = props;

	const t = useTranslations();
	const format = useFormatter();
	const headingId = useId();
	const labelId = useId();

	const Root = item != null ? "article" : "div";

	return (
		<Root
			aria-labelledby={item != null ? headingId : undefined}
			className="group relative row-span-3 grid grid-rows-subgrid"
		>
			<div className="relative aspect-3/2 overflow-hidden border border-stroke-weak">
				{item != null ? (
					<ApiImage
						alt=""
						className="object-cover transition-transform duration-200 ease-out motion-safe:group-hover:scale-105 motion-safe:group-has-focus-visible:scale-105"
						fill={true}
						image={item.image}
						sizes="(min-width: 120rem) 23rem, (min-width: 80rem) 22vw, (min-width: 40rem) 45vw, 90vw"
					/>
				) : (
					<SkeletonShape className="absolute inset-0 rounded-none" />
				)}
				<p className="absolute inset-s-0 inset-be-0 flex flex-wrap content-center items-baseline gap-x-3 gap-y-1 bg-background-base px-4 py-3 min-block-12">
					<NewspaperIcon aria-hidden={true} className="size-4 shrink-0 self-center text-icon-accent" />
					{item != null ? (
						<span className="text-small font-bold text-text-accent uppercase">
							<AnnouncementType type={item.type} />
						</span>
					) : (
						<SkeletonText className="inline-12 text-small" />
					)}
					{item != null ? (
						<time className="text-caption whitespace-nowrap" dateTime={item.publishedAt}>
							{format.dateTime(new Date(item.publishedAt), { dateStyle: "long" })}
						</time>
					) : (
						<SkeletonText className="inline-32 text-caption" />
					)}
				</p>
			</div>
			{item != null ? (
				<h3 className="pbs-6 font-heading text-title-4 leading-heading text-balance" id={headingId}>
					{item.title}
				</h3>
			) : (
				<SkeletonText className="mbs-6 font-heading text-title-4 leading-heading" lines={2} />
			)}
			<div className="pbs-6">
				{item != null ? (
					<Link
						aria-labelledby={`${labelId} ${headingId}`}
						className="inline-flex items-center gap-2 font-heading font-bold underline-offset-6 outline-none after:absolute after:inset-0 decoration-2 hover:text-text-accent hover:underline focus-visible:after:outline-3 focus-visible:after:outline-offset-8 focus-visible:after:outline-focus-outline focus-visible:after:outline-solid"
						href={announcementHref(item)}
						prefetch="intent"
					>
						<span id={labelId}>{t("Continue reading")}</span>
						<ChevronRightIcon aria-hidden={true} className="size-4 text-icon-accent" strokeWidth={2.5} />
					</Link>
				) : (
					<span className="inline-flex items-center gap-2 font-heading font-bold">
						{t("Continue reading")}
						<ChevronRightIcon aria-hidden={true} className="size-4 text-icon-accent" strokeWidth={2.5} />
					</span>
				)}
			</div>
		</Root>
	);
}
