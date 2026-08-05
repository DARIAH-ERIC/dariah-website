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
				"gap-4 xl:columns-2 xl:gap-x-16 3xl:gap-x-23.5",
				"[&>h1:first-child]:pb-12 [&>h1:first-child]:[column-span:all]",
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
			<ContentBlocks
				className={cn(
					"break-inside-auto! *:break-inside-avoid *:mt-0!",
					"[&>*:not(:last-child)]:mb-4! [&>*:has(+h2,+h3,+h4)]:mb-6!",
					"[&>:is(h2,h3,h4)]:break-after-avoid",
				)}
				fields={content}
			/>
		</div>
	);
}
