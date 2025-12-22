import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import * as v from "valibot";

import { Main } from "@/app/(default)/_components/main";
import { env } from "@/config/env.config";
import { client } from "@/lib/search/client";
import { type ResourceCollectionDocument, resources } from "@/lib/search/schema";

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
	props: Readonly<DariahResourceCataloguePageProps>,
): Promise<ReactNode> {
	const { searchParams } = props;

	const t = await getTranslations("DariahResourceCataloguePage");

	const filters = v.parse(
		v.object({
			q: v.fallback(v.string(), ""),
		}),
		await searchParams,
	);

	const { hits: items = [] } = await client
		.collections<ResourceCollectionDocument>(env.NEXT_PUBLIC_TYPESENSE_RESOURCE_COLLECTION_NAME)
		.documents()
		.search({
			...filters,
			query_by: resources.queryableFields,
		});

	return (
		<Main className="container flex flex-1 flex-col gap-8 px-8 py-12 xs:px-16">
			<h1>{t("title")}</h1>
			<ul className="flex flex-col gap-4" role="list">
				{items.map((item) => {
					const { description, id, label } = item.document;

					return (
						<li key={id}>
							<article className="flex flex-col gap-2">
								<h2>
									{label} {label}
								</h2>
								<div>{description}</div>
							</article>
						</li>
					);
				})}
			</ul>
		</Main>
	);
}
