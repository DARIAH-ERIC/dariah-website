import type { NewsletterList } from "@/lib/data/api-client";

export function groupNewslettersByYear(
	items: NewsletterList["data"],
): Array<[string, NewsletterList["data"]]> {
	const grouppedItems = items.reduce<Record<string, NewsletterList["data"]>>((acc, item) => {
		const itemDate = item.send_time !== null ? new Date(item.send_time) : new Date();
		const year = itemDate.getFullYear().toString();
		acc[year] = [...(acc[year] ?? []), item];
		return acc;
	}, {});

	return Object.entries(grouppedItems).toSorted((a, b) => {
		return Number(b[0]) - Number(a[0]);
	});
}

export const getSectionsFromGroups = (
	items: Array<[string, NewsletterList["data"]]>,
): Array<string> => {
	return [
		...new Set(
			items.map(([year]) => {
				return year;
			}),
		),
	];
};
