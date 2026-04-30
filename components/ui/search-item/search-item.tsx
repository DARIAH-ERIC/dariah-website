"use client";

import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";

import { DatabaseIcon } from "@/components/ui/icons/database";
import { EventIcon } from "@/components/ui/icons/event";
import { MenuBookIcon } from "@/components/ui/icons/menu-book";
import { NewsIcon } from "@/components/ui/icons/news";
import { OpenInNewIcon } from "@/components/ui/icons/open-in-new";
import { OpportunityIcon } from "@/components/ui/icons/opportunity";
import { ProjectIcon } from "@/components/ui/icons/project";
import { SpotlightArticleIcon } from "@/components/ui/icons/spotlight-article";
import { WorkingGroupIcon } from "@/components/ui/icons/working-group";
import { NavLink } from "@/components/ui/link/nav-link";
import { Typography } from "@/components/ui/typography/typography";
import { getFormattedDateForItem } from "@/utils/search-page.utils";

interface SearchItemProps {
	type:
		| "country"
		| "document-or-policy"
		| "event"
		| "funding-call"
		| "impact-case-study"
		| "institution"
		| "national-consortium"
		| "news-item"
		| "opportunity"
		| "page"
		| "person"
		| "project"
		| "spotlight-article"
		| "working-group"
		| "publication"
		| "service"
		| "software"
		| "training-material"
		| "workflow";
	date?: Date;
	title: string;
	description: string;
	href: string;
}

const TYPE_ICONS = {
	"working-group": <WorkingGroupIcon className="size-5 fill-primary-500" />,
	opportunity: <OpportunityIcon className="size-5 fill-primary-500" />,
	"news-item": <NewsIcon className="size-5 fill-primary-500" />,
	event: <EventIcon className="size-5 fill-primary-500" />,
	project: <ProjectIcon className="size-5 fill-primary-500" />,
	"spotlight-article": <SpotlightArticleIcon className="size-5 fill-primary-500" />,
	"impact-case-study": <MenuBookIcon className="size-5 fill-primary-500" />,
	resources: <DatabaseIcon className="size-5 fill-primary-500" />,
	page: <OpenInNewIcon className="size-5 fill-primary-500" />,
};

const RESOURCE_TYPES = new Set([
	"publication",
	"service",
	"software",
	"training-material",
	"workflow",
]);

export function SearchItem(props: Readonly<SearchItemProps>): ReactNode {
	const { type, date, title, description, href } = props;

	const getDisplayedType = () => {
		if (RESOURCE_TYPES.has(type)) {
			return "resources";
		}

		return type;
	};

	const displayedType = getDisplayedType() as keyof typeof TYPE_ICONS;

	return (
		<NavLink
			className={cn(
				"group p-2 w-full flex flex-col gap-2 lg:h-40.25",
				"hover:bg-event-card-list-bg-hover",
				"focus:outline-accent-800 focus:outline-4 focus:bg-event-card-list-bg-hover",
			)}
			href={href}
		>
			<div className="w-full">
				<div className="flex p-2 gap-3 items-center">
					<div className="flex gap-2">
						{TYPE_ICONS[displayedType]}
						<Typography
							className="text-primary-500 text-[14px] font-bold uppercase"
							variant="small"
						>
							{displayedType.replaceAll("-", " ")}
						</Typography>
					</div>
					{date && (
						<Typography className="text-gray-800" variant="small">
							{getFormattedDateForItem(date)}
						</Typography>
					)}
				</div>

				<div className="py-2">
					<Typography
						className={cn(
							"font-semibold text-section-text line-clamp-1",
							"group-hover:text-primary group-hover:underline",
							"group-focus:text-primary group-focus:underline",
						)}
						variant="regular"
					>
						{title}
					</Typography>
				</div>
			</div>
			<Typography className="line-clamp-2" variant="regular">
				{description}
			</Typography>
		</NavLink>
	);
}
