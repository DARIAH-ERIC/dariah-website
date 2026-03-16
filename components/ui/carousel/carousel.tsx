import "react-multi-carousel/lib/styles.css";

import type { ReactNode } from "react";
import ReactMultiCarousel, { type ResponsiveType } from "react-multi-carousel";

import { CarouselButtonGroup } from "@/components/ui/carousel/carousel-button-group";

interface CarouselProps {
	children: ReactNode;
	className?: string;
	breakpoints?: ResponsiveType;
}

const DEFAULT_BREAKPOINTS = {
	mobile: {
		breakpoint: { max: 1280, min: 0 },
		items: 2,
		slidesToSlide: 1,
	},
	desktop: {
		breakpoint: { min: 1280, max: 7680 },
		items: 3,
		slidesToSlide: 1,
	},
};

export function Carousel(props: Readonly<CarouselProps>): ReactNode {
	const { children, breakpoints, className, ...rest } = props;

	return (
		<div className="relative size-fit">
			<ReactMultiCarousel
				arrows={false}
				className={className}
				customButtonGroup={<CarouselButtonGroup />}
				draggable={true}
				keyBoardControl={true}
				partialVisible={false}
				renderButtonGroupOutside={true}
				responsive={breakpoints ?? DEFAULT_BREAKPOINTS}
				{...rest}
			>
				{children}
			</ReactMultiCarousel>
		</div>
	);
}
