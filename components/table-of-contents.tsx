"use client";

import cn from "clsx/lite";
import { useExtracted as useTranslations } from "next-intl";
import { type ReactNode, useEffect, useId, useState } from "react";

import type { RichTextHeading } from "#/lib/rich-text.ts";

/**
 * How far below the top of the viewport a heading counts as the one being read. A heading exactly at the top edge is
 * about to leave it, so the line sits a little lower - far enough that the section whose heading just scrolled past is
 * the one marked, not the one arriving.
 */
const activeHeadingOffset = 96;

/**
 * The id of the heading the reader is currently at: the last one whose top has passed {@link activeHeadingOffset}, or
 * the first heading while the reader is still above all of them.
 *
 * An `IntersectionObserver` is only the trigger here, not the answer. Asking it which heading is _visible_ breaks in
 * the two cases that matter most - a section longer than the viewport has no heading in view at all, and a run of short
 * sections has several - so each callback recomputes the answer from the headings' positions instead. The observer's
 * root is inset by the same offset, which is exactly the line a heading has to cross for that answer to change, so the
 * recomputation runs when it can produce something new and not on every scroll frame.
 */
function useActiveHeadingId(ids: Array<string>): string | null {
	const [activeId, setActiveId] = useState<string | null>(null);

	/** A stable dependency: the prop is a new array on every render, the ids it holds are not. */
	const key = ids.join(" ");

	useEffect(() => {
		const elements = key
			.split(" ")
			// oxlint-disable-next-line unicorn/prefer-query-selector -- A slug may start with a digit, which is a valid id but not a valid css selector without escaping.
			.map((id) => document.getElementById(id))
			.filter((element): element is HTMLElement => element != null);

		if (elements.length === 0) {
			return;
		}

		function update() {
			const index = elements.findLastIndex((element) => element.getBoundingClientRect().top <= activeHeadingOffset);

			/** While the reader is still above every heading, the first entry is the one to mark. */
			setActiveId(elements[Math.max(index, 0)]?.id ?? null);
		}

		/** Fires once per observed element on observe, which is what sets the initial answer. */
		const observer = new IntersectionObserver(update, {
			rootMargin: `-${String(activeHeadingOffset)}px 0px 0px 0px`,
		});

		for (const element of elements) {
			observer.observe(element);
		}

		return () => {
			observer.disconnect();
		};
	}, [key]);

	return activeId;
}

/**
 * Indent by how deep a heading sits below the shallowest level the page uses, not by its absolute level. On the link
 * rather than the list item, so every entry's marker stays on the rule.
 */
const depthClassName = ["ps-5", "ps-9", "ps-13"];

interface TableOfContentsProps {
	/** The page's outline, in reading order - see `collectHeadings` in `lib/rich-text.ts`. */
	headings: Array<RichTextHeading>;
	className?: string;
}

/**
 * The outline of an item's content, as links to the headings' anchors.
 *
 * A `nav` holding an ordered list: the entries are the page's sections in the order they appear, and a screen reader
 * user can reach the whole thing by landmark and hear how many sections there are before stepping into one. The heading
 * the reader is currently at is marked with `aria-current`, so the highlight is not colour alone.
 *
 * Plain anchors, with no scrolling of our own: the browser's own anchor navigation moves focus to the target as well as
 * scrolling to it, honours `prefers-reduced-motion`, and updates the address bar so a section can be linked to.
 * `:target` in `styles/index.css` supplies the landing offset.
 */
export function TableOfContents(props: Readonly<TableOfContentsProps>): ReactNode {
	const { headings, className } = props;

	const t = useTranslations();

	const labelId = useId();
	const activeId = useActiveHeadingId(headings.map((heading) => heading.id));

	const shallowestLevel = Math.min(...headings.map((heading) => heading.level));

	return (
		<nav aria-labelledby={labelId} className={className}>
			<h2 className="sr-only" id={labelId}>
				{t("On this page")}
			</h2>
			{/** The rule runs the whole list; the current entry's marker is drawn over it. */}
			<ol className="flex list-none flex-col gap-y-4 border-s border-stroke-medium p-0" role="list">
				{headings.map((heading) => {
					const depth = Math.min(heading.level - shallowestLevel, depthClassName.length - 1);
					const isActive = heading.id === activeId;

					return (
						<li key={heading.id}>
							<a
								aria-current={isActive ? "true" : undefined}
								/**
								 * The current entry is bold, in the accent colour, with a thicker marker over the rule. Its label is
								 * laid over an invisible bold copy of itself (`data-label`, in the same grid cell), so every entry is
								 * always as tall as it would be in bold and the list does not reflow as the reader scrolls and the
								 * marker moves.
								 */
								className={cn(
									depthClassName[depth],
									"relative grid pbs-1 pbe-1 font-heading text-caption uppercase focus-visible-outline",
									"after:invisible after:col-start-1 after:row-start-1 after:font-bold after:content-[attr(data-label)]",
									!isActive && "hover:text-text-accent",
									isActive &&
										"font-bold text-text-accent before:absolute before:inset-y-0 before:-inset-s-px before:bg-stroke-accent before:inline-1",
								)}
								data-label={heading.text}
								href={`#${heading.id}`}
							>
								<span className="col-start-1 row-start-1">{heading.text}</span>
							</a>
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
