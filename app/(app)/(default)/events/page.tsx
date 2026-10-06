import cn from "clsx/lite";
import { ChevronLeftIcon, ChevronRightIcon, MapPinIcon } from "lucide-react";
import type { Metadata } from "next";
import { useFormatter, useExtracted as useTranslations } from "next-intl";
import { getExtracted as getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { type ReactNode, Suspense, useId } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import { EventsFilter, EventsFilterSkeleton } from "#/app/(app)/(default)/events/_components/events-filter.tsx";
import { SubscribeMenu } from "#/app/(app)/(default)/events/_components/subscribe-menu.tsx";
import { searchParams as calendarSearchParams } from "#/app/(app)/(default)/events/calendar/search-params.ts";
import { searchParams } from "#/app/(app)/(default)/events/search-params.ts";
import { ApiImage } from "#/components/api-image.tsx";
import { NoResults } from "#/components/no-results.tsx";
import { PageHeader } from "#/components/page-header.tsx";
import { SubscribeSection } from "#/components/subscribe-section.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import { Skeleton, SkeletonShape, SkeletonText } from "#/components/ui/skeleton.tsx";
import type { EventBase } from "#/lib/api/schemas.ts";
import {
	type EventStatus,
	type EventsDirection,
	type EventsPage,
	getEventStatus,
	getEventsPage,
	today,
} from "#/lib/data/events.ts";
import { getCalendarFeedUrl, getFeedHref } from "#/lib/data/feeds.ts";
import { createMetadata } from "#/lib/metadata.ts";
import { type Href, href, serializeHref } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";

interface EventsPageProps extends PageProps<"/events"> {}

/**
 * Each page in either direction is its own canonical url, counted from today: an explicit `anchor` is left out, since
 * the default moves with the date and every anchored url would otherwise be one more for a crawler to index. A
 * malformed or out-of-range page is answered with `notFound()` here as well, so html-limited bots get a real `404`
 * status - see `news/page.tsx`.
 */
export async function generateMetadata(props: Readonly<EventsPageProps>): Promise<Metadata> {
	const t = await getTranslations();
	const query = searchParams.safeParse(await props.searchParams);

	if (!query.success) {
		notFound();
	}

	await connection();
	const { anchor = today(), direction, page } = query.output;

	if ((await getEventsPage({ anchor, direction, page })) == null) {
		notFound();
	}

	return createMetadata({
		href: href({ pathname: "/events", searchParams: searchParams.encode({ ...query.output, anchor: undefined }) }),
		title: t("Events"),
		description: t("Conferences, workshops, webinars and training events organised by DARIAH-EU and its community."),
	});
}

export default function EventsPage(props: Readonly<EventsPageProps>): ReactNode {
	const t = useTranslations();

	return (
		<Main>
			<div className="px-main pbe-16">
				<PageHeader current={href({ pathname: "/events" })} image={null} title={t("Events")} />
				<Suspense fallback={<EventsResultsSkeleton />}>
					<EventsResults searchParams={props.searchParams} />
				</Suspense>
			</div>
			<SubscribeSection description={t("Add the events to your calendar, or follow them in a feed reader.")}>
				<SubscribeMenu feedUrl={getCalendarFeedUrl()} rssHref={serializeHref(getFeedHref("events"))} />
			</SubscribeSection>
		</Main>
	);
}

async function EventsResults(props: Pick<EventsPageProps, "searchParams">): Promise<ReactNode> {
	const query = searchParams.safeParse(await props.searchParams);

	if (!query.success) {
		notFound();
	}

	const t = await getTranslations();

	await connection();
	const now = today();

	/** The default anchor is resolved here, outside the cache, so the cached entry is keyed by a concrete date. */
	const anchor = query.output.anchor ?? now;
	const { direction, page } = query.output;

	const list = await getEventsPage({ anchor, direction, page });

	if (list == null) {
		notFound();
	}

	/** The calendar opens at the anchor's month; at the current one, which is its default, without a param. */
	const month = anchor.slice(0, 7);
	const calendarHref = href({
		pathname: "/events/calendar",
		searchParams: calendarSearchParams.encode({ month: month === now.slice(0, 7) ? undefined : month }),
	});

	const { previous, next } = getPaginationHrefs(list);

	return (
		<section>
			<EventsFilter
				action="/events"
				date={anchor}
				name="anchor"
				view="list"
				viewHrefs={{
					list: href({
						pathname: "/events",
						searchParams: searchParams.encode({ anchor: query.output.anchor, direction: "upcoming", page: 1 }),
					}),
					month: calendarHref,
				}}
			/>
			<div className="xl:px-24">
				<EventsTimeline direction={list.direction} events={list.items} now={now} />
				{previous != null || next != null ? (
					<nav aria-label={t("Pagination")} className="mbs-12 flex flex-wrap gap-4">
						{previous != null ? (
							<PaginationLink direction="previous" href={previous}>
								{t("See previous events")}
							</PaginationLink>
						) : null}
						{next != null ? (
							<PaginationLink direction="next" href={next}>
								{t("See next events")}
							</PaginationLink>
						) : null}
					</nav>
				) : null}
			</div>
		</section>
	);
}

/**
 * The same layout as `EventsResults`: the filter's fields, and one month of the timeline with a placeholder for each
 * event.
 */
function EventsResultsSkeleton(): ReactNode {
	const t = useTranslations();

	return (
		<Skeleton label={t("Loading events…")}>
			<EventsFilterSkeleton />
			<div className="xl:px-24">
				<div className="border-s-2 border-dashed border-stroke-weak ps-5 sm:ps-6">
					<SkeletonText className="inline-48 text-title-3" />
					<div className="mbs-8 flex flex-col gap-y-8">
						{[0, 1, 2].map((index) => (
							<EventItem key={index} event={null} />
						))}
					</div>
				</div>
			</div>
		</Skeleton>
	);
}

/**
 * Previous/next links walk the timeline as one sequence: `past` pages count away from the anchor backwards, `upcoming`
 * pages forwards, and page 1 of either side links across the anchor to page 1 of the other, when it has any events.
 */
function getPaginationHrefs(list: EventsPage): { previous: Href | null; next: Href | null } {
	const { anchor, direction, page, pages, hasOpposite } = list;

	function hrefFor(direction: EventsDirection, page: number) {
		return href({ pathname: "/events", searchParams: searchParams.encode({ anchor, direction, page }) });
	}

	if (direction === "upcoming") {
		return {
			previous: page > 1 ? hrefFor("upcoming", page - 1) : hasOpposite ? hrefFor("past", 1) : null,
			next: page < pages ? hrefFor("upcoming", page + 1) : null,
		};
	}

	return {
		previous: page < pages ? hrefFor("past", page + 1) : null,
		next: page > 1 ? hrefFor("past", page - 1) : hasOpposite ? hrefFor("upcoming", 1) : null,
	};
}

function PaginationLink(
	props: Readonly<{ children: ReactNode; direction: "previous" | "next"; href: Href }>,
): ReactNode {
	const { children, direction, href } = props;

	const Icon = direction === "previous" ? ChevronLeftIcon : ChevronRightIcon;

	return (
		<Link
			className={cn(
				"inline-flex items-center gap-x-3 font-heading font-bold underline-offset-4 focus-visible-outline hover:underline",
				direction === "next" && "ms-auto flex-row-reverse",
			)}
			href={href}
			prefetch={true}
		>
			<Icon aria-hidden={true} className="size-4 text-icon-accent" strokeWidth={2.5} />
			{children}
		</Link>
	);
}

/**
 * The events grouped by the month they start in, along a dashed line with a dot for each event. The events are in
 * chronological order (see `EventsPage`), so a month's events are always adjacent. Without any, a message instead; the
 * pagination below it links to the events on the other side of the date, if there are any.
 */
function EventsTimeline(
	props: Readonly<{ direction: EventsDirection; events: Array<EventBase>; now: string }>,
): ReactNode {
	const { direction, events, now } = props;

	const t = useTranslations();
	const format = useFormatter();

	if (events.length === 0) {
		return (
			<NoResults>
				{direction === "upcoming"
					? t("There are no events on or after this date.")
					: t("There are no events before this date.")}
			</NoResults>
		);
	}

	const months = new Map<string, Array<EventBase>>();
	for (const event of events) {
		const month = event.duration.start.slice(0, 7);
		const group = months.get(month);
		if (group != null) {
			group.push(event);
		} else {
			months.set(month, [event]);
		}
	}

	return (
		<ol className="border-s-2 border-dashed border-stroke-weak ps-5 sm:ps-6" role="list">
			{Array.from(months, ([month, events]) => (
				<li key={month} className="pbe-12 last:pbe-0">
					<h2 className="text-title-3">
						{format.dateTime(new Date(`${month}-01`), { month: "long", year: "numeric", timeZone: "UTC" })}
					</h2>
					<ol className="mbs-8 flex flex-col gap-y-8" role="list">
						{events.map((event) => (
							<li key={event.id}>
								<EventItem event={event} now={now} />
							</li>
						))}
					</ol>
				</li>
			))}
		</ol>
	);
}

/**
 * The event's days beside its card, which holds the status, the title, the location and the image. The dot sits on the
 * timeline's line, level with the days. Below `sm` the days sit above the card, and the card has no image.
 *
 * The title's link stretches over the whole card, so its focus outline is drawn on the card's box.
 */
function EventItem(props: Readonly<{ event: EventBase; now: string } | { event: null; now?: never }>): ReactNode {
	const { event, now } = props;

	const t = useTranslations();
	const format = useFormatter();
	const headingId = useId();

	const statusLabels: Record<EventStatus, string> = {
		upcoming: t("Upcoming"),
		ongoing: t("Ongoing"),
		past: t("Past"),
	};

	if (event == null) {
		return (
			<div className="relative grid gap-x-6 gap-y-3 sm:grid-cols-[9rem_minmax(0,1fr)]">
				<span
					aria-hidden={true}
					className="absolute inset-bs-1.5 -inset-s-[calc(--spacing(5)+5px)] size-2 rounded-full bg-stroke-weak sm:-inset-s-[calc(--spacing(6)+5px)]"
				/>
				<SkeletonText className="inline-24 font-medium" />
				<div className="relative flex gap-x-8 bg-background-subtle p-5 shadow-card-edge">
					<div className="flex min-inline-0 flex-1 flex-col items-start gap-y-3">
						<SkeletonShape className="text-badge block-[calc(1lh+--spacing(1))] inline-20" />
						<SkeletonText className="self-stretch font-heading text-title-5 leading-heading" lines={2} />
						<SkeletonText className="mbs-auto inline-1/2 pbs-6" />
					</div>
					<SkeletonShape className="relative hidden aspect-2/1 inline-80 shrink-0 self-center md:block" />
				</div>
			</div>
		);
	}

	const status = getEventStatus(event, now);

	/** Calendar dates stored as UTC, see `EventBase["duration"]`: formatted in UTC, or the day may shift. */
	const start = new Date(event.duration.start);
	const end = new Date(event.duration.end ?? event.duration.start);

	return (
		<article aria-labelledby={headingId} className="relative grid gap-x-6 gap-y-3 sm:grid-cols-[9rem_minmax(0,1fr)]">
			<span
				aria-hidden={true}
				className="absolute inset-bs-1.5 -inset-s-[calc(--spacing(5)+5px)] size-2 rounded-full bg-stroke-weak sm:-inset-s-[calc(--spacing(6)+5px)]"
			/>
			<p className="font-medium uppercase">
				<time dateTime={event.duration.start}>
					{format.dateTimeRange(start, end, { day: "numeric", month: "short", timeZone: "UTC" })}
				</time>
			</p>
			<div className="group relative flex gap-x-8 bg-background-subtle p-5 shadow-card-edge hover:bg-background-card-hover">
				<div className="flex min-inline-0 flex-1 flex-col items-start gap-y-3">
					<Badge tone={status === "past" ? "muted" : "highlight"}>{statusLabels[status]}</Badge>
					<h3 className="font-heading text-title-5 leading-heading group-hover:text-text-accent" id={headingId}>
						<Link
							className="underline-offset-4 outline-none after:absolute after:inset-0 hover:underline focus-visible:after:outline-3 focus-visible:after:outline-offset-2 focus-visible:after:outline-focus-outline focus-visible:after:outline-solid"
							href={href({ pathname: "/events/[slug]", params: { slug: event.entity.slug } })}
							prefetch="intent"
						>
							{event.title}
						</Link>
					</h3>
					{event.location.length > 0 ? (
						<p className="mbs-auto flex items-center gap-x-3 pbs-6">
							<MapPinIcon aria-hidden={true} className="size-5 shrink-0" />
							{event.location}
						</p>
					) : null}
				</div>
				{/* Positioned, so it would paint above the link's overlay and catch its clicks. */}
				<div className="pointer-events-none relative hidden aspect-2/1 inline-80 shrink-0 self-center md:block">
					<ApiImage alt="" className="object-cover" fill={true} image={event.image} sizes="20rem" />
				</div>
			</div>
		</article>
	);
}
