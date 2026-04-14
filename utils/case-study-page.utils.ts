import type { ImpactCaseStudyList } from "@/lib/data/api-client";

export function groupCaseStudiesByYear(
	items: ImpactCaseStudyList["data"],
): Array<[string, ImpactCaseStudyList["data"]]> {
	const grouppedItems = items.reduce<Record<string, ImpactCaseStudyList["data"]>>((acc, item) => {
		const year = new Date(item.publishedAt).getFullYear().toString();
		acc[year] = [...(acc[year] ?? []), item];
		return acc;
	}, {});

	return Object.entries(grouppedItems).toSorted((a, b) => {
		return Number(b[0]) - Number(a[0]);
	});
}
