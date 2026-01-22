import { cn } from "@acdh-oeaw/style-variants";
import React, { type ReactNode, useMemo } from "react";

import type { EventCardProps } from "@/components/ui/event-card/event-card.types";
import { LocationIcon } from "@/components/ui/icons/location";
import { NavLink } from "@/components/ui/link/nav-link";
import { Tag } from "@/components/ui/tag/tag";
import { Typography } from "@/components/ui/typography/typography";

const parseDates = (startDate: string, endDate: string) => {
	const daysString =
		startDate === endDate
			? new Date(startDate).getDate().toString()
			: `${new Date(startDate).getDate().toString()}-${new Date(endDate).getDate().toString()}`;

	const month = new Intl.DateTimeFormat("en-US", { month: "long" })
		.format(new Date(endDate))
		.toUpperCase();

	const headerString = `${month} ${new Date(endDate).getFullYear().toString()}`;

	return { daysString, headerString };
};

export function EventCardHomepage(props: Readonly<EventCardProps>): ReactNode {
	const { title, localization, endDate, startDate, type, status = "pending" } = props;

	const { daysString, headerString } = useMemo(() => {
		return parseDates(startDate, endDate);
	}, [startDate, endDate]);

	return (
		<NavLink
			className="shadow-event-card min-w-116 w-116 max-w-full cursor-pointer bg-event-card-bg group flex-col focus-visible:outline-4 focus-visible:outline-accent"
			href={"/"}
		>
			<div className="bg-white px-12.25 py-8 flex flex-col gap-4 w-full">
				<div className="flex gap-4 items-end text-section-text">
					<Typography className="text-[50px] font-black" variant="h2">
						{daysString}
					</Typography>
					<Typography className="text-[20px]" variant="regular">
						{headerString}
					</Typography>
				</div>
				<div className="flex gap-6">
					<Typography className="flex gap-2 text-[14px] text-accent uppercase" variant="h4">
						{type}
					</Typography>
					<Tag text={status} variant={status} />
				</div>
			</div>
			<div
				className={cn(
					"bg-event-card-details-bg w-full px-12.25 py-7 flex flex-col gap-5.5 h-46.25 max-h-full",
					"group-hover:bg-event-card-details-bg-hover",
					"group-focus:bg-event-card-details-bg-hover",
				)}
			>
				<Typography
					className="line-clamp-3 group-hover:text-primary group-hover:underline group-focus:text-primary group-focus:underline"
					variant="regular"
				>
					{title}
				</Typography>
				<p className="flex gap-3.5 items-center">
					<span className="bg-white p-1 rounded-[100px]">
						<LocationIcon className="size-6" />
					</span>
					{localization}
				</p>
			</div>
		</NavLink>
	);
}
