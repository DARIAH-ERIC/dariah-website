import type { ReactNode } from "react";

import type { SvgProps } from "@/components/ui/icons/types";

export function LineIcon(props: Readonly<SvgProps>): ReactNode {
	const { fill, stroke } = props;

	return (
		<svg
			fill="none"
			height="2036"
			viewBox="0 0 1 2036"
			width="1"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<line
				fill={fill}
				stroke={stroke}
				strokeDasharray="8 8"
				x1="0.5"
				x2="0.499911"
				y1="2.18557e-08"
				y2="2036"
			/>
		</svg>
	);
}
