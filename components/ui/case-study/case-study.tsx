import { cn } from "@acdh-oeaw/style-variants";
import React, { type ReactNode } from "react";

import { Image } from "@/components/image";
import { MenuBookIcon } from "@/components/ui/icons/menu-book";
import { NavLink } from "@/components/ui/link/nav-link";
import { Typography } from "@/components/ui/typography/typography";

interface CaseStudyProps {
	title: string;
	imageUrl: string;
}

export function CaseStudy(props: Readonly<CaseStudyProps>): ReactNode {
	const { title, imageUrl } = props;
	return (
		<NavLink
			className={cn(
				"bg-white shadow-standard rounded-sm group flex-col w-133.75 h-113.75",
				"hover:bg-event-card-list-bg-hover",
				"focus-visible:bg-event-card-list-bg-hover focus-visible:outline-4 focus-visible:outline-accent",
			)}
			href={"/"}
		>
			<Image alt={title} height={313} src={imageUrl} width={535} />
			<div className="flex gap-2 p-4 flex-col">
				<div className="flex gap-2 items-center">
					<MenuBookIcon
						className="size-5"
						gradientEndColorVar="--case-study-gradient-end"
						gradientStartColorVar="--case-study-gradient-start"
					/>
					<Typography
						className="text-[14px] font-bold bg-linear-to-r from-case-study-gradient-start to-case-study-gradient-end bg-clip-text text-transparent"
						variant="regular"
					>
						{"CASE STUDY"}
					</Typography>
				</div>
				<Typography
					className={cn(
						"text-[22px] text-gray-800",
						"group-hover:text-primary group-hover:underline",
						"group-focus:text-primary group-focus:underline",
					)}
					variant="h3"
				>
					{title}
				</Typography>
			</div>
		</NavLink>
	);
}
