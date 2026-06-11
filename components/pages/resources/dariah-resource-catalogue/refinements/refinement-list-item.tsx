import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { SubrefinementList } from "@/components/pages/resources/dariah-resource-catalogue/refinements/subrefinement-list";
import { Button } from "@/components/ui/button/button";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { ChevronDownIcon } from "@/components/ui/icons/chevron-down";
import { ChevronUpIcon } from "@/components/ui/icons/chevron-up";
import { useDariahResourceCatalogueContext } from "@/context/dariah-resource-catalogue-context";
import type { ResourceCatalogueSubfilter } from "@/types/filters";

export interface RefinementListItem {
	value: string;
	label: string;
	highlighted?: string;
	count: number;
	isRefined: boolean;
}

interface RefinementListItemsProps {
	canToggleShowMore: boolean;
	itemsToShow: Array<RefinementListItem>;
	isShowingMore: boolean;
	refine: (value: string) => void;
	subfilters?: ResourceCatalogueSubfilter;
	toggleShowMore: () => void;
	labelType?: "translation" | "api";
	attribute?: string;
}

export function RefinementListItems(props: Readonly<RefinementListItemsProps>): ReactNode {
	const {
		itemsToShow,
		subfilters,
		toggleShowMore,
		refine,
		canToggleShowMore,
		isShowingMore,
		labelType,
		attribute,
	} = props;
	const t = useTranslations("DariahResourceCataloguePage");
	const { workingGroups, nationalConsortia } = useDariahResourceCatalogueContext();

	const getLabel = (label: string) => {
		if (labelType === "translation") return t(`filter.labelTranslation.${label}` as never);

		if (labelType === "api") {
			if (attribute === "working_groups") {
				const currentWG = workingGroups.find((workingGroup) => {
					return workingGroup.entity.slug === label;
				});
				return currentWG?.name ?? label.toLocaleUpperCase();
			} else if (attribute === "national_consortia") {
				const currentConsortium = nationalConsortia.find((nationalConsortium) => {
					return nationalConsortium.slug === label;
				});
				return currentConsortium?.name ?? label.toLocaleUpperCase();
			}
		}

		return label.toUpperCase();
	};

	return (
		<div>
			<ul>
				{itemsToShow.map((item) => {
					const subfilter = subfilters?.[item.label];

					if (subfilter) {
						const { name: subfilterName, ...rest } = subfilter;
						return (
							<SubrefinementList
								key={item.label}
								attribute={subfilterName}
								parentItem={item}
								refineParentItem={refine}
								{...rest}
							/>
						);
					}
					return (
						<li key={item.label}>
							<Checkbox
								isSelected={item.isRefined}
								label={getLabel(item.label)}
								onChange={() => {
									refine(item.value);
								}}
							/>
						</li>
					);
				})}
			</ul>
			{canToggleShowMore && (
				<Button
					endIcon={
						!isShowingMore ? (
							<ChevronDownIcon className="size-5" />
						) : (
							<ChevronUpIcon className="size-5" />
						)
					}
					onClick={toggleShowMore}
					variant="link-primary"
				>
					{!isShowingMore ? t("filter.seeMore") : t("filter.seeLess")}
				</Button>
			)}
		</div>
	);
}
