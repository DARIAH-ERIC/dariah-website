import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { EventPagination } from "@/components/pages/event-list-page/event-pagination";
import { Filters } from "@/components/pages/event-list-page/filters";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { EventCard } from "@/components/ui/event-card/event-card";
import { ElipseIcon } from "@/components/ui/icons/elipse";
import { LineIcon } from "@/components/ui/icons/line";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/client";
import { parseDateToRangeString, sortEventsByMonth } from "@/utils/event-page.utils";

const EVENT_CARD_VARIANT = "list";

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

	const data = await client.events.list();
	const breadcrumbs = await client.events.breadcrumbs();

	const { items } = data;
	const parsedItems = sortEventsByMonth(items);

	return (
		<Main className="flex flex-1 flex-col gap-8 px-34.5 pt-8 pb-30 container">
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
					<Typography className="text-[45px] font-light" variant="h2">
						{t("title")}
					</Typography>
					<Filters />
				</div>
			</div>

			<div className="flex flex-col pt-10 mx-auto gap-12">
				<EventPagination />
				<div className="flex h-full gap-2.5">
					<LineIcon className="stroke-gray-300 w-3" />
					<div className="flex flex-col gap-10">
						{Object.keys(parsedItems).map((key) => {
							return (
								<div key={key} className="flex flex-col gap-8">
									<Typography className="text-gray-800" variant="h3">
										{key}
									</Typography>
									{parsedItems[key]?.map((event) => {
										return (
											<div key={event.id} className="flex gap-4 relative justify-between">
												<Typography
													className="uppercase h-13.75 flex items-center gap-2.5 -ml-5.5"
													variant="regular"
												>
													<ElipseIcon className="fill-gray-300" />
													{parseDateToRangeString(event)}
												</Typography>
												<EventCard
													endDate={event.publishedAt.toDateString()}
													imageUrl={event.image.url}
													localization={event.location}
													startDate={event.publishedAt.toDateString()}
													title={event.title}
													type={"training"}
													variant={EVENT_CARD_VARIANT}
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
