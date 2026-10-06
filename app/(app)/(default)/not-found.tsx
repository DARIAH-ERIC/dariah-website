import { getExtracted as getTranslations } from "next-intl/server";
import { Fragment, type ReactNode } from "react";

import { NotFoundContent } from "#/app/(app)/(default)/_components/not-found-content.tsx";
import { getSiteMetadata } from "#/lib/data/site-metadata.ts";

/**
 * Rendered for `notFound()` calls in pages, inside the default layout. `not-found.tsx` supports no metadata exports,
 * and the title template of `app/(app)/layout.tsx` does not apply to a `<title>` element, so the site title is appended
 * by hand.
 *
 * Ideally `app/global-not-found.tsx` would handle these as well, but next only dispatches to it when no route matches
 * at all - a matched route calling `notFound()` falls back to the built-in 404 instead. Once that is fixed, this file
 * and `NotFoundContent` can likely be folded back into `app/global-not-found.tsx`.
 *
 * @see {@link https://github.com/vercel/next.js/issues/86095}
 * @see {@link https://github.com/vercel/next.js/issues/85446}
 */
export default async function NotFound(): Promise<ReactNode> {
	const [t, site] = await Promise.all([getTranslations(), getSiteMetadata()]);

	return (
		<Fragment>
			<title>{`${t("Page not found")} | ${site.title}`}</title>
			<NotFoundContent />
		</Fragment>
	);
}
