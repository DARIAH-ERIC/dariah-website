import type { Event } from "@/types/global";

export const sortEventsByMonth = (events: Array<Event>): Record<string, Array<Event>> => {
	const parsedEvents: Record<string, Array<Event>> = {};

	events.sort((a, b) => {
		return a.startDate.getTime() - b.startDate.getTime();
	});

	events.map((event) => {
		const eventDate = new Intl.DateTimeFormat("en-US", {
			month: "long",
			year: "numeric",
		}).format(event.startDate);

		parsedEvents[eventDate] ??= [];

		parsedEvents[eventDate].push(event);
	});

	return parsedEvents;
};

export const parseDateToRangeString = (event: Event): string => {
	const startDate = event.startDate;
	const endDate = event.endDate;

	const startDateString = new Intl.DateTimeFormat("en-US", {
		day: "2-digit",
		month: "short",
	}).format(startDate);

	if (startDate === endDate || endDate === undefined) return startDateString;

	const endDateString = new Intl.DateTimeFormat("en-US", {
		day: "2-digit",
		month: "short",
	}).format(endDate);

	return `${startDateString} - ${endDateString}`;
};

export const formatDateToInputString = (date: Date): string => {
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0"); // 0-based
	const year = date.getFullYear().toString();

	return `${day}-${month}-${year}`;
};

export const formatDateToIso = (date: Date): string => {
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0"); // 0-based
	const year = date.getFullYear().toString();

	return `${year}-${month}-${day}`;
};
