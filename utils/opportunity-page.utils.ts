import { CalendarDate, getLocalTimeZone, now } from "@internationalized/date";

export const convertDateToCalendarDate = (date: Date): CalendarDate => {
	return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
};

export const getOpportunityStatus = (
	startDate: Date,
	endDate: Date,
): "open" | "closed" | "upcoming" => {
	const startCalendarDate = convertDateToCalendarDate(startDate);
	const endCalendarDate = convertDateToCalendarDate(endDate);

	const currentTime = now(getLocalTimeZone());

	if (currentTime.compare(startCalendarDate) <= 0 && currentTime.compare(endCalendarDate) <= 0)
		return "upcoming";
	if (currentTime.compare(startCalendarDate) >= 0 && currentTime.compare(endCalendarDate) <= 0)
		return "open";

	return "closed";
};

export const getFormattedDateForOpportunity = (date: Date): string => {
	const formattedDate = date.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "long",
	});

	const formattedYear = date.getFullYear().toString();

	return `${formattedDate}, ${formattedYear}`;
};
