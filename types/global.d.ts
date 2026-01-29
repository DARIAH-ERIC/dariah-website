declare module "*.css";

export interface Event {
	id: string;
	title: string;
	summary: string;
	image: {
		readonly id: string;
		readonly url: string;
		readonly license: {
			id: string;
			name: string;
			url: string;
		};
	};
	slug: string;
	publishedAt: Date;
	startDate: Date;
	endDate: Date | undefined;
	location: string;
}
