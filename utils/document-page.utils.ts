import type { DocumentOrPolicyList } from "@/lib/data/api-client";

export const sortDocumentsByGroup = (
	items: DocumentOrPolicyList["data"],
): Record<string, DocumentOrPolicyList["data"]> => {
	return items.reduce<Record<string, DocumentOrPolicyList["data"]>>((acc, item) => {
		const groupLabel = item.group?.label ?? "others";

		acc[groupLabel] ??= [];

		acc[groupLabel].push(item);
		return acc;
	}, {});
};

export const getSectionsFromGroups = (items: DocumentOrPolicyList["data"]): Array<string> => {
	return [
		...new Set(
			items
				.map((item) => {
					return item.group?.label;
				})
				.filter((label) => {
					return label !== undefined;
				}),
		),
	];
};
