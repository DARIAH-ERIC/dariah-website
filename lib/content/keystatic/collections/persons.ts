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

export const createPersons = createCollection("/persons/", (paths, locale) => {
	return collection({
		label: "Persons",
		path: paths.contentPath,
		format: { contentField: "description" },
		slugField: "name",
		columns: ["name"],
		entryLayout: "content",
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
			links: fields.array(
				fields.object({
					kind: fields.select({
						label: "Type",
						options: [
							{ label: "Bluesky", value: "bluesky" },
							{ label: "Email", value: "email" },
							{ label: "Facebook", value: "facebook" },
							{ label: "Instagram", value: "instagram" },
							{ label: "Linkedin", value: "linkedin" },
							{ label: "Mastodon", value: "mastodon" },
							{ label: "ORCID", value: "orcid" },
							{ label: "Website", value: "website" },
							{ label: "YouTube", value: "youtube" },
						],
						defaultValue: "website",
					}),
					href: fields.url({
						label: "URL",
						validation: { isRequired: true },
					}),
				}),
				{
					label: "Links (social media)",
					itemLabel(props) {
						return props.fields.kind.value;
					},
				},
			),
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
