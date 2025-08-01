import type { ReactNode } from "react";

import { Image } from "@/components/image";

interface LogoProps {
	className?: string;
}

export function Logo(props: Readonly<LogoProps>): ReactNode {
	const { className } = props;

	return (
		<Image
			alt=""
			className={className}
			height={60}
			priority={true}
			src="/assets/images/dariah-eu-logo.png"
			width={163}
		/>
	);
}
