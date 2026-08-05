export type AnnouncementType = "funding_calls" | "news" | "opportunities";

export const getFormattedDateForNews = (date: Date): string => {
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date);
};

export const getHrefForAnnouncement = ({
	slug,
	type,
}: {
	slug: string;
	type: AnnouncementType;
}): string => {
	switch (type) {
		case "funding_calls": {
			return `/get-involved/funding-calls/${slug}`;
		}
		case "news": {
			return `/news/${slug}`;
		}
		case "opportunities": {
			return `/get-involved/opportunities/${slug}`;
		}
	}
};
