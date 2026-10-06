import { getExtracted as getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { mainContentId } from "#/app/(app)/(default)/_components/main.tsx";

/**
 * First focusable element on every page, so keyboard users can bypass the header navigation. Visually hidden until it
 * receives focus.
 *
 * Once shown, it is overlaid exactly on the header's logo: the wrapper is a zero-height box spanning the page frame, as
 * the header does, and the offsets are the header's padding plus the logo link's margin (`px-4`/`py-3` and `m-4`), so
 * they must follow any change there. At 48px it is as tall as the logo and wider, so it hides it completely, and a
 * white ring fills the outline's offset so nothing shows through that gap either.
 *
 * A plain anchor rather than a `next/link`: jumping to a fragment on the current page needs no client-side navigation,
 * and the browser then moves the sequential focus starting point to the target.
 */
export async function SkipLink(): Promise<ReactNode> {
	const t = await getTranslations();

	return (
		<div className="relative">
			<a
				className="absolute start-8 top-7 z-50 bg-background-accent-strong px-6 py-2.5 font-heading text-body font-bold whitespace-nowrap text-text-inverse ring-2 ring-background-base not-focus:sr-only focus-visible-outline"
				href={`#${mainContentId}`}
			>
				{t("Skip to main content")}
			</a>
		</div>
	);
}
