import type { ReactNode } from "react";

import type { SvgProps } from "@/components/ui/icons/types";

export function ChevronDownIcon(props: Readonly<SvgProps>): ReactNode {
	const { fill, stroke } = props;

	return (
		<svg
			fill="currentColor"
			height="24"
			viewBox="0 0 24 24"
			width="24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<mask
				height="24"
				id="mask_chevron_down"
				maskUnits="userSpaceOnUse"
				style={{ maskType: "alpha" }}
				width="24"
				x="0"
				y="0"
			>
				<rect fill="#D9D9D9" height="24" width="24" />
			</mask>
			<g mask="url(#mask_chevron_down)">
				<path d="M12 15.4L6 9.4L7.4 8L12 12.6L16.6 8L18 9.4L12 15.4Z" fill={fill} stroke={stroke} />
			</g>
		</svg>
	);
}
