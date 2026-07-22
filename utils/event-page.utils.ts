import type { DateTimeFormatOptions } from "next-intl";

export const formatDateToRangeString = (date: Date, withMonth = false): string => {
	const options: DateTimeFormatOptions = {
		day: "numeric",
		month: withMonth ? undefined : "short",
	};

	return new Intl.DateTimeFormat("en-GB", options).format(date);
};

export const formatTimePart = (startDate: Date, endDate?: Date): string => {
	const startDateTime = `${startDate.getUTCHours().toString()}:${startDate.getUTCMinutes().toString().padStart(2, "0")}`;

	const endDateTime =
		endDate === undefined
			? endDate
			: `${endDate.getUTCHours().toString()}:${endDate.getUTCMinutes().toString().padStart(2, "0")}`;

	if (startDateTime === endDateTime || endDateTime === undefined) return startDateTime;

	return `${startDateTime} - ${endDateTime}`;
};

const isSameMonth = (startDate: Date, endDate?: Date): boolean => {
	if (endDate === undefined) return false;
	return startDate.getUTCMonth() === endDate.getUTCMonth();
};

export const isSameDate = (startDate: Date, endDate?: Date): boolean => {
	if (endDate === undefined) return true;
	return (
		startDate.getUTCDate() === endDate.getUTCDate() &&
		startDate.getUTCMonth() === endDate.getUTCMonth() &&
		startDate.getUTCFullYear() === endDate.getUTCFullYear()
	);
};

export const parseDateToRangeString = (event: {
	duration: { start: Date; end?: Date };
	isFullDay: boolean;
}): string => {
	const {
		duration: { start, end },
		isFullDay,
	} = event;
	const startDate = start;
	const endDate = end;

	const sameDate = isSameDate(startDate, endDate);

	const startDateString = formatDateToRangeString(
		startDate,
		isSameMonth(startDate, endDate) && !sameDate,
	);

	if (sameDate || endDate === undefined) {
		if (!isFullDay) return `${startDateString} @ ${formatTimePart(startDate, endDate)}`;

		return startDateString;
	}

	const endDateString = formatDateToRangeString(endDate);

	return `${startDateString} - ${endDateString}`;
};

export const getDateParts = (
	date: Date,
): {
	day: string;
	month: string;
	year: string;
} => {
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear().toString();

	return {
		day,
		month,
		year,
	};
};

export const formatDateToInputString = (date: Date): string => {
	const { day, month, year } = getDateParts(date);

	return `${day}-${month}-${year}`;
};

export const formatDateToIso = (date: Date): string => {
	const { day, month, year } = getDateParts(date);

	return `${year}-${month}-${day}`;
};

export const getFormattedDateForEventDetails = (date: Date, isFullDay: boolean): string => {
	const datePart = new Intl.DateTimeFormat("en-GB", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date);

	if (isFullDay) return datePart;

	return `${datePart} @ ${formatTimePart(date)}`;
};

export const getFormattedDateForGoogleCalendar = (date: Date): string | undefined => {
	const isoDate = date.toISOString().replaceAll(/[-:]/g, "").split(".")[0];
	if (isoDate === undefined) return undefined;

	return `${isoDate}Z`;
};
