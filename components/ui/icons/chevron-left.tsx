import type { ReactNode } from "react";

import type { SvgProps } from "@/components/ui/icons/types";

export function ChevronLeftIcon(props: Readonly<SvgProps>): ReactNode {
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
				id="mask_chevron_left"
				maskUnits="userSpaceOnUse"
				style={{ maskType: "alpha" }}
				width="24"
				x="0"
				y="0"
			>
				<rect fill="#D9D9D9" height="24" width="24" />
			</mask>
			<g mask="url(#mask_chevron_left)">
				<path d="M14 18L8 12L14 6L15.4 7.4L10.8 12L15.4 16.6L14 18Z" fill={fill} stroke={stroke} />
			</g>
		</svg>
	);
}
