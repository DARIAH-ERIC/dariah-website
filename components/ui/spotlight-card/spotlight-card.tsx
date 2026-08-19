import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";

import { ApiImage } from "@/components/image";
import { NavLink } from "@/components/ui/link/nav-link";
import { Typography } from "@/components/ui/typography/typography";
import type { ImageAsset } from "@/lib/images/variants";
import { getFormattedDateForCard } from "@/utils/spotlight-page.utils";

interface SpotlightCardProps {
	title: string;
	summary: string;
	image: ImageAsset;
	href: string;
	publishedAt: Date;
}

export function SpotlightCard(props: Readonly<SpotlightCardProps>): ReactNode {
	const { title, summary, publishedAt, image, href } = props;

	return (
		<NavLink
			className={cn(
				"group pt-6 pl-6 rounded-[5px] bg-gray-100 shadow-standard flex-col w-82 h-106 justify-between items-start",
				"xl:size-120 2xl:flex-row 2xl:w-179.5 2xl:h-71.5 3xl:gap-6 lg:size-110",
				"hover:bg-primary-100",
				"focus:outline-accent-800 focus:outline-4 focus:bg-primary-100",
			)}
			href={href}
		>
			<div className="flex flex-col gap-6 pb-6 w-62 lg:w-95 xl:w-107.5 xl:pb-0 2xl:w-62 2xl:pb-6">
				<div className="flex flex-col gap-2">
					<Typography
						className="text-[1.25rem] font-medium text-accent-700 uppercase"
						variant="regular"
					>
						{getFormattedDateForCard(publishedAt)}
					</Typography>
					<Typography
						className={cn(
							"text-h5 line-clamp-2 2xl:line-clamp-4",
							"group-hover:text-primary group-hover:underline",
							"group-focus:text-primary group-focus:underline",
						)}
						variant="h2"
					>
						{title}
					</Typography>
				</div>
				<Typography className="line-clamp-3" variant="regular">
					{summary}
				</Typography>
			</div>
			<ApiImage
				className={cn(
					"w-76 h-44.75 shadow-spotlight-image rounded-t-sm object-cover",
					"lg:w-90 lg:h-48 lg:ml-auto xl:w-105 xl:h-60 2xl:mt-auto 3xl:w-105.5 3xl:h-65.5",
				)}
				height={262}
				image={image}
				sizes="(min-width: 80rem) 422px, (min-width: 64rem) 360px, 304px"
				width={422}
			/>
		</NavLink>
	);
}
