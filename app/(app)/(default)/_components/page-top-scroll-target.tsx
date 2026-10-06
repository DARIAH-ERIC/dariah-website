import type { ReactNode } from "react";

/**
 * Rendered first by a page whose layout draws the top of the page, e.g. the header above `TabNavigation`, so that
 * navigating to it scrolls to the top rather than to the page's own content.
 *
 * Next.js scrolls to the first element of the page segment, unless its top edge is already in view. Below a layout's
 * header and intro that is usually below the fold, so Next.js would scroll past the page's title. This marker is that
 * first element instead, and sits at the very top of the document, as none of its ancestors is positioned - so a
 * navigation from the top of another page does not scroll at all, and one from further down scrolls to the top. The tab
 * links themselves do not scroll.
 *
 * It is a pixel wide rather than empty, as an element with an all-zero box is skipped as a scroll target.
 */
export function PageTopScrollTarget(): ReactNode {
	return <span aria-hidden={true} className="pointer-events-none absolute inset-s-0 inset-bs-0 block-px inline-px" />;
}
