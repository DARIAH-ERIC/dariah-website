"use client";

import type { ReactNode } from "react";

import { SearchForm } from "#/app/(app)/(default)/_components/search-form.tsx";
import { searchParams } from "#/app/(app)/(default)/resources/resource-catalogue/search-params.ts";
import { href } from "#/lib/navigation/href.ts";

/** Binds the search form to this page's search params codec, which lives on the client with it. */
export function ResourcesSearchForm(
	props: Readonly<{ children: ReactNode; className?: string; statusClassName?: string }>,
): ReactNode {
	return (
		<SearchForm
			action="/resources/resource-catalogue"
			className={props.className}
			hrefFor={(values) => {
				const query = searchParams.safeParse(values);
				return query.success
					? href({ pathname: "/resources/resource-catalogue", searchParams: searchParams.encode(query.output) })
					: null;
			}}
			statusClassName={props.statusClassName}
		>
			{props.children}
		</SearchForm>
	);
}
