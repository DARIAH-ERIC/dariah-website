export interface FundingCall {
	publishedAt: Date;
	duration: {
		start: Date;
		end: Date | undefined;
	};
	id: string;
	title: string;
	summary: string | null;
	entity: {
		slug: string;
	};
}
