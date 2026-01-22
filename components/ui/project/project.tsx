import { cn } from "@acdh-oeaw/style-variants";
import React, { type ReactNode } from "react";

import { Image } from "@/components/image";
import { MenuBookIcon } from "@/components/ui/icons/menu-book";
import { NavLink } from "@/components/ui/link/nav-link";
import { Typography } from "@/components/ui/typography/typography";

interface ProjectProps {
	title: string;
	imageUrl: string;
	type: "Beneficiary" | "Coordinator";
	startDate: string;
	endDate: string;
}

export function Project(props: Readonly<ProjectProps>): ReactNode {
	const { title, imageUrl, type, startDate, endDate } = props;
	return (
		<NavLink
			className={cn(
				"bg-gray-100 shadow-standard rounded-sm group flex-col w-96.25 h-98.25",
				"hover:bg-event-card-list-bg-hover",
				"focus-visible:bg-event-card-list-bg-hover focus-visible:outline-4 focus-visible:outline-accent",
			)}
			href={"/"}
		>
			<Image alt={title} height={249} src={imageUrl} width={385} />
			<div className="flex gap-2 p-4 flex-col w-full">
				<div className="flex justify-between">
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
							{"PROJECT"}
						</Typography>
					</div>
					<Typography
						className={cn("text-[16px]", type === "Coordinator" ? "bg-primary-200" : "bg-gray-300")}
						variant="regular"
					>
						{type}
					</Typography>
				</div>
				<div className="flex gap-4 flex-col">
					<Typography
						className={cn(
							"text-[22px] text-black",
							"group-hover:text-primary group-hover:underline",
							"group-focus:text-primary group-focus:underline",
						)}
						variant="h3"
					>
						{title}
					</Typography>
					<Typography
						className="text-gray-800"
						variant="small"
					>{`Duration: ${startDate} - ${endDate}`}</Typography>
				</div>
			</div>
		</NavLink>
	);
}
