import type { ReactNode } from "react";

import type { SvgProps } from "@/components/ui/icons/types";

export function SpotlightArticleIcon(props: Readonly<SvgProps>): ReactNode {
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
				id="mask_spotlight_article"
				maskUnits="userSpaceOnUse"
				style={{ maskType: "alpha" }}
				width="24"
				x="0"
				y="0"
			>
				<rect fill="#D9D9D9" height="24" width="24" />
			</mask>
			<g mask="url(#mask_spotlight_article)">
				<path
					d="M1.00195 13V11H7.00195V13H1.00195ZM7.75195 9.15L5.65195 7.05L7.05195 5.65L9.15195 7.75L7.75195 9.15ZM11.002 7V1H13.002V7H11.002ZM16.252 9.15L14.852 7.75L16.952 5.65L18.352 7.05L16.252 9.15ZM17.002 13V11H23.002V13H17.002ZM12.002 15C11.1686 15 10.4603 14.7083 9.87695 14.125C9.29362 13.5417 9.00195 12.8333 9.00195 12C9.00195 11.1667 9.29362 10.4583 9.87695 9.875C10.4603 9.29167 11.1686 9 12.002 9C12.8353 9 13.5436 9.29167 14.127 9.875C14.7103 10.4583 15.002 11.1667 15.002 12C15.002 12.8333 14.7103 13.5417 14.127 14.125C13.5436 14.7083 12.8353 15 12.002 15ZM16.952 18.35L14.852 16.25L16.252 14.85L18.352 16.95L16.952 18.35ZM7.05195 18.35L5.65195 16.95L7.75195 14.85L9.15195 16.25L7.05195 18.35ZM11.002 23V17H13.002V23H11.002Z"
					fill={fill}
					stroke={stroke}
				/>
			</g>
		</svg>
	);
}
