export const getSectionsFromContent = (content: unknown): void => {
	console.log(typeof content, typeof content.content, content);
	// if (content !== undefined || content?.length === 0) return [];
	// return content.map((element) => {
	// 	return element.type === "heading" && element.attrs.level === 4;
	// });
};
