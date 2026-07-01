/* eslint-disable @eslint-react/no-array-index-key */

import { unreachable } from "@acdh-oeaw/lib";
import type { JSONContent } from "@tiptap/core";
import type { ReactNode } from "react";

import { Image } from "@/components/image";
import { RichText } from "@/components/rich-text";

interface ContentBlocksProps {
	fields: Array<
		| {
				type: "rich_text";
				content: unknown;
		  }
		| {
				type: "embed";
				url: string;
				caption: string | null;
		  }
		| {
				type: "image";
				image: {
					url: string;
				};
				caption: string | null;
		  }
		| {
				type: "data";
				dataType: "events" | "news";
				limit: number | null;
		  }
		| {
				type: "hero";
				title: string;
				eyebrow: string | null;
				image: { url: string } | null;
				ctas: Array<{ label: string; url: string }> | null;
		  }
		| {
				type: "accordion";
				items: Array<{ title: string; content?: unknown }>;
		  }
	>;
}

export function ContentBlocks(props: ContentBlocksProps): ReactNode {
	const { fields } = props;

	return fields.map((field, index) => {
		switch (field.type) {
			case "accordion": {
				return null;
			}

			case "data": {
				return null;
			}

			case "embed": {
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
							title={field.caption ?? "Embedded content"}
							width="1600"
						></iframe>
						{field.caption !== null && (
							<figcaption className="text-small text-gray-900">{field.caption}</figcaption>
						)}
					</figure>
				);
			}

			case "hero": {
				return null;
			}

			case "image": {
				return (
					<figure key={index} className="flex flex-col gap-7 py-4">
						<Image alt={field.caption ?? "Image"} height={900} src={field.image.url} width={1600} />
						{field.caption !== null && (
							<figcaption className="text-small text-gray-900">{field.caption}</figcaption>
						)}
					</figure>
				);
			}

			case "rich_text": {
				return <RichText key={index} content={field.content as JSONContent} />;
			}

			default: {
				unreachable();
			}
		}
	});
}
