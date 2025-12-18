import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { client } from "@/lib/data/client";

export function generateMetadata(): Metadata {
	const metadata: Metadata = {
		/**
		 * Fall back to `title.default` from `layout.tsx`.
		 *
		 * @see {@link https://nextjs.org/docs/app/api-reference/functions/generate-metadata#title}
		 */
	};

	return metadata;
}

export default async function IndexPage(): Promise<ReactNode> {
	const item = await client.homePage.read();

	const { image, leadIn, sections, title } = item;

	return (
		<Main className="container flex-1 px-8 py-12 xs:px-16">
			<h1>{title}</h1>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img alt="" src={image.url} />
			<div>{leadIn}</div>
			<section>
				<h2>{sections.news.title}</h2>
				<ul role="list">
					{sections.news.items.map((item) => {
						const { id, title } = item;

						return (
							<li key={id}>
								<article>
									<h3>{title}</h3>
								</article>
							</li>
						);
					})}
				</ul>
			</section>
			<section>
				<h2>{sections.events.title}</h2>
				<ul role="list">
					{sections.events.items.map((item) => {
						const { id, title } = item;

						return (
							<li key={id}>
								<article>
									<h3>{title}</h3>
								</article>
							</li>
						);
					})}
				</ul>
			</section>
		</Main>
	);
}
