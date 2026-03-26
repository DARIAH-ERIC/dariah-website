import type { ReactNode } from "react";

import type { SvgProps } from "@/components/ui/icons/types";

export function MapPinIcon(props: Readonly<SvgProps>): ReactNode {
	const { fill, stroke } = props;

	return (
		<svg
			fill="currentColor"
			height="51"
			viewBox="0 0 39 51"
			width="39"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M19.5 1C29.735 1 38 9.13372 38 19.125C38 23.0552 36.6875 26.6655 34.4951 29.6309L34.4561 29.6836L34.4238 29.7412C34.3803 29.8199 34.3521 29.8908 34.334 29.9404C34.3298 29.952 34.3257 29.9627 34.3223 29.9727L21.377 49.0186C20.9634 49.627 20.26 50 19.5 50C18.74 50 18.0366 49.627 17.623 49.0186L4.67676 29.9727C4.67313 29.9621 4.66962 29.9499 4.66504 29.9375C4.64692 29.8883 4.61897 29.8186 4.57617 29.7412L4.54395 29.6836L4.50488 29.6309C2.31246 26.6655 1 23.0552 1 19.125C1 9.13372 9.26501 1 19.5 1ZM19.5 11.75C15.3765 11.75 12 15.0339 12 19.125C12 23.2161 15.3765 26.5 19.5 26.5C23.6235 26.5 27 23.2161 27 19.125C27 15.0339 23.6235 11.75 19.5 11.75Z"
				fill={fill}
				stroke={stroke}
				strokeWidth="2"
			/>
		</svg>
	);
}
