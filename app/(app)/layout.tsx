import type { Metadata } from "next";
import { useLocale } from "next-intl";
import type { ReactNode } from "react";

import { HistoryScrollAnchoringFix } from "#/app/(app)/_components/history-scroll-anchoring-fix.tsx";
import { HtmlDocument } from "#/app/(app)/_components/html-document.tsx";
import { MatomoAnalytics } from "#/app/(app)/_components/matomo-analytics.tsx";
import { Providers } from "#/app/(app)/_components/providers.tsx";
import { ReloadOnBfcacheRestore } from "#/app/(app)/_components/reload-on-bfcache-restore.tsx";
import { env } from "#/configs/env.config.ts";
import { getSiteMetadata } from "#/lib/data/site-metadata.ts";
import { createAlternates, createOpenGraph } from "#/lib/metadata.ts";

export { viewport } from "#/app/(app)/_lib/viewport.config.ts";

export async function generateMetadata(): Promise<Metadata> {
	const [alternates, site, openGraph] = await Promise.all([createAlternates(), getSiteMetadata(), createOpenGraph()]);

	return {
		metadataBase: new URL(env.NEXT_PUBLIC_APP_BASE_URL),
		title: { default: site.title, template: `%s | ${site.title}` },
		description: site.description,
		/** No `title`, `description` or `url`, so each page's own fill them in. */
		openGraph,
		/** Title, description and image are carried over from `openGraph`. */
		twitter: { card: "summary_large_image" },
		alternates,
		verification:
			env.NEXT_PUBLIC_APP_GOOGLE_SITE_VERIFICATION != null
				? { google: env.NEXT_PUBLIC_APP_GOOGLE_SITE_VERIFICATION }
				: undefined,
	};
}

interface AppLayoutProps extends LayoutProps<"/"> {}

export default function AppLayout(props: Readonly<AppLayoutProps>): ReactNode {
	const { children } = props;

	const locale = useLocale();

	return (
		<HtmlDocument locale={locale}>
			<body>
				<Providers>{children}</Providers>
				<HistoryScrollAnchoringFix />
				<ReloadOnBfcacheRestore />
				{env.NEXT_PUBLIC_APP_MATOMO_ID != null ? (
					<MatomoAnalytics baseUrl={env.NEXT_PUBLIC_APP_MATOMO_BASE_URL} id={env.NEXT_PUBLIC_APP_MATOMO_ID} />
				) : null}
			</body>
		</HtmlDocument>
	);
}
