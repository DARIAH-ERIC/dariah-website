import type { Metadata, ResolvingMetadata } from "next";
import type { ReactNode } from "react";

import { Card } from "@/components/card";
import { MainContent } from "@/components/main-content";
import { defaultLocale } from "@/lib/i18n/locales";
import { createCollectionResource, createSingletonResource } from "@/lib/keystatic/resources";

interface ImpactCaseStudyOverviewPageProps {}

export async function generateMetadata(
	_props: Readonly<ImpactCaseStudyOverviewPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const impactCaseStudiesOverview = await createSingletonResource(
		"impact-case-studies-overview",
		defaultLocale,
	).read();

	const metadata: Metadata = {
		title: impactCaseStudiesOverview.data.title,
	};
	return metadata;
}

export default async function ImpactCaseStudyOverviewPage(
	_props: Readonly<ImpactCaseStudyOverviewPageProps>,
): Promise<ReactNode> {
	const impactCaseStudiesOverview = await createSingletonResource(
		"impact-case-studies-overview",
		defaultLocale,
	).read();
	const impactCaseStudies = await createCollectionResource(
		"impact-case-studies",
		defaultLocale,
	).all();

	return (
		<MainContent className="layout-grid content-start">
			<section className="layout-subgrid relative gap-y-12 py-16 xs:py-24">
				<header>
					<h1 className="text-balance font-heading text-heading-1 font-strong text-text-strong">
						{impactCaseStudiesOverview.data.title}
					</h1>
					<p className="mt-6 font-heading text-heading-4 text-text-weak">
						{impactCaseStudiesOverview.data.lead}
					</p>
				</header>
				<ul
					className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),1fr))] gap-8"
					role="list"
				>
					{impactCaseStudies.map(async (impactcasestudiesobj) => {
						const id = impactcasestudiesobj.id;
						const impactCaseStudiesItem = await createCollectionResource(
							"impact-case-studies",
							defaultLocale,
						).read(id);
						const link = { label: "", href: `/impact-case-studies/${id}` };
						return (
							<li key={id}>
								<Card
									className="grid h-full grid-rows-[13rem,auto]"
									discriminent="impact-case-study"
									{...impactCaseStudiesItem.data}
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
