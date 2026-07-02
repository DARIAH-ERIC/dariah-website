"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { type ReactNode } from "react";
import { Configure, InstantSearch } from "react-instantsearch";

import { Hit, Hits } from "@/components/pages/resources/dariah-resource-catalogue/hits";
import { Refinements } from "@/components/pages/resources/dariah-resource-catalogue/refinements/refinements";
import { SearchBox } from "@/components/pages/resources/dariah-resource-catalogue/search-box";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { SearchError } from "@/components/ui/typesense-multiuse/search-error";
import { SearchErrorBoundary } from "@/components/ui/typesense-multiuse/search-error-boundary";
import { TypesensePagination } from "@/components/ui/typesense-multiuse/typesense-pagination";
import { Typography } from "@/components/ui/typography/typography";
import { env } from "@/config/env.config";
import { searchResourceClient } from "@/lib/search/client";
import type { ResourceCatalogueFilter } from "@/types/filters";

interface SearchContainerProps {
	breadcrumbs: Array<{ href: string; label: string } | { label: string; href?: undefined }>;
	filters: Array<ResourceCatalogueFilter>;
}

export function SearchContainer(props: Readonly<SearchContainerProps>): ReactNode {
	const t = useTranslations("DariahResourceCataloguePage");
	const { breadcrumbs, filters } = props;
	const searchParams = useSearchParams();

	const envCollectionName = env.NEXT_PUBLIC_TYPESENSE_RESOURCE_COLLECTION_NAME;

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
			searchClient={searchResourceClient}
		>
			<Configure hitsPerPage={12} />
			<SearchErrorBoundary fallback={<SearchError />}>
				<div className="flex-col px-4 gap-16 w-full flex xl:px-20 3xl:px-40">
					<div className="flex flex-col gap-14 pt-8">
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
						<div className="flex flex-col gap-12 lg:gap-7 xl:px-19 3xl:px-39">
							<div className="flex flex-col gap-7">
								<Typography className="font-heading text-[45px] font-light" variant="h1">
									{t("title")}
								</Typography>
								<Typography variant="regular">{t("description")}</Typography>
							</div>
							<SearchBox />
						</div>
					</div>
					<div className="flex flex-col gap-18 lg:gap-3.5 lg:flex-row">
						<Refinements refinements={filters} />
						<Hits hitComponent={Hit} />
					</div>
				</div>
			</SearchErrorBoundary>
			<TypesensePagination pageUrlAlias="dariah-resources[page]" />
		</InstantSearch>
	);
}
