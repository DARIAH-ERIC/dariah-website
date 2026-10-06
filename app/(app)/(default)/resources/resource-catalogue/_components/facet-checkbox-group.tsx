"use client";

import cn from "clsx/lite";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useExtracted as useTranslations } from "next-intl";
import { type ReactNode, use, useEffect, useId, useRef, useState } from "react";

import { FacetsDialogContext } from "#/app/(app)/(default)/resources/resource-catalogue/_components/facets-panel.tsx";
import { SkeletonShape, SkeletonText } from "#/components/ui/skeleton.tsx";

/** Values listed before the rest are folded away behind "See more". */
const collapsedValues = 6;

export interface FacetCheckboxGroupValue {
	value: string;
	label: string;
	count: number;
}

/**
 * A facet's values as checkboxes, the first few listed and the rest behind a "See more" toggle. A selected value is
 * never folded away, so a selection is always visible, and can be unchecked. Folded values are `hidden`, which keeps
 * them in the form, so a submission still carries a folded selection.
 *
 * In the filters dialog, the facet is a disclosure as well: the legend holds a button which shows or hides its values,
 * open to start with when `defaultOpen`, or when a value is selected. The button replaces the legend's text, rather
 * than repeating it, so the fieldset keeps one name. In the column, the values are always shown, under a plain legend.
 *
 * Without any values, e.g. when nothing matches the search, nothing is rendered, rather than a legend over an empty
 * list. A selected value is always among the values (see `getFacetValues`), so a facet in use never disappears.
 */
export function FacetCheckboxGroup(
	props: Readonly<{
		defaultOpen?: boolean;
		label: string;
		name: string;
		selected: ReadonlyArray<string>;
		values: ReadonlyArray<FacetCheckboxGroupValue>;
	}>,
): ReactNode {
	const { defaultOpen = false, label, name, selected, values } = props;

	const t = useTranslations();
	const id = useId();
	const isInDialog = use(FacetsDialogContext);
	const [isOpen, setIsOpen] = useState(defaultOpen || selected.length > 0);
	const [isExpanded, setIsExpanded] = useState(false);
	const listRef = useRef<HTMLUListElement>(null);
	const selectedRef = useRef(selected.join("\n"));

	/**
	 * The checkboxes are uncontrolled, so a selection which changes in the url without them, e.g. by a link which clears
	 * the filters, is copied to them. A box the user toggled comes back selected as it is, once the form's submission has
	 * rendered, so nothing changes then; nor on the first render, which would undo a box ticked before hydration.
	 */
	useEffect(() => {
		const key = selected.join("\n");
		if (key === selectedRef.current) {
			return;
		}
		selectedRef.current = key;
		for (const input of listRef.current?.querySelectorAll("input") ?? []) {
			input.checked = selected.includes(input.value);
		}
	}, [selected]);

	if (values.length === 0) {
		return null;
	}

	const isFoldable = values.length > collapsedValues;

	return (
		<fieldset className={cn(isInDialog && "border-be border-stroke-weak")}>
			<legend className={cn("font-heading text-body font-bold inline-full", !isInDialog && "mbe-4")}>
				{isInDialog ? (
					<button
						aria-controls={`${id}-panel`}
						aria-expanded={isOpen}
						className="group flex items-center justify-between gap-x-2 px-2 py-4 text-start inline-full [--focus-outline-offset:-3px] aria-expanded:bg-background-muted focus-visible-outline"
						onClick={() => {
							setIsOpen(!isOpen);
						}}
						type="button"
					>
						{label}
						<ChevronDownIcon
							aria-hidden={true}
							className="size-5 shrink-0 text-icon-accent transition-transform group-aria-expanded:rotate-180"
							strokeWidth={2.5}
						/>
					</button>
				) : (
					label
				)}
			</legend>
			<div className={cn(isInDialog && "px-2 py-4")} hidden={isInDialog && !isOpen} id={`${id}-panel`}>
				<ul ref={listRef} className="flex flex-col gap-y-3" id={`${id}-values`} role="list">
					{values.map(({ value, label: valueLabel, count }, index) => {
						const isSelected = selected.includes(value);
						const isHidden = !isExpanded && index >= collapsedValues && !isSelected;

						return (
							<li key={value} className="flex items-center gap-x-4" hidden={isHidden}>
								<span className="grid shrink-0 place-items-center *:[grid-area:1/1]">
									<input
										className="peer size-5 appearance-none rounded-xs border-[1.5px] border-stroke-control bg-background-base checked:border-stroke-accent checked:bg-background-accent-strong hover:border-stroke-accent focus-visible-outline"
										defaultChecked={isSelected}
										id={`${id}-${value}`}
										name={name}
										type="checkbox"
										value={value}
									/>
									<CheckIcon
										aria-hidden={true}
										className="pointer-events-none invisible size-4 text-text-inverse peer-checked:visible"
										strokeWidth={3}
									/>
								</span>
								<label className="text-caption" htmlFor={`${id}-${value}`}>
									{valueLabel} <span className="text-text-weak">({count})</span>
								</label>
							</li>
						);
					})}
				</ul>
				{isFoldable ? (
					<button
						aria-controls={`${id}-values`}
						aria-expanded={isExpanded}
						className="flex items-center gap-x-2 text-caption font-medium mbs-4 hover:text-text-accent focus-visible-outline"
						onClick={() => {
							setIsExpanded(!isExpanded);
						}}
						type="button"
					>
						{isExpanded ? t("See less") : t("See more")}
						<ChevronDownIcon
							aria-hidden={true}
							className={cn("text-icon-accent block-5 inline-5", isExpanded && "rotate-180")}
						/>
					</button>
				) : null}
			</div>
		</fieldset>
	);
}

/**
 * A placeholder for a `FacetCheckboxGroup` while the facet counts load: its legend, which is known without them, and as
 * many rows as it shows folded.
 */
export function FacetCheckboxGroupSkeleton(props: Readonly<{ label: string }>): ReactNode {
	const { label } = props;

	return (
		<div>
			<p className="font-heading text-body font-bold mbe-4">{label}</p>
			<div className="flex flex-col gap-y-3">
				{Array.from({ length: collapsedValues }, (_, index) => (
					<div key={index} className="flex items-center gap-x-4">
						<SkeletonShape className="size-5 shrink-0 rounded-xs" />
						<SkeletonText className={cn("text-caption", index % 2 === 0 ? "inline-40" : "inline-28")} />
					</div>
				))}
			</div>
		</div>
	);
}
