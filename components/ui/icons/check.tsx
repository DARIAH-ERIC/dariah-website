import type { ReactNode } from "react";

import type { SvgProps } from "@/components/ui/icons/types";

export function CheckIcon(props: Readonly<SvgProps>): ReactNode {
	const { fill, stroke } = props;

	return (
		<svg
			fill="none"
			height="16"
			viewBox="0 0 16 16"
			width="16"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M6.29935 12.3L2.16602 8.16669L3.29935 7.03336L6.29935 10.0334L12.6827 3.65002L13.816 4.78336L6.29935 12.3Z"
				fill={fill}
				stroke={stroke}
			/>
		</svg>
	);
}
