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
	name: string | null;
}

export function Category({ name }: Readonly<CategoryProps>): ReactNode {
	const TYPE_ICONS = {
		working_group: <WorkingGroupIcon className="size-5 fill-primary-500" />,
		opportunities: <OpportunityIcon className="size-5 fill-primary-500" />,
		news: <NewsIcon className="size-5 fill-primary-500" />,
		events: <EventIcon className="size-5 fill-primary-500" />,
		projects: <ProjectIcon className="size-5 fill-primary-500" />,
		spotlight_articles: <SpotlightArticleIcon className="size-5 fill-primary-500" />,
		impact_case_studies: <MenuBookIcon className="size-5 fill-primary-500" />,
		resources: <DatabaseIcon className="size-5 fill-primary-500" />,
	};

	if (name === null) return null;

	return (
		<div className="flex gap-2">
			{Object.keys(TYPE_ICONS).includes(name) ? TYPE_ICONS[name as keyof typeof TYPE_ICONS] : null}
			<Typography className="text-primary-500 text-[14px] font-bold uppercase" variant="small">
				{name.replaceAll("-", " ").replaceAll("_", " ")}
			</Typography>
		</div>
	);
}
