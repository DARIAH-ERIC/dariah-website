import type { Metadata, ResolvingMetadata } from "next";
import type { ReactNode } from "react";

import { Card } from "@/components/card";
import { MainContent } from "@/components/main-content";
import { defaultLocale } from "@/lib/i18n/locales";
import { createCollectionResource, createSingletonResource } from "@/lib/keystatic/resources";

interface EventsOverviewPageProps {}

export async function generateMetadata(
	_props: Readonly<EventsOverviewPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const eventsOverview = await createSingletonResource("events-overview", defaultLocale).read();

	const metadata: Metadata = {
		title: eventsOverview.data.title,
	};

	return metadata;
}

export default async function EventsOverviewPage(
	_props: Readonly<EventsOverviewPageProps>,
): Promise<ReactNode> {
	const eventsOverview = await createSingletonResource("events-overview", defaultLocale).read();
	const events = await createCollectionResource("events", defaultLocale).all();

	return (
		<MainContent className="layout-grid content-start">
			<section className="layout-subgrid relative gap-y-12 py-16 xs:py-24">
				<header>
					<h1 className="text-balance font-heading text-heading-1 font-strong text-text-strong">
						{eventsOverview.data.title}
					</h1>
					<p className="mt-6 font-heading text-heading-4 text-text-weak">
						{eventsOverview.data.lead}
					</p>
				</header>
				<ul
					className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),1fr))] gap-8"
					role="list"
				>
					{events.map(async (event) => {
						const id = event.id;
						const eventItem = await createCollectionResource("events", defaultLocale).read(id);
						const link = { label: "", href: `/events/${id}` };
						return (
							<li key={id}>
								<Card
									className="grid h-full grid-rows-[13rem,auto]"
									discriminent="event"
									{...eventItem.data}
									link={link}
								></Card>
							</li>
						);
					})}
				</ul>
			</section>
		</MainContent>
	);
}
