import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { SectionPanel } from "@/components/pages/static-pages/section-panel";
import { BackToTop } from "@/components/ui/back-to-top/back-to-top";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { Document } from "@/components/ui/document/document";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";
import { getSectionsFromGroups, sortDocumentsByGroup } from "@/utils/document-page.utils";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("DocumentsPoliciesPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function DocumentsPoliciesPage(): Promise<ReactNode> {
	const t = await getTranslations("DocumentsPoliciesPage");

	const response = await client.documentsPolicies.list({ limit: 100 });
	const breadcrumbs = navigation().breadcrumbs.documentsAndPolicies;

	const { data: items } = response.data;
	const sortedDocuments = sortDocumentsByGroup(items);
	const sections = getSectionsFromGroups(items);

	return (
		<Main className="flex flex-1 flex-col gap-14 px-4 pt-8 pb-30 container lg:items-center 2xl:px-31.5">
			<div className="flex flex-col gap-14 w-full">
				{breadcrumbs.length > 0 && (
					<Breadcrumbs>
						{breadcrumbs.map(({ label, href }) => {
							return (
								<Breadcrumb key={label} href={href}>
									{label}
								</Breadcrumb>
							);
						})}
					</Breadcrumbs>
				)}
				<Typography variant="h2">{t("title")}</Typography>
			</div>
			<div className="flex-col flex gap-8 max-w-full items-center lg:items-start lg:justify-between lg:flex-row lg:gap-21">
				<SectionPanel className="w-82" sections={sections} />
				<div className="flex flex-col gap-14">
					{sections.map((section) => {
						const itemsForSection = sortedDocuments[section];
						if (!itemsForSection) return null;

						return (
							<div key={section} className="flex gap-6 flex-col">
								<Typography id={section} variant="h3">
									{section}
								</Typography>
								<ul className="flex flex-col">
									{itemsForSection.map((item, index) => {
										const {
											id,
											document: { url },
											title,
										} = item;
										return (
											<Document key={id} documentUrl={url} isEven={index % 2 === 0} title={title} />
										);
									})}
								</ul>
							</div>
						);
					})}
				</div>
			</div>
			<BackToTop />
		</Main>
	);
}
