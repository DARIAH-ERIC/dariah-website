"use client";

import type { ReactNode } from "react";

import { SearchForm } from "#/app/(app)/(default)/_components/search-form.tsx";
import { searchParams } from "#/app/(app)/(default)/search/search-params.ts";
import { href } from "#/lib/navigation/href.ts";

/** Binds the search form to this page's search params codec, which lives on the client with it. */
export function WebsiteSearchForm(
	props: Readonly<{ children: ReactNode; className?: string; statusClassName?: string }>,
): ReactNode {
	return (
		<SearchForm
			action="/search"
			className={props.className}
			hrefFor={(values) => {
				const query = searchParams.safeParse(values);
				return query.success ? href({ pathname: "/search", searchParams: searchParams.encode(query.output) }) : null;
			}}
			statusClassName={props.statusClassName}
		>
			{props.children}
		</SearchForm>
	);
}
