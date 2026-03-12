"use client";

import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button/button";

interface SectionPanelProps {
	sections: Array<string>;
	activeSection: string;
}

export function SectionPanel(props: Readonly<SectionPanelProps>): ReactNode {
	const { sections, activeSection } = props;

	const handleScrollToSection = (section: string) => {
		console.log(section);
	};

	if (sections.length === 0) return;

	return (
		<div className="flex flex-col gap-4 border-l border-l-gray-500">
			{sections.map((section) => {
				const isActive = section === activeSection;
				return (
					<Button
						key={section}
						className={cn("*:justify-start!", isActive && "border-l-4 -ml-0.5 pl-3.75")}
						data-active={isActive || undefined}
						onClick={() => {
							handleScrollToSection(section);
						}}
						variant="select-button"
					>
						{section.replaceAll("_", " ")}
					</Button>
				);
			})}
		</div>
	);
}
