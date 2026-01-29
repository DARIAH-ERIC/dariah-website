"use client";

import { useTranslations } from "next-intl";
import React, { type ReactNode } from "react";

import { Link } from "@/components/ui/link/link";

export function EventPagination(): ReactNode {
	const t = useTranslations("EventsPage");
	return (
		<div className="flex justify-between">
			<Link href="/" withLeftIcon={true}>
				{t("past-events")}
			</Link>
			<Link href="/" withRightIcon={true}>
				{t("past-events")}
			</Link>
		</div>
	);
}
