export interface ResourceCardProps {
	serviceType?: "core" | "community";
	resourceCategory: "service" | "training-material" | "workflow" | "publication";
	title: string;
	description?: string;
	resourceUrl?: string;
	variant?: "list" | "by-source";
}
