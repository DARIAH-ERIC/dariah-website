import type { ReactNode } from "react";

import type { SvgProps } from "@/components/ui/icons/types";

export function RemoveIcon(props: Readonly<SvgProps>): ReactNode {
	const { fill, stroke } = props;

	return (
		<svg
			fill="currentColor"
			height="3"
			viewBox="0 0 19 3"
			width="19"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M1.33333 2.66667C0.955556 2.66667 0.638889 2.53889 0.383333 2.28333C0.127778 2.02778 0 1.71111 0 1.33333C0 0.955555 0.127778 0.638889 0.383333 0.383333C0.638889 0.127778 0.955556 0 1.33333 0H17.3333C17.7111 0 18.0278 0.127778 18.2833 0.383333C18.5389 0.638889 18.6667 0.955555 18.6667 1.33333C18.6667 1.71111 18.5389 2.02778 18.2833 2.28333C18.0278 2.53889 17.7111 2.66667 17.3333 2.66667H1.33333Z"
				fill={fill}
				stroke={stroke}
			/>
		</svg>
	);
}
