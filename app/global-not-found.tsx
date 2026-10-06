import type { Metadata } from "next";
import { getExtracted as getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Footer } from "#/app/(app)/(default)/_components/footer.tsx";
import { Header } from "#/app/(app)/(default)/_components/header.tsx";
import { NotFoundContent } from "#/app/(app)/(default)/_components/not-found-content.tsx";
import { PageFrame } from "#/app/(app)/(default)/_components/page-frame.tsx";
import { SkipLink } from "#/app/(app)/(default)/_components/skip-link.tsx";
import { HtmlDocument } from "#/app/(app)/_components/html-document.tsx";
import { Providers } from "#/app/(app)/_components/providers.tsx";
import { getSiteMetadata } from "#/lib/data/site-metadata.ts";
import { defaultLocale } from "#/lib/i18n/locales.ts";

export { viewport } from "#/app/(app)/_lib/viewport.config.ts";

/** The title template of `app/(app)/layout.tsx` does not apply here, so the site title is appended by hand. */
export async function generateMetadata(): Promise<Metadata> {
	const [t, site] = await Promise.all([getTranslations(), getSiteMetadata()]);

	return {
		title: `${t("Page not found")} | ${site.title}`,
		description: site.description,
	};
}

/**
 * Rendered for urls which match no route at all. Next skips every layout for these, so this composes the document shell
 * of `app/(app)/layout.tsx` and the header and footer of `app/(app)/(default)/layout.tsx` itself.
 */
export default function GlobalNotFound(): ReactNode {
	return (
		<HtmlDocument locale={defaultLocale}>
			<body>
				<Providers>
					<PageFrame>
						<SkipLink />
						<Header />
						<NotFoundContent />
						<Footer />
					</PageFrame>
				</Providers>
			</body>
		</HtmlDocument>
	);
}
