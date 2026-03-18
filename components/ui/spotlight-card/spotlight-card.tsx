import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";

import { Image } from "@/components/image";
import { NavLink } from "@/components/ui/link/nav-link";
import { Typography } from "@/components/ui/typography/typography";
import { getFormattedDateForCard } from "@/utils/spotlight-page.utils";

interface SpotlightCardProps {
	title: string;
	summary: string;
	imageUrl: string;
	href: string;
	publishedAt: Date;
}

export function SpotlightCard(props: Readonly<SpotlightCardProps>): ReactNode {
	const { title, summary, publishedAt, imageUrl, href } = props;

	return (
		<NavLink
			className={cn(
				"group pt-6 pl-6 rounded-[5px] bg-gray-100 shadow-standard flex-col w-82 h-106 justify-between items-start",
				"lg:flex-row lg:gap-6 lg:w-179.5 lg:h-71.5",
				"hover:bg-primary-100",
				"focus:outline-accent-800 focus:outline-4 focus:bg-primary-100",
			)}
			href={href}
		>
			<div className="flex flex-col gap-6 pb-6 w-62">
				<div className="flex flex-col gap-2">
					<Typography
						className="text-[20px] font-medium text-accent-700 uppercase"
						variant="regular"
					>
						{getFormattedDateForCard(publishedAt)}
					</Typography>
					<Typography
						className={cn(
							"line-clamp-2 text-[18px] lg:line-clamp-4",
							"group-hover:text-primary group-hover:underline",
							"group-focus:text-primary group-focus:underline",
						)}
						variant="h4"
					>
						{title}
					</Typography>
				</div>
				<Typography className="line-clamp-3" variant="regular">
					{summary}
				</Typography>
			</div>
			<Image
				alt={title}
				className={cn("w-76 h-44.75 shadow-spotlight-image rounded-t-sm", "lg:w-105.5 lg:h-65.5")}
				height={262}
				src={imageUrl}
				width={422}
			/>
		</NavLink>
	);
}
