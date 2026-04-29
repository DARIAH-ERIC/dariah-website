import type { ReactNode } from "react";

import { SubrefinementList } from "@/components/pages/resources/dariah-resource-catalogue/refinements/subrefinement-list";
import { Button } from "@/components/ui/button/button";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { ChevronDownIcon } from "@/components/ui/icons/chevron-down";
import { ChevronUpIcon } from "@/components/ui/icons/chevron-up";
import type { ResourceCatalogueSubfilter } from "@/types/filters";

export interface RefinementListItem {
	value: string;
	label: string;
	highlighted?: string;
	count: number;
	isRefined: boolean;
}

export function RefinementListItems(
	props: Readonly<{
		canToggleShowMore: boolean;
		itemsToShow: Array<RefinementListItem>;
		isShowingMore: boolean;
		refine: (value: string) => void;
		subfilters?: ResourceCatalogueSubfilter;
		toggleShowMore: () => void;
	}>,
): ReactNode {
	const { itemsToShow, subfilters, toggleShowMore, refine, canToggleShowMore, isShowingMore } =
		props;

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
								label={item.label}
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
					{!isShowingMore ? "See more" : "See less"}
				</Button>
			)}
		</div>
	);
}
