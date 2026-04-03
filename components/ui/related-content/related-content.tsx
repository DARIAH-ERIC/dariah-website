import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";

import { Category } from "@/components/ui/category/category";
import { NavLink } from "@/components/ui/link/nav-link";
import { Typography } from "@/components/ui/typography/typography";

interface RelatedContentProps {
	category:
		| "working-group"
		| "opportunity"
		| "news"
		| "event"
		| "project"
		| "spotlight-article"
		| "case-study"
		| "resources";
	title: string;
	href?: string;
}

export function RelatedContent(props: Readonly<RelatedContentProps>): ReactNode {
	const { category, title, href } = props;
	return (
		<NavLink
			className={cn(
				"group bg-primary-100 flex flex-col items-start pb-10 gap-4 max-w-full lg:w-108",
				"focus:outline-4 focus:outline-accent",
			)}
			href={href}
		>
			<div className="bg-white px-6 py-4.5">
				<Category name={category} />
			</div>
			<div className="px-6">
				<Typography
					className={cn(
						"font-semibold text-text-link-bg line-clamp-3",
						"group-hover:text-primary group-hover:underline",
						"group-focus:text-primary group-focus:underline",
					)}
					variant="regular"
				>
					{title}
				</Typography>
			</div>
		</NavLink>
	);
}
