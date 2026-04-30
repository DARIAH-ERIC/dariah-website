"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { type ReactNode } from "react";
import { Configure, InstantSearch } from "react-instantsearch";

import { Hit, Hits } from "@/components/pages/resources/search/hits";
import { MenuSelect } from "@/components/pages/resources/search/menu-select";
import { SearchBox } from "@/components/pages/resources/search/search-box";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { SearchError } from "@/components/ui/typesense-multiuse/search-error";
import { SearchErrorBoundary } from "@/components/ui/typesense-multiuse/search-error-boundary";
import { TypesensePagination } from "@/components/ui/typesense-multiuse/typesense-pagination";
import { Typography } from "@/components/ui/typography/typography";
import { env } from "@/config/env.config";
import { searchSearchClient } from "@/lib/search/client";

interface SearchContainerProps {
	breadcrumbs: Array<{ href: string; label: string } | { label: string; href?: undefined }>;
}

export function SearchContainer(props: Readonly<SearchContainerProps>): ReactNode {
	const t = useTranslations("SearchPage");
	const { breadcrumbs } = props;
	const searchParams = useSearchParams();

	const envCollectionName = env.NEXT_PUBLIC_TYPESENSE_SEARCH_COLLECTION_NAME;

	const query = searchParams.get("query") ?? "";
	const pageUrlStringValue = searchParams.get("page");
	const pageUrlValue = pageUrlStringValue !== null ? Number.parseInt(pageUrlStringValue) : 0;

	return (
		<InstantSearch
			indexName={envCollectionName}
			initialUiState={{
				[envCollectionName]: {
					query,
					page: pageUrlValue,
				},
			}}
			routing={true}
			searchClient={searchSearchClient}
		>
			<Configure hitsPerPage={8} />
			<SearchErrorBoundary fallback={<SearchError />}>
				<div className="flex-col gap-8 w-full flex">
					<div className="px-4 pt-8 lg:px-34.5">
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
					</div>
					<div className="flex flex-col px-4 gap-10 lg:px-40 2xl:px-110">
						<Typography variant="h2">{t("title")}</Typography>
						<div className="flex flex-wrap w-full justify-between items-end gap-8">
							<SearchBox />
							<MenuSelect attribute="type" />
						</div>
						<Hits hitComponent={Hit} />
					</div>
				</div>
			</SearchErrorBoundary>
			<TypesensePagination pageUrlAlias="dariah-website[page]" />
		</InstantSearch>
	);
}
