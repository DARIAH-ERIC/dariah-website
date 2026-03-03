import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useRefinementList, type UseRefinementListProps } from "react-instantsearch";

import { Button } from "@/components/ui/button/button";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { ChevronDownIcon } from "@/components/ui/icons/chevron-down";
import { ChevronUpIcon } from "@/components/ui/icons/chevron-up";
import { Typography } from "@/components/ui/typography/typography";

export function Refinements({
	refinements,
}: Readonly<{ refinements: Array<ResourceCatalogueFilter> }>): ReactNode {
	const t = useTranslations("DariahResourceCataloguePage");
	return (
		<>
			<div className="hidden flex-col gap-10 w-96 max-w-96 lg:flex">
				<Typography variant="h4">{t("filter.title")}</Typography>
				{refinements.map(({ name, subfilters, ...rest }) => {
					return <RefinementList key={name} attribute={name} subfilters={subfilters} {...rest} />;
				})}
			</div>
			<Button className="w-full lg:hidden">{t("filter.showButton")}</Button>
		</>
	);
}

export interface RefinementListItem {
	value: string;
	label: string;
	highlighted?: string;
	count: number;
	isRefined: boolean;
}

export function RefinementList(
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
		</div>
	);
}

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
