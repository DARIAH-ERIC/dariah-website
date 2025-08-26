import type { Metadata, ResolvingMetadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { Card } from "@/components/card";
import { MainContent } from "@/components/main-content";
import type { Locale } from "@/config/i18n.config";
import { createCollectionResource, createSingletonResource } from "@/lib/keystatic/resources";

interface DocumentAndPoliciesOverviewPageProps {
	params: {
		locale: Locale;
	};
}

export async function generateMetadata(
	props: Readonly<DocumentAndPoliciesOverviewPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = params;

	const documentsPoliciesOverview = await createSingletonResource(
		"documents-and-policies-overview",
		locale,
	).read();

	const metadata: Metadata = {
		title: documentsPoliciesOverview.data.title,
	};
	return metadata;
}

export default async function DocumentAndPoliciesOverviewPage(
	props: Readonly<DocumentAndPoliciesOverviewPageProps>,
): Promise<ReactNode> {
	const { params } = props;

	const { locale } = params;

	setRequestLocale(locale);

	const documentsPoliciesOverview = await createSingletonResource(
		"documents-and-policies-overview",
		locale,
	).read();
	const documentsPolicies = await createCollectionResource("documents-and-policies", locale).all();

	return (
		<MainContent className="layout-grid content-start">
			<section className="layout-subgrid relative gap-y-12 py-16 xs:py-24">
				<header>
					<h1 className="text-balance font-heading text-heading-1 font-strong text-text-strong">
						{documentsPoliciesOverview.data.title}
					</h1>
					<p className="mt-6 font-heading text-heading-4 text-text-weak">
						{documentsPoliciesOverview.data.lead}
					</p>
				</header>
				<ul
					className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),1fr))] gap-8"
					role="list"
				>
					{documentsPolicies.map(async (documentspoliciesobj) => {
						const id = documentspoliciesobj.id;
						const documentsPolicyItem = await createCollectionResource(
							"documents-and-policies",
							locale,
						).read(id);
						const link = { label: "", href: `/documents-and-policies/${id}` };
						return (
							<li key={id}>
								<Card
									className="grid h-full grid-rows-[13rem,auto]"
									discriminent="document-or-policy"
									{...documentsPolicyItem.data}
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
