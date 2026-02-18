import React, { type ReactNode } from "react";

import { EventCard } from "@/components/ui/event-card/event-card";
import { Link } from "@/components/ui/link/link";
import { Typography } from "@/components/ui/typography/typography";

export function EventsSection(): ReactNode {
	return (
		<section className="bg-(image:--section-events-bg) flex flex-col gap-17.5 items-end relative py-17.5 lg:px-31.5">
			<Typography
				className="text-white font-heading text-[56px] px-6 font-light w-full lg:text-[85px]"
				variant="h1"
			>
				{"Upcoming Events"}
			</Typography>
			<div className="flex flex-wrap justify-center gap-32.25 w-full">
				<EventCard
					endDate={"2025-08-2"}
					localization={"Besançon, France"}
					startDate={"2025-07-21"}
					status="upcoming"
					title={"European Summer University in Digital Humanities “Culture and Technology” 2025"}
					type="training"
					variant="homepage"
				/>
				<EventCard
					endDate={"2025-08-8"}
					localization={"Riga / Latvia"}
					startDate={"2025-08-4"}
					status="upcoming"
					title={
						"7th Baltic Summer School of Digital Humanities: Digital Methods for History Studies"
					}
					type="training"
					variant="homepage"
				/>
				<EventCard
					endDate={"2025-09-1"}
					localization={"Berlin / Germany"}
					startDate={"2025-09-5"}
					status="upcoming"
					title={"ATRIUM Summer School on Automatic Text Recognition"}
					type="training"
					variant="homepage"
				/>
			</div>
			<div className="bg-white w-51.5 max-w-full py-5 px-6 lg:w-124.25">
				<Link href="/news" variant="primary" withDefaultRightIcon={true}>
					{"See all news"}
				</Link>
			</div>
		</section>
	);
}
