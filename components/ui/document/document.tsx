import { cn } from "@acdh-oeaw/style-variants";
import { useTranslations } from "next-intl";
import React, { type ReactNode } from "react";

import { ChevronForwardIcon } from "@/components/ui/icons/chevron-forward";
import { NavLink } from "@/components/ui/link/nav-link";
import { Typography } from "@/components/ui/typography/typography";

interface DocumentProps {
	title: string;
	documentUrl?: string;
	isEven?: boolean;
	previewText?: string;
}

export function Document(props: Readonly<DocumentProps>): ReactNode {
	const { title, documentUrl, isEven = false, previewText } = props;
	const t = useTranslations("DocumentsPoliciesPage");

	const isTitleEmpty = title.trim() === "";

	return (
		<NavLink
			className={cn(
				"px-4 py-3 flex border-2 border-transparent text-black flex-wrap flex-col max-w-full items-start justify-between gap-2",
				isEven ? "bg-gray-100" : "bg-transparent z-2",
				isTitleEmpty && "text-gray-800",
				"lg:flex-row lg:items-center lg:h-fit 2xl:gap-0 2xl:w-265 xl:justify-between",
				"hover:bg-gray-100 hover:border-gray-100 hover:text-primary hover:shadow-light",
				"focus-visible:bg-white focus-visible:outline-none focus-visible:border-accent focus-visible:text-primary focus-visible:shadow-light",
			)}
			href={documentUrl}
		>
			<Typography className={cn("text-[18px]")} variant="h4">
				{title || t("placeholderName")}
			</Typography>
			<Typography className="flex gap-2 items-center text-[18px]" variant="h4">
				{previewText ?? t("viewPDF")} <ChevronForwardIcon className="size-5" />
			</Typography>
		</NavLink>
	);
}
