import type { ReactNode } from "react";

import { GalleryItem, type GalleryItemProps } from "@/components/ui/gallery/gallery-item";

interface GalleryGridProps {
	items: Array<GalleryItemProps>;
}

export function GalleryGrid(props: Readonly<GalleryGridProps>): ReactNode {
	const { items } = props;

	return (
		<ul
			className="grid grid-cols-[repeat(auto-fill,minmax(min(22.5rem,100%),1fr))] items-start gap-6"
			role="list"
		>
			{items.map((item, index) => {
				return (
					<li key={index}>
						<GalleryItem alt={item.alt} caption={item.caption} url={item.url} />
					</li>
				);
			})}
		</ul>
	);
}
