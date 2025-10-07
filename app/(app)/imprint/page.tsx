import { HttpError, request } from "@acdh-oeaw/lib";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { createImprintUrl } from "@/config/imprint.config";
import { defaultLocale, getIntlLanguage, type IntlLocale } from "@/lib/i18n/locales";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("ImprintPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function ImprintPage(): Promise<ReactNode> {
	const t = await getTranslations("ImprintPage");

	const html = await getImprintHtml(defaultLocale);

	return (
		<MainContent>
			<h1>{t("title")}</h1>
			<div dangerouslySetInnerHTML={{ __html: html }} />
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
