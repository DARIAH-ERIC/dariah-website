import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { SearchContainer } from "@/components/pages/dariah-resource-catalogue/search-container";
import { client } from "@/lib/data/client";

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
	const breadcrumbs = await client.dariahResourceCatalogue.breadcrumbs();
	const filters = await client.dariahResourceCatalogue.filters();

	return (
		<Main className="container flex flex-col gap-16 items-end">
			<SearchContainer breadcrumbs={breadcrumbs} filters={filters} />
		</Main>
	);
}
