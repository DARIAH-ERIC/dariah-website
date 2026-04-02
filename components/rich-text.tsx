import { cn } from "@acdh-oeaw/style-variants";
import type { JSONContent } from "@tiptap/core";
import { Heading } from "@tiptap/extension-heading";
import { StarterKit } from "@tiptap/starter-kit";
import { renderToReactElement } from "@tiptap/static-renderer/pm/react";
import type { ReactNode } from "react";

import { linkStyles } from "@/components/ui/link/link.styles";

interface RichTextProps {
	content: JSONContent;
}

interface HeadingAttributes {
	level: number;
	id?: string;
}

const ExtendedHeading = Heading.extend({
	addAttributes() {
		return {
			...this.parent?.(),
			id: {
				default: null,
				renderHTML(attributes: HeadingAttributes) {
					const id = attributes.id;
					if (id != null) {
						return { id };
					}
					return {};
				},
			},
		};
	},
});

export function RichText(props: Readonly<RichTextProps>): ReactNode {
	const { content } = props;

	return renderToReactElement({
		content,
		extensions: [
			StarterKit.configure({
				heading: {},
				paragraph: {
					HTMLAttributes: {
						class: "text-regular mt-4",
					},
				},
				link: {
					HTMLAttributes: {
						class: cn(linkStyles({ variant: "paragraph" }), "inline"),
					},
				},
			}),
			ExtendedHeading.configure({
				HTMLAttributes: {
					class: cn(
						"[h2]:text-h2 [h2]:text-[22px] [h2]:font-medium [h2]:leading-normal [h2]:tracking-normal",
						"[h4]:text-h4 [h4]:mt-14",
					),
				},
			}),
		],
	});
}
