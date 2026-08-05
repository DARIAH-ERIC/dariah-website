"use client";

import { cn } from "@acdh-oeaw/style-variants";
import { type ReactNode, useEffect, useRef } from "react";

import { ContentBlocks } from "@/components/content-blocks";
import { Typography } from "@/components/ui/typography/typography";
import type { components } from "@/lib/api/types";

interface ListDescriptionProps {
	title?: string;
	content: components["schemas"]["Page"]["content"];
	page?: number;
}

export function ListDescription(props: Readonly<ListDescriptionProps>): ReactNode {
	const { title, content, page = 1 } = props;
	const headingRef = useRef<HTMLHeadingElement | HTMLParagraphElement>(null);

	useEffect(() => {
		if (headingRef.current && page > 1) {
			headingRef.current.focus();
		}
	}, [page]);

	return (
		<div
			className={cn(
				"gap-4 xl:columns-2 xl:gap-x-16 3xl:gap-x-23.5 *:break-inside-avoid *:first:mt-0!",
				"[&>h1:first-child]:pb-12 [&>:is(h2,h3,h4)]:break-after-avoid",
				"[&>h1:first-child]:[column-span:all] [&>*:nth-child(2)]:mt-0!",
			)}
		>
			{title !== undefined && title !== "" && (
				<Typography
					ref={headingRef}
					className="text-h2 font-light"
					tabIndex={page > 1 ? -1 : undefined}
					variant="h1"
				>
					{title}
				</Typography>
			)}
			<ContentBlocks fields={content} />
		</div>
	);
}
