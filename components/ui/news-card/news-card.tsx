import { cn } from "@acdh-oeaw/style-variants";
import React, { type ReactNode } from "react";

import { Image } from "@/components/image";
import { ChevronForwardIcon } from "@/components/ui/icons/chevron-forward";
import { NewsIcon } from "@/components/ui/icons/news";
import { NavLink } from "@/components/ui/link/nav-link";
import { Typography } from "@/components/ui/typography/typography";

interface NewsCardProps {
	title: string;
	description?: string;
	imageUrl: string;
	linkUrl: string;
	date: string;
	variant: "featured" | "standard";
}

export function NewsCard(props: Readonly<NewsCardProps>): ReactNode {
	const { variant, title, description, imageUrl, linkUrl, date } = props;

	const imageWidth = variant === "featured" ? 755 : 361;
	const imageHeight = variant === "featured" ? 339 : 244;

	return (
		<NavLink
			className={cn(
				"group flex flex-col cursor-pointer focus:outline-4 focus:outline-accent",
				variant === "featured" ? "w-188.75 h-147.25" : "w-90.25 h-126",
			)}
			href={linkUrl}
		>
			<div
				className={cn(
					"relative overflow-hidden",
					variant === "featured" ? "w-188.75 h-84.75" : "w-90.25 h-61",
				)}
			>
				<Image
					alt={title}
					className={cn(
						"overflow-hidden transition-transform duration-300 ease-in-out object-cover size-full",
						"group-hover:scale-110",
						"group-focus:scale-110",
					)}
					height={imageHeight}
					src={imageUrl}
					width={imageWidth}
				/>
				<div
					className={cn(
						"absolute bottom-0 bg-white flex gap-4 py-4.5",
						variant === "featured" ? "px-8" : "px-4",
					)}
				>
					<div className="flex gap-3.5 text-primary-500">
						<NewsIcon width="14px" />
						<span>{"NEWS"}</span>
					</div>
					<span className="text-gray-800">{date}</span>
				</div>
			</div>
			<div className="flex flex-1 flex-col gap-4 pt-13 justify-between">
				<Typography variant="h3">{title}</Typography>
				{variant === "featured" && (
					<Typography className="line-clamp-3" variant="regular">
						{description}
					</Typography>
				)}
				{}

				<Typography
					className={cn(
						"font-semibold flex gap-2 items-center",
						"group-hover:text-primary group-hover:underline",
						"group-focus:text-primary group-focus:underline",
					)}
					variant="regular"
				>
					{"Continiue reading"}
					<ChevronForwardIcon className="size-5" />
				</Typography>
			</div>
		</NavLink>
	);
}
