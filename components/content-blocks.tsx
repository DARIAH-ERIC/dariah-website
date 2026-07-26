/* eslint-disable @eslint-react/no-array-index-key */

import { log, unreachable } from "@acdh-oeaw/lib";
import { cn } from "@acdh-oeaw/style-variants";
import type { JSONContent } from "@tiptap/core";
import type { ReactNode } from "react";

import { Image } from "@/components/image";
import { RichText } from "@/components/rich-text";
import { getRichTextPlainText, RichTextCaption } from "@/components/rich-text-caption";
import { Typography } from "@/components/ui/typography/typography";
import type { components } from "@/lib/api/types";

interface ContentBlocksProps {
	fields: components["schemas"]["Page"]["content"];
}

export function ContentBlocks(props: ContentBlocksProps): ReactNode {
	const { fields } = props;

	return fields.map((field, index) => {
		switch (field.type) {
			case "accordion": {
				return null;
			}

			case "callout": {
				return (
					<aside
						key={index}
						className="flex flex-col gap-2.5 p-10 bg-primary-100 mt-4 *:first:mt-0!"
					>
						{field.title !== "" && field.title !== null && (
							<Typography variant="h5">{field.title}</Typography>
						)}
						<RichText content={field.content as JSONContent} />
					</aside>
				);
			}

			case "data": {
				return null;
			}

			case "embed": {
				const caption = getRichTextPlainText(field.caption);

				return (
					<figure key={index} className="flex flex-col gap-7 py-4">
						<iframe
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							allowFullScreen={true}
							className="max-w-full max-h-900 aspect-video"
							referrerPolicy="strict-origin-when-cross-origin"
							// eslint-disable-next-line @eslint-react/dom/no-unsafe-iframe-sandbox
							sandbox="allow-scripts allow-same-origin"
							src={field.url}
							title={caption || "Embedded content"}
							width="1600"
						></iframe>
						{field.caption !== null && (
							<figcaption className="text-small text-gray-900">
								<RichTextCaption content={field.caption} />
							</figcaption>
						)}
					</figure>
				);
			}

			case "hero": {
				return null;
			}

			case "image": {
				/**
				 * `float-*` pulls the image aside so the text of the following blocks wraps around it,
				 * but only once the viewport can spare the width - below `lg` it spans the column, so
				 * text never has to wrap in a cramped measure. `wide` and `full` break out into the page
				 * gutter by fixed amounts: the pages hosting content blocks share no content measure, and
				 * a viewport-relative full bleed would sit off-axis in the ones with a sidebar.
				 */
				const layoutClassName = {
					default: "",
					wide: "-mx-4 lg:-mx-12",
					full: "-mx-4 lg:-mx-24",
					"float-start": "lg:float-start lg:mr-7 lg:w-[min(18rem,45%)]",
					"float-end": "lg:float-end lg:ml-7 lg:w-[min(18rem,45%)]",
				}[field.layout];

				// Floated images are served at half the width of the ones that span the column.
				const isFloated = field.layout === "float-start" || field.layout === "float-end";

				return (
					<figure key={index} className={cn("flex flex-col gap-7 py-6", layoutClassName)}>
						<Image
							// No alt on the asset means the image is presentational.
							alt={field.image.alt ?? ""}
							height={isFloated ? 450 : 900}
							src={field.image.url}
							width={isFloated ? 800 : 1600}
						/>
						{field.caption !== null && (
							<figcaption className="text-small text-gray-900">
								<RichTextCaption content={field.caption} />
							</figcaption>
						)}
					</figure>
				);
			}

			case "media_text": {
				// The API drops the block from the editor preview when either half is missing, and there
				// is nothing to wrap text around (or no text to wrap) either way.
				if (field.content == null) {
					return null;
				}

				return (
					// `flow-root` contains the float, so it never reaches the following content block. The
					// block right after the figure drops its top margin, so the text starts level with the
					// top of the image rather than below it.
					<div key={index} className="flow-root py-4 [&>figure+*]:mt-0!">
						<figure
							className={cn(
								// The thumbnail keeps its square size and the figure grows for the caption, so a
								// credit sits under the image within the same column. It only floats once the
								// text beside it has room to wrap cleanly; below `sm` the pairing stacks.
								//
								// While floating, the image is nudged down to the cap height of the first line:
								// the half-leading above that line otherwise makes flush-aligned text read as
								// sitting lower than the image. Stacked, there is nothing to align to.
								"mb-4 w-50 max-w-full sm:mt-1.5",
								field.side === "end" ? "sm:float-end sm:ml-7" : "sm:float-start sm:mr-7",
							)}
						>
							<Image
								// No alt on the asset means the image is presentational.
								alt={field.image.alt ?? ""}
								// The API serves this image at 400px wide, so never scale it up past that.
								className="size-50 max-w-full object-cover"
								height={400}
								src={field.image.url}
								width={400}
							/>
							{field.caption !== null && (
								<figcaption className="text-small text-gray-900 mt-2">
									<RichTextCaption content={field.caption} />
								</figcaption>
							)}
						</figure>
						<RichText content={field.content as JSONContent} />
					</div>
				);
			}

			case "rich_text": {
				return <RichText key={index} content={field.content as JSONContent} />;
			}

			default: {
				log.error("Unknown content block type.");
				unreachable();
			}
		}
	});
}
