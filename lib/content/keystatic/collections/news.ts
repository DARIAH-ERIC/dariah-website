import {
	createAssetOptions,
	createCollection,
	createContentFieldOptions,
	withI18nPrefix,
} from "@acdh-oeaw/keystatic-lib";
import { collection, fields } from "@keystatic/core";

import { createFigure } from "@/lib/content/keystatic/components/figure";
import { createFootnote } from "@/lib/content/keystatic/components/footnote";
import { createGrid } from "@/lib/content/keystatic/components/grid";
import { createHeadingId } from "@/lib/content/keystatic/components/heading-id";
import { createLink } from "@/lib/content/keystatic/components/link";
import { createLinkButton } from "@/lib/content/keystatic/components/link-button";
import { createVideo } from "@/lib/content/keystatic/components/video";
import { createPreviewUrl } from "@/lib/content/keystatic/utils/create-preview-url";

export const createNews = createCollection("/news/", (paths, locale) => {
	return collection({
		label: "News",
		path: paths.contentPath,
		format: { contentField: "content" },
		slugField: "title",
		columns: ["title", "publicationDate"],
		entryLayout: "content",
		previewUrl: createPreviewUrl("/news/{slug}"),
		schema: {
			title: fields.slug({
				name: {
					label: "Title",
					validation: { isRequired: true },
				},
			}),
			publicationDate: fields.date({
				label: "Publication date",
				validation: { isRequired: true },
				defaultValue: { kind: "today" },
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
			links: fields.array(
				fields.object(
					{
						label: fields.text({
							label: "Label",
							validation: { isRequired: true },
						}),
						url: fields.url({
							label: "URL",
							validation: { isRequired: true },
						}),
					},
					{
						label: "Link",
					},
				),
				{
					label: "Links",
					itemLabel(props) {
						return props.fields.label.value;
					},
				},
			),
			attachments: fields.array(
				fields.object(
					{
						file: fields.file({
							label: "File",
							validation: { isRequired: true },
							...createAssetOptions(paths.downloadPath),
						}),
						label: fields.text({
							label: "Label",
							validation: { isRequired: true },
						}),
					},
					{
						label: "Attachment",
					},
				),
				{
					label: "Attachments",
					itemLabel(props) {
						return props.fields.label.value;
					},
				},
			),
			"working-groups": fields.array(
				fields.relationship({
					label: "Working group",
					collection: withI18nPrefix("working-groups", locale),
				}),
				{
					label: "Working Groups",
					itemLabel(props) {
						return props.value ?? "";
					},
				},
			),
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
