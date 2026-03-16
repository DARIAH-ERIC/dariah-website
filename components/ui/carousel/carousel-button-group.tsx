import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";
import type { ButtonGroupProps } from "react-multi-carousel";

import { Button } from "@/components/ui/button/button";
import { ChevronForwardIcon } from "@/components/ui/icons/chevron-forward";
import { ChevronLeftIcon } from "@/components/ui/icons/chevron-left";

export function CarouselButtonGroup(props: Readonly<ButtonGroupProps>): ReactNode {
	const { next, previous, carouselState } = props;

	if (!carouselState) return null;

	const { totalItems, slidesToShow, currentSlide } = carouselState;

	const isLastElement = currentSlide + slidesToShow === totalItems;
	const isFirstElement = currentSlide === 0;

	return (
		<>
			<Button
				className={cn(
					"absolute left-0 -translate-x-[125%] -translate-y-1/2 z-1000 top-1/2 lg:-translate-x-1/2",
					isFirstElement && "hidden",
				)}
				onClick={previous}
				variant="carousel-button"
			>
				<ChevronLeftIcon />
			</Button>
			<Button
				className={cn(
					"absolute right-0 translate-x-[125%] z-1000 top-1/2 -translate-y-1/2 lg:translate-x-1/2",
					isLastElement && "hidden",
				)}
				onClick={next}
				variant="carousel-button"
			>
				<ChevronForwardIcon />
			</Button>
		</>
	);
}
