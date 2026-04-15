"use client";

import type { ReactNode } from "react";

import { EventCalendarCell } from "@/components/ui/event-calendar/event-calendar-cell";
import { Typography } from "@/components/ui/typography/typography";
import type { CalendarEvent } from "@/types/calendar";
import {
	convertParamToCalendarDate,
	filterEventsForDates,
	getCalendarGrid,
} from "@/utils/event-calendar.utils";
import { useMediaQuery } from "@/utils/hooks/use-media-query";

interface CalendarProps {
	eventsIn?: string;
	events?: Array<CalendarEvent>;
}

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export function EventCalendar(props: Readonly<CalendarProps>): ReactNode {
	const { eventsIn, events } = props;
	const isMd = useMediaQuery("md");
	const selectedDate = convertParamToCalendarDate(eventsIn);
	const calendarGrid = getCalendarGrid(selectedDate);

	const eventsForDates = events && filterEventsForDates(events, calendarGrid);

	return (
		<table aria-label="Events calendar" className="w-full">
			<caption className="size-0 overflow-hidden">{"Events calendar"}</caption>
			<thead>
				<tr>
					{DAYS.map((day) => {
						return (
							<th
								key={day}
								className="bg-accent-100 uppercase w-[14.28%] max-w-[14.28%] h-10.75"
								id={day}
								scope="col"
							>
								<Typography className="font-bold" variant="caption">
									{isMd ? day : day.slice(0, 3)}
								</Typography>
							</th>
						);
					})}
				</tr>
			</thead>
			<tbody>
				{calendarGrid.map((week) => {
					return (
						<tr key={week[0]?.toString()}>
							{week.map((day) => {
								const eventsForDay = eventsForDates?.[day.toString()];
								return (
									<EventCalendarCell
										key={day.toString()}
										dayDateString={day.toString()}
										events={eventsForDay}
										eventsIn={eventsIn}
									/>
								);
							})}
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}
