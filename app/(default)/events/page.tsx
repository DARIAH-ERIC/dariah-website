import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import * as v from "valibot";

import { Main } from "@/app/(default)/_components/main";
import { Link } from "@/components/ui/link/link";
import { client } from "@/lib/data/api-client";

const SearchParamsSchema = v.object({
	limit: v.fallback(v.pipe(v.string(), v.toNumber(), v.minValue(1), v.maxValue(100)), 10),
	offset: v.fallback(v.pipe(v.string(), v.toNumber(), v.minValue(0)), 0),
});

interface EventsPageProps extends PageProps<"/events"> {}

export async function generateMetadata(_props: EventsPageProps): Promise<Metadata> {
	const t = await getTranslations("EventsPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function EventsPage(props: Readonly<EventsPageProps>): Promise<ReactNode> {
	const { searchParams } = props;

	const t = await getTranslations("EventsPage");

	const { limit, offset } = v.parse(SearchParamsSchema, await searchParams);

	const response = await client.events.list({ limit, offset });

	const { data: items } = response.data;

	return (
		<Main className="container flex flex-1 flex-col gap-8 px-8 py-12 xs:px-16">
			<h1 className="text-2xl font-extrabold tracking-tight">{t("title")}</h1>
			<ul
				className="grid grid-cols-[repeat(auto-fill,minmax(min(18rem,100%),1fr))] gap-4"
				role="list"
			>
				{items.map((item) => {
					const { entity, image, summary, title } = item;
					const { slug } = entity;

					const href = `/events/${slug}`;

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
