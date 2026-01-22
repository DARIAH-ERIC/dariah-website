import { cn } from "@acdh-oeaw/style-variants";
import { PentagonIcon } from "lucide-react";
import React, { type ReactNode } from "react";

import { Button } from "@/components/ui/button/button";
import { OpenInNewIcon } from "@/components/ui/icons/open-in-new";
import { WorkingGroupIcon } from "@/components/ui/icons/working-group";
import { Typography } from "@/components/ui/typography/typography";

interface ResourceCardProps {
	serviceType?: "core" | "community";
	resourceCategory: "toolOrService" | "trainingMaterial" | "workflow" | "publication";
	title: string;
	description?: string;
}

const typeConfiguration = {
	toolOrService: {
		border: "border-1 border-primary-300",
		borderLeftColor: "border-l-in-text-link",
		bgColor: "bg-in-text-link",
		text: "tool or service",
	},
	trainingMaterial: {
		border: "border-1 border-accent-300",
		borderLeftColor: "border-l-resource-training-material",
		bgColor: "bg-resource-training-material",
		text: "training material",
	},
	workflow: {
		border: "border-1 border-resource-workflow-border",
		borderLeftColor: "border-l-resource-workflow",
		bgColor: "bg-resource-workflow",
		text: "workflow",
	},
	publication: {
		border: "border-1 border-resource-publication-border",
		borderLeftColor: "border-l-resource-publication",
		bgColor: "bg-resource-publication",
		text: "publication",
	},
};

const serviceConfiguration = {
	core: {
		icon: <PentagonIcon className="size-5" />,
		text: "Core resources",
	},
	community: {
		icon: <WorkingGroupIcon className="size-5" />,
		text: "Community resources",
	},
	empty: {
		icon: null,
		text: null,
	},
};

export function ResourceCard(props: Readonly<ResourceCardProps>): ReactNode {
	const { serviceType, resourceCategory, title, description } = props;

	const { icon: serviceIcon, text: serviceText } = serviceConfiguration[serviceType ?? "empty"];

	const {
		border: resourceTypeBorder,
		borderLeftColor: resourceTypeBorderLeftColor,
		bgColor: resourceTypeBgColor,
		text: resourceTypeText,
	} = typeConfiguration[resourceCategory];

	return (
		<div
			className={cn(
				resourceTypeBorder,
				resourceTypeBorderLeftColor,
				"border-l-6 py-10 pl-6 pr-4 w-226 max-w-full flex gap-6 items-center",
			)}
		>
			<div className="flex flex-col gap-2 max-w-150.25">
				<div className="flex gap-6">
					<div
						className={cn(
							resourceTypeBgColor,
							"px-2 py-0.5 uppercase text-regular text-[12px] text-white",
						)}
					>
						{resourceTypeText}
					</div>
					{serviceType && (
						<div className="flex gap-2 fill-resource-service-text text-resource-service-text items-center">
							{serviceIcon} {serviceText}
						</div>
					)}
				</div>
				<Typography variant="h4">{title}</Typography>
				<Typography variant="regular">{description}</Typography>
			</div>
			<Button endIcon={<OpenInNewIcon className="size-5" />} variant="tertiary">
				{"Go to resource"}
			</Button>
		</div>
	);
}
