/** The empty element rendered first in the page, which `FocusOnNavigation` moves focus to - see there. */
export const pageTopFocusTargetId = "page-top-focus-target";

/**
 * Moves focus back to the top of the document, as loading a new document would, so the next `Tab` goes to the skip
 * link, without screen readers saying anything for it.
 *
 * Also for a link which hides itself when followed, e.g. one in a disclosed menu, to call before it does: focus would
 * otherwise drop to the document, which screen readers like Orca with Firefox announce by the document's name - by then
 * often the new page's title, which next's route announcer then repeats.
 */
export function focusPageTop(): void {
	document.getElementById(pageTopFocusTargetId)?.focus({ preventScroll: true });
}
