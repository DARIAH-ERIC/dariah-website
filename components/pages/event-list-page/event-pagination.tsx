"use client";

import { useTranslations } from "next-intl";
import React, { type ReactNode } from "react";

import { Link } from "@/components/ui/link/link";

export function EventPagination(): ReactNode {
	const t = useTranslations("EventsPage");
	return (
		<div className="flex justify-between">
			<Link href="/" withLeftIcon={true}>
				{t("previous-events")}
			</Link>
			<Link href="/" withRightIcon={true}>
				{t("next-events")}
			</Link>
		</div>
	);
}
