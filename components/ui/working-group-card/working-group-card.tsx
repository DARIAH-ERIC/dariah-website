import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";

import { Image } from "@/components/image";
import { WorkingGroupIcon } from "@/components/ui/icons/working-group";
import { NavLink } from "@/components/ui/link/nav-link";
import { Typography } from "@/components/ui/typography/typography";

interface WorkingGroupCard {
	title: string;
	imageUrl: string;
	href: string;
}

export function WorkingGroupCard(props: Readonly<WorkingGroupCard>): ReactNode {
	const { title, imageUrl, href } = props;

	return (
		<NavLink
			className={cn(
				"w-80 h-108 group shadow-light bg-white rounded-sm flex-col md:w-96.25 md:h-124.5",
				"hover:shadow-standard",
				"focus:shadow-standard focus:outline-accent-800 focus:outline-4",
			)}
			href={href}
		>
			<Image
				alt={title}
				className="size-80 rounded-t-sm object-cover md:size-96.25"
				height={385}
				src={imageUrl}
				width={385}
			/>
			<div
				className={cn(
					"flex flex-col px-4 py-2 gap-1 border border-gray-100 w-full h-28.25",
					"group-hover:bg-primary-100",
					"group-focus:bg-primary-100",
				)}
			>
				<div className="flex gap-2 items-center">
					<WorkingGroupIcon
						className="size-5"
						gradientEndColorVar="--case-study-gradient-end"
						gradientStartColorVar="--case-study-gradient-start"
					/>
					<Typography
						className="text-[14px] font-bold bg-linear-to-r uppercase from-case-study-gradient-start to-case-study-gradient-end bg-clip-text text-transparent"
						variant="regular"
					>
						{"Working group"}
					</Typography>
				</div>
				<Typography
					className={cn(
						"line-clamp-2",
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
