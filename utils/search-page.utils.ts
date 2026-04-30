export const getFormattedDateForItem = (date: Date): string => {
	const formattedDate = date.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "long",
	});

	const formattedYear = date.getFullYear().toString();

	return `${formattedDate}, ${formattedYear}`;
};
