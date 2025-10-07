import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { AcdhImprint } from "@/app/(app)/(default)/imprint/_components/acdh-imprint";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("ImprintPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default function ImprintPage(): ReactNode {
	const locale = useLocale();
	const t = useTranslations("ImprintPage");

	return (
		<div className="mx-auto w-full max-w-(--breakpoint-2xl) px-6">
			<h1>{t("title")}</h1>
			<AcdhImprint locale={locale} />
		</div>
	);
}
