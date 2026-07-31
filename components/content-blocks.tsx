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
	className?: string;
	fields: components["schemas"]["Page"]["content"];
}

export function ContentBlocks(props: Readonly<ContentBlocksProps>): ReactNode {
	const { className, fields } = props;

	return <div className={cn("@container", className)}>{fields.map(renderContentBlock)}</div>;
}

function renderContentBlock(
	field: components["schemas"]["Page"]["content"][number],
	index: number,
): ReactNode {
	switch (field.type) {
		case "accordion": {
			return null;
		}

		case "callout": {
			return (
				<aside key={index} className="flex flex-col gap-2.5 p-10 bg-primary-100 mt-4 *:first:mt-0!">
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
				<figure key={index} className="flex flex-col gap-y-2 py-4">
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
					<Image
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
						<Image
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
}
