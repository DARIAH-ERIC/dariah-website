import type { ReactNode } from "react";

import { Category } from "@/components/ui/category/category";
import { NavLink } from "@/components/ui/link/nav-link";
import { Typography } from "@/components/ui/typography/typography";

interface RelatedContentProps {
	category: "working-group" | "opportunity" | "news" | "event" | "project" | "spotlight-article";
	title: string;
	href?: string;
}

export function RelatedContent(props: Readonly<RelatedContentProps>): ReactNode {
	const { category, title, href } = props;
	return (
		<NavLink
			className="relative bg-primary-100 flex flex-col items-start pb-10 gap-4 lg:w-108"
			href={href}
		>
			<div className="bg-white px-6 py-4.5">
				<Category name={category} />
			</div>
			<div className="px-6">
				<Typography className="font-semibold text-text-link-bg line-clamp-3" variant="regular">
					{title}
				</Typography>
			</div>
		</NavLink>
	);
}
