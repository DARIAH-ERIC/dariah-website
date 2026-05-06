import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { Filters } from "@/components/pages/events/event-list-page/filters";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { EventCalendar } from "@/components/ui/event-calendar/event-calendar";
import { Link } from "@/components/ui/link/link";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";
import {
	convertDateToCalendarDate,
	convertParamToCalendarDate,
	formatDateToMonthYear,
	formatToDateParam,
	getEdgeDates,
} from "@/utils/event-calendar.utils";

interface EventsSearchParams {
	events_in?: string;
	date?: string;
}

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("EventsCalendar");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function EventsCalendarPage({
	searchParams,
}: Readonly<{
	searchParams: Promise<EventsSearchParams>;
}>): Promise<ReactNode> {
	const params = await searchParams;
	const { events_in, date } = params;
	const selectedDate = convertParamToCalendarDate(events_in);
	const dateParam =
		date !== undefined && date !== "" ? convertDateToCalendarDate(new Date(date)) : undefined;
	const { startDate, endDate, displayedMonth } = getEdgeDates(selectedDate, dateParam);

	const displayedDate = displayedMonth !== undefined && dateParam ? dateParam : selectedDate;

	const t = await getTranslations("EventsCalendar");

	const response = await client.events.list({
		from: startDate.toString(),
		until: endDate.toString(),
	});
	const breadcrumbs = navigation().breadcrumbs.events;

	const { data: items } = response.data;

	const prevMonthDate = displayedDate.subtract({ months: 1 });
	const nextMonthDate = displayedDate.add({ months: 1 });

	return (
		<Main className="flex flex-1 flex-col gap-8 pt-8 pb-30 container lg:gap-16 lg:items-center xl:px-31.5">
			<div className="flex flex-col px-4 gap-14 w-full">
				{breadcrumbs.length > 0 && (
					<Breadcrumbs>
						{breadcrumbs.map(({ label, href }) => {
							return (
								<Breadcrumb key={label} href={href}>
									{label}
								</Breadcrumb>
							);
						})}
					</Breadcrumbs>
				)}
				<div className="flex flex-col gap-11 py-2.5 xl:px-13.5">
					<Typography variant="h2">{t("title")}</Typography>
					<Filters currentView="calendar" />
				</div>
			</div>
			<div className="px-4 gap-6 max-w-full lg:w-full 2xl:px-40">
				<Typography variant="h3">{formatDateToMonthYear(displayedDate)}</Typography>
				<div className="flex w-full justify-between">
					<Link
						href={`/events/calendar?events_in=${formatToDateParam(prevMonthDate)}`}
						withDefaultLeftIcon={true}
					>
						{formatDateToMonthYear(prevMonthDate)}
					</Link>
					<Link
						href={`/events/calendar?events_in=${formatToDateParam(nextMonthDate)}`}
						withDefaultRightIcon={true}
					>
						{formatDateToMonthYear(nextMonthDate)}
					</Link>
				</div>
				<EventCalendar events={items} eventsIn={displayedMonth ?? events_in} />
			</div>
		</Main>
	);
}
