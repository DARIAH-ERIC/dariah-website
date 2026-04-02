"use client";

import { cn } from "@acdh-oeaw/style-variants";
import { type ReactNode, useState } from "react";

import { Button } from "@/components/ui/button/button";
import { ChevronUpIcon } from "@/components/ui/icons/chevron-up";

export function BackToTop(): ReactNode {
	const [isButtonVisible, setIsButtonVisible] = useState(false);
	const handleScrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleScroll = () => {
		if (window.pageYOffset > 300) {
			setIsButtonVisible(true);
		} else {
			setIsButtonVisible(false);
		}
	};

	if (typeof window !== "undefined") window.addEventListener("scroll", handleScroll);

	return (
		<Button
			className={cn(
				"fixed! right-8 bottom-8 border-2 border-primary z-100 md:hidden [&_svg]:fill-primary",
				!isButtonVisible && "hidden",
			)}
			onClick={handleScrollToTop}
			variant="icon-button"
		>
			<ChevronUpIcon className="size-6" />
		</Button>
	);
}
