"use client";

import type { CalendarDate } from "@internationalized/date";
import { useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";

import { EventCalendarCell } from "@/components/ui/event-calendar/event-calendar-cell";
import { EventCard } from "@/components/ui/event-card/event-card";
import { Typography } from "@/components/ui/typography/typography";
import type { CalendarEvent } from "@/types/calendar";
import {
	convertParamToCalendarDate,
	filterEventsForDates,
	formatDateForSelectedDay,
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

	const t = useTranslations("EventsCalendar");

	const [selectedDayPreview, setSelectedDayPreview] = useState<CalendarDate | undefined>(undefined);
	const [selectedDayEvents, setSelectedDayEvents] = useState<Array<CalendarEvent> | undefined>(
		undefined,
	);

	const isMd = useMediaQuery("md");
	const selectedDate = convertParamToCalendarDate(eventsIn);
	const calendarGrid = getCalendarGrid(selectedDate);

	const eventsForDates = events && filterEventsForDates(events, calendarGrid);

	const handleDaySelection = (selectedDay: CalendarDate, events?: Array<CalendarEvent>) => {
		setSelectedDayPreview(selectedDay);
		setSelectedDayEvents(events);
	};

	return (
		<div className="flex flex-col gap-8 w-full">
			<table aria-label={t("title")} className="w-full">
				<caption className="size-0 overflow-hidden">{t("title")}</caption>
				<thead className="w-full">
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
											handleDaySelection={() => {
												handleDaySelection(day, eventsForDay);
											}}
										/>
									);
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
			<div className="flex flex-col gap-4 items-center lg:hidden">
				{selectedDayEvents && selectedDayEvents.length > 0 && (
					<>
						<Typography className="w-full text-left" variant="h5">
							{t("eventsFor", { dateString: formatDateForSelectedDay(selectedDayPreview) })}
						</Typography>
						{selectedDayEvents.map((event) => {
							const {
								id,
								title,
								entity: { slug },
								duration: { end, start },
								location,
								image: { url: imageUrl },
							} = event;
							return (
								<EventCard
									key={id}
									endDate={end}
									imageUrl={imageUrl}
									localization={location}
									slug={slug}
									startDate={start}
									title={title}
									variant="list"
								/>
							);
						})}
					</>
				)}
			</div>
		</div>
	);
}
