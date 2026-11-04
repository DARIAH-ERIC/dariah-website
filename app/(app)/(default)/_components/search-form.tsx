"use client";

import { LoaderCircleIcon } from "lucide-react";
import { useExtracted as useTranslations } from "next-intl";
import Form from "next/form";
import { type ComponentProps, type ReactNode, useEffect, useRef, useState, useTransition } from "react";

import type { Href } from "#/lib/navigation/href.ts";
import { useRouter } from "#/lib/navigation/router.ts";
import type { SearchParamsInput } from "#/lib/navigation/search-params.ts";

interface SearchFormProps extends Omit<ComponentProps<typeof Form>, "action" | "onSubmit" | "replace" | "scroll"> {
	action: string;
	/**
	 * The url a submission navigates to, or `null` for values the page's search params codec rejects, which are left to
	 * the ordinary form submission. Pass the values through the codec, so empty fields are dropped from the url.
	 */
	hrefFor: (values: SearchParamsInput) => Href | null;
	/**
	 * What the status says once a search has rendered, e.g. the number of results, so that results which update in place
	 * are announced: the page's title stays the same, so next's route announcer does not. Visually hidden, as the page
	 * shows it elsewhere, e.g. as the results' heading.
	 */
	status?: ReactNode;
	/** Places the spinner, which follows the form's children, e.g. in a cell of the form's grid. */
	statusClassName?: string;
}

/**
 * A `get` search form which submits on every change - each keystroke and each toggled filter - so results update as the
 * user types. Not debounced, because typesense responds fast enough; the router drops stale navigations. Submissions
 * replace the history entry instead of adding one per keystroke, and keep the scroll position. Without javascript it
 * still works as an ordinary form with a submit button.
 *
 * While a search is in flight the previous results stay on screen, and a spinner shows they are about to be replaced.
 * Screen readers are told the same, and `status` once the search has rendered - see `useAnnouncement`.
 */
type Announcement = "loading" | "none" | "status";

/**
 * What the status reads out, which lags behind the search, so that typing - a search per keystroke - is not read out
 * keystroke by keystroke: once results have stayed put for half a second, `status`; while a search takes longer than a
 * second, "Loading results…". In between, nothing, which screen readers do not announce. The spinner is shown at once.
 *
 * Starts with `status`, which is rendered on the server, so that loading the page does not announce it.
 */
function useAnnouncement(isPending: boolean): Announcement {
	const [announcement, setAnnouncement] = useState<Announcement>("status");
	/** Compared against, rather than skipping the first run, which react's strict mode runs twice. */
	const wasPending = useRef(isPending);

	useEffect(() => {
		if (isPending === wasPending.current) {
			return;
		}

		wasPending.current = isPending;
		setAnnouncement("none");

		const timeout = setTimeout(
			() => {
				setAnnouncement(isPending ? "loading" : "status");
			},
			isPending ? 1000 : 500,
		);

		return () => {
			clearTimeout(timeout);
		};
	}, [isPending]);

	return announcement;
}

export function SearchForm(props: Readonly<SearchFormProps>): ReactNode {
	const { children, hrefFor, onChange, status, statusClassName, ...rest } = props;

	const t = useTranslations();
	const router = useRouter();
	/** Keeps pending across overlapping navigations, so the spinner stays up until the latest search has rendered. */
	const [isPending, startTransition] = useTransition();
	const announcement = useAnnouncement(isPending);

	return (
		<Form
			{...rest}
			onChange={(event) => {
				onChange?.(event);
				event.currentTarget.requestSubmit();
			}}
			onSubmit={(event) => {
				const values = new URLSearchParams();
				for (const [name, value] of new FormData(event.currentTarget)) {
					if (typeof value === "string") {
						values.append(name, value);
					}
				}

				const href = hrefFor(values);

				if (href == null) {
					return;
				}

				event.preventDefault();
				startTransition(() => {
					router.replace(href, { scroll: false });
				});
			}}
			role="search"
		>
			{children}
			<span className={statusClassName} role="status">
				{isPending ? <LoaderCircleIcon aria-hidden={true} className="animate-spin block-5 inline-5" /> : null}
				{announcement === "loading" ? (
					<span className="sr-only">{t("Loading results…")}</span>
				) : announcement === "status" && status != null ? (
					<span className="sr-only">{status}</span>
				) : null}
			</span>
		</Form>
	);
}
