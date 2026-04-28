"use client";

import { cn, styles } from "@acdh-oeaw/style-variants";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import type { ReactNode } from "react";

import { NavLink } from "@/components/ui/link/nav-link";
import { Typography } from "@/components/ui/typography/typography";
import type { CalendarEvent } from "@/types/calendar";
import { convertParamToCalendarDate } from "@/utils/event-calendar.utils";
import { useMediaQuery } from "@/utils/hooks/use-media-query";

interface EventCalendarCellProps {
	dayDateString: string;
	eventsIn?: string;
	handleDaySelection: () => void;
	events?: Array<CalendarEvent>;
}

const eventCalendarCellVariants = styles({
	base: [
		"border w-[14.28%] max-w-[14.28%] border-gray-400 align-top h-16 [&_p]:text-[14px] [&_p]:leading-100% [&_p]:p-1",
		"lg:h-36.5",
	],
	variants: {
		variant: {
			otherMonthEmpty: "opacity-50 [&_p]:bg-gray-200 [&_p]:text-gray-600",
			otherMonthWithEvent: "opacity-50 [&_p]:bg-accent-700 [&_p]:text-white",
			empty: "[&_p]:bg-gray-200 [&_p]:text-gray-600",
			withEvent: "[&_p]:bg-accent-700 [&_p]:text-white",
			currentDay: "[&_p]:bg-accent-600 [&_p]:text-white",
			currentDayWithEvent: "[&_p]:bg-accent-800 [&_p]:text-white",
		},
	},
	defaults: {
		variant: "empty",
	},
});

export function EventCalendarCell(props: Readonly<EventCalendarCellProps>): ReactNode {
	const { dayDateString, eventsIn, events, handleDaySelection } = props;
	const selectedMonth = convertParamToCalendarDate(eventsIn).month;
	const dayDate = parseDate(dayDateString);
	const dayDateMonth = dayDate.month;
	const dayNumber = dayDate.day.toString().padStart(2, "0");

	const hasEvents = events !== undefined && events.length > 0;
	const isCurrentMonth = selectedMonth === dayDateMonth;
	const isCurrentDay = dayDate.compare(today(getLocalTimeZone())) === 0;

	const isLg = useMediaQuery("lg");

	const getVariantForDay = () => {
		if (isCurrentDay) {
			return hasEvents ? "currentDayWithEvent" : "currentDay";
		}
		if (isCurrentMonth) {
			return hasEvents ? "withEvent" : "empty";
		}
		return hasEvents ? "otherMonthWithEvent" : "otherMonthEmpty";
	};

	const dayVariant = getVariantForDay();

	return (
		<td className={eventCalendarCellVariants({ variant: dayVariant })}>
			<Typography
				className={cn(
					"flex items-center gap-2.5 cursor-pointer lg:cursor-default",
					"focus:underline focus:outline-2 focus:outline-primary",
					"h-full lg:h-fit",
				)}
				onClick={() => {
					if (!isLg) handleDaySelection();
				}}
				onKeyDown={(e) => {
					if (!isLg && e.code === "Enter") handleDaySelection();
				}}
				tabIndex={0}
				variant="small"
			>
				{isCurrentDay && <span className="size-2 rounded-full bg-white" />}
				{dayNumber}
			</Typography>
			{events?.map((event) => {
				const eventUrl = `/events/${event.entity.slug}`;
				return (
					<NavLink
						key={event.id}
						className={cn(
							"bg-event-bg-calendar border border-gray-400 text-primary pt-2 px-4 line-clamp-5",
							"hidden lg:flex",
							"hover:underline",
							"focus:underline focus:outline-2 focus:outline-primary",
						)}
						href={eventUrl}
					>
						{event.title}
					</NavLink>
				);
			})}
		</td>
	);
}
