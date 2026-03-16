"use client";

import { cn } from "@acdh-oeaw/style-variants";
import { type ReactNode, useState } from "react";

import { Image } from "@/components/image";
import { Carousel } from "@/components/ui/carousel/carousel";

interface ImageItemProps {
	id: string;
	url: string;
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
					<Image
						alt={"Selected image"}
						className="h-55.5 w-full md:h-61.5 xl:w-290.5 xl:h-154.5"
						height={618}
						src={selectedImage.url}
						width={1162}
					/>
				)}
				<Carousel className="w-55 h-15.75 md:w-120 md:h-31.5 xl:w-290.5 xl:h-61.25">
					{images.map((image) => {
						const { id, url } = image;
						const isSelected = id === selectedImage?.id;

						return (
							<Image
								key={id}
								alt={`image_${id}`}
								className={cn(
									"w-25.5 h-15.75 mx-2",
									"md:w-55 md:h-31.5 md:mx-3",
									"xl:w-89.75 xl:h-61.25",
									isSelected && "border-4 border-white z-10",
								)}
								height={245}
								onClick={() => {
									setSelectedImage(image);
								}}
								src={url}
								width={359}
							/>
						);
					})}
				</Carousel>
			</div>
		</div>
	);
}
