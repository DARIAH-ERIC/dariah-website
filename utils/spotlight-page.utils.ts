export const getFormattedDateForCard = (date: Date): string => {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		year: "numeric",
	}).format(date);
};

export const getFormattedDateForDetails = (date: Date): string => {
	return new Intl.DateTimeFormat("en-US", {
		month: "long",
		year: "numeric",
	}).format(date);
};
