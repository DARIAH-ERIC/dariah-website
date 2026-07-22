import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";

import { ContentBlocks } from "@/components/content-blocks";
import { Typography } from "@/components/ui/typography/typography";
import type { components } from "@/lib/api/types";

interface ListDescriptionProps {
	title?: string;
	content: components["schemas"]["Page"]["content"];
}

export function ListDescription(props: Readonly<ListDescriptionProps>): ReactNode {
	const { title, content } = props;

	return (
		<div
			className={cn(
				"gap-4 xl:columns-2 xl:gap-x-16 3xl:gap-x-23.5 *:break-inside-avoid *:first:mt-0!",
				"[&>h1:first-child]:pb-12 [&>:is(h2,h3,h4)]:break-after-avoid",
				"[&>h1:first-child]:[column-span:all] [&>*:nth-child(2)]:mt-0!",
			)}
		>
			{title !== undefined && title !== "" && (
				<Typography className="text-h2 font-light" variant="h1">
					{title}
				</Typography>
			)}
			<ContentBlocks fields={content} />
		</div>
	);
}
