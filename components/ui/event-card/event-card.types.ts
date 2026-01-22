export interface EventCardProps {
	title: string;
	localization: string;
	endDate: string;
	startDate: string;
	variant: "list" | "homepage";
	type: "training" | "conference" | "workshop";
	status?: "past" | "pending" | "upcoming";
	imageUrl?: string;
}
