import type { JSONContent } from "@tiptap/core";
import { StarterKit } from "@tiptap/starter-kit";
import { renderToReactElement } from "@tiptap/static-renderer/pm/react";
import type { ReactNode } from "react";

interface RichTextProps {
	content: JSONContent;
}

export function RichText(props: Readonly<RichTextProps>): ReactNode {
	const { content } = props;

	return renderToReactElement({ content, extensions: [StarterKit] });
}
