import { cn } from "@acdh-oeaw/style-variants";
import React, { type ReactNode } from "react";

import { Image } from "@/components/image";
import { NewsIcon } from "@/components/ui/icons/news";
import { Link } from "@/components/ui/link/link";

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

	const infoText = variant === "featured" ? "FEATURED NEWS" : "NEWS";

	return (
		<div
			className={cn(
				"group flex flex-col focus:p-2 focus:border-4 focus:border-accent",
				variant === "featured" ? "w-188.75 h-147.25" : "w-90.25 h-126",
			)}
			role="button"
			tabIndex={0}
		>
			<div className="relative">
				<Image alt={title} height={imageHeight} src={imageUrl} width={imageWidth} />
				<div
					className={cn(
						"absolute bottom-0 bg-white flex gap-4 py-4.5",
						variant === "featured" ? "px-8" : "px-4",
					)}
				>
					<div className="flex gap-3.5 text-primary-500">
						<NewsIcon width="14px" />
						<span>{infoText}</span>
					</div>
					<span className="text-gray-800">{date}</span>
				</div>
			</div>
			<div className="flex flex-1 flex-col gap-4 pt-13 justify-between">
				<h3
					className={cn(
						"text-h3",
						"group-hover:text-primary group-hover:underline",
						"group-focus:text-primary group-focus:underline",
					)}
				>
					{title}
				</h3>
				{variant === "featured" && <p className="text-regular line-clamp-3">{description}</p>}
				<Link href={linkUrl} withRightIcon={true}>
					{"Continiue reading"}
				</Link>
			</div>
		</div>
	);
}
