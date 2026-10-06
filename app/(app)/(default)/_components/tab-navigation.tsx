import cn from "clsx/lite";
import type { ReactNode } from "react";

import { TabLink } from "#/app/(app)/(default)/_components/tab-link.tsx";
import type { Href } from "#/lib/navigation/href.ts";

interface Tab {
	/** The route segment below the layout which renders the tabs, `null` for the layout's own page. */
	segment: string | null;
	label: string;
	href: Href;
}

interface TabNavigationProps {
	/** The navigation's accessible name, e.g. "Project status". */
	label: string;
	tabs: Array<Tab>;
	className?: string;
}

/**
 * Tabs which switch between the sibling routes of a list, as links rather than aria tabs, so each can be shared,
 * bookmarked and opened in a new tab. The current one is marked with `aria-current`, and set bold and underlined, so
 * the highlight is not colour alone. The rule below the tabs runs the full width, so it is inset with `px-main`
 * itself.
 *
 * Below `sm`, the tabs would wrap, leaving the current tab's underline between the rows, so they stack instead, the
 * current one marked by a bar at its start.
 *
 * The tabs must be rendered by the layout shared by the routes they switch between, not by each page: the layout is not
 * remounted on navigation, so focus stays on the link - Next.js does not move it. Screen readers do not read out the
 * link's `aria-current` change, but Next.js's route announcer reads out the new page title, so each route needs its
 * own. A status region with the tab's item count is no use alongside it: screen readers like Orca interrupt one live
 * announcement with the next, so only the title would be heard. Next.js would also scroll to the top of the page, past
 * the intro, so the links do not scroll.
 */
export function TabNavigation(props: Readonly<TabNavigationProps>): ReactNode {
	const { label, tabs, className } = props;

	return (
		<nav aria-label={label} className={cn("border-be border-stroke-weak px-main", className)}>
			<ul className="flex flex-col max-sm:pbe-4 sm:flex-row sm:flex-wrap" role="list">
				{tabs.map((tab) => (
					<li key={tab.label}>
						<TabLink
							className="block border-transparent px-4 font-heading max-sm:border-s-4 max-sm:py-3 sm:border-be-4 sm:pbe-5 text-lead font-regular text-text-strong hover:border-stroke-weak focus-visible-outline aria-[current=page]:border-stroke-accent aria-[current=page]:font-bold"
							href={tab.href}
							segment={tab.segment}
						>
							{tab.label}
						</TabLink>
					</li>
				))}
			</ul>
		</nav>
	);
}
