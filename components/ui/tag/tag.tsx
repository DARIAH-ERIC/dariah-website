import { type GetVariantProps, styles } from "@acdh-oeaw/style-variants";
import React, { type ReactNode } from "react";

const tagStyles = styles({
	base: ["rounded-sm px-1 py-0.5 shadow-light text-h4 text-[12px] text-black uppercase"],
	variants: {
		variant: {
			past: "bg-gray-200",
			pending: "text-white bg-accent",
			upcoming: "bg-tag-upcoming-bg",
		},
	},
	defaults: {
		variant: "upcoming",
	},
});

type TagStyleProps = GetVariantProps<typeof tagStyles>;

interface TagProps extends TagStyleProps {
	text?: string;
}

export function Tag(props: Readonly<TagProps>): ReactNode {
	const { text, variant } = props;
	return <div className={tagStyles({ variant })}>{text}</div>;
}
