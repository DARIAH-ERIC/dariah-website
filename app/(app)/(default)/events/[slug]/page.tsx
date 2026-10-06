import cn from "clsx/lite";
import { CalendarPlusIcon } from "lucide-react";
import type { Metadata } from "next";
import { type DateTimeFormatOptions, useFormatter, useExtracted as useTranslations } from "next-intl";
import { getExtracted as getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Fragment, type ReactNode, Suspense } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import { ContentLayout } from "#/components/content-layout.tsx";
import { EventCard } from "#/components/event-card.tsx";
import { PageHeader, PageHeaderSkeleton } from "#/components/page-header.tsx";
import { SectionErrorBoundary } from "#/components/section-error-boundary.tsx";
import { SkeletonText } from "#/components/ui/skeleton.tsx";
import type { Event, EventBase } from "#/lib/api/schemas.ts";
import { getAdjacentEvents, getEventBySlug, getEventSlugs, getEventStatus, today } from "#/lib/data/events.ts";
import { createMetadata } from "#/lib/metadata.ts";
import { href, serializeHref, unsafeHref } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";

interface EventPageProps extends PageProps<"/events/[slug]"> {}

/**
 * A link's prefetch of this page - see `Link`'s `prefetch="intent"` - is served from static output, never rendered per
 * request. Every slug known at build time is prerendered; for one that is not, the prefetch holds the skeleton.
 */
export const ensureStatic = "prefetch";

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
	const slugs = await getEventSlugs();

	return slugs.map((slug) => {
		return { slug };
	});
}

/**
 * An unknown slug is answered with `notFound()` here as well as in the page: html-limited bots (see `htmlLimitedBots`)
 * get metadata before the response starts, so for them that is a real `404` status, where the page's own call, inside a
 * Suspense boundary, comes too late for anything but a `noindex`.
 */
export async function generateMetadata(props: Readonly<EventPageProps>): Promise<Metadata> {
	const { slug } = await props.params;

	const item = await getEventBySlug(slug);

	if (item == null) {
		notFound();
	}

	return createMetadata({
		href: href({ pathname: "/events/[slug]", params: { slug } }),
		title: item.title,
		description: item.summary,
		image: item.image,
	});
}

/**
 * The event depends on the slug, so it streams in behind its skeleton. The skeleton is the route's app shell, which a
 * link to any event prefetches, so following one shows it at once; a slug known at build time is prerendered whole,
 * except for the adjacent events.
 */
export default function EventPage(props: Readonly<EventPageProps>): ReactNode {
	const t = useTranslations();

	return (
		<Main>
			<Suspense
				fallback={
					<PageHeaderSkeleton
						className="px-main"
						image="wide-banner"
						label={t("Loading event…")}
						parent={href({ pathname: "/events" })}
						titleLines={{ base: 4, sm: 3, lg: 2 }}
					>
						<SkeletonText className="inline-1/2 pbe-24" lines={3} />
					</PageHeaderSkeleton>
				}
			>
				<EventContent params={props.params} />
			</Suspense>
		</Main>
	);
}

/**
 * The title and the image, then the event's facts - when and where it is, which is what a reader comes for - and its
 * content, laid out as every detail page's (see `PageHeader` and `ContentLayout`). The image is a banner which keeps
 * its wide box on a phone too: an event's image often has its title and dates set in it, which 4:3 cuts apart. The
 * events either side of this one close the page, in a band of their own.
 */
async function EventContent(props: Pick<EventPageProps, "params">): Promise<ReactNode> {
	const { slug } = await props.params;

	const t = await getTranslations();
	const item = await getEventBySlug(slug);

	if (item == null) {
		notFound();
	}

	return (
		<Fragment>
			<div className="px-main">
				<PageHeader
					current={href({ pathname: "/events/[slug]", params: { slug } })}
					image={item.image}
					imageVariant="wide-banner"
					parent={href({ pathname: "/events" })}
					title={item.title}
				/>
				<ContentLayout
					related="related-content"
					tableOfContents={false}
					blocks={item.content}
					intro={
						<div className="flex flex-col items-start gap-y-8">
							<EventFacts item={item} />
							<a
								className="inline-flex items-center gap-x-3 border-2 border-stroke-accent bg-background-accent-strong px-6 py-3 font-heading font-bold text-text-inverse hover:bg-background-base hover:text-text-accent focus-visible-outline"
								download={`${slug}.ics`}
								href={serializeHref(unsafeHref(`/events/${encodeURIComponent(slug)}/calendar.ics`, false))}
							>
								<CalendarPlusIcon aria-hidden={true} className="size-5" />
								{t("Add to calendar")}
							</a>
						</div>
					}
				/>
			</div>
			<SectionErrorBoundary isHidden={true}>
				<Suspense fallback={null}>
					<AdjacentEvents event={item} />
				</Suspense>
			</SectionErrorBoundary>
		</Fragment>
	);
}

/**
 * Date, venue and website, each a term beside its value. Dates are UTC standing in for the event's own timezone (see
 * `EventBase["duration"]`), so they are formatted in UTC; a timed event's time is shown as well.
 */
function EventFacts(props: Readonly<{ item: Event }>): ReactNode {
	const { item } = props;

	const t = useTranslations();
	const format = useFormatter();

	const options: DateTimeFormatOptions = item.isFullDay
		? { dateStyle: "long", timeZone: "UTC" }
		: { dateStyle: "long", timeStyle: "short", timeZone: "UTC" };

	const { start, end } = item.duration;

	/** Collapses shared parts, e.g. "7–9 October 2026", and to a single date when a full-day event ends the day it starts. */
	const date =
		end == null ? (
			<time dateTime={start}>{format.dateTime(new Date(start), options)}</time>
		) : (
			format.dateTimeRange(new Date(start), new Date(end), options)
		);

	const facts: Array<{ term: string; value: ReactNode }> = [{ term: t("Date"), value: date }];

	if (item.location.length > 0) {
		facts.push({ term: t("Venue"), value: item.location });
	}

	if (item.website != null) {
		facts.push({
			term: t("Website"),
			value: (
				<Link
					className="break-all font-medium text-text-accent underline hover:no-underline focus-visible-outline"
					href={unsafeHref(item.website, true)}
				>
					{item.website}
				</Link>
			),
		});
	}

	return (
		<dl className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-8 gap-y-3">
			{facts.map((fact) => (
				<div key={fact.term} className="col-span-full grid grid-cols-subgrid">
					<dt className="font-bold text-text-strong">{fact.term}</dt>
					<dd>{fact.value}</dd>
				</div>
			))}
		</dl>
	);
}

/**
 * The events before and after this one, by start, each under its heading: the previous one at the start, the next one
 * at the end, as in the design, in the column's two halves. A missing one leaves its half empty, so the other keeps its
 * side. Their status is relative to today, so they are rendered at request time, after the page's static shell.
 */
async function AdjacentEvents(props: Readonly<{ event: EventBase }>): Promise<ReactNode> {
	const { event } = props;

	const { previous, next } = await getAdjacentEvents(event);

	if (previous == null && next == null) {
		return null;
	}

	await connection();
	const now = today();

	return <AdjacentEventsList next={next} now={now} previous={previous} />;
}

function AdjacentEventsList(
	props: Readonly<{ next: EventBase | null; now: string; previous: EventBase | null }>,
): ReactNode {
	const { next, now, previous } = props;

	const t = useTranslations();

	const items = [
		{ id: "previous", label: t("Previous event"), event: previous, className: "md:col-start-1" },
		{ id: "next", label: t("Next event"), event: next, className: "md:col-start-2" },
	];

	return (
		<div className="border-bs border-stroke-weak bg-background-subtle px-main pbs-12 pbe-16">
			<div className="grid max-inline-title gap-x-columns gap-y-12 md:grid-cols-2">
				{items.map(({ id, label, event, className }) =>
					event != null ? (
						<section key={id} className={cn("@container flex flex-col gap-y-8", className)}>
							<h2 className="text-title-4">{label}</h2>
							<EventCard event={event} status={getEventStatus(event, now)} />
						</section>
					) : null,
				)}
			</div>
		</div>
	);
}
