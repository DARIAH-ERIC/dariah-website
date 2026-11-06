import type { ReactNode } from "react";

import logo from "#/assets/images/logo-dariah-eu-white.svg";
import { Image } from "#/components/image.tsx";

/**
 * What a card shows for want of an image: the white DARIAH logo on grey, filling the card's image box, as wide relative
 * to the box's height as on a person's square portrait, so it is not blown up to the card's width.
 */
export function CardImagePlaceholder(): ReactNode {
	return (
		<div className="grid place-items-center bg-background-placeholder block-full inline-full">
			<Image alt="" className="block-auto inline-[57%]" src={logo} />
		</div>
	);
}
