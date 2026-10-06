import { type CalendarDate, endOfMonth, endOfWeek, parseDate, startOfWeek } from "@internationalized/date";
import cn from "clsx/lite";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { Metadata } from "next";
import { useFormatter, useExtracted as useTranslations } from "next-intl";
import { getExtracted as getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { type ReactNode, Suspense } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import { EventsFilter, EventsFilterSkeleton } from "#/app/(app)/(default)/events/_components/events-filter.tsx";
import { SubscribeMenu } from "#/app/(app)/(default)/events/_components/subscribe-menu.tsx";
import { searchParams } from "#/app/(app)/(default)/events/calendar/search-params.ts";
import { searchParams as listSearchParams } from "#/app/(app)/(default)/events/search-params.ts";
import { NoResults } from "#/components/no-results.tsx";
import { PageHeader } from "#/components/page-header.tsx";
import { SubscribeSection } from "#/components/subscribe-section.tsx";
import { Skeleton, SkeletonText } from "#/components/ui/skeleton.tsx";
import type { EventBase } from "#/lib/api/schemas.ts";
import { getEventsInRange, today } from "#/lib/data/events.ts";
import { getCalendarFeedUrl, getFeedHref } from "#/lib/data/feeds.ts";
import { createMetadata } from "#/lib/metadata.ts";
import { href, serializeHref } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";

interface EventsCalendarPageProps extends PageProps<"/events/calendar"> {}

/** Not indexed: the months never run out, and every event is listed on `/events` and in the sitemap as well. */
export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations();

	return createMetadata({
		href: href({ pathname: "/events/calendar" }),
		title: t("Events calendar"),
		description: t("Conferences, workshops, webinars and training events organised by DARIAH-EU and its community."),
		noindex: true,
	});
}

/** Another view of the events list, so it has the list's title and breadcrumbs. */
export default function EventsCalendarPage(props: Readonly<EventsCalendarPageProps>): ReactNode {
	const t = useTranslations();

	return (
		<Main>
			<div className="px-main pbe-16">
				<PageHeader current={href({ pathname: "/events" })} image={null} title={t("Events")} />
				<Suspense fallback={<CalendarResultsSkeleton />}>
					<CalendarResults searchParams={props.searchParams} />
				</Suspense>
			</div>
			<SubscribeSection description={t("Add the events to your calendar, or follow them in a feed reader.")}>
				<SubscribeMenu feedUrl={getCalendarFeedUrl()} rssHref={serializeHref(getFeedHref("events"))} />
			</SubscribeSection>
		</Main>
	);
}

/** Weeks start on Monday, as in the design, whatever the locale's convention. */
const firstDayOfWeek = "mon";

async function CalendarResults(props: Pick<EventsCalendarPageProps, "searchParams">): Promise<ReactNode> {
	const query = searchParams.safeParse(await props.searchParams);

	if (!query.success) {
		notFound();
	}

	await connection();
	const now = today();

	/** The default month is resolved here, outside the cache, so the cached entry is keyed by a concrete month. */
	const month = query.output.month ?? now.slice(0, 7);
	const isCurrentMonth = month === now.slice(0, 7);

	/** The grid spans whole weeks, so it starts and ends with days of the months either side. */
	const first = parseDate(`${month}-01`);
	const gridStart = startOfWeek(first, "en", firstDayOfWeek);
	const gridEnd = endOfWeek(endOfMonth(first), "en", firstDayOfWeek);

	const events = await getEventsInRange(gridStart.toString(), gridEnd.toString());

	/** The list opens at the month's first day; at the current month, today, which is its default, without a param. */
	const listHref = href({
		pathname: "/events",
		searchParams: listSearchParams.encode({
			anchor: isCurrentMonth ? undefined : first.toString(),
			direction: "upcoming",
			page: 1,
		}),
	});

	return (
		<section>
			<EventsFilter
				action="/events/calendar"
				date={isCurrentMonth ? now : first.toString()}
				name="month"
				view="month"
				viewHrefs={{ list: listHref, month: hrefFor(month) }}
			/>
			<div className="xl:px-24">
				<MonthCalendar end={gridEnd} events={events} first={first} now={now} start={gridStart} />
			</div>
		</section>
	);
}

/**
 * The same layout as `CalendarResults` while the month loads: the filter, the month's title and links, and the grid.
 * The weekday names are known without the month, so the grid's header is the real one; its five weeks have a
 * placeholder for each day's number. Below `lg`, where only days with events are listed, a few placeholder days.
 */
function CalendarResultsSkeleton(): ReactNode {
	const t = useTranslations();
	const format = useFormatter();

	/** 1 January 2024 was a Monday, where the grid's weeks start. */
	const weekdays = Array.from({ length: 7 }, (_, index) =>
		format.dateTime(new Date(Date.UTC(2024, 0, 1 + index)), { weekday: "long", timeZone: "UTC" }),
	);

	return (
		<Skeleton label={t("Loading events…")}>
			<EventsFilterSkeleton />
			<div className="xl:px-24">
				<SkeletonText className="inline-56 text-title-3" />
				<div className="mbs-10 flex flex-wrap justify-between gap-4">
					<SkeletonText className="inline-36 font-heading font-bold" />
					<SkeletonText className="inline-36 font-heading font-bold" />
				</div>
				<div className="mbs-10 lg:border lg:border-stroke-weak">
					<div aria-hidden={true} className="hidden grid-cols-7 bg-calendar-weekdays lg:grid">
						{weekdays.map((weekday) => (
							<span key={weekday} className="py-2 text-center text-badge tracking-wide uppercase">
								{weekday}
							</span>
						))}
					</div>
					<div className="hidden grid-cols-7 lg:grid">
						{Array.from({ length: 35 }, (_, index) => (
							<div
								key={index}
								className="border-e border-be border-stroke-weak bg-background-base min-block-28 nth-[7n]:border-e-0"
							>
								<p className="bg-background-muted px-3 py-0.5 text-badge">
									<SkeletonText className="inline-5" />
								</p>
							</div>
						))}
					</div>
					<div className="flex flex-col gap-y-6 lg:hidden">
						{[0, 1, 2].map((index) => (
							<div key={index} className="bg-calendar-day">
								<p className="bg-background-muted px-3 py-1 text-small">
									<SkeletonText className="inline-48" />
								</p>
								<div className="p-3">
									<SkeletonText className="leading-body" lines={2} />
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</Skeleton>
	);
}

function hrefFor(month: string) {
	return href({ pathname: "/events/calendar", searchParams: searchParams.encode({ month }) });
}

function formatMonth(format: ReturnType<typeof useFormatter>, date: CalendarDate): string {
	return format.dateTime(date.toDate("UTC"), { month: "long", year: "numeric", timeZone: "UTC" });
}

interface MonthCalendarProps {
	/** The month's first day. */
	first: CalendarDate;
	/** The grid's first and last day, which fill the month's first and last week. */
	start: CalendarDate;
	end: CalendarDate;
	events: Array<EventBase>;
	/** Today, `YYYY-MM-DD`. */
	now: string;
}

/**
 * The month's title, links to the months either side, and a grid of its weeks, from `lg` up. A day with events has a
 * dark header, and lists them; a multi-day event is listed on each of its days. Today's header is marked with a dot.
 * The days of the months either side are told apart by their month in the day's number, and a header without the muted
 * background, rather than faded: their events are as real, and as much links, as the month's own.
 *
 * Narrower than that, seven columns leave no room for a title, so the grid collapses into a list of the month's days
 * which have events, each labelled with its full date. The weekday header is only drawn for the grid; screen readers
 * get the full date on every day either way.
 */
function MonthCalendar(props: Readonly<MonthCalendarProps>): ReactNode {
	const { first, start, end, events, now } = props;

	const t = useTranslations();
	const format = useFormatter();

	const previous = first.subtract({ months: 1 });
	const next = first.add({ months: 1 });

	const days: Array<CalendarDate> = [];
	for (let day = start; day.compare(end) <= 0; day = day.add({ days: 1 })) {
		days.push(day);
	}

	const month = first.toString().slice(0, 7);

	const eventsByDay = new Map(
		days.map((day) => {
			const date = day.toString();
			return [
				date,
				events.filter(
					(event) =>
						event.duration.start.slice(0, 10) <= date &&
						(event.duration.end ?? event.duration.start).slice(0, 10) >= date,
				),
			];
		}),
	);

	const hasEventsInMonth = days.some(
		(day) => day.toString().startsWith(month) && (eventsByDay.get(day.toString())?.length ?? 0) > 0,
	);

	return (
		<div>
			<h2 className="text-title-3">{formatMonth(format, first)}</h2>
			<nav aria-label={t("Months")} className="mbs-10 flex flex-wrap justify-between gap-4">
				<Link
					className="inline-flex items-center gap-x-3 font-heading font-bold underline-offset-4 hover:underline focus-visible-outline"
					href={hrefFor(previous.toString().slice(0, 7))}
					prefetch={true}
				>
					<ChevronLeftIcon aria-hidden={true} className="size-4 text-icon-accent" strokeWidth={2.5} />
					<span className="sr-only">{t("Previous month:")} </span>
					{formatMonth(format, previous)}
				</Link>
				<Link
					className="inline-flex items-center gap-x-3 font-heading font-bold underline-offset-4 hover:underline focus-visible-outline"
					href={hrefFor(next.toString().slice(0, 7))}
					prefetch={true}
				>
					<span className="sr-only">{t("Next month:")} </span>
					{formatMonth(format, next)}
					<ChevronRightIcon aria-hidden={true} className="size-4 text-icon-accent" strokeWidth={2.5} />
				</Link>
			</nav>
			{!hasEventsInMonth ? <NoResults className="mbs-10 lg:sr-only">{t("No events this month.")}</NoResults> : null}
			<div className="mbs-10 lg:border lg:border-stroke-weak">
				<div aria-hidden={true} className="hidden grid-cols-7 bg-calendar-weekdays lg:grid">
					{days.slice(0, 7).map((day) => (
						<span key={day.toString()} className="py-2 text-center text-badge tracking-wide uppercase">
							{format.dateTime(day.toDate("UTC"), { weekday: "long", timeZone: "UTC" })}
						</span>
					))}
				</div>
				<ol className="flex flex-col gap-y-6 lg:grid lg:grid-cols-7 lg:gap-0" role="list">
					{days.map((day) => {
						const date = day.toString();
						const dayEvents = eventsByDay.get(date) ?? [];
						const isOutside = !date.startsWith(month);
						const isToday = date === now;
						const hasEvents = dayEvents.length > 0;

						return (
							<li
								key={date}
								className={cn(
									"flex flex-col lg:border-e lg:border-be lg:border-stroke-weak lg:min-block-28 lg:nth-[7n]:border-e-0",
									(!hasEvents || isOutside) && "max-lg:hidden",
									hasEvents ? "bg-calendar-day" : "lg:bg-background-base",
								)}
							>
								<p
									className={cn(
										"flex items-center gap-x-2 px-3 py-1 text-small font-bold lg:py-0.5 lg:text-badge",
										hasEvents
											? "bg-calendar-day-header text-text-inverse"
											: isToday
												? "bg-calendar-today text-text-inverse"
												: isOutside
													? "text-text-weak"
													: "bg-background-muted text-text-weak",
									)}
								>
									{isToday ? <span aria-hidden={true} className="size-1.5 rounded-full bg-current" /> : null}
									<time dateTime={date}>
										<span aria-hidden={true} className="max-lg:hidden">
											{isOutside
												? format.dateTime(day.toDate("UTC"), { day: "numeric", month: "short", timeZone: "UTC" })
												: day.day}
										</span>
										<span className="lg:sr-only">
											{format.dateTime(day.toDate("UTC"), {
												weekday: "long",
												day: "numeric",
												month: "long",
												timeZone: "UTC",
											})}
										</span>
									</time>
									{isToday ? <span className="sr-only">({t("today")})</span> : null}
								</p>
								{hasEvents ? (
									<ul className="flex flex-col gap-y-3 px-3 py-3 lg:px-4" role="list">
										{dayEvents.map((event) => (
											<li key={event.id} className="lg:text-small">
												<Link
													className="text-text-accent hyphens-auto underline-offset-4 hover:underline focus-visible-outline"
													href={href({ pathname: "/events/[slug]", params: { slug: event.entity.slug } })}
													prefetch="intent"
												>
													{event.title}
												</Link>
											</li>
										))}
									</ul>
								) : null}
							</li>
						);
					})}
				</ol>
			</div>
		</div>
	);
}
