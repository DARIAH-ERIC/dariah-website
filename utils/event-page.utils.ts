export const formatDateToRangeString = (date: Date): string => {
	return new Intl.DateTimeFormat("en-US", {
		day: "2-digit",
		month: "short",
	}).format(date);
};

export const parseDateToRangeString = (event: {
	duration: { start: Date; end?: Date };
}): string => {
	const startDate = event.duration.start;
	const endDate = event.duration.end;

	const startDateString = formatDateToRangeString(startDate);

	if (startDate === endDate || endDate === undefined) return startDateString;

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
