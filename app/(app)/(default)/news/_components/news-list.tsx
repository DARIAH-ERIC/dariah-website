import { ChevronRightIcon, NewspaperIcon } from "lucide-react";
import { useFormatter, useExtracted as useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { Fragment, type ReactNode, useId } from "react";

import { Pagination } from "#/app/(app)/(default)/_components/pagination.tsx";
import { AnnouncementType } from "#/components/announcement-type.tsx";
import { ApiImage } from "#/components/api-image.tsx";
import { FeedLink } from "#/components/feed-link.tsx";
import { SubscribeSection } from "#/components/subscribe-section.tsx";
import { Skeleton, SkeletonShape, SkeletonText } from "#/components/ui/skeleton.tsx";
import type { Announcement } from "#/lib/api/schemas.ts";
import { announcementHref } from "#/lib/data/announcements.ts";
import { getNewsPage } from "#/lib/data/news.ts";
import { type Href, href } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";

/** The url of a page of the news list: the first is the list's own. */
function newsPageHref(page: number): Href {
	return page === 1
		? href({ pathname: "/news" })
		: href({ pathname: "/news/page/[page]", params: { page: String(page) } });
}

/**
 * The page's title, below it the list, and the ways to subscribe to the news feed - on every page, under the first
 * page's featured announcement (see `app/(app)/(default)/news/(list)/page.tsx`).
 */
export function NewsListFrame(props: Readonly<{ children: ReactNode }>): ReactNode {
	const { children } = props;

	const t = useTranslations();

	return (
		<Fragment>
			<div className="px-main pbe-16">
				<h1 className="mbs-14 text-title-1">{t("News")}</h1>
				{children}
			</div>
			<SubscribeSection description={t("Follow the latest news, opportunities and funding calls in your feed reader.")}>
				<FeedLink feed="news" />
			</SubscribeSection>
		</Fragment>
	);
}

interface NewsListProps {
	page: number;
}

/**
 * One page of the news list - the announcements feed, news, opportunities and funding calls, rather than news alone
 * (see `newsPageSize`) - each card labelled with its type and linking to its own page.
 */
export async function NewsList(props: Readonly<NewsListProps>): Promise<ReactNode> {
	const news = await getNewsPage(props.page);

	if (news == null) {
		notFound();
	}

	return (
		<section>
			{/**
			 * One column, two from `xl`, where a card is still wide enough for its image and text side by side - with a single
			 * gutter between them up to `2xl`, to leave the text more room.
			 */}
			<ul
				className="mbs-16 grid gap-x-gutter gap-y-12 xl:grid-cols-2 xl:gap-y-16 2xl:gap-x-[calc(2*var(--spacing-gutter))]"
				role="list"
			>
				{news.items.map((item, index) => (
					<li key={item.id}>
						<NewsCard isLead={index === 0 && !news.isFeaturedShown} item={item} />
					</li>
				))}
			</ul>
			<Pagination className="mbs-16" hrefFor={newsPageHref} page={news.page} pages={news.pages} prefetch={true} />
		</section>
	);
}

/**
 * The same list as `NewsList` while a page loads, with a placeholder for each card: a page which was not prerendered,
 * see `app/(app)/(default)/news/(list)/page/[page]/page.tsx`.
 */
export function NewsListSkeleton(): ReactNode {
	const t = useTranslations();

	return (
		<Skeleton
			className="mbs-16 grid gap-x-gutter gap-y-12 xl:grid-cols-2 xl:gap-y-16 2xl:gap-x-[calc(2*var(--spacing-gutter))]"
			label={t("Loading news…")}
		>
			{[0, 1, 2, 3].map((index) => (
				<NewsCard key={index} isLead={false} item={null} />
			))}
		</Skeleton>
	);
}

/**
 * The image and the text side by side from `sm`, in equal halves, the image in the design's 7:4; below `sm` the text
 * follows the image. From `xl` to `2xl`, where the cards are two to a row but the row is not yet wide, the text takes
 * three fifths, so a long title is not squeezed into a narrow column. The summary is clamped, so cards in a row stay
 * close in height; the title is never cut.
 *
 * Without an item, the card is its own loading skeleton: the same boxes, with the "Continue reading" link's text, which
 * does not depend on the item, and placeholders for the image, the type, the date, the title and the summary. The
 * link's text is not a link then.
 */
function NewsCard(props: Readonly<{ item: Announcement | null; isLead: boolean }>): ReactNode {
	const { item, isLead } = props;

	const format = useFormatter();
	const headingId = useId();

	const Root = item != null ? "article" : "div";

	return (
		<Root
			aria-labelledby={item != null ? headingId : undefined}
			className="group relative grid gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-[2fr_3fr] 2xl:grid-cols-2"
		>
			<div className="relative aspect-7/4 self-start overflow-hidden border border-stroke-weak">
				{item != null ? (
					<ApiImage
						alt=""
						className="object-cover transition-transform duration-200 ease-out motion-safe:group-hover:scale-105 motion-safe:group-has-focus-visible:scale-105"
						/**
						 * The first card's image is the page's largest contentful paint when no featured item leads the page:
						 * loaded with the document rather than after layout, as a lazy image would be.
						 */
						fetchPriority={isLead ? "high" : undefined}
						fill={true}
						image={item.image}
						loading={isLead ? "eager" : undefined}
						sizes="(min-width: 120rem) 23rem, (min-width: 96rem) 20vw, (min-width: 80rem) 17vw, (min-width: 40rem) 45vw, 90vw"
					/>
				) : (
					<SkeletonShape className="absolute inset-0 rounded-none" />
				)}
			</div>
			<div className="flex flex-col">
				<p className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
					<span className="flex items-baseline gap-x-2">
						<NewspaperIcon aria-hidden={true} className="size-4 shrink-0 self-center text-icon-accent" />
						{item != null ? (
							<span className="text-small font-bold text-text-accent uppercase">
								<AnnouncementType type={item.type} />
							</span>
						) : (
							<SkeletonText className="inline-12 text-small" />
						)}
					</span>
					{item != null ? (
						<time className="text-caption whitespace-nowrap" dateTime={item.publishedAt}>
							{format.dateTime(new Date(item.publishedAt), { dateStyle: "long" })}
						</time>
					) : (
						<SkeletonText className="inline-32 text-caption" />
					)}
				</p>
				{item != null ? (
					<h2 className="mbs-4 font-heading text-title-5 leading-heading" id={headingId}>
						{item.title}
					</h2>
				) : (
					<SkeletonText className="mbs-4 font-heading text-title-5 leading-heading" lines={2} />
				)}
				{item != null ? (
					<p className="mbs-3 line-clamp-3 text-caption">{item.summary}</p>
				) : (
					<SkeletonText className="mbs-3 text-caption" lines={3} />
				)}
				<div className="mbs-5">
					{item != null ? <ContinueReadingLink headingId={headingId} item={item} /> : <ContinueReadingPlaceholder />}
				</div>
			</div>
		</Root>
	);
}

/** The "Continue reading" link's text in a card's skeleton, where it is not a link. */
function ContinueReadingPlaceholder(): ReactNode {
	const t = useTranslations();

	return (
		<span className="inline-flex items-center gap-2 font-heading font-bold">
			{t("Continue reading")}
			<ChevronRightIcon aria-hidden={true} className="size-4 text-icon-accent" strokeWidth={2.5} />
		</span>
	);
}

interface ContinueReadingLinkProps {
	item: Announcement;
	/** The card's heading, which completes the link's name for a screen reader's list of links. */
	headingId: string;
}

/**
 * As on the landing page's news cards: stretched over its card, so the whole card is the link's target.
 *
 * Named by its own text followed by the card's heading - "Continue reading <title>" - so the name tells the links apart
 * and still starts with what is visible, which voice control users say to activate it (wcag 2.5.3, label in name).
 */
export function ContinueReadingLink(props: Readonly<ContinueReadingLinkProps>): ReactNode {
	const { headingId, item } = props;

	const t = useTranslations();
	const labelId = useId();

	return (
		<Link
			aria-labelledby={`${labelId} ${headingId}`}
			className="inline-flex items-center gap-2 font-heading font-bold underline-offset-6 outline-none after:absolute after:inset-0 decoration-2 hover:text-text-accent hover:underline focus-visible:after:outline-3 focus-visible:after:outline-offset-8 focus-visible:after:outline-focus-outline focus-visible:after:outline-solid"
			href={announcementHref(item)}
			prefetch="intent"
		>
			<span id={labelId}>{t("Continue reading")}</span>
			<ChevronRightIcon aria-hidden={true} className="size-4 text-icon-accent" strokeWidth={2.5} />
		</Link>
	);
}
