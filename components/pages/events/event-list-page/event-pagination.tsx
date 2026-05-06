"use client";

import { cn } from "@acdh-oeaw/style-variants";
import { useTranslations } from "next-intl";
import React, { type ReactNode } from "react";

import { Link } from "@/components/ui/link/link";

interface EventPaginationProps {
	hasPrevEvents: boolean;
	hasNextEvents: boolean;
	currentPage: string;
}

export function EventPagination(props: Readonly<EventPaginationProps>): ReactNode {
	const { hasPrevEvents, hasNextEvents, currentPage } = props;
	const t = useTranslations("EventsPage");

	const prevPageNumber = Number.parseInt(currentPage) - 1;
	const nextPageNumber = Number.parseInt(currentPage) + 1;

	return (
		<div
			className={cn(
				"flex justify-between w-full",
				!hasPrevEvents && hasNextEvents && "justify-end",
			)}
		>
			{hasPrevEvents && (
				<Link href={`/events?page=${prevPageNumber.toString()}`} withDefaultLeftIcon={true}>
					{t("previous-events")}
				</Link>
			)}
			{hasNextEvents && (
				<Link
					className="[&>span]:text-end"
					href={`/events?page=${nextPageNumber.toString()}`}
					withDefaultRightIcon={true}
				>
					{t("next-events")}
				</Link>
			)}
		</div>
	);
}
