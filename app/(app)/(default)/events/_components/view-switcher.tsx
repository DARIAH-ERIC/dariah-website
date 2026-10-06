import { CalendarDaysIcon, ListIcon } from "lucide-react";
import { useExtracted as useTranslations } from "next-intl";
import { type ReactNode, useId } from "react";

import type { Href } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";

export type EventsView = "list" | "month";

const icons = { list: ListIcon, month: CalendarDaysIcon };

/**
 * Switches between the list and the calendar. They are two routes, so the views are links rather than a choice in a
 * field: each can be opened in a new tab, and works without javascript. Styled like the filter form's fields beside it,
 * a segmented control as tall as they are, with the current view filled and marked with `aria-current`. A focused view
 * is lifted above the other, whose background would otherwise cover its outline where they meet.
 *
 * It is not part of the filter form: submitting the form keeps the view, following a view keeps the form's date.
 *
 * Below `md` the label is for screen readers only: the icons and the labels of the views speak for themselves, and the
 * row it would take pushes the events further down a phone's screen.
 */
export function ViewSwitcher(
	props: Readonly<{ className?: string; hrefs: Record<EventsView, Href>; view: EventsView }>,
): ReactNode {
	const { className, hrefs, view } = props;

	const t = useTranslations();
	const labelId = useId();

	const views: Array<{ id: EventsView; label: string }> = [
		{ id: "list", label: t("List") },
		{ id: "month", label: t("Month") },
	];

	return (
		<nav aria-labelledby={labelId} className={className}>
			<div className="flex flex-col gap-y-2">
				<span className="font-bold max-md:sr-only" id={labelId}>
					{t("View as")}
				</span>
				<ul className="flex shadow-[0_0_4px_0_rgb(0_0_0/0.08)]" role="list">
					{views.map(({ id, label }) => {
						const Icon = icons[id];

						return (
							<li key={id} className="flex-1">
								<Link
									aria-current={id === view ? "page" : undefined}
									className="relative flex items-center justify-center gap-x-2 border-be-2 border-stroke-weak bg-background-field px-4 py-2.5 font-medium min-block-15 hover:border-stroke-accent focus-visible:z-1 focus-visible-outline aria-[current=page]:border-stroke-accent aria-[current=page]:bg-background-accent-strong aria-[current=page]:text-text-inverse"
									href={hrefs[id]}
								>
									<Icon aria-hidden={true} className="size-5 shrink-0" />
									{label}
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
		</nav>
	);
}
