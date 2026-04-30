import { useTranslations } from "next-intl";
import type { ElementType, ReactNode } from "react";
import { useHits, type UseHitsProps, useInstantSearch } from "react-instantsearch";

import { SearchItem } from "@/components/ui/search-item/search-item";
import { Typography } from "@/components/ui/typography/typography";
import type { SearchCollectionItem } from "@/lib/search/schema";

export function Hit({ hit }: Readonly<{ hit: SearchCollectionItem }>): ReactNode {
	const { label, description, type, link, imported_at } = hit;

	return (
		<SearchItem
			date={new Date(imported_at)}
			description={description}
			href={link}
			title={label}
			type={type}
		/>
	);
}

export function Hits(
	props: Readonly<UseHitsProps<SearchCollectionItem> & { hitComponent?: ElementType }>,
): ReactNode {
	const t = useTranslations("SearchPage");
	const { status } = useInstantSearch();
	const { items, results } = useHits(props);
	const { nbHits, query } = results ?? {};
	const { hitComponent } = props;

	const count = nbHits?.toString() ?? "0";
	const queryToInfoText =
		query !== undefined && query.trim() !== "" && query !== "*" ? `for "${query}"` : "";

	const Component: ElementType = hitComponent ?? Hit;

	if (items.length === 0 && status === "idle") {
		return (
			<div className="max-w-301 w-full">
				<Typography className="text-center" variant="regular">
					{t("hits.empty")}
				</Typography>
			</div>
		);
	}

	return (
		<>
			<Typography variant="h4">{t("resultsInfo", { count, query: queryToInfoText })}</Typography>
			<ul className="list-none flex flex-col gap-8 max-w-301">
				{items.map((hit) => {
					return <Component key={hit.objectID} hit={hit} />;
				})}
			</ul>
		</>
	);
}
