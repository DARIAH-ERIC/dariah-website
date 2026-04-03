import type { ReactNode } from "react";

import { DatabaseIcon } from "@/components/ui/icons/database";
import { EventIcon } from "@/components/ui/icons/event";
import { MenuBookIcon } from "@/components/ui/icons/menu-book";
import { NewsIcon } from "@/components/ui/icons/news";
import { OpportunityIcon } from "@/components/ui/icons/opportunity";
import { ProjectIcon } from "@/components/ui/icons/project";
import { SpotlightArticleIcon } from "@/components/ui/icons/spotlight-article";
import { WorkingGroupIcon } from "@/components/ui/icons/working-group";
import { Typography } from "@/components/ui/typography/typography";

interface CategoryProps {
	name:
		| "working-group"
		| "opportunity"
		| "news"
		| "event"
		| "project"
		| "spotlight-article"
		| "case-study"
		| "resources";
}

export function Category({ name }: Readonly<CategoryProps>): ReactNode {
	const TYPE_ICONS = {
		"working-group": <WorkingGroupIcon className="size-5 fill-primary-500" />,
		opportunity: <OpportunityIcon className="size-5 fill-primary-500" />,
		news: <NewsIcon className="size-5 fill-primary-500" />,
		event: <EventIcon className="size-5 fill-primary-500" />,
		project: <ProjectIcon className="size-5 fill-primary-500" />,
		"spotlight-article": <SpotlightArticleIcon className="size-5 fill-primary-500" />,
		"case-study": <MenuBookIcon className="size-5 fill-primary-500" />,
		resources: <DatabaseIcon className="size-5 fill-primary-500" />,
	};
	return (
		<div className="flex gap-2">
			{TYPE_ICONS[name]}
			<Typography className="text-primary-500 text-[14px] font-bold uppercase" variant="small">
				{name.replaceAll("-", " ")}
			</Typography>
		</div>
	);
}
