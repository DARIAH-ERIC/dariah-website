import { SearchIcon } from "lucide-react";
import { useExtracted as useTranslations } from "next-intl";
import Form from "next/form";
import type { ReactNode } from "react";

import { type EventsView, ViewSwitcher } from "#/app/(app)/(default)/events/_components/view-switcher.tsx";
import { DatePicker } from "#/components/ui/date-picker.tsx";
import { SkeletonShape } from "#/components/ui/skeleton.tsx";
import type { Href } from "#/lib/navigation/href.ts";

interface EventsFilterProps {
	/** The route the form submits to, the current view's. */
	action: "/events" | "/events/calendar";
	/** The search param the date is submitted as - see each view's `search-params.ts`. */
	name: "anchor" | "month";
	/** `YYYY-MM-DD`. */
	date: string;
	view: EventsView;
	/** Where each view opens, at the date this one shows. */
	viewHrefs: Record<EventsView, Href>;
}

/**
 * The date the events start from, and the view, above both the list and the calendar. A plain `get` form, so the
 * selection is a url the user can share. It submits on the button only: the date changes with every segment typed.
 *
 * The date and the button share a row, spanning what the view switcher at the end leaves; below `md` the switcher gets
 * a row of its own. On a phone the filter is kept compact so the first events still show above the fold: below `sm` the
 * button is a square search icon, its label for screen readers only, so it fits beside the date.
 */
export function EventsFilter(props: Readonly<EventsFilterProps>): ReactNode {
	const { action, name, date, view, viewHrefs } = props;

	const t = useTranslations();

	return (
		<div className="flex flex-col gap-4 pbe-10 md:flex-row md:items-end md:justify-between md:gap-x-columns md:pbe-16">
			<Form action={action} className="flex flex-wrap items-end gap-3 md:gap-4">
				<DatePicker className="flex-1 md:flex-none" defaultValue={date} label={t("Events starting from")} name={name} />
				<button
					className="flex items-center justify-center border-2 border-stroke-accent bg-background-accent-strong font-heading font-bold text-text-inverse min-block-15 min-inline-15 hover:bg-background-base hover:text-text-accent focus-visible-outline sm:px-8"
					type="submit"
				>
					<SearchIcon aria-hidden={true} className="size-5 sm:hidden" />
					<span className="max-sm:sr-only">{t("Find events")}</span>
				</button>
			</Form>
			<ViewSwitcher className="md:inline-60" hrefs={viewHrefs} view={view} />
		</div>
	);
}

/** A placeholder for `EventsFilter` while the view loads: the same rows, with the labels, and a box for each control. */
export function EventsFilterSkeleton(): ReactNode {
	const t = useTranslations();

	return (
		<div className="flex flex-col gap-4 pbe-10 md:flex-row md:items-end md:justify-between md:gap-x-columns md:pbe-16">
			<div className="flex flex-col gap-y-2">
				<span className="font-bold">{t("Events starting from")}</span>
				<div className="flex flex-wrap gap-3 md:gap-4">
					<SkeletonShape className="min-block-15 flex-1 md:flex-none md:inline-44" />
					<SkeletonShape className="min-block-15 inline-15 sm:inline-36" />
				</div>
			</div>
			{/* No label below `md`, like the switcher's, which keeps it for screen readers only. */}
			<div className="flex flex-col gap-y-2 md:inline-60">
				<span className="font-bold max-md:hidden">{t("View as")}</span>
				<SkeletonShape className="min-block-15" />
			</div>
		</div>
	);
}
