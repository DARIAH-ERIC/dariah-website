import { cn } from "@acdh-oeaw/style-variants";
import { Node, type JSONContent } from "@tiptap/core";
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
	footnoteScope?: string;
}

interface HeadingAttributes {
	level: number;
	id?: string;
}

/** An empty spacer paragraph - `{ "type": "paragraph" }`, or one holding only whitespace. */
function isBlankNode(node: JSONContent): boolean {
	if (node.type !== "paragraph") {
		return false;
	}

	return (node.content ?? []).every((child) => {
		return child.type === "text" && (child.text ?? "").trim() === "";
	});
}

/**
 * Drops blank paragraphs from the start and end of a document, as the backend does before rendering.
 * The WordPress import left spacer paragraphs throughout the content, and one sitting at the edge of
 * a block contributes an empty line box plus its top margin to the gap against the neighbouring
 * block. Interior blanks stay: they separate paragraphs that are visible either way, so dropping
 * them would edit the copy rather than the spacing between blocks.
 */
function withTrimmedBlankEdges(document: JSONContent): JSONContent {
	const nodes = document.content;

	if (nodes == null) {
		return document;
	}

	let start = 0;
	let end = nodes.length;

	while (start < end) {
		const node = nodes[start];
		if (node == null || !isBlankNode(node)) break;
		start += 1;
	}

	while (end > start) {
		const node = nodes[end - 1];
		if (node == null || !isBlankNode(node)) break;
		end -= 1;
	}

	return { ...document, content: nodes.slice(start, end) };
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

/**
 * The note is stored on the inline atom. `number` is derived by the page renderer and must be part
 * of the schema or Tiptap will discard it before the node mapping sees it.
 */
const Footnote = Node.create({
	name: "footnote",
	group: "inline",
	inline: true,
	atom: true,

	addAttributes() {
		return {
			content: { default: null },
			number: {
				default: null,
				parseHTML: () => null,
				renderHTML: () => ({}),
			},
		};
	},

	parseHTML() {
		return [{ tag: "sup[data-footnote]" }];
	},

	renderHTML() {
		// The empty child closes `sup`; HTML does not have self-closing superscript tags.
		return ["sup", { "data-footnote": "" }, ""];
	},
});

export function RichText(props: Readonly<RichTextProps>): ReactNode {
	const { content, footnoteScope = "rich-text" } = props;

	const format = useFormatter();

	return renderToReactElement({
		content: withTrimmedBlankEdges(content),
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
							"inline break-all [font-size:inherit]! leading-[inherit]! [[href^='mailto:']]:whitespace-nowrap",
						),
						target: null,
						rel: null,
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
						// Every level takes the same top margin, one step above the `mt-4` between
						// paragraphs, so a heading reads as belonging to the text below it.
						"mt-6",
						"[h1]:text-h2",
						"[h2]:text-h2 [h2]:text-[2rem] [h2]:font-medium [h2]:leading-normal [h2]:tracking-normal",
						"[h3]:text-h3",
						"[h4]:text-h4",
					),
				},
			}),
			PlaceholderValue,
			ButtonLink,
			Footnote,
			/**
			 * Tables carry data rather than layout, so column widths are left to the stylesheet:
			 * `resizable: false` matches the backend, which therefore never writes `colwidth`.
			 */
			TableKit.configure({ table: { resizable: false } }),
		],
		options: {
			markMapping: {
				link({ children, mark }) {
					const href = typeof mark.attrs?.href === "string" ? mark.attrs.href : undefined;

					return (
						<a
							className={cn(
								// eslint-disable-next-line better-tailwindcss/no-unknown-classes
								linkStyles({ variant: "paragraph" }),
								"inline break-all [font-size:inherit]! leading-[inherit]! [[href^='mailto:']]:whitespace-nowrap",
							)}
							href={href}
						>
							{children}
						</a>
					);
				},
			},
			nodeMapping: {
				footnote({ node }) {
					const number = node.attrs?.number;

					if (typeof number !== "number") return <sup data-footnote="" />;

					return (
						<a
							aria-label={`Footnote ${String(number)}`}
							className="font-medium text-primary underline"
							href={`#fn-${footnoteScope}-${String(number)}`}
							id={`fnref-${footnoteScope}-${String(number)}`}
							role="doc-noteref"
						>
							<sup data-footnote="">{number}</sup>
						</a>
					);
				},
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
