"use client";

import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";

import { Link } from "@/components/ui/link/link";
import { Typography } from "@/components/ui/typography/typography";

interface QuickLink {
	link: string;
	label: string;
}

interface QuickLinksProps {
	links?: Array<QuickLink>;
	className?: string;
}

export function QuickLinks(props: Readonly<QuickLinksProps>): ReactNode {
	const { links, className } = props;

	return (
		<div className={cn("flex-col gap-4 w-full h-fit lg:top-0 lg:sticky lg:w-51.5", className)}>
			<Typography className="text-[45px] font-light" variant="h4">
				{"Quick links"}
			</Typography>
			{links === undefined || links.length === 0 ? (
				<Typography variant="regular">{"No quick links available."}</Typography>
			) : (
				links.map((linkItem) => {
					const { link, label } = linkItem;
					return (
						<Link
							key={`${label}-${link}`}
							href={link}
							variant="primary"
							withDefaultRightIcon={true}
						>
							{label}
						</Link>
					);
				})
			)}
		</div>
	);
}
