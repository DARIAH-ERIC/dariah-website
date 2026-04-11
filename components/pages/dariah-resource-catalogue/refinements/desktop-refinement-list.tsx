import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useRefinementList, type UseRefinementListProps } from "react-instantsearch";

import { RefinementListItems } from "@/components/pages/dariah-resource-catalogue/refinements/refinement-list-item";
import { Typography } from "@/components/ui/typography/typography";
import type { ResourceCatalogueSubfilter } from "@/types/filters";

export function DesktopRefinementList(
	props: Readonly<UseRefinementListProps & { subfilters?: ResourceCatalogueSubfilter }>,
): ReactNode {
	const t = useTranslations("DariahResourceCataloguePage");
	const { attribute, subfilters } = props;
	const { items, isShowingMore, toggleShowMore, refine, canToggleShowMore } =
		useRefinementList(props);

	const itemsToShow = isShowingMore ? items : items.slice(0, 6);

	if (itemsToShow.length <= 0) return null;

	return (
		<div className="flex flex-col gap-2">
			<Typography variant="h4">{t(`filter.${attribute}` as never)}</Typography>
			<RefinementListItems
				canToggleShowMore={canToggleShowMore}
				isShowingMore={isShowingMore}
				itemsToShow={itemsToShow}
				refine={refine}
				subfilters={subfilters}
				toggleShowMore={toggleShowMore}
			/>
		</div>
	);
}
