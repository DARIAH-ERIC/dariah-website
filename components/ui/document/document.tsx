import { cn } from "@acdh-oeaw/style-variants";
import React, { type ReactNode } from "react";

import { ChevronForwardIcon } from "@/components/ui/icons/chevron-forward";
import { NavLink } from "@/components/ui/link/nav-link";
import { Typography } from "@/components/ui/typography/typography";

interface DocumentProps {
	title: string;
	documentUrl: string;
}

export function Document(props: Readonly<DocumentProps>): ReactNode {
	const { title, documentUrl } = props;
	return (
		<NavLink
			className={cn(
				"px-4 py-3 flex items-center justify-between bg-transparent border-2 border-transparent text-black w-265",
				"hover:bg-gray-100 hover:border-gray-100 hover:text-primary hover:shadow-light",
				"focus-visible:bg-white focus-visible:outline-none focus-visible:border-accent focus-visible:text-primary focus-visible:shadow-light",
			)}
			href={documentUrl}
		>
			<Typography variant="h4">{title}</Typography>
			<Typography className="flex gap-2 items-center" variant="h4">
				{"View PDF"} <ChevronForwardIcon className="size-5" />
			</Typography>
		</NavLink>
	);
}
