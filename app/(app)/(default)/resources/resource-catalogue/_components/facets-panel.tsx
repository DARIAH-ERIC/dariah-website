"use client";

import { XIcon } from "lucide-react";
import { useExtracted as useTranslations } from "next-intl";
import { type ReactNode, createContext, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";

/** Matches `--breakpoint-lg` in `styles/index.css`, where the facets become a column beside the results. */
const desktopMediaQuery = "(min-width: 64rem)";

function subscribeToViewport(onChange: () => void): () => void {
	const mediaQuery = window.matchMedia(desktopMediaQuery);
	mediaQuery.addEventListener("change", onChange);
	return () => {
		mediaQuery.removeEventListener("change", onChange);
	};
}

/**
 * Whether the facets are shown in a dialog: below `lg`, once hydrated. `false` on the server and during hydration, when
 * the viewport is unknown; the facets are then hidden below `lg` by css instead.
 */
function useIsDialog(): boolean {
	return useSyncExternalStore(
		subscribeToViewport,
		() => !window.matchMedia(desktopMediaQuery).matches,
		() => false,
	);
}

/** Whether a facet is inside the filters dialog, where it collapses - see `FacetCheckboxGroup`. */
export const FacetsDialogContext = createContext(false);

/**
 * The facets: a column beside the results from `lg` up, and a full-screen modal dialog below, opened by a "Show
 * filters" button, which counts the active filters.
 *
 * A native `dialog`, not react-aria's `Modal` like the mobile navigation: that mounts its content only while open, and
 * portals it out of the page. The checkboxes must stay in the search form at all times, or a query typed while the
 * dialog is closed would be submitted without them. `showModal()` makes the rest of the page inert, so neither `Tab`
 * nor a screen reader's cursor can leave the dialog for the page, closes on `Escape`, and returns focus to the button.
 *
 * The column is a plain `div`, so it is not exposed as a dialog. The server does not know the viewport, so it renders
 * the column, hidden below `lg` by css, and the "Show filters" button, hidden from `lg` up: the page does not shift
 * once hydrated, though the button does nothing until then. After hydration, below `lg`, the column becomes the dialog;
 * the element also switches when the viewport crosses the breakpoint, remounting the checkboxes, which take their state
 * from the url.
 *
 * Filters apply live, as in the column: each change submits the form, and the results behind the dialog update. The
 * page is inert while the dialog is open, so the form's status is not announced; the dialog has its own, which
 * announces the number of results. Closing the dialog does not undo a change. "See results" only closes it - every
 * change has been submitted already - and moves focus to the results, whose heading has `resultsId`; the close button
 * and `Escape` return focus to the "Show filters" button.
 *
 * Without any facet values to show - when nothing matches and no filter is set, each facet renders nothing - the dialog
 * says so, rather than opening empty; the column is left empty.
 */
export function FacetsPanel(
	props: Readonly<{
		activeCount: number;
		children: ReactNode;
		className?: string;
		/** Whether any facet has values to show - see `FacetCheckboxGroup`. */
		hasValues: boolean;
		resultsId: string;
		total: number;
	}>,
): ReactNode {
	const { activeCount, children, className, hasValues, resultsId, total } = props;

	const t = useTranslations();
	const id = useId();
	const isDialog = useIsDialog();
	const dialogRef = useRef<HTMLDialogElement>(null);
	const headingRef = useRef<HTMLHeadingElement>(null);
	const [isOpen, setIsOpen] = useState(false);

	/** Growing past the breakpoint, e.g. on rotating, unmounts an open dialog without a `close` event. */
	const isModalOpen = isOpen && isDialog;

	/** Lock the page's scrolling while the dialog is open. */
	useEffect(() => {
		if (!isModalOpen) {
			return;
		}

		const root = document.documentElement;
		const overflow = root.style.overflow;
		root.style.overflow = "hidden";

		return () => {
			root.style.overflow = overflow;
		};
	}, [isModalOpen]);

	function open(): void {
		dialogRef.current?.showModal();
		/** The heading, not the first control: the dialog's content is long, so a screen reader starts at its title. */
		headingRef.current?.focus();
		setIsOpen(true);
	}

	function showResults(): void {
		dialogRef.current?.close();
		// oxlint-disable-next-line unicorn/prefer-query-selector -- A `useId` id is not guaranteed to be a valid css selector without escaping.
		document.getElementById(resultsId)?.focus();
	}

	return (
		<div className={className}>
			<button
				className="flex items-center justify-center gap-x-2 border-2 border-stroke-accent bg-background-base px-6 py-3 font-heading font-bold text-text-accent min-block-15 inline-full hover:bg-background-accent-strong hover:text-text-inverse focus-visible-outline lg:hidden"
				onClick={open}
				type="button"
			>
				{t("Show filters")}
				{activeCount > 0 ? (
					<span>
						<span aria-hidden={true}>({activeCount})</span>
						<span className="sr-only">, {t("{count, plural, other {# active}}", { count: activeCount })}</span>
					</span>
				) : null}
			</button>
			{isDialog ? (
				<dialog
					ref={dialogRef}
					aria-labelledby={`${id}-heading`}
					className="fixed inset-0 m-0 flex-col border-0 bg-background-base p-0 text-text-strong block-dvh max-block-none max-inline-none inline-full backdrop:bg-transparent open:flex"
					onClose={() => {
						setIsOpen(false);
					}}
				>
					<div className="mx-4 mbs-4 flex shrink-0 items-center justify-between gap-x-4 border-be border-stroke-weak py-2 pe-2">
						<h2
							ref={headingRef}
							className="text-title-3 font-bold focus:outline-none"
							id={`${id}-heading`}
							tabIndex={-1}
						>
							{t("Filters")}
						</h2>
						<button
							aria-label={t("Close filters")}
							className="flex touch-area text-icon-accent focus-visible-outline"
							onClick={() => {
								dialogRef.current?.close();
							}}
							type="button"
						>
							<XIcon aria-hidden={true} className="size-6" strokeWidth={2.5} />
						</button>
					</div>
					<div className="flex flex-1 flex-col overflow-y-auto p-4">
						{hasValues ? (
							<FacetsDialogContext value={true}>{children}</FacetsDialogContext>
						) : (
							<p>{t("No resources match your search, so there is nothing to filter.")}</p>
						)}
					</div>
					<div className="shrink-0 p-4 shadow-[0_-4px_12px_0_rgb(0_0_0/0.08)]">
						<button
							className="flex items-center justify-center border-2 border-stroke-accent bg-background-accent-strong px-6 py-3 font-heading font-bold text-text-inverse min-block-15 inline-full hover:bg-background-base hover:text-text-accent focus-visible-outline"
							onClick={showResults}
							type="button"
						>
							{t("{total, plural, one {See # result} other {See # results}}", { total })}
						</button>
						<span className="sr-only" role="status">
							{t("{total, plural, one {# result} other {# results}}", { total })}
						</span>
					</div>
				</dialog>
			) : (
				<div className="flex flex-col gap-y-10 max-lg:hidden">{children}</div>
			)}
		</div>
	);
}
