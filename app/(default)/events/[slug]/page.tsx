import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { client } from "@/lib/data/api-client";

interface EventPageProps extends PageProps<"/events/[slug]"> {}

// export async function generateStaticParams(): Promise<
// 	Array<Pick<Awaited<EventPageProps["params"]>, "slug">>
// > {
// 	const slugs = await client.events.slugs();

// 	return slugs.map((slug) => {
// 		return { slug };
// 	});
// }

export async function generateMetadata(props: Readonly<EventPageProps>): Promise<Metadata> {
	const { params } = props;

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);

	const response = await client.events.bySlug({ slug });

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

export default async function EventPage(props: Readonly<EventPageProps>): Promise<ReactNode> {
	const { params } = props;

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);

	const response = await client.events.bySlug({ slug });

	const { data: item } = response;

	const { title } = item;

	return (
		<Main className="container flex flex-1 flex-col gap-8 px-8 py-12 xs:px-16">
			<h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
		</Main>
	);
}
