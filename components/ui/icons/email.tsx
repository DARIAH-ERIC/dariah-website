import type { ReactNode } from "react";

import type { SvgProps } from "@/components/ui/icons/types";

export function EmailIcon(props: Readonly<SvgProps>): ReactNode {
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
			<path
				d="M13.5416 15.8798H6.62488C4.54985 15.8798 3.1665 14.8423 3.1665 12.4214V7.57971C3.1665 5.15885 4.54985 4.12134 6.62488 4.12134H13.5416C15.6167 4.12134 17 5.15885 17 7.57971V12.4214C17 14.8423 15.6167 15.8798 13.5416 15.8798Z"
				fill={fill}
				stroke={stroke}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeMiterlimit="10"
				strokeWidth="1.2"
			/>
			<path
				d="M14.7658 7.07397L10.9291 10.0387C10.4309 10.4236 9.73558 10.4236 9.23737 10.0387L5.40063 7.07397"
				fill={fill}
				stroke={stroke}
				strokeLinecap="round"
				strokeWidth="1.2"
			/>
		</svg>
	);
}
