/* eslint-disable @eslint-react/no-array-index-key */

import { unreachable } from "@acdh-oeaw/lib";
import type { JSONContent } from "@tiptap/core";
import type { ReactNode } from "react";

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
				return null;
			}

			case "hero": {
				return null;
			}

			case "image": {
				return null;
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
