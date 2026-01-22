import { cn } from "@acdh-oeaw/style-variants";
import React, { type ReactNode } from "react";

import { Image } from "@/components/image";
import { NavLink } from "@/components/navigation";
import type { EventCardProps } from "@/components/ui/event-card/event-card.types";
import { LocationIcon } from "@/components/ui/icons/location";
import { Tag } from "@/components/ui/tag/tag";
import { Typography } from "@/components/ui/typography/typography";

export function EventCardList(props: Readonly<EventCardProps>): ReactNode {
	const { title, localization, imageUrl, type, status = "pending" } = props;

	return (
		<NavLink
			className={cn(
				"shadow-light w-292.25 max-w-full h-44.5 cursor-pointer p-4 bg-gray-100 group flex justify-between rounded-sm",
				"hover:bg-event-card-list-bg-hover",
				"focus-visible:outline-4 focus-visible:outline-accent focus-visible:hover:bg-event-card-list-bg-hover",
			)}
			href={"/"}
		>
			<div className="flex flex-col gap-4 w-133.75 h-36.5 justify-between">
				<div>
					<div className="flex gap-6">
						<Typography className="flex gap-2 text-[14px] uppercase text-accent" variant="h4">
							{type}
						</Typography>
						<Tag text={status} variant={status} />
					</div>
					<Typography
						className="line-clamp-3 text-black group-hover:text-primary group-hover:underline group-focus:text-primary group-focus:underline"
						variant="h4"
					>
						{title}
					</Typography>
				</div>
				<div>
					<Typography className="flex gap-3.5 items-center text-black" variant="regular">
						<span className="bg-white p-1 rounded-[100px]">
							<LocationIcon className="size-6" />
						</span>
						{localization}
					</Typography>
				</div>
			</div>
			{imageUrl != null && (
				<Image alt={title} className="w-67 h-36.5" height={146} src={imageUrl} width={268} />
			)}
		</NavLink>
	);
}
