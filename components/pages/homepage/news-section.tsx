import React, { type ReactNode } from "react";

import { Link } from "@/components/ui/link/link";
import { NewsCard } from "@/components/ui/news-card/news-card";

export function NewsSection(): ReactNode {
	return (
		<section className="flex pb-10.5 flex-col gap-19 items-end bg-white">
			<div className="flex px-32 gap-21.5 items-end w-full">
				<NewsCard
					date={"2024-06-10"}
					description={
						"On October 22nd, 2025 the DARIAH South-East European (SEE) Regional Hub officially launched, during an event at the Vučedol Culture Museum in Osijek, Croatia. The launch was organised on the side of the Digital Humanities and Heritage conference, an annual international conference run by DARIAH-HR. The SEE Hub is the first DARIAH"
					}
					imageUrl={"/assets/images/temp-news-1.jpg"}
					linkUrl={"#"}
					title={"Launch of the DARIAH South-East European Regional Hub"}
					variant="featured"
				/>
				<NewsCard
					date={"2024-06-10"}
					imageUrl={"/assets/images/temp-news-2.png"}
					linkUrl={"#"}
					title={
						"DARIAH publishes the CoARA Progress Report and Action Plan for the years 2025-2027"
					}
					variant="standard"
				/>
				<NewsCard
					date={"2024-06-10"}
					imageUrl={"/assets/images/temp-news-3.jpg"}
					linkUrl={"#"}
					title={
						"OpenMethods metablog: From a DARIAH Core Service to a DARIAH-IT Community Service"
					}
					variant="standard"
				/>
			</div>
			<div className="bg-text-link-bg w-124.25 max-w-full py-5 px-6">
				<Link href="/news" variant="color-bg" withRightIcon={true}>
					{"See all news"}
				</Link>
			</div>
		</section>
	);
}
