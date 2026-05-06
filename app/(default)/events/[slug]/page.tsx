import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { ContentBlocks } from "@/components/content-blocks";
import { Image } from "@/components/image";
import { EventInfoSection } from "@/components/pages/events/event-detail-page/event-info-section";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { Button } from "@/components/ui/button/button";
import { EventCard } from "@/components/ui/event-card/event-card";
import { AddIcon } from "@/components/ui/icons/add";
import { Link } from "@/components/ui/link/link";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";
import { getFormattedDateForGoogleCalendar } from "@/utils/event-page.utils";

interface EventPageProps extends PageProps<"/events/[slug]"> {}

export async function generateStaticParams(): Promise<
	Array<Pick<Awaited<EventPageProps["params"]>, "slug">>
> {
	const response = await client.events.slugs();

	return response.data.data.map((item) => {
		return { slug: item.entity.slug };
	});
}

export async function generateMetadata(props: Readonly<EventPageProps>): Promise<Metadata> {
	const { params } = props;

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);

	const response = await client.events.bySlug({ slug });

	const { title } = response.data;

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function EventPage(props: Readonly<EventPageProps>): Promise<ReactNode> {
	const { params } = props;
	const t = await getTranslations("EventsDetailPage");

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);

	const response = await client.events.bySlug({ slug });
	const breadcrumbs = navigation().breadcrumbs.eventsDetailPage;

	const {
		title,
		image,
		location,
		links,
		content,
		duration: { start: startDate, end: endDate },
		website,
	} = response.data;

	const { prev: prevEvent, next: nextEvent } = links;

	const getAddCalendarUrl = (): string | undefined => {
		const baseUrl = "https://www.google.com/calendar/render";
		const startDateParam = getFormattedDateForGoogleCalendar(startDate);
		const endDateParam = getFormattedDateForGoogleCalendar(endDate ?? startDate);

		if (startDateParam === undefined || endDateParam === undefined) {
			return undefined;
		}

		const params = new URLSearchParams({
			action: "TEMPLATE",
			text: title,
			dates: `${startDateParam}/${endDateParam}`,
			location,
		});

		return `${baseUrl}?${params.toString()}`;
	};

	const addToCalendarUrl = getAddCalendarUrl();

	return (
		<Main className="container flex flex-1 pt-8 flex-col mb-16 gap-14 lg:mb-36.5 lg:gap-13.5">
			{breadcrumbs.length > 0 && (
				<Breadcrumbs className="px-4 lg:px-34.5">
					{breadcrumbs.map(({ label, href }) => {
						return (
							<Breadcrumb key={label} className="w-fit" href={href}>
								{label}
							</Breadcrumb>
						);
					})}
					<Breadcrumb>{slug.replaceAll("-", " ")}</Breadcrumb>
				</Breadcrumbs>
			)}
			<div className="flex flex-col gap-10 lg:px-40">
				<Link href="/events" variant="secondary" withDefaultLeftIcon={true}>
					{t("browseAll")}
				</Link>
				<div className="flex flex-col items-center px-4 gap-5 lg:flex-row lg:flex-wrap lg:px-0">
					<Image
						alt={title}
						className="w-82 h-40 object-contain lg:w-197.5 lg:h-101.25"
						height={405}
						src={image.url}
						width={790}
					/>
					<div className="flex flex-col gap-6.5">
						<Typography className="mb-8.5" variant="h3">
							{title}
						</Typography>
						<EventInfoSection
							endDate={endDate}
							location={location}
							startDate={startDate}
							website={website ?? undefined}
						/>
						<Button
							href={addToCalendarUrl}
							startIcon={<AddIcon className="size-5" />}
							target="_blank"
							variant="tertiary"
						>
							{t("addToCalendar")}
						</Button>
					</div>
				</div>
				<hr className="w-full h-0.5 border-t-2 border-gray-300" />
				<div className="flex flex-col gap-5 px-4">
					<Typography variant="h4">{t("details")}</Typography>
					<div className="xl:max-w-201.5">
						<ContentBlocks fields={content} />
					</div>
				</div>
				<hr className="w-full h-0.5 border-t-2 border-gray-300" />
				<div className="flex w-full gap-10 flex-col items-center xl:justify-between xl:flex-row">
					{prevEvent && (
						<div className="px-2 gap-10 flex flex-col max-w-full">
							<Typography variant="h4">{t("prevEvent")}</Typography>
							<EventCard
								endDate={prevEvent.duration.end}
								localization={prevEvent.location}
								slug={prevEvent.entity.slug}
								startDate={new Date(prevEvent.duration.start)}
								title={prevEvent.title}
								variant="homepage"
							/>
						</div>
					)}
					{nextEvent && (
						<div className="px-2 gap-10 flex flex-col max-w-full">
							<Typography variant="h4">{t("nextEvent")}</Typography>
							<EventCard
								endDate={nextEvent.duration.end}
								localization={nextEvent.location}
								slug={nextEvent.entity.slug}
								startDate={new Date(nextEvent.duration.start)}
								title={nextEvent.title}
								variant="homepage"
							/>
						</div>
					)}
				</div>
			</div>
		</Main>
	);
}
