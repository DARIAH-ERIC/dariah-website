import type { Metadata } from "next";
import type { ReactNode } from "react";

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

			<ul role="list">
				{entries.map((entry) => {
					const { id } = entry;
					const _href = `/working-groups/${id}`;

					return (
						<li key={id}>
							<article>
								<pre>{JSON.stringify(entry.data, null, 2)}</pre>
							</article>
						</li>
					);
				})}
			</ul>
		</MainContent>
	);
}
