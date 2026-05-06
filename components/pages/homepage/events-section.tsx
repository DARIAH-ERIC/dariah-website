import { useTranslations } from "next-intl";
import React, { type ReactNode } from "react";

import { EventCard } from "@/components/ui/event-card/event-card";
import { Link } from "@/components/ui/link/link";
import { Typography } from "@/components/ui/typography/typography";

interface EventsSectionProps {
	events: Array<{
		id: string;
		title: string;
		summary: string;
		location: string;
		isFullDay: boolean;
		image: { url: string };
		entity: { slug: string };
		publishedAt: Date;
		duration: { start: Date; end: Date | undefined };
	}>;
}

export function EventsSection(props: Readonly<EventsSectionProps>): ReactNode {
	const { events } = props;
	const t = useTranslations("HomePage");

	return (
		<section className="bg-(image:--section-events-bg) flex flex-col gap-17.5 items-end relative px-6 py-17.5 lg:px-31.5">
			<Typography
				className="text-white font-heading text-[56px] px-6 font-light w-full lg:text-[85px]"
				variant="h1"
			>
				{t("EventsSection.upcomingEvents")}
			</Typography>
			<div className="flex flex-wrap justify-center gap-32.25 w-full">
				{events.map((event) => {
					const { duration, entity, id, location, title } = event;

					return (
						<EventCard
							key={id}
							endDate={duration.end}
							localization={location}
							slug={entity.slug}
							startDate={duration.start}
							title={title}
							type="training"
							variant="homepage"
						/>
					);
				})}
			</div>
			<div className="bg-white w-51.5 max-w-full py-5 px-6 lg:w-124.25">
				<Link href="/events" variant="primary" withDefaultRightIcon={true}>
					{t("EventsSection.seeAll")}
				</Link>
			</div>
		</section>
	);
}
