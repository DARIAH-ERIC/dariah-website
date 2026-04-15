import {
	CalendarDate,
	DateFormatter,
	endOfMonth,
	getDayOfWeek,
	startOfMonth,
} from "@internationalized/date";

import type { CalendarEvent } from "@/types/calendar";

export const convertDateToCalendarDate = (date: Date): CalendarDate => {
	return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
};

export const convertParamToCalendarDate = (dateParam?: string): CalendarDate => {
	const currentDate = new Date();
	if (dateParam === undefined) return convertDateToCalendarDate(currentDate);

	try {
		const [month, year] = dateParam.split("-").map(Number);

		return new CalendarDate(
			year ?? currentDate.getFullYear(),
			month ?? currentDate.getMonth() + 1,
			1,
		);
	} catch {
		return convertDateToCalendarDate(currentDate);
	}
};

export const getEdgeDates = (
	currentDate: CalendarDate,
): { startDate: CalendarDate; endDate: CalendarDate } => {
	const startDay = startOfMonth(currentDate);
	const endDay = endOfMonth(currentDate);

	const startOffset = getDayOfWeek(startDay, "en-150");
	const startDate = startDay.subtract({ days: startOffset });

	const dayOfWeekEnd = getDayOfWeek(endDay, "en-150");
	const endOffset = 6 - dayOfWeekEnd;

	const endDate = endDay.add({ days: endOffset });

	return { startDate, endDate };
};

export const getCalendarGrid = (currentDate: CalendarDate): Array<Array<CalendarDate>> => {
	const { startDate, endDate } = getEdgeDates(currentDate);
	const days: Array<Array<CalendarDate>> = [];
	let currentPointer = startDate;

	while (currentPointer.compare(endDate) <= 0) {
		const week: Array<CalendarDate> = [];

		// Wewnętrzna pętla zawsze wypełnia dokładnie 7 dni (jeden tydzień)
		for (let i = 0; i < 7; i++) {
			week.push(currentPointer);
			currentPointer = currentPointer.add({ days: 1 });
		}

		days.push(week);
	}

	return days;
};

export const formatDateToMonthYear = (date: CalendarDate): string => {
	return new DateFormatter("en-150", {
		month: "long",
		year: "numeric",
	}).format(date.toDate("UTC"));
};

export const formatToDateParam = (d: CalendarDate): string => {
	return `${String(d.month).padStart(2, "0")}-${d.year.toString()}`;
};

export const filterEventsForDates = (
	events: Array<CalendarEvent>,
	calendarGrid: Array<Array<CalendarDate>>,
): Record<string, Array<CalendarEvent>> => {
	const flattenCalendarGrid = calendarGrid.flat();
	const filteredEventsForDate: Record<string, Array<CalendarEvent>> = {};

	for (const gridDay of flattenCalendarGrid) {
		filteredEventsForDate[gridDay.toString()] ??= [];
		const matchingEvents = events.filter((event) => {
			const calendarStart = convertDateToCalendarDate(event.duration.start);
			const calendarEnd = event.duration.end
				? convertDateToCalendarDate(event.duration.end)
				: flattenCalendarGrid.at(-1);
			return gridDay.compare(calendarStart) >= 0 && gridDay.compare(calendarEnd ?? gridDay) <= 0;
		});
		filteredEventsForDate[gridDay.toString()] = matchingEvents;
	}

	return filteredEventsForDate;
};
