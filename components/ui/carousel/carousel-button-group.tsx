import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";
import type { ButtonGroupProps } from "react-multi-carousel";

import { Button } from "@/components/ui/button/button";
import { ChevronForwardIcon } from "@/components/ui/icons/chevron-forward";
import { ChevronLeftIcon } from "@/components/ui/icons/chevron-left";

/**
 * `outside` places the buttons next to the carousel, `inside` overlays them on top of it, which
 * avoids horizontal overflow when the carousel spans the full width of its container.
 */
export type CarouselButtonPlacement = "inside" | "outside";

interface CarouselButtonGroupProps extends ButtonGroupProps {
	placement?: CarouselButtonPlacement;
}

const placementStyles = {
	outside: {
		previous: "left-0 translate-x-[-125%] lg:-translate-x-1/2",
		next: "right-0 translate-x-[125%] lg:translate-x-1/2",
	},
	inside: {
		previous: "left-0 translate-x-1/4",
		next: "right-0 -translate-x-1/4",
	},
} satisfies Record<CarouselButtonPlacement, { next: string; previous: string }>;

export function CarouselButtonGroup(props: Readonly<CarouselButtonGroupProps>): ReactNode {
	const { next, placement = "outside", previous, carouselState } = props;

	if (!carouselState) return null;

	const { totalItems, slidesToShow, currentSlide } = carouselState;

	const isLastElement = currentSlide + slidesToShow >= totalItems;
	const isFirstElement = currentSlide === 0;

	const styles = placementStyles[placement];

	return (
		<>
			<Button
				aria-label="previous"
				className={cn(
					"absolute -translate-y-1/2 z-1000 top-1/2",
					styles.previous,
					isFirstElement && "hidden",
				)}
				onClick={previous}
				variant="carousel-button"
			>
				<ChevronLeftIcon />
			</Button>
			<Button
				aria-label="next"
				className={cn(
					"absolute z-1000 top-1/2 -translate-y-1/2",
					styles.next,
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
