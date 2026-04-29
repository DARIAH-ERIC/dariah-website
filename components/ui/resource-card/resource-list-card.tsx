import { cn } from "@acdh-oeaw/style-variants";
import { PentagonIcon } from "lucide-react";
import React, { type ReactNode } from "react";

import { Button } from "@/components/ui/button/button";
import { OpenInNewIcon } from "@/components/ui/icons/open-in-new";
import { WorkingGroupIcon } from "@/components/ui/icons/working-group";
import type { ResourceCardProps } from "@/components/ui/resource-card/resource-card.types";
import { Typography } from "@/components/ui/typography/typography";

const typeConfiguration = {
	service: {
		border: "border-1 border-primary-300",
		borderLeftColor: "border-l-in-text-link",
		bgColor: "bg-in-text-link",
		text: "tool or service",
	},
	software: {
		border: "border-1 border-primary-300",
		borderLeftColor: "border-l-in-text-link",
		bgColor: "bg-in-text-link",
		text: "tool or service",
	},
	"training-material": {
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

export function ResourceListCard(props: Readonly<ResourceCardProps>): ReactNode {
	const { serviceType, resourceCategory, title, description, resourceUrl } = props;

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
				"border-l-6 py-10 pl-6 pr-4 max-w-full flex flex-col gap-6 md:items-center md:flex-row",
			)}
		>
			<div className="flex flex-1 flex-col gap-2">
				<div className="flex gap-x-6 gap-y-2 flex-wrap">
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
				<Typography className="text-[18px]" variant="h4">
					{title}
				</Typography>
				<Typography variant="regular">{description}</Typography>
			</div>
			<Button endIcon={<OpenInNewIcon className="size-5" />} href={resourceUrl} variant="tertiary">
				{"Go to resource"}
			</Button>
		</div>
	);
}
