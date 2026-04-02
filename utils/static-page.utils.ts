import type { JSONContent } from "@tiptap/core";

import type { components } from "@/lib/api/types";

export const getSectionsFromContent = (content: JSONContent): Array<string> => {
	const headings = content.content?.filter((element) => {
		return element.type === "heading" && element.attrs?.level === 4;
	});

	if (!headings) return [];
	return headings.map((heading) => {
		const text = heading.content?.[0]?.text;
		return text ?? "";
	});
};

export const addIdsToContent = (
	content: components["schemas"]["Page"]["content"],
): components["schemas"]["Page"]["content"] => {
	return content.map((element) => {
		if (element.type === "rich_text") {
			const jsonContent = (element.content as JSONContent).content?.map((subElement) => {
				if (subElement.type !== "heading" || subElement.attrs?.level !== 4) return subElement;
				return {
					...subElement,
					attrs: { ...subElement.attrs, id: subElement.content?.[0]?.text ?? "" },
				};
			});

			return {
				...element,
				content: {
					...(typeof element.content === "object" && element.content !== null
						? element.content
						: {}),
					content: jsonContent,
				},
			};
		} else return element;
	});
};
