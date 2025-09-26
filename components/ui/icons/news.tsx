import type { ReactNode } from "react";

import type { SvgProps } from "@/components/ui/icons/types";

export function NewsIcon(props: Readonly<SvgProps>): ReactNode {
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
				id="mask_news"
				maskUnits="userSpaceOnUse"
				style={{ maskType: "alpha" }}
				width="24"
				x="0"
				y="0"
			>
				<rect fill="#D9D9D9" height="24" width="24" />
			</mask>
			<g mask="url(#mask_news)">
				<path
					d="M4 21C3.45 21 2.97917 20.8042 2.5875 20.4125C2.19583 20.0208 2 19.55 2 19V5C2 4.45 2.19583 3.97917 2.5875 3.5875C2.97917 3.19583 3.45 3 4 3H20C20.55 3 21.0208 3.19583 21.4125 3.5875C21.8042 3.97917 22 4.45 22 5V19C22 19.55 21.8042 20.0208 21.4125 20.4125C21.0208 20.8042 20.55 21 20 21H4ZM4 19H20V5H4V19ZM6 17H18V15H6V17ZM6 13H10V7H6V13ZM12 13H18V11H12V13ZM12 9H18V7H12V9Z"
					fill={fill}
					stroke={stroke}
				/>
			</g>
		</svg>
	);
}
