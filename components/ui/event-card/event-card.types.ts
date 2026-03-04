export interface EventCardProps {
	title: string;
	localization: string;
	endDate: Date | undefined;
	startDate: Date;
	variant: "list" | "homepage";
	type?: "training" | "conference" | "workshop";
	imageUrl?: string;
}
