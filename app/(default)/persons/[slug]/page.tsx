import { isNonEmptyArray } from "@acdh-oeaw/lib";
import type { Metadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { ContentBlocks } from "@/components/content-blocks";
import { Link } from "@/components/ui/link/link";
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
	const t = await getTranslations("PersonPage");
	const format = await getFormatter();

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
				// eslint-disable-next-line @next/next/no-img-element
				<img
					alt={person.image.alt ?? ""}
					className="size-48 rounded-md object-cover -order-1 mb-4"
					src={person.image.url}
				/>
			) : null}
			<div className="max-w-4xl">
				<Typography variant="small">
					<PersonPositions position={person.positions} />
				</Typography>
				<ContentBlocks fields={person.biography} />
			</div>
			{isNonEmptyArray(person.articles) ? (
				<section className="flex flex-col gap-y-2 mt-4 max-w-4xl">
					<Typography className="text-h3 font-light" variant="h2">
						{t("articles")}
					</Typography>
					<ul className="flex flex-col gap-y-6" role="list">
						{person.articles.map((article, index) => {
							const href =
								article.type === "impact_case_study"
									? `/about/impact-case-studies/${article.entity.slug}`
									: // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
										article.type === "spotlight_article"
										? `/spotlights/${article.entity.slug}`
										: undefined;

							return (
								// eslint-disable-next-line @eslint-react/no-array-index-key
								<li key={index}>
									<article className="flex flex-col">
										<Typography className="text-h4" variant="h3">
											<Link href={href}>{article.title}</Link>
										</Typography>
										<time dateTime={article.publishedAt}>
											<Typography variant="small">
												{format.dateTime(new Date(article.publishedAt), { timeZone: "UTC" })}
											</Typography>
										</time>
										<div className="mt-2">{article.summary}</div>
									</article>
								</li>
							);
						})}
					</ul>
				</section>
			) : null}
		</Main>
	);
}
