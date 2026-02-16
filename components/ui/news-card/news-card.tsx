"use client";

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
	variant: "featured" | "standard" | "list-item" | "list-headline";
}

export function NewsCard(props: Readonly<NewsCardProps>): ReactNode {
	const { variant, title, description, imageUrl, linkUrl, date } = props;

	const getImageSizeForVariant = () => {
		switch (variant) {
			case "featured": {
				return { imageWidth: 755, imageHeight: 339 };
			}
			case "standard": {
				return { imageWidth: 361, imageHeight: 244 };
			}
			case "list-item": {
				return { imageWidth: 362, imageHeight: 220 };
			}
			case "list-headline": {
				return { imageWidth: 925, imageHeight: 431 };
			}
			default: {
				return { imageWidth: 361, imageHeight: 244 };
			}
		}
	};

	const variantWithDescription = ["featured", "list-item", "list-headline"].includes(variant);
	const isListVariant = ["list-item", "list-headline"].includes(variant);

	const { imageWidth, imageHeight } = getImageSizeForVariant();

	const containerVariants = {
		featured: "w-188.75 h-147.25",
		standard: "w-90.25 h-126",
		"list-item": "w-188.25 h-55 gap-7",
		"list-headline": "max-w-400 h-107.75 relative",
	};

	const imageWrapperVariants = {
		featured: "w-188.75 h-84.75",
		standard: "w-90.25 h-61",
		"list-item": "w-90.5 h-55",
		"list-headline": "w-231.25 h-107.75",
	};

	return (
		<NavLink
			className={cn(
				"group flex cursor-pointer focus:outline-4 focus:outline-accent",
				containerVariants[variant],
				!isListVariant && "flex-col gap-0",
			)}
			href={linkUrl}
		>
			<div className={cn("relative overflow-hidden", imageWrapperVariants[variant])}>
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
						isListVariant && "hidden",
					)}
				>
					<div className="flex gap-3.5 text-primary-500">
						<NewsIcon width="14px" />
						<span>{"NEWS"}</span>
					</div>
					<span className="text-gray-800">{date}</span>
				</div>
			</div>
			<div
				className={cn(
					"flex flex-1 flex-col gap-4 justify-between",
					!isListVariant && "pt-13",
					variant === "list-item" && "gap-0! max-h-55 h-full",
					variant === "list-headline" &&
						"absolute right-0 z-10 max-w-197.25 bg-white justify-center p-6!",
				)}
			>
				<div className="flex flex-col gap-2.5">
					<div className={cn("flex gap-4", !isListVariant && "hidden")}>
						<div
							className={cn(
								"flex gap-3.5 text-primary-500 items-center",
								variant !== "list-item" && "hidden",
							)}
						>
							<NewsIcon className="size-4" />
							<Typography className="text-[16px] font-bold" variant="small">
								{"NEWS"}
							</Typography>
						</div>
						<span className="text-gray-800">{date}</span>
					</div>
					<Typography
						className={cn(variant === "list-item" && "mb-3.5 line-clamp-2 h-13.5 text-[18px]")}
						variant="h3"
					>
						{title}
					</Typography>
				</div>
				{variantWithDescription && (
					<Typography
						className={cn("line-clamp-5", variant === "list-item" && "mb-2 line-clamp-3!")}
						variant={variant === "list-item" ? "small" : "regular"}
					>
						{description}
					</Typography>
				)}
				<Typography
					className={cn(
						"font-semibold flex items-center",
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
