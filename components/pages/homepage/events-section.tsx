import React, { type ReactNode } from "react";

import { EventCard } from "@/components/ui/event-card/event-card";
import { Link } from "@/components/ui/link/link";

export function EventsSection(): ReactNode {
	return (
		<section className="bg-(image:--section-events-bg) px-31.5 py-17.5 flex flex-col gap-17.5 items-end">
			<p className="text-h1 text-white font-heading text-[85px] font-light w-full">
				{"Upcoming Events"}
			</p>
			<div className="flex gap-32.25 w-full">
				<EventCard
					endDate={"2025-08-2"}
					localization={"Besançon, France"}
					startDate={"2025-07-21"}
					title={"European Summer University in Digital Humanities “Culture and Technology” 2025"}
				/>
				<EventCard
					endDate={"2025-08-8"}
					localization={"Riga / Latvia"}
					startDate={"2025-08-4"}
					title={
						"7th Baltic Summer School of Digital Humanities: Digital Methods for History Studies"
					}
				/>
				<EventCard
					endDate={"2025-09-1"}
					localization={"Berlin / Germany"}
					startDate={"2025-09-5"}
					title={"ATRIUM Summer School on Automatic Text Recognition"}
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
