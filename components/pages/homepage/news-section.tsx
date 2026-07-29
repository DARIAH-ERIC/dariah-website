import { useTranslations } from "next-intl";
import React, { type ReactNode } from "react";

import { Link } from "@/components/ui/link/link";
import { NewsCard } from "@/components/ui/news-card/news-card";
import type { Announcement } from "@/lib/data/api-client";
import { getHrefForAnnouncement } from "@/utils/news-page.utils";

interface NewsSectionProps {
	announcements: Array<Announcement>;
}

export function NewsSection(props: Readonly<NewsSectionProps>): ReactNode {
	const { announcements } = props;
	const t = useTranslations("HomePage");

	return (
		<section className="flex pb-10.5 flex-col gap-19 items-end bg-white">
			<div className="flex flex-col items-center px-4 gap-6 justify-center w-full xl:items-end xl:justify-center xl:flex-row 3xl:justify-start 3xl:gap-21.5 3xl:px-32">
				{announcements.map((announcement, index) => {
					const { entity, id, image, publishedAt, summary, title, type } = announcement;

					const href = getHrefForAnnouncement({ slug: entity.slug, type });

					return (
						<NewsCard
							key={id}
							date={publishedAt}
							description={summary}
							imageAlt={image.alt}
							imageUrl={image.url}
							linkUrl={href}
							title={title}
							type={type}
							variant={index === 0 ? "featured" : "standard"}
						/>
					);
				})}
			</div>
			<div className="bg-text-link-bg w-51.5 max-w-full py-5 px-6 lg:w-124.25">
				<Link href="/news" variant="color-bg" withDefaultRightIcon={true}>
					{t("NewsSection.seeAll")}
				</Link>
			</div>
		</section>
	);
}
