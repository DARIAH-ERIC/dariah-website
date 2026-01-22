import React, { type ReactNode } from "react";

import { EventCard } from "@/components/ui/event-card/event-card";
import { Link } from "@/components/ui/link/link";
import { Typography } from "@/components/ui/typography/typography";

export function EventsSection(): ReactNode {
	return (
		<section className="bg-(image:--section-events-bg) px-31.5 py-17.5 flex flex-col gap-17.5 items-end">
			<Typography className="text-white font-heading text-[85px] font-light w-full" variant="h1">
				{"Upcoming Events"}
			</Typography>
			<div className="flex gap-32.25 w-full">
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
			<div className="bg-white w-124.25 max-w-full py-5 px-6">
				<Link href="/news" variant="primary" withRightIcon={true}>
					{"See all news"}
				</Link>
			</div>
		</section>
	);
}
