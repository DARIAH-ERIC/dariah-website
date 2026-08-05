"use client";

import { type ReactNode, useEffect, useRef } from "react";

import { Typography } from "@/components/ui/typography/typography";

interface ListHeadingProps {
	title?: string;
	page?: number;
}

export function ListHeading(props: Readonly<ListHeadingProps>): ReactNode {
	const { title, page = 1 } = props;
	const headingRef = useRef<HTMLHeadingElement | HTMLParagraphElement>(null);

	useEffect(() => {
		if (headingRef.current && (page > 1 || page <= -1)) {
			headingRef.current.focus();
		}
	}, [page]);

	return (
		<Typography
			ref={headingRef}
			className="text-h2 font-light"
			tabIndex={page > 1 || page <= -1 ? -1 : undefined}
			variant="h1"
		>
			{title}
		</Typography>
	);
}
