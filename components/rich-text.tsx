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
				blockquote: {
					HTMLAttributes: {
						class: cn(
							"relative bg-(image:--block-quote-section-bg) flex flex-col p-5 my-5 gap-6 xl:py-4 xl:px-6 xl:my-13 [&>p]:z-2 [&>p]:mt-0!",
							"after:absolute after:content-[''] after:size-full after:max-w-56 after:max-h-38 after:z-1 after:bg-[url(/assets/images/quote-mark.svg)] after:top-1/2 after:left-1/2 after:-translate-1/2",
						),
					},
				},
				bulletList: {
					HTMLAttributes: {
						class: "[&>li]:ml-2 [&>li>p]:inline [&>li>p]:mt-0! list-disc list-inside",
					},
				},
			}),
			ExtendedHeading.configure({
				HTMLAttributes: {
					class: cn(
						"[h1]:text-h2",
						"[h2]:text-h2 [h2]:text-[22px] [h2]:font-medium [h2]:leading-normal [h2]:tracking-normal",
						"[h4]:text-h4 [h4]:mt-6",
						"[h3]:text-h3 [h3]:mt-4",
					),
				},
			}),
		],
	});
}
