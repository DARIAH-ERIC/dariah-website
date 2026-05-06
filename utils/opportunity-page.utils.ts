import { CalendarDate, getLocalTimeZone, now } from "@internationalized/date";

export const convertDateToCalendarDate = (date: Date): CalendarDate => {
	return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
};

export const checkIfOpportunityIsOpen = (startDate: Date, endDate: Date): boolean => {
	const startCalendarDate = convertDateToCalendarDate(startDate);
	const endCalendarDate = convertDateToCalendarDate(endDate);

	const currentTime = now(getLocalTimeZone());

	return currentTime.compare(startCalendarDate) >= 0 && currentTime.compare(endCalendarDate) <= 0;
};

export const getFormattedDateForOpportunity = (date: Date): string => {
	const formattedDate = date.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "long",
	});

	const formattedYear = date.getFullYear().toString();

	return `${formattedDate}, ${formattedYear}`;
};
