import React, { type ReactNode } from "react";

import { Link } from "@/components/ui/link/link";
import { NewsCard } from "@/components/ui/news-card/news-card";

interface NewsSectionProps {
	news: Array<{
		id: string;
		title: string;
		summary: string;
		image: { url: string };
		entity: { slug: string };
		publishedAt: Date;
	}>;
}

export function NewsSection(props: Readonly<NewsSectionProps>): ReactNode {
	const { news } = props;

	return (
		<section className="flex pb-10.5 flex-col gap-19 items-end bg-white">
			<div className="flex flex-wrap px-4 gap-21.5 justify-center w-full items-end lg:px-32">
				{news.map((newsItem) => {
					const { entity, id, image, publishedAt, summary, title } = newsItem;

					const href = `/news/${entity.slug}`;

					return (
						<NewsCard
							key={id}
							date={publishedAt}
							description={summary}
							imageUrl={image.url}
							linkUrl={href}
							title={title}
							variant="featured"
						/>
					);
				})}
			</div>
			<div className="bg-text-link-bg w-51.5 max-w-full py-5 px-6 lg:w-124.25">
				<Link href="/news" variant="color-bg" withDefaultRightIcon={true}>
					{"See all news"}
				</Link>
			</div>
		</section>
	);
}
