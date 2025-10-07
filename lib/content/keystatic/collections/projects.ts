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

export const createProjects = createCollection("/projects/", (paths, locale) => {
	return collection({
		label: "Projects",
		path: paths.contentPath,
		format: { contentField: "content" },
		slugField: "title",
		columns: ["title", "startDate"],
		entryLayout: "content",
		previewUrl: createPreviewUrl("/projects/{slug}"),
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
			funding: fields.select({
				label: "Funding",
				description: "The funding of the project",
				options: [{ label: "DARIAH EU", value: "dariah-eu" }],
				defaultValue: "dariah-eu",
			}),
			responsiblePersons: fields.array(
				fields.relationship({
					label: "Name",
					collection: withI18nPrefix("persons", locale),
				}),
				{
					label: "Responsible Person(s)",
					itemLabel(props) {
						return props.value ?? "";
					},
				},
			),
			projectPartners: fields.array(
				fields.relationship({
					label: "Name",
					collection: withI18nPrefix("organisations", locale),
				}),
				{
					label: "Project Partner(s)",
					itemLabel(props) {
						return props.value ?? "";
					},
				},
			),
			startDate: fields.date({
				label: "Start date",
				validation: { isRequired: false },
			}),
			endDate: fields.date({
				label: "End date",
				validation: { isRequired: false },
			}),
			keywords: fields.array(
				fields.relationship({
					label: "Keyword",
					collection: withI18nPrefix("keywords", locale),
				}),
				{
					label: "Keyword(s)",
					itemLabel(props) {
						return props.value ?? "";
					},
				},
			),
			additionalImages: fields.array(
				fields.object(
					{
						image: fields.image({
							label: "Image",
							validation: { isRequired: true },
							...createAssetOptions(paths.assetPath),
						}),
						alt: fields.text({
							label: "Alternative text",
							validation: { isRequired: false },
						}),
						license: fields.text({
							label: "License",
							validation: { isRequired: false },
						}),
					},
					{
						label: "Image",
					},
				),
				{
					label: "Additional images",
					itemLabel(props) {
						return props.fields.alt.value;
					},
				},
			),
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
