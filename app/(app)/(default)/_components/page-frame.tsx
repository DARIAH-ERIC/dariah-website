import type { ReactNode } from "react";

/**
 * The back-to-top link's target. Browsers do scroll to the top for `#top` without an element to match, but Safari and
 * Firefox then leave the sequential focus starting point where it was, so the next `Tab` would go on from the bottom.
 */
export const pageTopId = "top";

interface PageFrameProps {
	children: ReactNode;
}

/**
 * The sheet every page is drawn on, and the only `container`: the header, the page's `<Main>` and the footer take its
 * width rather than repeating it, and each sets its own inline padding. Once the viewport outgrows it, its sides are
 * drawn against the canvas background, so the page reads as one sheet rather than content floating in the viewport. It
 * is at least as tall as the viewport, but grows with its content: a fixed `block-size` would end its background and
 * sides after one screen.
 */
export function PageFrame(props: Readonly<PageFrameProps>): ReactNode {
	const { children } = props;

	return (
		<div className="container min-block-full bg-background-base 3xl:border-x 3xl:border-stroke-weak" id={pageTopId}>
			{children}
		</div>
	);
}
