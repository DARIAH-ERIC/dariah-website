import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";

import { DashedArrowIcon } from "@/components/ui/icons/dashed-arrow";
import { Tag } from "@/components/ui/tag/tag";

interface GovernanceBodyRelationArrowProps {
	direction: "left" | "right" | "down";
	text: string;
}

export function GovernanceBodyRelationArrow(
	props: Readonly<GovernanceBodyRelationArrowProps>,
): ReactNode {
	const { direction, text } = props;

	return (
		<div
			className={cn(
				"flex items-center",
				direction === "down" && "flex-col-reverse h-21 justify-center",
				direction === "right" && "flex-row-reverse",
			)}
		>
			<DashedArrowIcon
				className={cn(
					"fill-gray-700",
					direction === "down" && "-rotate-90 h-8.75",
					direction === "right" && "rotate-180",
				)}
			/>
			<Tag text={text} variant="past" />
			<div
				className={cn("border border-dashed border-gray-700", direction === "down" ? "h-6" : "w-4")}
			/>
		</div>
	);
}
