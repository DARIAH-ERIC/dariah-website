import type { ReactNode } from "react";

import type { SvgProps } from "@/components/ui/icons/types";

export function DashedArrowIcon(props: Readonly<SvgProps>): ReactNode {
	const { fill, stroke } = props;

	return (
		<svg
			fill="currentColor"
			height="15"
			viewBox="0 0 31 15"
			width="31"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M0 7.2168L12.5 14.4337L12.5 -8.09928e-05L0 7.2168ZM7.75 7.2168L7.75 8.4668L12.9167 8.4668L12.9167 7.2168L12.9167 5.9668L7.75 5.9668L7.75 7.2168ZM18.0833 7.2168L18.0833 8.4668L23.25 8.4668L23.25 7.2168L23.25 5.9668L18.0833 5.9668L18.0833 7.2168ZM28.4167 7.2168L28.4167 8.4668L31 8.4668L31 7.2168L31 5.9668L28.4167 5.9668L28.4167 7.2168Z"
				fill={fill}
				stroke={stroke}
			/>
		</svg>
	);
}
