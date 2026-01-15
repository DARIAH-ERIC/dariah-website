import { cn } from "@acdh-oeaw/style-variants";
import React, { type ReactNode, useMemo } from "react";

import { CalendarMonthIcon } from "@/components/ui/icons/calendar-month";
import { LocationIcon } from "@/components/ui/icons/location";
import { Link } from "@/components/ui/link/link";
import { Tag } from "@/components/ui/tag/tag";

interface EventCardProps {
	title: string;
	localization: string;
	endDate: string;
	startDate: string;
}

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

export function EventCard(props: Readonly<EventCardProps>): ReactNode {
	const { title, localization, endDate, startDate } = props;

	const { daysString, headerString } = useMemo(() => {
		return parseDates(startDate, endDate);
	}, [startDate, endDate]);

	return (
		<div
			className="shadow-event-card min-w-116 max-w-full cursor-pointer bg-event-card-bg group focus:outline-4 focus:outline-accent"
			role="button"
			tabIndex={0}
		>
			<div className="bg-white px-12.25 py-8 flex flex-col gap-4 w-full">
				<div className="flex gap-4 items-end text-section-text">
					<p className="text-h2 text-[50px] font-black">{daysString}</p>
					<p className="text-regular text-[20px]">{headerString}</p>
				</div>
				<div className="flex gap-6">
					<p className="flex gap-2 text-h4 text-[14px]">
						<CalendarMonthIcon className="size-5" />
						{"EVENT"}
					</p>
					<Tag text="UPCOMING" variant="upcoming" />
				</div>
			</div>
			<div
				className={cn(
					"bg-event-card-details-bg w-full px-12.25 py-7 flex flex-col gap-5.5 h-46.25 max-h-full",
					"group-hover:bg-event-card-details-bg-hover",
					"group-focus:bg-event-card-details-bg-hover",
				)}
			>
				<Link href={"/"} variant="secondary">
					<span className="line-clamp-3">{title}</span>
				</Link>
				<p className="flex gap-3.5 items-center">
					<span className="bg-white p-1 rounded-[100px]">
						<LocationIcon className="size-6" />
					</span>
					{localization}
				</p>
			</div>
		</div>
	);
}
