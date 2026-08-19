"use client";

import { cn } from "@acdh-oeaw/style-variants";
import { type ReactNode, useState } from "react";

import { ApiImage } from "@/components/image";
import { Carousel } from "@/components/ui/carousel/carousel";
import type { ImageAsset } from "@/lib/images/variants";

interface ImageItemProps extends ImageAsset {
	id: string;
}

interface CarouselSectionProps {
	images: Array<ImageItemProps>;
}

export function CarouselSection(props: Readonly<CarouselSectionProps>): ReactNode {
	const { images } = props;
	const [selectedImage, setSelectedImage] = useState<ImageItemProps | null>(images[0] ?? null);

	return (
		<div className="h-107.25 px-4 w-full bg-(image:--static-pages-carousel-bg) flex items-center justify-center md:h-150 xl:h-267.75">
			<div className="flex flex-col gap-12 justify-center items-center">
				{selectedImage && (
					<ApiImage
						className="h-55.5 w-full md:h-61.5 xl:w-290.5 xl:h-154.5"
						height={618}
						image={selectedImage}
						sizes="(min-width: 80rem) 1162px, 100vw"
						width={1162}
					/>
				)}
				<Carousel className="w-55 h-15.75 justify-center md:w-120 md:h-31.5 xl:w-290.5 xl:h-61.25">
					{images.map((image) => {
						const { id } = image;
						const isSelected = id === selectedImage?.id;

						return (
							<ApiImage
								key={id}
								className={cn(
									"w-25.5 h-15.75 mx-2",
									"md:w-55 md:h-31.5 md:mx-3",
									"xl:w-89.75 xl:h-61.25",
									isSelected && "border-4 border-white z-10",
								)}
								height={245}
								image={image}
								onClick={() => {
									setSelectedImage(image);
								}}
								sizes="(min-width: 80rem) 359px, (min-width: 48rem) 220px, 102px"
								width={359}
							/>
						);
					})}
				</Carousel>
			</div>
		</div>
	);
}
