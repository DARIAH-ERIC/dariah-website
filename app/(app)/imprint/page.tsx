import { HttpError, request } from "@acdh-oeaw/lib";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { createImprintUrl } from "@/config/imprint.config";
import { defaultLocale, getIntlLanguage, type IntlLocale } from "@/lib/i18n/locales";

interface ImprintPageProps {}

export async function generateMetadata(
	_props: Readonly<ImprintPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const t = await getTranslations("ImprintPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function ImprintPage(_props: Readonly<ImprintPageProps>): Promise<ReactNode> {
	const t = await getTranslations("ImprintPage");

	const html = await getImprintHtml(defaultLocale);

	return (
		<MainContent className="layout-grid content-start">
			<section className="layout-subgrid relative grid gap-y-6 bg-fill-weaker py-16 xs:py-20">
				<div className="max-w-text grid gap-y-4">
					<h1 className="text-balance font-heading text-heading-1 font-strong text-text-strong">
						{t("title")}
					</h1>
				</div>
			</section>

			<section
				dangerouslySetInnerHTML={{ __html: html }}
				className="layout-subgrid content-max-w-text typography relative border-t border-stroke-weak py-16 xs:py-20"
			/>
		</MainContent>
	);
}

async function getImprintHtml(locale: IntlLocale): Promise<string> {
	const lang = getIntlLanguage(locale);

	try {
		const url = createImprintUrl(lang);
		const html = await request(url, { responseType: "text" });

		return html;
	} catch (error) {
		if (error instanceof HttpError && error.response.status === 404) {
			notFound();
		}

		throw error;
	}
}
