import { cn } from "@acdh-oeaw/style-variants";
import type { JSONContent } from "@tiptap/core";
import { Heading } from "@tiptap/extension-heading";
import { TableKit } from "@tiptap/extension-table/kit";
import { StarterKit } from "@tiptap/starter-kit";
import { renderToReactElement } from "@tiptap/static-renderer/pm/react";
import { useFormatter } from "next-intl";
import type { ReactNode } from "react";

import { ButtonLink, renderButtonLink } from "@/components/button-link";
import { PlaceholderValue, renderPlaceholderValue } from "@/components/placeholder-value";
import { linkStyles } from "@/components/ui/link/link.styles";

interface RichTextProps {
	content: JSONContent;
}

interface HeadingAttributes {
	level: number;
	id?: string;
}

/**
 * Lists take the same top margin as paragraphs, so one following a heading is not flush against it,
 * while a list nested in an item stays tight to the line introducing it. Markers hang outside the
 * content box, so wrapped lines line up with the text rather than with the marker.
 */
const listStyles = cn(
	"mt-4 pl-6 list-outside",
	"[&>li>p:first-child]:mt-0!",
	"[&>li>ol]:mt-0! [&>li>ul]:mt-0!",
);

interface TableCellNodeProps {
	node: { attrs: Record<string, unknown> };
	children?: ReactNode;
}

/**
 * The cell extensions spell their span attributes the HTML way, which React rejects, so render
 * cells here instead of letting the static renderer serialise them.
 */
function renderTableCell(element: "td" | "th", props: TableCellNodeProps): ReactNode {
	const Element = element;
	const { colspan, rowspan } = props.node.attrs;

	return (
		<Element
			className={cn(
				"border border-gray-300 p-3 align-top [&>p:first-child]:mt-0!",
				element === "th" && "bg-gray-100 text-left font-medium",
			)}
			colSpan={typeof colspan === "number" ? colspan : undefined}
			rowSpan={typeof rowspan === "number" ? rowspan : undefined}
		>
			{props.children}
		</Element>
	);
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

	const format = useFormatter();

	return renderToReactElement({
		content,
		extensions: [
			StarterKit.configure({
				// `ExtendedHeading` replaces the bundled heading extension, which shares its name.
				heading: false,
				paragraph: {
					HTMLAttributes: {
						class: "text-regular mt-4",
					},
				},
				link: {
					HTMLAttributes: {
						class: cn(
							// eslint-disable-next-line better-tailwindcss/no-unknown-classes
							linkStyles({ variant: "paragraph" }),
							"inline break-all [[href^='mailto:']]:whitespace-nowrap",
						),
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
						class: cn(listStyles, "list-disc"),
					},
				},
				orderedList: {
					HTMLAttributes: {
						class: cn(listStyles, "list-decimal"),
					},
				},
				horizontalRule: {
					HTMLAttributes: {
						class: "mt-4",
					},
				},
			}),
			ExtendedHeading.configure({
				HTMLAttributes: {
					class: cn(
						"[h1]:text-h2",
						"[h2]:text-h2 [h2]:text-[2rem] [h2]:font-medium [h2]:leading-normal [h2]:tracking-normal [h2]:mt-4",
						"[h3]:text-h3 [h3]:mt-4",
						"[h4]:text-h4 [h4]:mt-6",
						"[hr]:mt-2",
					),
				},
			}),
			PlaceholderValue,
			ButtonLink,
			/**
			 * Tables carry data rather than layout, so column widths are left to the stylesheet:
			 * `resizable: false` matches the backend, which therefore never writes `colwidth`.
			 */
			TableKit.configure({ table: { resizable: false } }),
		],
		options: {
			nodeMapping: {
				placeholderValue(nodeProps) {
					return renderPlaceholderValue(nodeProps, format);
				},
				/**
				 * Without a mapping the static renderer serialises the node via its `renderHTML` into a
				 * bare `<a data-button-link>`, indistinguishable from an ordinary link.
				 */
				buttonLink(nodeProps) {
					return renderButtonLink(nodeProps);
				},
				/**
				 * A table wider than the content column has to scroll on its own rather than widen the
				 * page, and the static renderer emits no wrapper to scroll. Overriding the node drops
				 * the `tbody` that the extension's own `renderHTML` provides, so reinstate it here.
				 */
				table(nodeProps) {
					return (
						<div className="overflow-x-auto my-4">
							<table className="w-full border-collapse">
								<tbody>{nodeProps.children}</tbody>
							</table>
						</div>
					);
				},

				tableHeader(nodeProps) {
					return renderTableCell("th", nodeProps);
				},

				tableCell(nodeProps) {
					return renderTableCell("td", nodeProps);
				},
			},
		},
	});
}
