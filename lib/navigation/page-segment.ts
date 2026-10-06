/**
 * A paginated list's first page is the list's own url, and each later page is at `<list>/page/<n>`: a path segment
 * rather than a search param, so every page is prerendered whole (see `generateStaticParams`), and an out-of-range page
 * is a real `404`.
 *
 * The first page has no `/page/1` url, so it is answered with `null` here, as a malformed number is - `01` too, so each
 * page has a single url.
 */
export function parsePageSegment(segment: string): number | null {
	if (!/^[1-9]\d*$/.test(segment)) {
		return null;
	}

	const page = Number(segment);

	return Number.isSafeInteger(page) && page >= 2 ? page : null;
}

/**
 * The params of every later page of a list with `pages` pages, for `generateStaticParams`. Never empty, which Cache
 * Components does not allow: a list of a single page still lists page 2, which answers with `notFound()`.
 */
export function pageSegmentParams(pages: number): Array<{ page: string }> {
	return Array.from({ length: Math.max(pages, 2) - 1 }, (_, index) => {
		return { page: String(index + 2) };
	});
}
