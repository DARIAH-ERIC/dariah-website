import type { Metadata } from "next";
import type { ReactNode } from "react";

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

			<ul role="list">
				{entries.map((entry) => {
					const { id } = entry;
					const _href = `/strategies/${id}`;

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
