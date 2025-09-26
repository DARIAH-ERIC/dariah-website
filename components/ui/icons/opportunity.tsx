import type { ReactNode } from "react";

import type { SvgProps } from "@/components/ui/icons/types";

export function OpportunityIcon(props: Readonly<SvgProps>): ReactNode {
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
				id="mask_opportunity"
				maskUnits="userSpaceOnUse"
				style={{ maskType: "alpha" }}
				width="24"
				x="0"
				y="0"
			>
				<rect fill="#D9D9D9" height="24" width="24" />
			</mask>
			<g mask="url(#mask_opportunity)">
				<path
					d="M7 6V4C7 3.45 7.19583 2.97917 7.5875 2.5875C7.97917 2.19583 8.45 2 9 2H15C15.55 2 16.0208 2.19583 16.4125 2.5875C16.8042 2.97917 17 3.45 17 4V6H20C20.55 6 21.0208 6.19583 21.4125 6.5875C21.8042 6.97917 22 7.45 22 8V19C22 19.55 21.8042 20.0208 21.4125 20.4125C21.0208 20.8042 20.55 21 20 21H4C3.45 21 2.97917 20.8042 2.5875 20.4125C2.19583 20.0208 2 19.55 2 19V8C2 7.45 2.19583 6.97917 2.5875 6.5875C2.97917 6.19583 3.45 6 4 6H7ZM9 6H15V4H9V6ZM4 17H20V14H4V17Z"
					fill={fill}
					stroke={stroke}
				/>
			</g>
		</svg>
	);
}
