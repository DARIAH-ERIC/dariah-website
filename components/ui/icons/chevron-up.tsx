import type { ReactNode } from "react";

import type { SvgProps } from "@/components/ui/icons/types";

export function ChevronUpIcon(props: Readonly<SvgProps>): ReactNode {
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
				id="mask_chevron_up"
				maskUnits="userSpaceOnUse"
				style={{ maskType: "alpha" }}
				width="24"
				x="0"
				y="0"
			>
				<rect fill="#D9D9D9" height="24" width="24" />
			</mask>
			<g mask="url(#mask_chevron_up)">
				<path
					d="M12 10.8L7.4 15.4L6 14L12 8L18 14L16.6 15.4L12 10.8Z"
					fill={fill}
					stroke={stroke}
				/>
			</g>
		</svg>
	);
}
