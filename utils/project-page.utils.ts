export const parseDateForProject = (date: Date): string => {
	return new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(date);
};

export const parseDateForProjectDuration = (date: Date): string => {
	return new Intl.DateTimeFormat("pl-PL", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	})
		.format(date)
		.replaceAll(".", "-");
};

export const getTopicFromUrl = (url: string): string | undefined => {
	return url.split("/").at(-1);
};
