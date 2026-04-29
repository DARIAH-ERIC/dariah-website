import { cn } from "@acdh-oeaw/style-variants";
import React, { type ReactNode } from "react";

import { Button } from "@/components/ui/button/button";
import { OpenInNewIcon } from "@/components/ui/icons/open-in-new";
import type { ResourceCardProps } from "@/components/ui/resource-card/resource-card.types";
import { Typography } from "@/components/ui/typography/typography";

const typeConfiguration = {
	service: {
		bgColor: "bg-in-text-link",
		text: "tool or service",
	},
	"training-material": {
		bgColor: "bg-resource-training-material",
		text: "training material",
	},
	workflow: {
		bgColor: "bg-resource-workflow",
		text: "workflow",
	},
	publication: {
		bgColor: "bg-resource-publication",
		text: "publication",
	},
};

export function ResourceBySourceCard(props: Readonly<ResourceCardProps>): ReactNode {
	const { resourceCategory, title, description, resourceUrl } = props;

	const { bgColor: resourceTypeBgColor, text: resourceTypeText } =
		typeConfiguration[resourceCategory];

	return (
		<div
			className={cn(
				"bg-gray-100 rounded-[5px] flex flex-col justify-between p-6 shadow-light",
				"h-103.5 w-82 xl:w-129",
			)}
		>
			<div className="flex flex-1 flex-col gap-5">
				<Typography className="line-clamp-2" variant="h3">
					{title}
				</Typography>
				<div
					className={cn(
						resourceTypeBgColor,
						"px-2 py-0.5 uppercase w-fit text-regular text-[12px] text-white",
					)}
				>
					{resourceTypeText}
				</div>
				<Typography className="line-clamp-6" variant="regular">
					{description}
				</Typography>
			</div>
			<Button
				className="w-full"
				endIcon={<OpenInNewIcon className="size-5" />}
				href={resourceUrl}
				variant="tertiary"
			>
				{"Go to resource"}
			</Button>
		</div>
	);
}
