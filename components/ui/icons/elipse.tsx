import type { ReactNode } from "react";

import type { SvgProps } from "@/components/ui/icons/types";

export function ElipseIcon(props: Readonly<SvgProps>): ReactNode {
	const { fill, stroke } = props;

	return (
		<svg
			fill="none"
			height="12"
			viewBox="0 0 12 12"
			width="12"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<circle cx="6" cy="6" fill={fill} r="6" stroke={stroke} />
		</svg>
	);
}
