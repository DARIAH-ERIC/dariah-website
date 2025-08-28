import type { Metadata, ResolvingMetadata } from "next";
import type { ReactNode } from "react";

import { Card } from "@/components/card";
import { MainContent } from "@/components/main-content";
import { defaultLocale } from "@/lib/i18n/locales";
import { createCollectionResource, createSingletonResource } from "@/lib/keystatic/resources";

interface NewsOverviewPageProps {}

export async function generateMetadata(
	_props: Readonly<NewsOverviewPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const newsOverview = await createSingletonResource("news-overview", defaultLocale).read();

	const metadata: Metadata = {
		title: newsOverview.data.title,
	};
	return metadata;
}

export default async function NewsOverviewPage(
	_props: Readonly<NewsOverviewPageProps>,
): Promise<ReactNode> {
	const newsOverview = await createSingletonResource("news-overview", defaultLocale).read();
	const news = await createCollectionResource("news", defaultLocale).all();

	return (
		<MainContent className="layout-grid content-start">
			<section className="layout-subgrid relative gap-y-12 py-16 xs:py-24">
				<header>
					<h1 className="text-balance font-heading text-heading-1 font-strong text-text-strong">
						{newsOverview.data.title}
					</h1>
					<p className="mt-6 font-heading text-heading-4 text-text-weak">
						{newsOverview.data.lead}
					</p>
				</header>
				<ul
					className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),1fr))] gap-8"
					role="list"
				>
					{news.map(async (newsobj) => {
						const id = newsobj.id;
						const newsItem = await createCollectionResource("news", defaultLocale).read(id);
						const link = { label: "", href: `/news/${id}` };
						return (
							<li key={id}>
								<Card
									className="grid h-full grid-rows-[13rem,auto]"
									discriminent="news"
									{...newsItem.data}
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
