import type { SVGAttributes } from "react";

export interface SvgProps extends SVGAttributes<HTMLOrSVGElement> {
	fill?: string;
	opac?: boolean;
	stroke?: string;
	margin?: string;
}
