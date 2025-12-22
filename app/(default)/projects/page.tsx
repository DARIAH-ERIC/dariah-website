import type { Metadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { Link } from "@/components/link";
import { client } from "@/lib/data/client";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("ProjectsPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function ProjectsPage(): Promise<ReactNode> {
	const t = await getTranslations("ProjectsPage");
	const format = await getFormatter();

	const data = await client.projects.list();

	const { items } = data;

	return (
		<Main className="container flex flex-1 flex-col gap-8 px-8 py-12 xs:px-16">
			<h1>{t("title")}</h1>
			<ul
				className="grid grid-cols-[repeat(auto-fill,minmax(min(18rem,100%),1fr))] gap-4"
				role="list"
			>
				{items.map((item) => {
					const { endDate, image, name, slug, startDate } = item;

					const href = `/projects/${slug}`;

					return (
						<li key={slug}>
							<article className="flex flex-col gap-2">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									alt=""
									className="aspect-video w-full rounded-md object-cover"
									src={image.url}
								/>
								<h2>
									<Link href={href}>{name}</Link>
								</h2>
								<div>{format.dateTimeRange(startDate, endDate, { dateStyle: "long" })}</div>
							</article>
						</li>
					);
				})}
			</ul>
		</Main>
	);
}
