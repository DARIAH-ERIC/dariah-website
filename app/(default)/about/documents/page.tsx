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
import { createOpenGraphMetadata } from "@/lib/metadata/open-graph";
import { getSectionsFromGroups, splitDocumentsByGroup } from "@/utils/document-page.utils";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("DocumentsPoliciesPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		openGraph: await createOpenGraphMetadata({ title }),
	};

	return metadata;
}

export default async function DocumentsPoliciesPage(): Promise<ReactNode> {
	const t = await getTranslations("DocumentsPoliciesPage");

	const response = await client.documentsPolicies.tree();
	const breadcrumbs = navigation().breadcrumbs.documentsAndPolicies;

	const { data: items } = response.data;
	const { documentsWithoutGroup, documentsByGroup } = splitDocumentsByGroup(items);
	const sections = getSectionsFromGroups(documentsByGroup);

	return (
		<Main className="flex flex-1 flex-col gap-14 px-4 pt-8 pb-30 container lg:items-center 2xl:px-31.5">
			<div className="flex flex-col gap-14 w-full xl:px-8 2xl:px-0">
				{breadcrumbs.length > 0 && (
					<Breadcrumbs>
						{breadcrumbs.map(({ label, href }, index) => {
							return (
								<Breadcrumb
									key={label}
									aria-current={index === breadcrumbs.length - 1 ? "page" : undefined}
									href={href}
								>
									{label}
								</Breadcrumb>
							);
						})}
					</Breadcrumbs>
				)}
				<Typography className="text-h2" variant="h1">
					{t("title")}
				</Typography>
			</div>
			<div className="flex-col flex gap-8 max-w-full items-center lg:items-start lg:justify-between lg:flex-row 2xl:gap-21">
				<SectionPanel className="w-82" sections={sections} />
				<div className="flex flex-col gap-14">
					{items.length === 0 ? (
						<Typography variant="regular">{t("emptyState")}</Typography>
					) : (
						<>
							{documentsWithoutGroup.length > 0 && (
								<div className="flex gap-6 flex-col">
									{documentsWithoutGroup.map((document, index) => {
										const {
											id,
											document: { url },
											title,
										} = document;
										return (
											<Document key={id} documentUrl={url} isEven={index % 2 === 0} title={title} />
										);
									})}
								</div>
							)}

							{documentsByGroup.length > 0 &&
								documentsByGroup.map((section) => {
									return (
										<div key={section.id} className="flex gap-6 flex-col">
											<Typography className="text-h3" id={section.label} variant="h2">
												{section.label}
											</Typography>
											<ul className="flex flex-col">
												{section.items.length === 0 && (
													<Typography variant="regular">{t("emptyStateSection")}</Typography>
												)}
												{section.items.map((item, index) => {
													const {
														id,
														document: { url },
														title,
													} = item;
													return (
														<Document
															key={id}
															documentUrl={url}
															isEven={index % 2 === 0}
															title={title}
														/>
													);
												})}
											</ul>
										</div>
									);
								})}
						</>
					)}
				</div>
			</div>
			<BackToTop />
		</Main>
	);
}
