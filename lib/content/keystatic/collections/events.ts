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

export const createEvents = createCollection("/events/", (paths, locale) => {
	return collection({
		label: "Events",
		path: paths.contentPath,
		format: { contentField: "content" },
		slugField: "title",
		columns: ["title", "publicationDate"],
		entryLayout: "content",
		previewUrl: createPreviewUrl("/events/{slug}"),
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
			startDate: fields.datetime({
				label: "Event start date",
				validation: { isRequired: false },
			}),
			endDate: fields.datetime({
				label: "Event end date",
				validation: { isRequired: false },
			}),
			location: fields.text({
				label: "Event location",
				validation: { isRequired: false },
			}),
			hosts: fields.blocks(
				{
					person: {
						label: "Person",
						schema: fields.relationship({
							label: "Person",
							collection: withI18nPrefix("persons", locale),
						}),
						itemLabel(props) {
							return props.value ?? "";
						},
					},
					organisation: {
						label: "Organisation",
						schema: fields.relationship({
							label: "Organisation",
							collection: withI18nPrefix("organisations", locale),
						}),
						itemLabel(props) {
							return props.value ?? "";
						},
					},
				},
				{ label: "Hosts" },
			),
			speakers: fields.array(
				fields.relationship({
					label: "Speakers",
					collection: withI18nPrefix("persons", locale),
				}),
				{
					label: "Speakers",
					itemLabel(props) {
						return props.value ?? "";
					},
				},
			),
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
						label: fields.text({
							label: "Attachment",
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
					label: "Attachments",
					itemLabel(props) {
						return props.fields.label.value;
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
