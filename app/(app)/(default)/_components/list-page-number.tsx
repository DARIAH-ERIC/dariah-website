"use client";

import { useExtracted as useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { type ReactNode, Suspense } from "react";

import { parsePageSegment } from "#/lib/navigation/page-segment.ts";

/**
 * The page number of a paginated list's later page, e.g. `/news/page/2`, visually hidden at the end of its `<h1>`, as
 * it is in the page's title. Next's route announcer reads the title on a client-side navigation, but that is usually
 * before the new page's metadata has streamed in: then it falls back to the `<h1>`, which would only say "News" on
 * every page. Nothing on the list's first page, which has no page segment.
 *
 * Read on the client, as the list's heading is rendered outside the boundary which waits for the params: a page number
 * not known at build time is answered with the route's skeleton, heading included.
 */
export function ListPageNumber(): ReactNode {
	return (
		<Suspense fallback={null}>
			<PageNumber />
		</Suspense>
	);
}

function PageNumber(): ReactNode {
	const t = useTranslations();
	const params = useParams<{ page?: string }>();

	const page = params.page != null ? parsePageSegment(params.page) : null;

	if (page == null) {
		return null;
	}

	return <span className="sr-only">{t(", page {page}", { page: String(page) })}</span>;
}
