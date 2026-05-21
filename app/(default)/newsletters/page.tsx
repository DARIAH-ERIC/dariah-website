import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { Main } from "@/app/(default)/_components/main";
import { SubscribeNewsletter } from "@/components/navigation/subscribe-newsletter";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { Document } from "@/components/ui/document/document";
import { Pagination } from "@/components/ui/pagination/pagination";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";

interface NewslettersPageProps extends PageProps<"/newsletters"> {}

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("NewslettersPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function NewslettersPage(
	props: Readonly<NewslettersPageProps>,
): Promise<ReactNode> {
	const { searchParams } = props;
	const { page = 1, per_page = 10 } = await searchParams;
	const t = await getTranslations("NewslettersPage");

	const response = await client.newsletters.list({
		limit: Number(per_page),
		offset: (Number(page) - 1) * Number(per_page),
	});
	const breadcrumbs = navigation().breadcrumbs.newsletters;

	const { data: items, total } = response.data;

	return (
		<Main className="flex flex-1 flex-col gap-14 px-4 pt-8 pb-30 container lg:px-12 2xl:px-31.5">
			<div className="flex flex-col gap-14 w-full">
				{breadcrumbs.length > 0 && (
					<Breadcrumbs>
						{breadcrumbs.map(({ label, href }) => {
							return (
								<Breadcrumb key={label} href={href}>
									{label}
								</Breadcrumb>
							);
						})}
					</Breadcrumbs>
				)}
				<Typography variant="h2">{t("title")}</Typography>
			</div>
			<div className="flex flex-col gap-16 xl:flex-row">
				<div className="flex flex-col gap-16">
					<ul className="flex flex-col lg:min-w-[60%]" role="list">
						{items.map((item, index) => {
							const { id, archive_url, subject_line } = item;
							return (
								<li key={id}>
									<Document
										documentUrl={archive_url}
										isEven={index % 2 === 0}
										previewText={t("previewText")}
										title={subject_line}
									/>
								</li>
							);
						})}
					</ul>

					<div className="bg-pagination-bg max-w-full w-92 h-21 flex items-center ml-auto sm:w-125 sm:pl-8 sm:max-w-125">
						<Suspense>
							<Pagination pageCount={Math.ceil(total / Number(per_page))} shouldScroll={true} />
						</Suspense>
					</div>
				</div>
				<SubscribeNewsletter />
			</div>
		</Main>
	);
}
