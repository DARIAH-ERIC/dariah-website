import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { client } from "@/lib/data/api-client";

interface NewsItemPageProps extends PageProps<"/news/[slug]"> {}

// export async function generateStaticParams(): Promise<
// 	Array<Pick<Awaited<NewsItemPageProps["params"]>, "slug">>
// > {
// 	const slugs = await client.news.slugs();

// 	return slugs.map((slug) => {
// 		return { slug };
// 	});
// }

export async function generateMetadata(props: Readonly<NewsItemPageProps>): Promise<Metadata> {
	const { params } = props;

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);

	const response = await client.news.bySlug({ slug });

	const { data: item } = response;

	const { title } = item;

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function NewsItemPage(props: Readonly<NewsItemPageProps>): Promise<ReactNode> {
	const { params } = props;

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);

	const response = await client.news.bySlug({ slug });

	const { data: item } = response;

	const { title } = item;

	return (
		<Main className="container flex flex-1 flex-col gap-8 px-8 py-12 xs:px-16">
			<h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
		</Main>
	);
}
