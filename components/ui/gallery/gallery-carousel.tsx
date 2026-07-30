"use client";

import type { ReactNode } from "react";
import type { ResponsiveType } from "react-multi-carousel";

import { Carousel } from "@/components/ui/carousel/carousel";
import { GalleryItem, type GalleryItemProps } from "@/components/ui/gallery/gallery-item";

interface GalleryCarouselProps {
	items: Array<GalleryItemProps>;
}

const BREAKPOINTS = {
	mobile: {
		breakpoint: { max: 1280, min: 0 },
		items: 1,
		slidesToSlide: 1,
	},
	desktop: {
		breakpoint: { min: 1280, max: 7680 },
		items: 1,
		slidesToSlide: 1,
	},
} satisfies ResponsiveType;

export function GalleryCarousel(props: Readonly<GalleryCarouselProps>): ReactNode {
	const { items } = props;

	return (
		<Carousel
			breakpoints={BREAKPOINTS}
			buttonPlacement="inside"
			className="w-full"
			containerClassName="w-full"
		>
			{items.map((item, index) => {
				return <GalleryItem key={index} alt={item.alt} caption={item.caption} url={item.url} />;
			})}
		</Carousel>
	);
}
