import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { DocumentBody } from "@/app/_components/document-body";
import { HtmlDocument } from "@/app/_components/html-document";
import { Providers } from "@/app/_components/providers";
import { Footer } from "@/app/(default)/_components/footer";
import { Header } from "@/app/(default)/_components/header";
import { Main } from "@/components/main";
import { NotFound } from "@/components/pages/not-found/not-found";
import { defaultLocale } from "@/lib/i18n/locales";
import { getMetadata } from "@/lib/i18n/metadata";

export { viewport } from "@/app/_lib/viewport.config";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("GlobalNotFoundPage");
	const meta = await getMetadata();

	const metadata: Metadata = {
		title: [t("meta.title"), meta.title].join(" | "),
		/**
		 * Automatically set by next.js.
		 *
		 * @see {@link https://nextjs.org/docs/app/api-reference/functions/not-found}
		 */
		// robots: {
		// 	index: false,
		// },
	};

	return metadata;
}

export default function GlobalNotFoundPage(): ReactNode {
	const locale = defaultLocale;

	return (
		<HtmlDocument locale={locale}>
			<DocumentBody>
				<Providers locale={locale}>
					<div className="relative isolate flex min-h-full flex-col bg-white">
						<Header />
						<Main className="container flex flex-col mb-16 relative lg:gap-0 lg:mb-0">
							<NotFound />
						</Main>
						<Footer />
					</div>
				</Providers>
			</DocumentBody>
		</HtmlDocument>
	);
}
