import {
	createAssetOptions,
	createCollection,
	createContentFieldOptions,
} from "@acdh-oeaw/keystatic-lib";
import { collection, fields } from "@keystatic/core";

import { createFigure } from "@/lib/content/keystatic/components/figure";
import { createFootnote } from "@/lib/content/keystatic/components/footnote";
import { createGrid } from "@/lib/content/keystatic/components/grid";
import { createHeadingId } from "@/lib/content/keystatic/components/heading-id";
import { createLink } from "@/lib/content/keystatic/components/link";
import { createLinkButton } from "@/lib/content/keystatic/components/link-button";
import { createVideo } from "@/lib/content/keystatic/components/video";

export const createPages = createCollection("/pages/", (paths, locale) => {
	return collection({
		label: "Pages",
		path: paths.contentPath,
		format: { contentField: "content" },
		slugField: "title",
		columns: ["title"],
		entryLayout: "content",
		schema: {
			title: fields.slug({
				name: {
					label: "Title",
					validation: { isRequired: true },
				},
			}),
			image: fields.object({
				src: fields.image({
					label: "Image",
					validation: { isRequired: true },
					...createAssetOptions(paths.assetPath),
				}),
				caption: fields.mdx.inline({
					label: "Image Caption",
					options: {
						heading: false,
						orderedList: false,
						unorderedList: false,
						divider: false,
						code: false,
						codeBlock: false,
						blockquote: false,
						table: false,
						image: false,
						strikethrough: false,
					},
				}),
			}),
			summary: fields.object({
				title: fields.text({
					label: "Summary title",
					validation: { isRequired: false },
				}),
				content: fields.mdx.inline({
					label: "Summary content",
					options: {
						heading: false,
						orderedList: false,
						unorderedList: false,
						divider: false,
						code: false,
						codeBlock: false,
						blockquote: false,
						table: false,
						image: false,
					},
				}),
			}),
			content: fields.mdx({
				label: "Content",
				options: createContentFieldOptions(paths),
				components: {
					//...createAvatar(paths, locale),
					//...createDownloadButton(paths, locale),
					...createFigure(paths, locale),
					...createFootnote(paths, locale),
					...createGrid(paths, locale),
					...createHeadingId(paths, locale),
					//...createImageLink(paths, locale),
					...createLink(paths, locale),
					...createLinkButton(paths, locale),
					//...createTweet(paths, locale),
					...createVideo(paths, locale),
				},
			}),
		},
	});
});
