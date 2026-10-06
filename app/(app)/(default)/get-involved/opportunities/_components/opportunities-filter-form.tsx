"use client";

import type { ReactNode } from "react";

import { SearchForm } from "#/app/(app)/(default)/_components/search-form.tsx";
import { searchParams } from "#/app/(app)/(default)/get-involved/opportunities/search-params.ts";
import { href } from "#/lib/navigation/href.ts";

/** Binds the search form to this page's search params codec, which lives on the client with it. */
export function OpportunitiesFilterForm(
	props: Readonly<{ children: ReactNode; className?: string; statusClassName?: string }>,
): ReactNode {
	return (
		<SearchForm
			action="/get-involved/opportunities"
			className={props.className}
			hrefFor={(values) => {
				const query = searchParams.safeParse(values);
				return query.success
					? href({ pathname: "/get-involved/opportunities", searchParams: searchParams.encode(query.output) })
					: null;
			}}
			statusClassName={props.statusClassName}
		>
			{props.children}
		</SearchForm>
	);
}
