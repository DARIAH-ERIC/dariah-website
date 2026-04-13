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
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";
import { parseDateToRangeString } from "@/utils/event-page.utils";

interface EventsSearchParams {
	date?: string;
	search?: string;
}

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("EventsPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function EventsPage({
	searchParams,
}: Readonly<{
	searchParams: Promise<EventsSearchParams>;
}>): Promise<ReactNode> {
	const _params = await searchParams;

	const t = await getTranslations("EventsPage");
	const format = await getFormatter();

	const response = await client.events.list();
	const breadcrumbs = navigation().breadcrumbs.events;

	const { data: items } = response.data;

	const sortedItems = items.toSorted((a, z) => {
		return a.duration.start.getTime() - z.duration.start.getTime();
	});

	const itemsByStartDate = groupBy(sortedItems, (item) => {
		return format.dateTime(item.duration.start, { month: "long", year: "numeric" });
	});

	return (
		<Main className="flex flex-1 flex-col gap-8 px-4 pt-8 pb-30 container lg:items-center lg:px-31.5">
			<div className="flex flex-col gap-14">
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
				<div className="flex flex-col gap-11 py-2.5 px-13.5">
					<Typography variant="h2">{t("title")}</Typography>
					<Filters />
				</div>
			</div>

			<div className="flex flex-col pt-10 gap-12 items-center max-w-full w-332.5 pl-0.5 px-4">
				<EventPagination />
				<div className="flex h-full gap-2.5 max-w-full">
					<LineIcon className="stroke-gray-300 w-3" />
					<div className="flex flex-col gap-10 max-w-full">
						{Object.entries(itemsByStartDate).map(([startDate, events]) => {
							return (
								<div key={startDate} className="flex flex-col gap-8">
									<Typography className="text-gray-800" variant="h3">
										{startDate}
									</Typography>
									{events.map((event) => {
										return (
											<div
												key={event.id}
												className="flex flex-col flex-wrap gap-4 relative justify-between lg:flex-row lg:flex-nowrap"
											>
												<Typography
													className="uppercase h-13.75 flex items-center gap-2.5 -ml-5.5 w-fit text-nowrap"
													variant="regular"
												>
													<ElipseIcon className="fill-gray-300" />
													{parseDateToRangeString(event)}
												</Typography>
												<EventCard
													endDate={event.duration.end}
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
						})}
					</div>
				</div>
				<EventPagination />
			</div>
		</Main>
	);
}
