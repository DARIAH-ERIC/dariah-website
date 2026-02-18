import type { ReactNode } from "react";

import type { SvgProps } from "@/components/ui/icons/types";

export function MenuIcon(props: Readonly<SvgProps>): ReactNode {
	const { fill } = props;

	return (
		<svg
			fill="currentColor"
			height="41"
			viewBox="0 0 44 41"
			width="44"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				clipRule="evenodd"
				d="M32 29H12V26H32V29ZM32 22H12V19H32V22ZM32 15H12V12H32V15Z"
				fill={fill}
				fillRule="evenodd"
			/>
		</svg>
	);
}
