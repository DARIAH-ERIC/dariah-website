"use client";

import { cn } from "@acdh-oeaw/style-variants";
import { useTranslations } from "next-intl";
import React, { type ReactNode } from "react";

import { Image } from "@/components/image";
import { ChevronForwardIcon } from "@/components/ui/icons/chevron-forward";
import { NewsIcon } from "@/components/ui/icons/news";
import { NavLink } from "@/components/ui/link/nav-link";
import { Typography } from "@/components/ui/typography/typography";
import { getFormattedDateForNews } from "@/utils/news-page.utils";

interface NewsCardProps {
	title: string;
	description?: string;
	imageUrl: string;
	linkUrl: string;
	date: Date;
	variant: "featured" | "standard" | "list-item" | "list-headline";
}

export function NewsCard(props: Readonly<NewsCardProps>): ReactNode {
	const { variant, title, description, imageUrl, linkUrl, date } = props;
	const t = useTranslations("NewsPage");

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
		featured: "max-w-full xl:max-w-[40%] 3xl:max-w-full w-188.75 h-147.25",
		standard: "max-w-full xl:max-w-[25%] 3xl:max-w-full w-90.25 h-123",
		"list-item": "max-w-full h-113 w-188.25 2xl:h-55 gap-7",
		"list-headline": "max-w-full max-w-400 h-171.75 lg:h-107.75 relative",
	};

	const imageWrapperVariants = {
		featured: "max-w-full w-188.75 h-84.75",
		standard: "max-w-full w-90.25 h-61",
		"list-item": "w-full max-w-full 2xl:w-90.5 h-53.5 2xl:h-55",
		"list-headline": "w-full max-w-full h-80.5 lg:w-231.25 lg:h-107.75",
	};

	return (
		<NavLink
			className={cn(
				"group flex cursor-pointer flex-col focus:outline-4 focus:outline-accent",
				containerVariants[variant],
				!isListVariant && "gap-0",
				variant === "list-headline" && "lg:flex-row",
				variant === "list-item" && "2xl:flex-row",
			)}
			href={linkUrl}
		>
			<div
				className={cn(
					"relative border border-gray-200 overflow-hidden",
					imageWrapperVariants[variant],
				)}
			>
				<Image
					alt={title}
					className={cn(
						"overflow-hidden transition-transform duration-300 ease-in-out object-cover",
						"group-hover:scale-110",
						imageWrapperVariants[variant],
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
						<span className="uppercase">{t("newsCard.tag")}</span>
					</div>
					<span className="text-gray-800">{getFormattedDateForNews(date)}</span>
				</div>
			</div>
			<div
				className={cn(
					"flex flex-1 flex-col gap-4 justify-between",
					!isListVariant && "pt-8 size-full 2xl:pt-13",
					variant === "list-item" && "gap-0! 2xl:max-h-55",
					variant === "list-headline" &&
						"absolute w-full h-119.75 top-[208] left-[24] z-5 max-w-197.25 bg-white justify-center p-6! lg:h-81.5 lg:right-0 lg:left-auto lg:top-auto",
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
							<Typography className="text-[16px] font-bold uppercase" variant="small">
								{t("newsCard.tag")}
							</Typography>
						</div>
						<span className="text-gray-800">{getFormattedDateForNews(date)}</span>
					</div>
					<div className={variant === "list-item" ? "mb-3.5 h-13.5" : undefined}>
						<Typography
							className={cn(
								variant === "list-item" && "line-clamp-2 text-[18px]",
								variant === "list-headline" && "text-[24px]",
								!isListVariant && "line-clamp-3",
							)}
							variant="h3"
						>
							{title}
						</Typography>
					</div>
				</div>
				{variantWithDescription && (
					<Typography
						className={cn(
							"line-clamp-8 lg:line-clamp-2",
							variant === "list-item" && "mb-2 line-clamp-3!",
						)}
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
					{t("newsCard.continueReading")}
					<ChevronForwardIcon className="size-5" />
				</Typography>
			</div>
		</NavLink>
	);
}
