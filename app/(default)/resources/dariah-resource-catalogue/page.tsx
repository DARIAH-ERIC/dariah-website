import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { Main } from "@/app/(default)/_components/main";
import { SearchContainer } from "@/components/pages/resources/dariah-resource-catalogue/search-container";
import { DariahResourceCatalogueContextrovider } from "@/context/dariah-resource-catalogue-context";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";

interface DariahResourceCataloguePageProps extends PageProps<"/resources/dariah-resource-catalogue"> {}

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("DariahResourceCataloguePage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function DariahResourceCataloguePage(
	_props: Readonly<DariahResourceCataloguePageProps>,
): Promise<ReactNode> {
	const breadcrumbs = navigation().breadcrumbs.dariahResourceCatalogue.breadcrumbs;
	const filters = navigation().breadcrumbs.dariahResourceCatalogue.filters;

	const workingGroupsResponse = await client.workingGroups.list({ limit: 100 });
	const nationalConsortiaResponse = await client.nationalConsortia.list({ limit: 100 });

	const { data: workingGroups } = workingGroupsResponse.data;
	const { data: nationalConsortia } = nationalConsortiaResponse.data;

	return (
		<Main className="container relative flex flex-col gap-16 items-end">
			<div className="absolute inset-0 mask-(--resource-catalogue-divider) bg-(image:--resource-catalogue-divider) h-20 backdrop-blur-[80px]" />

			<Suspense>
				<DariahResourceCatalogueContextrovider
					initialNationalConsortia={nationalConsortia}
					initialWorkingGroups={workingGroups}
				>
					<SearchContainer breadcrumbs={breadcrumbs} filters={filters} />
				</DariahResourceCatalogueContextrovider>
			</Suspense>
		</Main>
	);
}
