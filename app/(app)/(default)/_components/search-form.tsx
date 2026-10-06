"use client";

import { LoaderCircleIcon } from "lucide-react";
import { useExtracted as useTranslations } from "next-intl";
import Form from "next/form";
import { type ComponentProps, Fragment, type ReactNode, useTransition } from "react";

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
 */
export function SearchForm(props: Readonly<SearchFormProps>): ReactNode {
	const { children, hrefFor, onChange, statusClassName, ...rest } = props;

	const t = useTranslations();
	const router = useRouter();
	/** Keeps pending across overlapping navigations, so the spinner stays up until the latest search has rendered. */
	const [isPending, startTransition] = useTransition();

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
				{isPending ? (
					<Fragment>
						<LoaderCircleIcon aria-hidden={true} className="size-5 animate-spin" />
						<span className="sr-only">{t("Loading results…")}</span>
					</Fragment>
				) : null}
			</span>
		</Form>
	);
}
