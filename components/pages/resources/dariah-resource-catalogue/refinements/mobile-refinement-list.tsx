import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useRefinementList, type UseRefinementListProps } from "react-instantsearch";

import { RefinementListItems } from "@/components/pages/resources/dariah-resource-catalogue/refinements/refinement-list-item";
import {
	Disclosure,
	DisclosureHeader,
	DisclosurePanel,
} from "@/components/ui/disclosure/disclosure";
import type { ResourceCatalogueSubfilter } from "@/types/filters";

type MobileRefinementListProps = UseRefinementListProps & {
	subfilters?: ResourceCatalogueSubfilter;
	labelType?: "translation" | "api";
};

export function MobileRefinementList(props: Readonly<MobileRefinementListProps>): ReactNode {
	const t = useTranslations("DariahResourceCataloguePage");
	const { attribute, subfilters, labelType } = props;
	const { items, isShowingMore, toggleShowMore, refine, canToggleShowMore } =
		useRefinementList(props);

	const itemsToShow = isShowingMore ? items : items.slice(0, 6);

	if (itemsToShow.length <= 0) return null;

	return (
		<Disclosure>
			<DisclosureHeader variant="white-bg">{t(`filter.${attribute}` as never)}</DisclosureHeader>
			<DisclosurePanel>
				<RefinementListItems
					attribute={attribute}
					canToggleShowMore={canToggleShowMore}
					isShowingMore={isShowingMore}
					itemsToShow={itemsToShow}
					labelType={labelType}
					refine={refine}
					subfilters={subfilters}
					toggleShowMore={toggleShowMore}
				/>
			</DisclosurePanel>
		</Disclosure>
	);
}
