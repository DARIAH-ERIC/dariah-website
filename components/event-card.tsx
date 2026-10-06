import cn from "clsx/lite";
import { MapPinIcon } from "lucide-react";
import { useFormatter, useExtracted as useTranslations } from "next-intl";
import { Fragment, type ReactNode } from "react";

import { Badge } from "#/components/ui/badge.tsx";
import { SkeletonShape, SkeletonText } from "#/components/ui/skeleton.tsx";
import type { EventBase } from "#/lib/api/schemas.ts";
import type { EventStatus } from "#/lib/data/events.ts";
import { href } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";

type EventCardProps = (
	| { event: EventBase; status: EventStatus }
	/** A placeholder while the event loads, see `EventCard`. */
	| { event: null; status?: never }
) & {
	/**
	 * A card on a dark background, like the landing page's gradient: its body lets the background through, tinted as in
	 * the design, a little more while the card is hovered or focused, and its focus outline is drawn in the inverse
	 * colour.
	 */
	isOnDark?: boolean;
	/** The title's heading level, which depends on the section the card is listed in. */
	headingLevel?: "h2" | "h3";
};

/**
 * An event's days in large figures, its status, and below them its title and location.
 *
 * The inline padding is what the card's width leaves beside the widest date on one line ("28–30 September 2026", about
 * 313px), between 24px and the design's 48px, so the card must sit in a size container. A tight shadow around the whole
 * card outlines it. The design also has the body cast a shadow on the bottom of the header, which is left out: at that
 * size it reads as a smudge rather than depth.
 *
 * The title's link stretches over the whole card, above the header, so all of the card is clickable. Its focus outline
 * is drawn by the card itself, as the card's clipping would cut off an outline drawn outside the link's box.
 *
 * Without an event, the card is its own loading skeleton: the same boxes, with placeholders for the days, the status, a
 * title of three lines, and the location, beside its real icon. A placeholder card has no link, so it is neither
 * focusable nor prefetched.
 */
export function EventCard(props: Readonly<EventCardProps>): ReactNode {
	const { event, status, isOnDark = false, headingLevel: Heading = "h3" } = props;

	const t = useTranslations();
	const format = useFormatter();

	const statusLabels: Record<EventStatus, string> = {
		upcoming: t("Upcoming"),
		ongoing: t("Ongoing"),
		past: t("Past"),
	};

	function formatDays(event: EventBase): { days: string; months: string } {
		/** Calendar dates stored as UTC, see `EventBase["duration"]`: formatted in UTC, or the day may shift. */
		const start = new Date(event.duration.start);
		const end = new Date(event.duration.end ?? event.duration.start);
		const day = (date: Date) => format.dateTime(date, { day: "numeric", timeZone: "UTC" });
		const isSameDay = event.duration.start.slice(0, 10) === (event.duration.end ?? event.duration.start).slice(0, 10);
		/**
		 * Collapses a shared year, e.g. "July – August 2026". Ranges across months abbreviate them, e.g. "Jul – Aug 2026",
		 * so the date fits on one line in the card.
		 */
		const isSameMonth = event.duration.start.slice(0, 7) === (event.duration.end ?? event.duration.start).slice(0, 7);

		return {
			days: isSameDay ? day(start) : `${day(start)}–${day(end)}`,
			months: format.dateTimeRange(start, end, {
				month: isSameMonth ? "long" : "short",
				year: "numeric",
				timeZone: "UTC",
			}),
		};
	}

	const dates = event != null ? formatDays(event) : null;
	const Root = event != null ? "article" : "div";

	return (
		<Root
			className={cn(
				"group relative flex flex-col overflow-clip text-text-strong shadow-card-edge [--card-px:clamp(1.5rem,(100cqi-20rem)/2,3rem)] has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-solid",
				isOnDark
					? "bg-background-event/30 has-focus-visible:outline-focus-outline-inverse"
					: "has-focus-visible:outline-focus-outline",
			)}
		>
			<div className="flex flex-col items-start gap-y-4 bg-background-base px-(--card-px) py-8">
				{event != null ? (
					<Fragment>
						<p className="flex flex-wrap content-center items-baseline gap-x-3">
							<span className="font-heading text-figure-4">{dates?.days}</span>
							<span className="text-title-5 font-regular uppercase">{dates?.months}</span>
						</p>
						<Badge tone={status === "past" ? "muted" : "highlight"}>{statusLabels[status]}</Badge>
					</Fragment>
				) : (
					<Fragment>
						<SkeletonText className="inline-3/4 font-heading text-figure-4" />
						<SkeletonShape className="text-badge block-[calc(1lh+--spacing(1))] inline-20" />
					</Fragment>
				)}
			</div>
			<div
				className={cn(
					"flex-1 px-(--card-px) py-8",
					isOnDark
						? "bg-background-base/85 group-hover:bg-background-base/74 group-has-focus-visible:bg-background-base/74"
						: "bg-background-callout",
				)}
			>
				{event != null ? (
					<Heading className="font-body text-body">
						<Link
							className="underline-offset-4 outline-none after:absolute after:inset-0 after:z-20 hover:text-text-accent hover:underline"
							href={href({ pathname: "/events/[slug]", params: { slug: event.entity.slug } })}
							prefetch="intent"
						>
							{event.title}
						</Link>
					</Heading>
				) : (
					<SkeletonText className="text-body" lines={3} />
				)}
				{event == null || event.location.length > 0 ? (
					<p className="mbs-4 flex items-center gap-3 text-body font-light">
						<span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background-base">
							<MapPinIcon aria-hidden={true} className="size-4" />
						</span>
						{event != null ? event.location : <SkeletonText className="inline-1/2" />}
					</p>
				) : null}
			</div>
		</Root>
	);
}
