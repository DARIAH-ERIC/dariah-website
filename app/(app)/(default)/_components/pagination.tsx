import cn from "clsx/lite";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useExtracted as useTranslations } from "next-intl";
import type { ReactNode } from "react";

import type { Href } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";

interface PaginationProps {
	/** The route of a 1-based page number; page 1 is the list's canonical url. */
	hrefFor: (page: number) => Href;
	page: number;
	pages: number;
	prefetch?: boolean;
	className?: string;
}

/**
 * The page numbers to list, with `null` for an elided run: the first and last page, and the current page with
 * `siblings` neighbours on either side. The list keeps the same length wherever the current page is, so the bar does
 * not change width between pages: up to that many pages, every page is listed. An elided run is never a single page -
 * that page is listed instead, since an ellipsis would take as much room as its number.
 */
function listPages(page: number, pages: number, siblings: number): Array<number | null> {
	if (pages <= 2 * siblings + 5) {
		return Array.from({ length: pages }, (_, index) => index + 1);
	}

	const start = Math.max(1, Math.min(page - siblings, pages - 2 * siblings - 2));
	const end = Math.min(pages, Math.max(page + siblings, 2 * siblings + 3));

	const listed: Array<number | null> = [];

	if (start > 1) {
		listed.push(1);
	}
	if (start === 3) {
		listed.push(2);
	} else if (start > 3) {
		listed.push(null);
	}
	for (let current = start; current <= end; current += 1) {
		listed.push(current);
	}
	if (end === pages - 2) {
		listed.push(pages - 1);
	} else if (end < pages - 2) {
		listed.push(null);
	}
	if (end < pages) {
		listed.push(pages);
	}

	return listed;
}

interface ListedPage {
	/** The page number, or `null` for an elided run. */
	page: number | null;
	narrow: boolean;
	wide: boolean;
}

/**
 * The pages to list on a narrow screen, with only the current page between the first and last, and on a wide one, with
 * its neighbours too, as one list: each is shown on the screens it is listed for. A single list rather than one per
 * screen, so each page link is in the document once. An elided run is keyed by the page before it, so it sorts between
 * that page and the next.
 */
function listPagesByScreen(page: number, pages: number): Array<ListedPage> {
	const byKey = new Map<number, ListedPage>();

	for (const [screen, siblings] of [
		["narrow", 0],
		["wide", 1],
	] as const) {
		let previous = 0;
		for (const listed of listPages(page, pages, siblings)) {
			const key = listed ?? previous + 0.5;
			const entry = byKey.get(key) ?? { page: listed, narrow: false, wide: false };
			entry[screen] = true;
			byKey.set(key, entry);
			if (listed != null) {
				previous = listed;
			}
		}
	}

	return Array.from(byKey.entries())
		.toSorted(([a], [b]) => a - b)
		.map(([, entry]) => entry);
}

/**
 * A dark bar at the end side of the page, bleeding to its edge, like the landing page's "See all news" link. The
 * current page is underlined, and marked with `aria-current` rather than linked; the previous and next links are named
 * for a screen reader, which would otherwise read a bare chevron.
 *
 * The bar is as tall as that link, a line of text and `py-7`: the links are 44px touch targets, taller than the line,
 * so the block padding gives back the difference. On a narrow screen, fewer pages are listed (see `listPagesByScreen`),
 * and the links are narrower and set without a gap, so the bar fits on one line down to a 320px viewport.
 */
export function Pagination(props: Readonly<PaginationProps>): ReactNode {
	const { hrefFor, page, pages, prefetch, className } = props;

	const t = useTranslations();

	const previous = page > 1 ? page - 1 : null;
	const next = page < pages ? page + 1 : null;

	const sizeClassName = "grid place-items-center block-11 inline-9 sm:inline-11";
	const itemClassName = cn(
		sizeClassName,
		"relative after:absolute after:inset-x-2 after:inset-be-0 after:border-be-2 after:border-current after:content-['']",
	);

	return (
		<nav
			aria-label={t("Pagination")}
			className={cn(
				"ms-auto -me-main flex bg-background-strong py-[calc(--spacing(7)-(--spacing(11)-1lh)/2)] ps-3 pe-main text-text-inverse inline-fit sm:ps-6",
				className,
			)}
		>
			<ul className="flex flex-wrap items-center font-medium sm:gap-x-3" role="list">
				{previous != null ? (
					<li>
						<Link
							aria-label={t("Previous page")}
							className={cn(
								sizeClassName,
								"focus-visible-outline [--color-focus-outline:var(--color-focus-outline-inverse)]",
							)}
							href={hrefFor(previous)}
							prefetch={prefetch}
						>
							<ChevronLeftIcon aria-hidden={true} className="size-6" strokeWidth={2.5} />
						</Link>
					</li>
				) : null}
				{listPagesByScreen(page, pages).map(({ page: listed, narrow, wide }, index) => {
					const screenClassName = cn(!narrow && "max-sm:hidden", !wide && "sm:hidden");

					return listed == null ? (
						<li
							key={`elided-${String(index)}`}
							aria-hidden={true}
							className={cn("grid place-items-center block-11 inline-6 sm:inline-11", screenClassName)}
						>
							…
						</li>
					) : (
						<li key={listed} className={screenClassName}>
							{listed === page ? (
								<span aria-current="page" className={itemClassName}>
									<span className="sr-only">{t("Page")} </span>
									{listed}
								</span>
							) : (
								<Link
									className={cn(
										itemClassName,
										"focus-visible-outline [--color-focus-outline:var(--color-focus-outline-inverse)] after:opacity-0 hover:after:opacity-100",
									)}
									href={hrefFor(listed)}
									prefetch={prefetch}
								>
									<span className="sr-only">{t("Page")} </span>
									{listed}
								</Link>
							)}
						</li>
					);
				})}
				{next != null ? (
					<li>
						<Link
							aria-label={t("Next page")}
							className={cn(
								sizeClassName,
								"focus-visible-outline [--color-focus-outline:var(--color-focus-outline-inverse)]",
							)}
							href={hrefFor(next)}
							prefetch={prefetch}
						>
							<ChevronRightIcon aria-hidden={true} className="size-6" strokeWidth={2.5} />
						</Link>
					</li>
				) : null}
			</ul>
		</nav>
	);
}
