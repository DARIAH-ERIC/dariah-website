import type { ReactNode } from "react";

import { ApiImage } from "#/components/api-image.tsx";
import { SkeletonShape, SkeletonText } from "#/components/ui/skeleton.tsx";
import type { Image } from "#/lib/api/schemas.ts";

interface EntityIntroProps {
	/** E.g. a member's national consortium's, or a working group's own. */
	logo?: Image | null;
	/** E.g. a member's national consortium and institutions, as lines of text. */
	children?: ReactNode;
}

/**
 * An organisation's details and logo, first in its content column (see `ContentLayout`'s `intro`): the details to the
 * start side, the logo to the end side, centred on them and ending where the content does. On a phone the logo moves
 * above the details instead, though it follows them in the source, so a screen reader meets the details first.
 *
 * The logo is decorative: the title or the details name what it shows. It is laid out by its height, with a cap on its
 * width for a wide wordmark, so a square logo - most working groups' - is as large as the details allow, and its
 * built-in lettering stays legible. On a phone it is smaller, so a wordmark does not outweigh the title.
 *
 * Nothing renders with neither a logo nor details.
 */
export function EntityIntro(props: Readonly<EntityIntroProps>): ReactNode {
	const { logo, children } = props;

	const hasDetails = children != null && children !== false;

	if (logo == null && !hasDetails) {
		return null;
	}

	return (
		<div className="flex flex-col-reverse items-start gap-y-6 sm:flex-row sm:items-center sm:justify-between sm:gap-x-10">
			{hasDetails ? <div className="flex flex-col gap-y-2 min-inline-0">{children}</div> : null}
			{logo != null ? (
				<ApiImage
					alt=""
					className="shrink-0 object-contain object-left block-16 inline-auto max-inline-48 sm:object-right sm:block-28 sm:max-inline-56"
					image={logo}
					sizes="(min-width: 40rem) 14rem, 12rem"
				/>
			) : null}
		</div>
	);
}

/**
 * The same layout as `EntityIntro` while the page loads, for the content placeholder of its header's skeleton (see
 * `PageHeaderSkeleton`): the details beside the logo's box, then a few lines of the content. No related content:
 * whether there is any is not known until the page is.
 */
export function EntityIntroSkeleton(): ReactNode {
	return (
		<div className="pbe-24 max-inline-measure">
			<div className="flex flex-col-reverse items-start gap-y-6 sm:flex-row sm:items-center sm:justify-between sm:gap-x-10">
				<div className="flex flex-col gap-y-2 inline-full sm:max-inline-md">
					<SkeletonText className="text-title-4 inline-3/4" />
					<SkeletonText lines={2} />
				</div>
				<SkeletonShape className="shrink-0 block-16 inline-16 sm:block-28 sm:inline-28" />
			</div>
			<SkeletonText className="mbs-12" lines={4} />
		</div>
	);
}
