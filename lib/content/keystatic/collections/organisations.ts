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

export const createOrganisation = createCollection("/organisations/", (paths, locale) => {
	return collection({
		label: "Organisations",
		path: paths.contentPath,
		format: { contentField: "description" },
		slugField: "name",
		columns: ["name"],
		entryLayout: "form",
		schema: {
			name: fields.slug({
				name: {
					label: "Name",
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
			affiliations: fields.array(
				fields.relationship({
					label: "Affiliation",
					collection: withI18nPrefix("organisations", locale),
				}),
				{
					label: "Affiliations",
					itemLabel(props) {
						return props.value ?? "";
					},
				},
			),
			contact: fields.array(
				fields.relationship({
					label: "Contact",
					collection: withI18nPrefix("persons", locale),
				}),
				{
					label: "Contact",
					itemLabel(props) {
						return props.value ?? "";
					},
				},
			),
			consortiumStatus: fields.select({
				label: "Consortium Status",
				description: "The status of the consortium",
				options: [
					{ label: "Member", value: "member" },
					{ label: "Observer", value: "observer" },
					{ label: "None", value: "none" },
				],
				defaultValue: "none",
			}),
			description: fields.mdx({
				label: "Description",
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
