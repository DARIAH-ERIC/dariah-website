import { createCollection, createContentFieldOptions } from "@acdh-oeaw/keystatic-lib";
import { collection, fields } from "@keystatic/core";

import { createFigure } from "@/lib/content/keystatic/components/figure";
import { createFootnote } from "@/lib/content/keystatic/components/footnote";
import { createGrid } from "@/lib/content/keystatic/components/grid";
import { createHeadingId } from "@/lib/content/keystatic/components/heading-id";
import { createLink } from "@/lib/content/keystatic/components/link";
import { createLinkButton } from "@/lib/content/keystatic/components/link-button";
import { createVideo } from "@/lib/content/keystatic/components/video";

export const createKeywords = createCollection("/keywords/", (paths, locale) => {
	return collection({
		label: "Keywords",
		path: paths.contentPath,
		format: { contentField: "description" },
		slugField: "label",
		columns: ["label"],
		entryLayout: "content",
		schema: {
			label: fields.slug({
				name: {
					label: "Name",
					validation: { isRequired: true },
				},
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
			synonyms: fields.array(
				fields.text({
					label: "Synonym",
				}),
				{
					label: "Synonyms",
					itemLabel(props) {
						return props.value;
					},
				},
			),
		},
	});
});
