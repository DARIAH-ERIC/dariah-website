import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";

import { ContentBlocks } from "@/components/content-blocks";
import type { components } from "@/lib/api/types";

interface ListDescriptionProps {
	content: components["schemas"]["Page"]["content"];
}

export function ListDescription(props: Readonly<ListDescriptionProps>): ReactNode {
	const { content } = props;

	return (
		<div
			className={cn(
				"gap-4 xl:columns-2 xl:gap-x-16 3xl:gap-x-23.5 *:first:mt-0! [&>h2:first-child]:text-h2!",
				"[&>h2:first-child]:font-light! [&>:is(h1,h2):first-child]:pb-12",
				"[&>:is(h1,h2):first-child]:[column-span:all] [&>*:nth-child(2)]:mt-0!",
			)}
		>
			<ContentBlocks fields={content} />
		</div>
	);
}
