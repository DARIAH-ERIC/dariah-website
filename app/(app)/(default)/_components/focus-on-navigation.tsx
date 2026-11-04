"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useEffect } from "react";

import { focusPageTop, pageTopFocusTargetId } from "#/lib/navigation/page-top-focus.ts";

/**
 * The pathname shown before, starting with the one the document was loaded at. Kept outside the component, as on a
 * route whose pathname suspends while prerendering, the component is only rendered once the client gets to its suspense
 * boundary, which can be after a quick first navigation: it would take the new pathname for the initial one. This
 * module is loaded before hydration, so `location` still has the initial one then.
 */
let previousPathname = typeof window === "undefined" ? null : window.location.pathname;

/**
 * Moves focus back to the top of the document after a client-side navigation to another pathname, as loading a new
 * document would, so the next `Tab` goes to the skip link. Next leaves focus where it was, which drops it to the
 * document when the link followed goes away with the old page, e.g. one in a disclosed menu or the pagination; the next
 * `Tab` would then go on from where that link was, e.g. to the next menu button, or into the footer.
 *
 * Focus moves to an empty, unnamed element rendered first in the page, which screen readers say nothing for, so that
 * the new page is named once, by next's route announcer. Focusing the page's `<h1>` instead would name it twice, and
 * would race the announcer, which may be cut off by the focus change. Focusing `<body>` would make Orca with Chromium
 * read out the whole page. `blur()` would leave the next `Tab` going on from where the link was.
 *
 * Only on a new pathname, so a search updating its query, or a link to a fragment, keeps focus where it is. Not on the
 * initial page load, where the browser starts at the top of the document. Not when focus is inside an element marked
 * with `data-keep-focus-on-navigation`, e.g. a `TabLink`, which switches between sibling routes and stays on the page
 * when it does. Scrolling is left to the router, which restores the position on back and forward.
 */
export function FocusOnNavigation(): ReactNode {
	const pathname = usePathname();

	useEffect(() => {
		if (pathname === previousPathname) {
			return;
		}

		previousPathname = pathname;

		if (document.activeElement?.closest("[data-keep-focus-on-navigation]") != null) {
			return;
		}

		focusPageTop();
	}, [pathname]);

	return <span className="outline-none" id={pageTopFocusTargetId} tabIndex={-1} />;
}
