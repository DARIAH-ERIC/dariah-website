import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useRefinementList, type UseRefinementListProps } from "react-instantsearch";

import type { RefinementListItem } from "@/components/pages/dariah-resource-catalogue/refinements/refinement-list-item";
import { Button } from "@/components/ui/button/button";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { ChevronDownIcon } from "@/components/ui/icons/chevron-down";
import { ChevronUpIcon } from "@/components/ui/icons/chevron-up";
import { Typography } from "@/components/ui/typography/typography";

export interface SubrefinementListProps extends UseRefinementListProps {
	parentItem: RefinementListItem;
	refineParentItem: (value: string) => void;
}

export function SubrefinementList(props: Readonly<SubrefinementListProps>): ReactNode {
	const t = useTranslations("DariahResourceCataloguePage");
	const { parentItem, refineParentItem, ...refinementListProps } = props;
	const { attribute } = refinementListProps;
	const { items, isShowingMore, toggleShowMore, refine, canToggleShowMore } =
		useRefinementList(refinementListProps);

	const itemsToShow = isShowingMore ? items : items.slice(0, 6);

	const handleParentRefine = () => {
		refineParentItem(parentItem.value);
		if (parentItem.isRefined) {
			clearAll();
		} else {
			refineAll();
		}
	};

	const handleRefine = (value: string) => {
		refineParentItem(parentItem.value);
		refine(value);
	};

	const refineAll = () => {
		for (const item of items) {
			if (!item.isRefined) {
				refine(item.value);
			}
		}
	};

	const clearAll = () => {
		for (const item of items) {
			if (item.isRefined) {
				refine(item.value);
			}
		}
	};

	return (
		<li key={parentItem.label}>
			<Checkbox
				isSelected={parentItem.isRefined}
				label={parentItem.label}
				onChange={handleParentRefine}
			/>
			<div className="flex flex-col gap-2">
				<Typography className="px-4 text-[16px] text-subfilter-text" variant="h4">
					{t(`filter.${attribute}` as never)}
				</Typography>
				<div className="px-8">
					<ul>
						{itemsToShow.map((item) => {
							return (
								<li key={item.label}>
									<Checkbox
										isSelected={item.isRefined}
										label={item.label}
										onChange={() => {
											handleRefine(item.value);
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
			</div>
		</li>
	);
}
