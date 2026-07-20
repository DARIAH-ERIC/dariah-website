import type { Metadata } from "next";
// import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { ContentBlocks } from "@/components/content-blocks";
import { PersonPositions } from "@/components/ui/person-card/person-positions";
// import { Image } from "@/components/image";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/api-client";

interface PersonPageProps extends PageProps<"/persons/[slug]"> {}

export async function generateStaticParams(): Promise<
	Array<Pick<Awaited<PersonPageProps["params"]>, "slug">>
> {
	const response = await client.persons.slugs();

	return response.data.data.map((item) => {
		return { slug: item.entity.slug };
	});
}

export async function generateMetadata(props: Readonly<PersonPageProps>): Promise<Metadata> {
	const { params } = props;

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);

	const response = await client.persons.bySlug({ slug });
	const person = response.data;

	const metadata: Metadata = {
		title: person.name,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function PersonPage(props: Readonly<PersonPageProps>): Promise<ReactNode> {
	const { params } = props;
	// const t = await getTranslations("PersonPage");

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);

	const response = await client.persons.bySlug({ slug });
	const person = response.data;

	return (
		<Main className="container flex flex-1 flex-col px-4 py-8 gap-y-4 xl:px-31 2xl:pb-15">
			<Typography className="text-h2 font-light" variant="h1">
				{person.name}
			</Typography>
			{person.image != null ? (
				<img alt={person.image.alt ?? ""} className="size-48 rounded-md object-cover" src={person.image.url} />
			) : null}
			<PersonPositions position={person.position} />
			<ContentBlocks fields={person.biography} />
		</Main>
	);
}
