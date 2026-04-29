"use client";

import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button/button";
import { useActiveHeading } from "@/utils/hooks/use-active-heading";
import { useMediaQuery } from "@/utils/hooks/use-media-query";

interface SectionPanelProps {
	sections: Array<string>;
}

export function SectionPanel(props: Readonly<SectionPanelProps>): ReactNode {
	const { sections } = props;
	const isLg = useMediaQuery("lg");

	const activeId = useActiveHeading(sections);

	const handleScrollToSection = (section: string) => {
		const element = document.getElementById(section);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	if (sections.length === 0) return;

	return (
		<div className="flex flex-col gap-4 border-l border-l-gray-500 h-fit lg:sticky lg:top-4">
			{sections.map((section) => {
				const isActive = section === activeId;
				return (
					<Button
						key={section}
						className={cn(
							"*:justify-start! *:text-left",
							isActive && "lg:-ml-0.5 lg:pl-3.75 lg:border-l-4",
						)}
						data-active={isLg ? isActive || undefined : undefined}
						onClick={() => {
							handleScrollToSection(section);
						}}
						variant="select-button"
					>
						{section}
					</Button>
				);
			})}
		</div>
	);
}
