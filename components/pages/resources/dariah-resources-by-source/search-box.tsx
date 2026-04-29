"use client";

import { useTranslations } from "next-intl";
import React, { type ReactNode } from "react";
import { Configure, InstantSearch } from "react-instantsearch";

import { SearchError } from "@/components/pages/resources/dariah-resource-catalogue/search-error";
import { SearchErrorBoundary } from "@/components/pages/resources/dariah-resource-catalogue/search-error-boundary";
import { Hit, Hits } from "@/components/pages/resources/dariah-resources-by-source/hits";
import { Typography } from "@/components/ui/typography/typography";
import { env } from "@/config/env.config";
import { searchClient } from "@/lib/search/client";

interface SearchContainerProps {
	source: "ssh-open-marketplace" | "episciences" | "dariah-campus";
}

export function SearchContainer(props: Readonly<SearchContainerProps>): ReactNode {
	const t = useTranslations("DariahResourcesPage");
	const { source } = props;

	const envCollectionName = env.NEXT_PUBLIC_TYPESENSE_RESOURCE_COLLECTION_NAME;

	return (
		<InstantSearch indexName={envCollectionName} routing={true} searchClient={searchClient}>
			<Configure
				filters={`source:=['${source}']`}
				hitsPerPage={6}
				sortFacetValuesBy={"source_updated_at"}
			/>
			<SearchErrorBoundary fallback={<SearchError />}>
				<div className="flex flex-col gap-14 p-4 lg:px-32.5">
					<Typography variant="h4">{t("discover")}</Typography>
					<Hits hitComponent={Hit} />
				</div>
			</SearchErrorBoundary>
		</InstantSearch>
	);
}
