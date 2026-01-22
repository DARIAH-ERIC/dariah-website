import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import React, { type ReactNode } from "react";

import { Image } from "@/components/image";
import { Link } from "@/components/ui/link/link";
import { Typography } from "@/components/ui/typography/typography";

interface PillarProps {
	title: string;
	description: string;
	image: string | StaticImport;
}

export function Pillar(props: Readonly<PillarProps>): ReactNode {
	const { title, description, image } = props;

	return (
		<div className="flex flex-col gap-10 cursor-default">
			<Image alt="Pilar Technology" height={305} src={image} width={384} />
			<div className="flex flex-col justify-between w-69.75 h-95 font-heading">
				<div className="flex flex-col gap-7">
					<Typography className="text-[28px]" variant="h3">
						{title}
					</Typography>
					<hr className="w-25" />
					<Typography className="text-[24px] tracking-(--letter-spacing-medium)" variant="regular">
						{description}
					</Typography>
				</div>
				<Link href={"/"} variant="primary" withRightIcon={true}>
					{"Read more"}
				</Link>
			</div>
		</div>
	);
}
