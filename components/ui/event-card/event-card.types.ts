import type { ImageAsset } from "@/lib/images/variants";

export interface EventCardProps {
	title: string;
	slug: string;
	localization: string;
	endDate: Date | undefined;
	startDate: Date;
	variant: "list" | "homepage";
	type?: "training" | "conference" | "workshop";
	image?: ImageAsset | null;
}
