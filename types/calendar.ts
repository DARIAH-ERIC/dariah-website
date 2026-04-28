export interface CalendarEvent {
	publishedAt: Date;
	duration: {
		start: Date;
		end: Date | undefined;
	};
	id: string;
	title: string;
	summary: string;
	location: string;
	isFullDay: boolean;
	image: {
		url: string;
	};
	entity: {
		slug: string;
	};
}
