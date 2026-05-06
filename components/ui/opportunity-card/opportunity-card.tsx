import { cn, styles } from "@acdh-oeaw/style-variants";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Link } from "@/components/ui/link/link";
import { Tag } from "@/components/ui/tag/tag";
import { Typography } from "@/components/ui/typography/typography";
import {
	checkIfOpportunityIsOpen,
	getFormattedDateForOpportunity,
} from "@/utils/opportunity-page.utils";

export const opportunityCardStyles = styles({
	base: [
		"p-6 pl-5 border-l-4 rounded-[5px] flex flex-col gap-2 w-full h-66.5 cursor-default md:h-53",
	],
	variants: {
		variant: {
			dariah: cn("border-accent-800 bg-event-bg-calendar"),
			external: cn("border-transparent"),
		},
	},
	defaults: {
		variant: "dariah",
	},
});

interface OpportunityCardProps {
	variant: "dariah" | "external";
	title: string;
	website: string | null;
	startDate: Date;
	endDate?: Date;
	summary: string | null;
}

export function OpportunityCard(props: Readonly<OpportunityCardProps>): ReactNode {
	const { variant, title, website, startDate, endDate, summary } = props;
	const t = useTranslations("Opportunities");

	const isOpen = checkIfOpportunityIsOpen(startDate, endDate ?? startDate);

	return (
		<div className={cn(opportunityCardStyles({ variant }))}>
			<Link href={website ?? undefined} variant="primary">
				{title}
			</Link>
			<div className="flex gap-4 items-center">
				<Tag
					className="rounded-none!"
					text={isOpen ? t("filters.availability.open") : t("filters.availability.closed")}
					variant={isOpen ? "upcoming" : "past"}
				/>
				<div className="border-l border-gray-400 h-4" />
				<Tag
					className="rounded-none! px-2"
					text={t(`filters.source.${variant}`)}
					variant={variant === "dariah" ? "internal" : "past"}
				/>
				<div className="border-l border-gray-400 h-4" />
				<Typography variant="small">
					{getFormattedDateForOpportunity(endDate ?? startDate)}
				</Typography>
			</div>
			<Typography className="text-gray-800 line-clamp-3" variant="regular">
				{summary}
			</Typography>
		</div>
	);
}
