import type { ReactNode } from "react";
import { useMap } from "react-leaflet";

import { Button } from "@/components/ui/button/button";
import { AddIcon } from "@/components/ui/icons/add";
import { RemoveIcon } from "@/components/ui/icons/remove";

export function ZoomButtons(): ReactNode {
	const map = useMap();
	return (
		<div className="z-800 absolute top-30 right-6 flex flex-col gap-4 lg:top-6 lg:right-20">
			<Button
				className="size-12 shadow-light [&_svg]:fill-primary"
				onClick={() => {
					return map.zoomIn();
				}}
				variant="icon-button"
			>
				<AddIcon className="size-8" />
			</Button>
			<Button
				className="size-12 shadow-light [&_svg]:fill-primary"
				onClick={() => {
					return map.zoomOut();
				}}
				variant="icon-button"
			>
				<RemoveIcon />
			</Button>
		</div>
	);
}
