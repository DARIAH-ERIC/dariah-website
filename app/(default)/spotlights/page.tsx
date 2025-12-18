import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { Link } from "@/components/link";
import { client } from "@/lib/data/client";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("SpotlightArticlesPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function SpotlightArticlesPage(): Promise<ReactNode> {
	const t = await getTranslations("SpotlightArticlesPage");

	const data = await client.spotlightArticles.list();

	const { items } = data;

	return (
		<Main className="container flex-1 px-8 py-12 xs:px-16">
			<h1>{t("title")}</h1>
			<ul role="list">
				{items.map((item) => {
					const { image, slug, summary, title } = item;

					const href = `/spotlight/${slug}`;

					return (
						<li key={slug}>
							<article>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img alt="" src={image.url} />
								<h2>
									<Link href={href}>{title}</Link>
								</h2>
								<div>{summary}</div>
							</article>
						</li>
					);
				})}
			</ul>
		</Main>
	);
}
