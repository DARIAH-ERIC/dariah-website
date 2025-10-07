import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Card } from "@/components/card";
import { MainContent } from "@/components/main-content";
import { defaultLocale } from "@/lib/i18n/locales";
import { createCollectionResource, createSingletonResource } from "@/lib/keystatic/resources";

export async function generateMetadata(): Promise<Metadata> {
	const page = await createSingletonResource("working-groups-overview", defaultLocale).read();

	const { title } = page.data;

	const metadata: Metadata = {
		title,
	};
	return metadata;
}

export default async function WorkingGroupsPage(): Promise<ReactNode> {
	const page = await createSingletonResource("working-groups-overview", defaultLocale).read();

	const { title, lead } = page.data;

	const entries = await createCollectionResource("working-groups", defaultLocale).all();

	return (
		<MainContent>
			<h1 className="text-h1 text-balance">{title}</h1>
			<p>{lead}</p>

			<ul
				className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),1fr))] gap-8"
				role="list"
			>
				{entries.map(async (workinggroupobj) => {
					const id = workinggroupobj.id;
					const workingGroupItem = await createCollectionResource(
						"working-groups",
						defaultLocale,
					).read(id);
					const link = { label: "", href: `/working-groups/${id}` };
					return (
						<li key={id}>
							<Card
								className="grid h-full grid-rows-[13rem_auto]"
								discriminent="working-group"
								{...workingGroupItem.data}
								link={link}
								reference={id}
								title={workingGroupItem.data.name}
							/>
						</li>
					);
				})}
			</ul>
		</MainContent>
	);
}
