import type { Metadata, ResolvingMetadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { Card } from "@/components/card";
import { MainContent } from "@/components/main-content";
import type { Locale } from "@/config/i18n.config";
import { createCollectionResource, createSingletonResource } from "@/lib/keystatic/resources";

interface ImpactCaseStudyOverviewPageProps {
	params: {
		locale: Locale;
	};
}

export async function generateMetadata(
	props: Readonly<ImpactCaseStudyOverviewPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = params;

	const impactCaseStudiesOverview = await createSingletonResource(
		"impact-case-studies-overview",
		locale,
	).read();

	const metadata: Metadata = {
		title: impactCaseStudiesOverview.data.title,
	};
	return metadata;
}

export default async function ImpactCaseStudyOverviewPage(
	props: Readonly<ImpactCaseStudyOverviewPageProps>,
): Promise<ReactNode> {
	const { params } = props;

	const { locale } = params;

	setRequestLocale(locale);

	const impactCaseStudiesOverview = await createSingletonResource(
		"impact-case-studies-overview",
		locale,
	).read();
	const impactCaseStudies = await createCollectionResource("impact-case-studies", locale).all();

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
							locale,
						).read(id);
						const link = { label: "", href: `/impact-case-studies/${id}` };
						return (
							<li key={id}>
								<Card
									className="grid h-full grid-rows-[13rem,auto]"
									discriminent="impact-case-study"
									{...impactCaseStudiesItem.data}
									link={link}
									locale={locale}
								></Card>
							</li>
						);
					})}
				</ul>
			</section>
		</MainContent>
	);
}
