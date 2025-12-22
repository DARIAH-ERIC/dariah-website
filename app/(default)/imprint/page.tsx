import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { AcdhImprint } from "@/app/(default)/imprint/_components/acdh-imprint";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("ImprintPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default function ImprintPage(): ReactNode {
	const locale = useLocale();
	const t = useTranslations("ImprintPage");

	return (
		<Main className="container flex flex-1 flex-col gap-8 px-8 py-12 xs:px-16">
			<h1 className="text-2xl font-extrabold tracking-tight">{t("title")}</h1>
			<AcdhImprint locale={locale} />
		</Main>
	);
}
