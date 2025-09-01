import type { Metadata, ResolvingMetadata } from "next";
import type { ReactNode } from "react";

import { Card } from "@/components/card";
import { MainContent } from "@/components/main-content";
import { defaultLocale } from "@/lib/i18n/locales";
import { createCollectionResource, createSingletonResource } from "@/lib/keystatic/resources";

interface WorkingGroupsOverviewPageProps {}

export async function generateMetadata(
	_props: Readonly<WorkingGroupsOverviewPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const workingGroupsOverview = await createSingletonResource(
		"working-groups-overview",
		defaultLocale,
	).read();

	const metadata: Metadata = {
		title: workingGroupsOverview.data.title,
	};
	return metadata;
}

export default async function WorkingGroupsOverviewPage(
	_props: Readonly<WorkingGroupsOverviewPageProps>,
): Promise<ReactNode> {
	const workingGroupsOverview = await createSingletonResource(
		"working-groups-overview",
		defaultLocale,
	).read();
	const workingGroups = await createCollectionResource("working-groups", defaultLocale).all();

	return (
		<MainContent className="layout-grid content-start">
			<section className="layout-subgrid relative gap-y-12 py-16 xs:py-24">
				<header>
					<h1 className="text-balance font-heading text-heading-1 font-strong text-text-strong">
						{workingGroupsOverview.data.title}
					</h1>
					<p className="mt-6 font-heading text-heading-4 text-text-weak">
						{workingGroupsOverview.data.lead}
					</p>
				</header>
				<ul
					className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),1fr))] gap-8"
					role="list"
				>
					{workingGroups.map(async (workinggroupobj) => {
						const id = workinggroupobj.id;
						const workingGroupItem = await createCollectionResource(
							"working-groups",
							defaultLocale,
						).read(id);
						const link = { label: "", href: `/working-groups/${id}` };
						return (
							<li key={id}>
								<Card
									className="grid h-full grid-rows-[13rem,auto]"
									discriminent="working-group"
									{...workingGroupItem.data}
									link={link}
									reference={id}
									title={workingGroupItem.data.name}
								></Card>
							</li>
						);
					})}
				</ul>
			</section>
		</MainContent>
	);
}
