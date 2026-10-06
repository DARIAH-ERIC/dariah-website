"use client";

import { clsx as cn } from "clsx";
import { ChevronUpIcon } from "lucide-react";
import { useExtracted as useTranslations } from "next-intl";
import { Fragment, type ReactNode, useEffect, useRef, useState } from "react";

import { pageTopId } from "#/app/(app)/(default)/_components/page-frame.tsx";

/**
 * Floats in the page's end corner once it has been scrolled far enough, and jumps back to the top. Only below `xl`, as
 * in the mobile design: that is where a page is many screens long, and there is no `Home` key to hand.
 *
 * "Far enough" is two viewport heights. On a phone the footer alone is about two screens tall, so a page whose content
 * fits on about one screen, e.g. a project or a person, can never be scrolled that far, while a long article or list
 * shows the link from its second screen on.
 *
 * Rather than a scroll listener, which would run on every scroll frame, an intersection observer watches an invisible
 * marker spanning those first two screens, and is only called when the marker leaves or comes back into view. It spans
 * them rather than sitting at their end: an observer is only called when intersection changes, and a fling or a jump
 * can carry a line past the viewport within a single frame without it ever intersecting. The callback also runs once on
 * `observe()`, so a page restored scrolled down, e.g. on history navigation, shows the link straight away. On the rare
 * page shorter than two screens, the marker makes the page that long. It is positioned against the document, as none of
 * its ancestors is positioned.
 *
 * A plain anchor, with no scrolling of our own, as in the table of contents: the browser's anchor navigation moves
 * focus to the top as well, so the next `Tab` starts from the skip link rather than from wherever the reader was.
 *
 * While hidden, it is `visibility: hidden`, so it is out of the tab order and the accessibility tree too, not just
 * transparent. Last in the document, so it is also the last stop when tabbing to the end of a page. Without scripting
 * nothing would ever show it, so it is always shown then.
 */
export function BackToTopLink(): ReactNode {
	const t = useTranslations();

	const markerRef = useRef<HTMLSpanElement>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const marker = markerRef.current;
		if (marker == null) {
			return;
		}

		const observer = new IntersectionObserver(([entry]) => {
			if (entry == null) {
				return;
			}
			setIsVisible(!entry.isIntersecting);
		});

		observer.observe(marker);

		return () => {
			observer.disconnect();
		};
	}, []);

	return (
		<Fragment>
			<span
				ref={markerRef}
				aria-hidden={true}
				className="pointer-events-none absolute inset-s-0 inset-bs-0 block-[200svh] inline-px xl:hidden"
			/>
			<a
				aria-label={t("Back to top")}
				className={cn(
					"fixed inset-e-4 inset-be-4 z-40 flex items-center justify-center border-2 border-stroke-accent bg-background-base text-icon-accent shadow-light focus-visible-outline transition-[opacity,visibility] duration-200 block-10 inline-10 hover:bg-background-accent-strong hover:text-text-inverse xl:hidden print:hidden",
					isVisible ? "visible opacity-100" : "invisible opacity-0 noscript:visible noscript:opacity-100",
				)}
				href={`#${pageTopId}`}
			>
				<ChevronUpIcon aria-hidden={true} className="size-5" strokeWidth={2.5} />
			</a>
		</Fragment>
	);
}
