import { cn } from "@acdh-oeaw/style-variants";
import type { JSONContent } from "@tiptap/core";
import { StarterKit } from "@tiptap/starter-kit";
import { renderToReactElement } from "@tiptap/static-renderer/pm/react";
import type { ReactNode } from "react";

import { createRichTextLinkRenderer } from "@/components/rich-text-link";
import { linkStyles } from "@/components/ui/link/link.styles";

interface RichTextCaptionProps {
	content: unknown;
}

const richTextCaptionLink = createRichTextLinkRenderer(
	cn(
		// eslint-disable-next-line better-tailwindcss/no-unknown-classes -- `paragraph` is a style variant, not a class.
		linkStyles({ variant: "paragraph" }),
		"inline [font-size:inherit]! leading-[inherit]!",
	),
);

function isJSONContent(content: unknown): content is JSONContent {
	return (
		typeof content === "object" &&
		content !== null &&
		"type" in content &&
		typeof content.type === "string"
	);
}

export function getRichTextPlainText(content: unknown): string {
	if (typeof content === "string") return content;
	if (Array.isArray(content)) {
		return content.map(getRichTextPlainText).join("");
	}
	if (!isJSONContent(content)) return "";
	if (typeof content.text === "string") return content.text;

	return getRichTextPlainText(content.content);
}

export function RichTextCaption(props: Readonly<RichTextCaptionProps>): ReactNode {
	const { content } = props;

	if (typeof content === "string") return content;
	if (!isJSONContent(content)) return null;

	return renderToReactElement({
		content,
		extensions: [
			StarterKit.configure({
				blockquote: false,
				bulletList: false,
				code: false,
				codeBlock: false,
				dropcursor: false,
				gapcursor: false,
				hardBreak: false,
				heading: false,
				horizontalRule: false,
				link: richTextCaptionLink.linkOptions,
				listItem: false,
				listKeymap: false,
				orderedList: false,
				paragraph: {
					HTMLAttributes: {
						class: "inline",
					},
				},
				strike: false,
				trailingNode: false,
				underline: false,
				undoRedo: false,
			}),
		],
		options: {
			markMapping: richTextCaptionLink.markMapping,
		},
	});
}
