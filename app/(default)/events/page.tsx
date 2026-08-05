import { groupBy } from "@acdh-oeaw/lib";
import type { Metadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { EventPagination } from "@/components/pages/events/event-list-page/event-pagination";
import { Filters } from "@/components/pages/events/event-list-page/filters";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { EventCard } from "@/components/ui/event-card/event-card";
import { ElipseIcon } from "@/components/ui/icons/elipse";
import { LineIcon } from "@/components/ui/icons/line";
import { ListHeading } from "@/components/ui/list-heading/list-heading";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";
import { createOpenGraphMetadata } from "@/lib/metadata/open-graph";
import { convertDateToCalendarDate } from "@/utils/event-calendar.utils";
import { parseDateToRangeString } from "@/utils/event-page.utils";

interface EventsSearchParams {
	date?: string;
	page?: string;
}

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("EventsPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		openGraph: await createOpenGraphMetadata({ title }),
	};

	return metadata;
}

const DEFAULT_PER_PAGE = 10;

const checkPrevAndNextEvents = (
	page: number,
	offset: number,
	perPage: number,
	total: number,
	hasDateParam: boolean,
	totalResponsePrev: number,
) => {
	if (page === 1 && !hasDateParam && totalResponsePrev > 0) {
		return {
			hasPrevEvents: totalResponsePrev >= DEFAULT_PER_PAGE,
			hasNextEvents: offset + perPage < total,
		};
	}

	if (page < 0) {
		return { hasPrevEvents: offset + perPage < total, hasNextEvents: true };
	}

	return { hasPrevEvents: offset >= DEFAULT_PER_PAGE, hasNextEvents: offset + perPage < total };
};

export default async function EventsPage({
	searchParams,
}: Readonly<{
	searchParams: Promise<EventsSearchParams>;
}>): Promise<ReactNode> {
	const params = await searchParams;
	const { date, page = "1" } = params;

	const t = await getTranslations("EventsPage");
	const format = await getFormatter();
	const dateParam =
		date !== undefined && date !== ""
			? convertDateToCalendarDate(new Date(date))
			: convertDateToCalendarDate(new Date());
	const hasDateParam = date !== undefined && date !== "";

	const eventListParams =
		Number(page) > 0
			? {
					from: dateParam.toString(),
					offset: DEFAULT_PER_PAGE * (Number.parseInt(page) - 1),
				}
			: {
					until: dateParam.toString(),
					offset: DEFAULT_PER_PAGE * (-1 * Number.parseInt(page) - 1),
				};

	const response = await client.events.list(eventListParams);

	const responseUntil =
		Number.parseInt(page) > 0
			? await client.events.list({
					until: dateParam.toString(),
					offset: DEFAULT_PER_PAGE * (Number.parseInt(page) - 1),
				})
			: { data: { total: 0 } };
	const breadcrumbs = navigation().breadcrumbs.events;

	const { data: items, offset, total } = response.data;
	const { total: totalResponsePrev } = responseUntil.data;

	const { hasPrevEvents, hasNextEvents } = checkPrevAndNextEvents(
		Number.parseInt(page),
		offset,
		DEFAULT_PER_PAGE,
		total,
		hasDateParam,
		totalResponsePrev,
	);

	const sortedItems = items.toSorted((a, z) => {
		return a.duration.start.getTime() - z.duration.start.getTime();
	});

	const itemsByStartDate = groupBy(sortedItems, (item) => {
		return format.dateTime(item.duration.start, { month: "long", year: "numeric" });
	});

	return (
		<Main className="flex flex-1 flex-col gap-8 px-4 pt-8 pb-30 container md:items-center md:px-31.5">
			<div className="flex flex-col gap-14 w-full">
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
					<ListHeading page={Number(page)} title={t("title")} />
					<Filters currentView="list" />
				</div>
			</div>

			<div className="flex flex-col pt-10 gap-12 items-center max-w-full w-332.5 pl-0.5 px-4">
				<EventPagination
					currentPage={page}
					dateParam={date}
					hasNextEvents={hasNextEvents}
					hasPrevEvents={hasPrevEvents}
				/>
				<div className="flex h-full relative gap-2.5 max-w-full">
					<div className="absolute top-0 left-0 h-full flex flex-col gap-2.5 items-stretch overflow-hidden">
						<LineIcon className="stroke-gray-300 w-3 h-full" />
					</div>
					<div className="flex flex-col gap-10 max-w-full ml-5.5">
						{total > 0 ? (
							Object.entries(itemsByStartDate).map(([startDate, events]) => {
								return (
									<div key={startDate} className="flex flex-col gap-8">
										<Typography className="text-h3 text-gray-800" variant="h2">
											{startDate}
										</Typography>
										{events.map((event) => {
											return (
												<div
													key={event.id}
													className="flex flex-col flex-wrap gap-4 relative justify-between lg:flex-row lg:flex-nowrap"
												>
													<Typography
														className="uppercase h-13.75 flex items-center gap-2.5 -ml-5.5 w-fit text-nowrap whitespace-pre lg:min-w-55 lg:max-w-55"
														variant="regular"
													>
														<ElipseIcon className="fill-gray-300" />
														{parseDateToRangeString(event)}
													</Typography>
													<EventCard
														endDate={event.duration.end}
														imageAlt={event.image.alt}
														imageUrl={event.image.url}
														localization={event.location}
														slug={event.entity.slug}
														startDate={event.duration.start}
														title={event.title}
														variant="list"
													/>
												</div>
											);
										})}
									</div>
								);
							})
						) : (
							<Typography variant="regular">{t("emptyState")}</Typography>
						)}
					</div>
				</div>
				<EventPagination
					currentPage={page}
					dateParam={date}
					hasNextEvents={hasNextEvents}
					hasPrevEvents={hasPrevEvents}
				/>
			</div>
		</Main>
	);
}
