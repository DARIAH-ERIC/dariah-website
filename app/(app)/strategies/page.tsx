import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Card } from "@/components/card";
import { MainContent } from "@/components/main-content";
import { defaultLocale } from "@/lib/i18n/locales";
import { createCollectionResource, createSingletonResource } from "@/lib/keystatic/resources";

export async function generateMetadata(): Promise<Metadata> {
	const page = await createSingletonResource("strategies-overview", defaultLocale).read();

	const { title } = page.data;

	const metadata: Metadata = {
		title,
	};

	return metadata;
}

export default async function StrategiesPage(): Promise<ReactNode> {
	const page = await createSingletonResource("strategies-overview", defaultLocale).read();

	const { title, lead } = page.data;

	const entries = await createCollectionResource("strategies", defaultLocale).all();

	return (
		<MainContent>
			<h1 className="text-h1 text-balance">{title}</h1>
			<p>{lead}</p>

			<ul
				className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),1fr))] gap-8"
				role="list"
			>
				{entries.map(async (strategiesobj) => {
					const id = strategiesobj.id;
					const strategiesItem = await createCollectionResource("strategies", defaultLocale).read(
						id,
					);
					const link = { label: "", href: `/strategies/${id}` };
					return (
						<li key={id}>
							<Card
								className="grid h-full grid-rows-[13rem_auto]"
								discriminent="strategy"
								{...strategiesItem.data}
								link={link}
							/>
						</li>
					);
				})}
			</ul>
		</MainContent>
	);
}
