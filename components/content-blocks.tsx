import { log, unreachable } from "@acdh-oeaw/lib";
import { cn } from "@acdh-oeaw/style-variants";
import type { JSONContent } from "@tiptap/core";
import { type ReactNode, useId } from "react";

import { ContentImage } from "@/components/image";
import { RichText } from "@/components/rich-text";
import { getRichTextPlainText, RichTextCaption } from "@/components/rich-text-caption";
import { GalleryCarousel } from "@/components/ui/gallery/gallery-carousel";
import { GalleryGrid } from "@/components/ui/gallery/gallery-grid";
import { ChevronDownIcon } from "@/components/ui/icons/chevron-down";
import { Typography } from "@/components/ui/typography/typography";
import type { components } from "@/lib/api/types";
import { collectFootnotes, numberFootnotes } from "@/lib/rich-text-footnotes";

interface ContentBlocksProps {
	className?: string;
	fields: components["schemas"]["Page"]["content"];
}

export function ContentBlocks(props: Readonly<ContentBlocksProps>): ReactNode {
	const { className, fields } = props;
	const footnoteScope = useId();
	const numberedFields = numberFootnotes(fields);
	const footnotes = collectFootnotes(numberedFields);
	const footnotesLabelId = `footnotes-${footnoteScope}`;

	return (
		<div className={cn("@container", className)}>
			{numberedFields.map((field, index) => renderContentBlock(field, index, footnoteScope))}
			{footnotes.length > 0 ? (
				<section
					aria-labelledby={footnotesLabelId}
					className="clear-both border-t border-gray-300 pt-4 mt-6"
					role="doc-endnotes"
				>
					<p className="text-small font-semibold text-gray-700 uppercase" id={footnotesLabelId}>
						Footnotes
					</p>
					<ol className={cn(listStyles, "list-decimal mt-2 text-regular")}>
						{footnotes.map((note, index) => {
							const number = index + 1;

							return (
								<li id={`fn-${footnoteScope}-${String(number)}`} key={number}>
									{note != null ? <RichTextCaption content={note} /> : null}
									{"\u00A0"}
									<a
										aria-label={`Back to footnote ${String(number)} in the text`}
										className="text-gray-700 no-underline"
										href={`#fnref-${footnoteScope}-${String(number)}`}
										role="doc-backlink"
									>
										↩
									</a>
								</li>
							);
						})}
					</ol>
				</section>
			) : null}
		</div>
	);
}

/** Footnotes are separated by the same `mt-4` that sits between paragraphs. */
const listStyles = cn("pl-6 list-outside", "[&>li>p:first-child]:mt-0!", "[&>li+li]:mt-4");

function renderContentBlock(
	field: components["schemas"]["Page"]["content"][number],
	index: number,
	footnoteScope: string,
): ReactNode {
	switch (field.type) {
		case "accordion": {
			if (field.items.length === 0) {
				return null;
			}

			return (
				<div
					key={index}
					className="flex flex-col divide-y divide-gray-300 rounded-lg border border-gray-300 mt-4"
				>
					{field.items.map((item, itemIndex) => {
						return (
							// Accordion items do not have ids in the API schema.
							// eslint-disable-next-line @eslint-react/no-array-index-key
							<details key={itemIndex} className="group px-4">
								<summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3 font-medium text-regular [&::-webkit-details-marker]:hidden">
									{item.title}
									<ChevronDownIcon
										aria-hidden="true"
										className="shrink-0 transition-transform group-open:rotate-180"
									/>
								</summary>
								{item.content != null ? (
									<div className="pb-3 *:first:mt-0!">
										<RichText content={item.content as JSONContent} footnoteScope={footnoteScope} />
									</div>
								) : null}
							</details>
						);
					})}
				</div>
			);
		}

		case "callout": {
			return (
				<aside key={index} className="flex flex-col gap-2.5 p-10 bg-primary-100 mt-4 *:first:mt-0!">
					{field.title !== "" && field.title !== null && (
						<Typography className="text-h5" variant="h2">
							{field.title}
						</Typography>
					)}
					<RichText content={field.content as JSONContent} footnoteScope={footnoteScope} />
				</aside>
			);
		}

		case "data": {
			return null;
		}

		case "embed": {
			const caption = getRichTextPlainText(field.caption);

			return (
				<figure key={index} className="flex flex-col gap-y-2 py-4">
					<iframe
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowFullScreen={true}
						className="max-w-full max-h-900 aspect-video"
						referrerPolicy="strict-origin-when-cross-origin"
						// eslint-disable-next-line @eslint-react/dom/no-unsafe-iframe-sandbox
						sandbox="allow-scripts allow-same-origin"
						src={`${field.url}?hl=en`}
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

		case "gallery": {
			if (field.items.length === 0) {
				return null;
			}

			const items = field.items.map((item) => {
				return {
					alt: item.image.alt,
					caption: item.caption != null ? <RichTextCaption content={item.caption} /> : undefined,
					url: item.image.url,
				};
			});

			return (
				<div key={index} className="py-4">
					{field.layout === "carousel" ? (
						<GalleryCarousel items={items} />
					) : (
						<GalleryGrid items={items} />
					)}
				</div>
			);
		}

		case "hero": {
			return null;
		}

		case "image": {
			/**
			 * The layout determines the slot claimed by the figure, not the rendered image width. Keep
			 * narrower sources at their intrinsic width and centre them instead of stretching them to fill.
			 */
			const layoutClassName = {
				default: "",
				wide: "-mx-4 lg:-mx-12",
				full: "-mx-4 lg:-mx-24",
				"float-start": "max-w-72 @2xl:float-start @2xl:mr-7",
				"float-end": "max-w-72 @2xl:float-end @2xl:ml-7",
			}[field.layout];

			const isFloated = field.layout === "float-start" || field.layout === "float-end";

			return (
				<figure key={index} className={cn("flex flex-col gap-y-2 py-4 mt-1.5", layoutClassName)}>
					<ContentImage
						alt={field.image.alt ?? ""}
						className="ms-auto me-auto inline-auto max-inline-full"
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
			if (field.content == null) {
				return null;
			}

			return (
				<div key={index} className="flow-root py-4 [&>figure+*]:mt-0!">
					<figure
						className={cn(
							"mb-4 w-50 max-w-full @xl:mt-1.5",
							field.side === "end" ? "@xl:float-end @xl:ml-7" : "@xl:float-start @xl:mr-7",
						)}
					>
						<ContentImage
							alt={field.image.alt ?? ""}
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
					<RichText content={field.content as JSONContent} footnoteScope={footnoteScope} />
				</div>
			);
		}

		case "rich_text": {
			return (
				<RichText
					key={index}
					content={field.content as JSONContent}
					footnoteScope={footnoteScope}
				/>
			);
		}

		default: {
			log.error("Unknown content block type.");
			unreachable();
		}
	}
}
