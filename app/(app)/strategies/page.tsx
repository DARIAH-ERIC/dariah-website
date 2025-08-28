import type { Metadata, ResolvingMetadata } from "next";
import type { ReactNode } from "react";

import { Card } from "@/components/card";
import { MainContent } from "@/components/main-content";
import { defaultLocale } from "@/lib/i18n/locales";
import { createCollectionResource, createSingletonResource } from "@/lib/keystatic/resources";

interface StrategiesOverviewPageProps {}

export async function generateMetadata(
	_props: Readonly<StrategiesOverviewPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const strategiesOverview = await createSingletonResource(
		"strategies-overview",
		defaultLocale,
	).read();

	const metadata: Metadata = {
		title: strategiesOverview.data.title,
	};
	return metadata;
}

export default async function StrategiesOverviewPage(
	_props: Readonly<StrategiesOverviewPageProps>,
): Promise<ReactNode> {
	const strategiesOverview = await createSingletonResource(
		"strategies-overview",
		defaultLocale,
	).read();
	const strategies = await createCollectionResource("strategies", defaultLocale).all();

	return (
		<MainContent className="layout-grid content-start">
			<section className="layout-subgrid relative gap-y-12 py-16 xs:py-24">
				<header>
					<h1 className="text-balance font-heading text-heading-1 font-strong text-text-strong">
						{strategiesOverview.data.title}
					</h1>
					<p className="mt-6 font-heading text-heading-4 text-text-weak">
						{strategiesOverview.data.lead}
					</p>
				</header>
				<ul
					className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),1fr))] gap-8"
					role="list"
				>
					{strategies.map(async (strategiesobj) => {
						const id = strategiesobj.id;
						const strategiesItem = await createCollectionResource("strategies", defaultLocale).read(
							id,
						);
						const link = { label: "", href: `/strategies/${id}` };
						return (
							<li key={id}>
								<Card
									className="grid h-full grid-rows-[13rem,auto]"
									discriminent="strategy"
									{...strategiesItem.data}
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
