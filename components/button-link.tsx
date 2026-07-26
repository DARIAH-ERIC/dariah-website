import { Node } from "@tiptap/core";
import type { ReactNode } from "react";

import { Link, type LinkProps } from "@/components/ui/link/link";

type ButtonLinkVariant = "primary" | "secondary" | "outline";

interface ButtonLinkNodeProps {
	node: { attrs: Record<string, unknown> };
}

/**
 * The backend offers editors three intents, while our design system has four button styles whose
 * names do not line up with them, so map by visual emphasis instead of by name.
 */
const linkVariants = {
	primary: "button-secondary-blue",
	secondary: "button-secondary-black",
	outline: "button-primary",
} satisfies Record<ButtonLinkVariant, LinkProps["variant"]>;

function normalizeVariant(value: unknown): ButtonLinkVariant {
	if (value === "secondary" || value === "outline") {
		return value;
	}

	return "primary";
}

export const ButtonLink = Node.create({
	name: "buttonLink",
	group: "inline",
	inline: true,
	atom: true,

	addAttributes() {
		return {
			href: { default: null },
			label: { default: null },
			variant: { default: "primary" },
		};
	},

	parseHTML() {
		return [{ tag: "a[data-button-link]" }];
	},

	renderHTML({ HTMLAttributes }) {
		return ["a", HTMLAttributes];
	},
});

export function renderButtonLink(props: ButtonLinkNodeProps): ReactNode {
	const { href, label, variant } = props.node.attrs;

	/**
	 * The node is inserted empty and filled in afterwards, so an unfinished button can reach us.
	 * Neither a button without a target nor one without a label is worth rendering.
	 */
	if (typeof href !== "string" || href === "") return null;
	if (typeof label !== "string" || label === "") return null;

	return (
		// The button styles are `display: flex`, so keep the node inline within its paragraph.
		<span className="inline-block align-middle">
			<Link href={href} variant={linkVariants[normalizeVariant(variant)]}>
				{label}
			</Link>
		</span>
	);
}
