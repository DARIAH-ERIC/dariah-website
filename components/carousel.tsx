"use client";

import cn from "clsx/lite";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useExtracted as useTranslations } from "next-intl";
import { type ReactNode, type RefObject, useEffect, useId, useRef, useState } from "react";

/** How far, in css pixels, the strip may sit off an edge and still count as at it - scroll positions are fractional. */
const edgeTolerance = 1;

type Direction = "previous" | "next";

/** Whether the strip can still scroll towards its start, and towards its end. */
type ScrollState = Record<Direction, boolean>;

/**
 * Where the strip can still scroll to, or `null` until it has been measured - before hydration, and without javascript.
 *
 * Read from the scroll offset's magnitude, which is the distance from the start edge in either writing direction - in a
 * right-to-left strip, `scrollLeft` counts down from zero. Slides as well as the strip are observed, since an image
 * that settles on a different width changes how far the strip can scroll without resizing the strip itself.
 */
function useScrollState(ref: RefObject<HTMLElement | null>): ScrollState | null {
	const [scrollState, setScrollState] = useState<ScrollState | null>(null);

	useEffect(() => {
		const scroller = ref.current;

		if (scroller == null) {
			return;
		}

		function update() {
			if (scroller == null) {
				return;
			}

			const offset = Math.abs(scroller.scrollLeft);
			const maxOffset = scroller.scrollWidth - scroller.clientWidth;
			const previous = offset > edgeTolerance;
			const next = offset < maxOffset - edgeTolerance;

			/** Kept when unchanged, so scrolling only re-renders as the strip reaches or leaves an edge. */
			setScrollState((state) => (state?.previous === previous && state.next === next ? state : { previous, next }));
		}

		update();

		scroller.addEventListener("scroll", update, { passive: true });

		const observer = new ResizeObserver(update);
		observer.observe(scroller);
		for (const slide of scroller.children) {
			observer.observe(slide);
		}

		return () => {
			scroller.removeEventListener("scroll", update);
			observer.disconnect();
		};
	}, [ref]);

	return scrollState;
}

type CarouselProps = {
	slides: Array<ReactNode>;
} & (
	| {
			/** What the strip holds, for its accessible name - e.g. "Image gallery". */
			label: string;
			labelledBy?: never;
	  }
	| {
			/** The id of a visible label, such as the gallery's own caption, to name the strip by instead. */
			labelledBy: string;
			label?: never;
	  }
);

/**
 * A row of slides that scrolls sideways, one slide snapping to the start edge at a time.
 *
 * Without javascript, it is the scroll strip alone - its scrollbar, and the slide cut off at its end edge, are what
 * tell a reader there is more. Once hydrated, a previous and a next button below it serve readers on a mouse, who
 * cannot swipe and rarely know to shift-scroll. Below rather than laid over the strip's edges, where they would cover
 * part of a photo, and - with slides of different heights - the caption of a shorter one. Their row keeps its space,
 * unseen, until the strip has been measured, so it does not push the content below down as it appears; only a strip
 * whose slides turn out to fit drops it.
 *
 * A button at its edge is `aria-disabled` rather than `disabled` or hidden, either of which would drop its focus to the
 * body as a keyboard reaches the end. The strip itself takes focus too, so a keyboard can scroll it with the arrow keys -
 * chromium and firefox already make a scroller focusable, safari does not.
 *
 * A list, and a `group` rather than a `region` landmark, so a page with several galleries gets no landmark for each and
 * a screen reader still announces a slide's position in the set. The buttons point at the list with `aria-controls`, as
 * in the aria practices guide's carousel example.
 */
export function Carousel(props: Readonly<CarouselProps>): ReactNode {
	const { label, labelledBy, slides } = props;

	const t = useTranslations();

	const listId = useId();
	const scrollerRef = useRef<HTMLUListElement>(null);
	const scrollState = useScrollState(scrollerRef);

	function scrollBySlide(direction: Direction) {
		const scroller = scrollerRef.current;

		if (scroller == null || scrollState?.[direction] !== true) {
			return;
		}

		const isRtl = getComputedStyle(scroller).direction === "rtl";
		const scrollerRect = scroller.getBoundingClientRect();

		/** Each slide's start edge, measured from the strip's start edge along the inline axis. */
		const offsets = Array.from(scroller.children, (slide) => {
			const rect = slide.getBoundingClientRect();

			return isRtl ? scrollerRect.right - rect.right : rect.left - scrollerRect.left;
		});

		/**
		 * The first slide past the start edge, or the last one before it. The edge rather than the slide in view, so a
		 * press mid-way through a smooth scroll continues from wherever the strip has got to.
		 */
		const delta =
			direction === "next"
				? offsets.find((offset) => offset > edgeTolerance)
				: offsets.findLast((offset) => offset < -edgeTolerance);

		if (delta == null) {
			return;
		}

		/** No `behavior`: the strip's own `scroll-behavior` decides, which is smooth unless reduced motion is asked for. */
		scroller.scrollBy({ left: isRtl ? -delta : delta });
	}

	const buttonClassName =
		"flex items-center justify-center border-2 border-stroke-accent text-text-accent block-10 inline-10 focus-visible-outline hover:not-aria-disabled:bg-background-accent-strong hover:not-aria-disabled:text-text-inverse aria-disabled:border-stroke-weak aria-disabled:text-text-weak";

	return (
		<div aria-label={label} aria-labelledby={labelledBy} aria-roledescription={t("carousel")} role="group">
			<ul
				className="flex snap-x snap-mandatory list-none gap-4 overflow-x-auto p-0 pbe-2 focus-visible-outline motion-safe:scroll-smooth"
				id={listId}
				ref={scrollerRef}
				role="list"
				// oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- A scroller safari does not make focusable itself, see above.
				tabIndex={0}
			>
				{slides.map((slide, index) => (
					// oxlint-disable-next-line react/no-array-index-key -- Slides carry no id of their own.
					<li className="shrink-0 snap-start" key={index}>
						{slide}
					</li>
				))}
			</ul>
			{scrollState != null && !scrollState.previous && !scrollState.next ? null : (
				<div className={cn("mbs-2 flex justify-end gap-2", scrollState == null && "invisible")}>
					<button
						aria-controls={listId}
						aria-disabled={scrollState?.previous !== true}
						className={buttonClassName}
						onClick={() => {
							scrollBySlide("previous");
						}}
						type="button"
					>
						<ChevronLeftIcon aria-hidden={true} className="block-5 inline-5 rtl:-scale-x-100" strokeWidth={2.5} />
						<span className="sr-only">{t("Previous slide")}</span>
					</button>
					<button
						aria-controls={listId}
						aria-disabled={scrollState?.next !== true}
						className={buttonClassName}
						onClick={() => {
							scrollBySlide("next");
						}}
						type="button"
					>
						<ChevronRightIcon aria-hidden={true} className="block-5 inline-5 rtl:-scale-x-100" strokeWidth={2.5} />
						<span className="sr-only">{t("Next slide")}</span>
					</button>
				</div>
			)}
		</div>
	);
}
