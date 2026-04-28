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
	dateParam?: CalendarDate,
): { startDate: CalendarDate; endDate: CalendarDate; displayedMonth?: string } => {
	const startDay = startOfMonth(currentDate);
	const endDay = endOfMonth(currentDate);

	const startOffset = getDayOfWeek(startDay, "en-150");
	const startDate = startDay.subtract({ days: startOffset });

	const dayOfWeekEnd = getDayOfWeek(endDay, "en-150");
	const endOffset = 6 - dayOfWeekEnd;

	const endDate = endDay.add({ days: endOffset });

	if (dateParam) {
		if (!checkIfDatesMonthIsEqual(currentDate, dateParam)) {
			const endDayFromDateParam = endOfMonth(dateParam);

			const dayOfWeekEndFromDateParam = getDayOfWeek(endDayFromDateParam, "en-150");
			const endOffsetFromDateParam = 6 - dayOfWeekEndFromDateParam;

			const endDateFromDateParam = endDay.add({ days: endOffsetFromDateParam });
			return {
				startDate: dateParam,
				endDate: endDateFromDateParam,
				displayedMonth: formatToDateParam(dateParam),
			};
		}
		if (dateParam.compare(startDate) > 0) {
			return { startDate: dateParam, endDate };
		}
	}

	return { startDate, endDate };
};

export const getCalendarGrid = (currentDate: CalendarDate): Array<Array<CalendarDate>> => {
	const { startDate, endDate } = getEdgeDates(currentDate);
	const days: Array<Array<CalendarDate>> = [];
	let currentPointer = startDate;

	while (currentPointer.compare(endDate) <= 0) {
		const week: Array<CalendarDate> = [];

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

export const formatToDateParam = (date: CalendarDate): string => {
	return `${String(date.month).padStart(2, "0")}-${date.year.toString()}`;
};

export const formatDateForSelectedDay = (date?: CalendarDate): string => {
	if (!date) return "";
	return new DateFormatter("en-150", { year: "numeric", month: "long", day: "numeric" }).format(
		date.toDate("UTC"),
	);
};

const checkIfDatesMonthIsEqual = (dateA: CalendarDate, dateB: CalendarDate): boolean => {
	return dateA.year === dateB.year && dateA.month === dateB.month;
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
