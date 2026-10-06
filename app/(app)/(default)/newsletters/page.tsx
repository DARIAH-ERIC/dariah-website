import { ExternalLinkIcon } from "lucide-react";
import type { Metadata } from "next";
import { useFormatter, useExtracted as useTranslations } from "next-intl";
import { getExtracted as getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { type ReactNode, useId } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import { SubscribeForm } from "#/app/(app)/(default)/newsletters/_components/subscribe-form.tsx";
import { ContentBlocks } from "#/components/content-blocks.tsx";
import { ContentLayout } from "#/components/content-layout.tsx";
import { PageHeader } from "#/components/page-header.tsx";
import type { Newsletter } from "#/lib/api/schemas.ts";
import { getNewsletters } from "#/lib/data/newsletters.ts";
import { getPageBySlug } from "#/lib/data/pages.ts";
import { createMetadata } from "#/lib/metadata.ts";
import { href } from "#/lib/navigation/href.ts";

interface NewslettersPageProps extends PageProps<"/newsletters"> {}

/**
 * Nothing on this page depends on the request, so it is prerendered whole, and `next build` fails if a change makes any
 * of it render per request.
 */
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const page = await getPageBySlug("newsletters");

	if (page == null) {
		return {};
	}

	return createMetadata({
		href: href({ pathname: "/newsletters" }),
		title: page.title,
		description: page.summary,
		image: page.image,
	});
}

/**
 * A content page, with the subscription form below its content, in its column, followed by the archive of past issues
 * in a band of its own, and the privacy notice last, as the small print it is.
 */
export default async function NewslettersPage(_props: Readonly<NewslettersPageProps>): Promise<ReactNode> {
	const t = await getTranslations();

	const [page, privacyNotice, items] = await Promise.all([
		getPageBySlug("newsletters"),
		getPageBySlug("newsletters-privacy-notice"),
		getNewsletters(),
	]);

	if (page == null) {
		notFound();
	}

	return (
		<Main>
			<div className="px-main">
				<PageHeader current={href({ pathname: "/newsletters" })} image={page.image} title={page.title} />
				<ContentLayout
					related="quick-links"
					blocks={page.content}
					relatedEntities={page.relatedEntities}
					relatedResources={page.relatedResources}
					tableOfContents={page.showTableOfContents}
				>
					<section className="bg-background-callout p-8">
						<h2 className="mbe-6 text-title-3">{t("Subscribe to the newsletter")}</h2>
						<SubscribeForm />
					</section>
				</ContentLayout>
			</div>
			<NewsletterArchive items={items} />
			{privacyNotice != null ? (
				<section className="px-main pbs-16 pbe-24">
					{/** The notice's content opens with a heading of its own, so its page title only names the section. */}
					<h2 className="sr-only">{privacyNotice.title}</h2>
					<ContentBlocks blocks={privacyNotice.content} className="max-inline-measure [&_.prose]:text-caption" />
				</section>
			) : null}
		</Main>
	);
}

interface NewsletterArchiveProps {
	items: Array<Newsletter>;
}

/**
 * Past issues, newest first, grouped by the year they were sent in. The subject line already names the month, so an
 * issue is listed by it alone. An issue which has not been sent has no archive page yet, and is left out.
 */
function NewsletterArchive(props: Readonly<NewsletterArchiveProps>): ReactNode {
	const { items } = props;

	const t = useTranslations();
	const format = useFormatter();

	const headingId = useId();

	const sent = items
		.filter((item): item is Newsletter & { send_time: string } => item.send_time != null)
		.toSorted((a, z) => z.send_time.localeCompare(a.send_time));

	if (sent.length === 0) {
		return null;
	}

	const years = new Map<number, typeof sent>();

	for (const item of sent) {
		const year = new Date(item.send_time).getUTCFullYear();
		years.set(year, [...(years.get(year) ?? []), item]);
	}

	return (
		<section
			aria-labelledby={headingId}
			className="border-bs border-be border-stroke-weak bg-background-subtle px-main pbs-12 pbe-20"
		>
			<h2 className="text-title-1" id={headingId}>
				{t("Newsletter archive")}
			</h2>
			<div className="mbs-10 flex flex-col gap-y-12">
				{Array.from(years, ([year, issues]) => (
					<section key={year}>
						<h3 className="mbe-5 text-title-3">{year}</h3>
						<ul className="grid grid-cols-[repeat(auto-fill,minmax(min(18rem,100%),1fr))] gap-x-5 gap-y-3" role="list">
							{issues.map((item) => (
								<li key={item.id} className="flex">
									<a
										className="group flex inline-full items-start justify-between gap-x-4 bg-background-base px-5 py-4 shadow-card-edge hover:text-text-accent focus-visible-outline"
										href={item.archive_url}
									>
										<span className="flex flex-col gap-y-1">
											<span className="font-medium">{item.subject_line}</span>
											<time className="text-small text-text-weak" dateTime={item.send_time}>
												{format.dateTime(new Date(item.send_time), { dateStyle: "long" })}
											</time>
										</span>
										<ExternalLinkIcon aria-hidden={true} className="size-4 shrink-0 text-icon-accent mbs-1" />
									</a>
								</li>
							))}
						</ul>
					</section>
				))}
			</div>
		</section>
	);
}
