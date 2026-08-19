import type { ImageAsset } from "@/lib/images/variants";

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
	image: ImageAsset;
	entity: {
		slug: string;
	};
}
