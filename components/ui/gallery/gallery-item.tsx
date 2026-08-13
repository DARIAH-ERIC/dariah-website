import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";

import { ContentImage } from "@/components/image";

export interface GalleryItemProps {
	alt: string | null;
	caption?: ReactNode;
	className?: string;
	url: string;
}

export function GalleryItem(props: Readonly<GalleryItemProps>): ReactNode {
	const { alt, caption, className, url } = props;

	return (
		<figure className={cn("flex flex-col gap-y-2", className)}>
			<ContentImage
				alt={alt ?? ""}
				className="ms-auto me-auto inline-auto max-block-96 max-inline-full"
				height={900}
				src={url}
				width={1350}
			/>
			{caption != null && <figcaption className="text-small text-gray-900">{caption}</figcaption>}
		</figure>
	);
}
