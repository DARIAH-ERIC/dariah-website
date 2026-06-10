import type { DocumentOrPolicyTree } from "@/lib/data/api-client";
import type { DocumentOrPolicy, DocumentOrPolicyGroup } from "@/types/documents";

export const getSectionsFromGroups = (items: Array<DocumentOrPolicyGroup>): Array<string> => {
	return [
		...new Set(
			items.map((item) => {
				return item.label;
			}),
		),
	];
};

export const splitDocumentsByGroup = (
	items: DocumentOrPolicyTree["data"],
): {
	documentsWithoutGroup: Array<DocumentOrPolicy>;
	documentsByGroup: Array<DocumentOrPolicyGroup>;
} => {
	const documentsWithoutGroup: Array<DocumentOrPolicy> = items.filter((item) => {
		return "publishedAt" in item;
	});
	const documentsByGroup: Array<DocumentOrPolicyGroup> = items.filter((item) => {
		return "items" in item;
	});

	return { documentsWithoutGroup, documentsByGroup };
};
