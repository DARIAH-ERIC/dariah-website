import type { Metadata } from "next";
import { useExtracted as useTranslations } from "next-intl";
import { getExtracted as getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import { ContactForm } from "#/app/(app)/(default)/helpdesk/_components/contact-form.tsx";
import { PageHeader } from "#/components/page-header.tsx";
import { createMetadata } from "#/lib/metadata.ts";
import { href } from "#/lib/navigation/href.ts";

interface HelpdeskPageProps extends PageProps<"/helpdesk"> {}

/**
 * Nothing on this page depends on the request - the form posts to a server action - so it is prerendered whole, and
 * `next build` fails if a change makes any of it render per request.
 */
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations();

	return createMetadata({
		href: href({ pathname: "/helpdesk" }),
		title: t("Helpdesk"),
		description: t("Questions about DARIAH? Send us a message, and we will get back to you."),
	});
}

/**
 * The page's text lives here rather than in the knowledge base, since it has no page for the helpdesk; the form sends
 * its messages via the api, which delivers them to the DARIAH office by email.
 */
export default function HelpdeskPage(_props: Readonly<HelpdeskPageProps>): ReactNode {
	const t = useTranslations();

	return (
		<Main className="px-main pbe-24">
			<PageHeader current={href({ pathname: "/helpdesk" })} image={null} title={t("Helpdesk")} />
			<div className="flex flex-col gap-y-10 max-inline-measure">
				<p className="text-lead font-regular text-text-weak">
					{t(
						"Do you have a question about DARIAH, its activities or how to get involved? Send us a message, and we will get back to you by email.",
					)}
				</p>
				<section className="bg-background-callout p-8">
					<h2 className="mbe-6 text-title-3">{t("Send us a message")}</h2>
					<ContactForm />
				</section>
				<p className="text-small text-text-weak">
					{t(
						"We use the information you provide only to answer your message. It is sent to the DARIAH office by email, and not stored on this website.",
					)}
				</p>
			</div>
		</Main>
	);
}
