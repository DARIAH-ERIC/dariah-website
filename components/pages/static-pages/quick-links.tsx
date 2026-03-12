"use client";

import type { ReactNode } from "react";

import { Link } from "@/components/ui/link/link";
import { Typography } from "@/components/ui/typography/typography";

interface QuickLink {
	link: string;
	label: string;
}

interface QuickLinksProps {
	links: Array<QuickLink>;
}

export function QuickLinks(props: Readonly<QuickLinksProps>): ReactNode {
	const { links } = props;

	if (links.length === 0) return null;

	return (
		<div className="flex flex-col gap-4">
			<Typography className="text-[45px] font-light" variant="h4">
				{"Quick links"}
			</Typography>
			{links.map((linkItem) => {
				const { link, label } = linkItem;
				return (
					<Link key={`${label}-${link}`} href={link} variant="primary" withDefaultRightIcon={true}>
						{label}
					</Link>
				);
			})}
		</div>
	);
}
