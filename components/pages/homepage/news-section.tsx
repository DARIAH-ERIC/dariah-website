import React, { type ReactNode } from "react";

import { Link } from "@/components/ui/link/link";
import { NewsCard } from "@/components/ui/news-card/news-card";

export function NewsSection(): ReactNode {
	return (
		<section className="flex pb-10.5 flex-col gap-19 items-end bg-white">
			<div className="flex flex-wrap px-4 gap-21.5 justify-center w-full items-end lg:px-32">
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
			<div className="bg-text-link-bg w-51.5 max-w-full py-5 px-6 lg:w-124.25">
				<Link href="/news" variant="color-bg" withDefaultRightIcon={true}>
					{"See all news"}
				</Link>
			</div>
		</section>
	);
}
