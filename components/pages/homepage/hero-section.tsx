import React, { type ReactNode } from "react";

import { Button } from "@/components/ui/button/button";

export function HeroSection(): ReactNode {
	return (
		<section
			className={`w-full h-241.25 bg-[url(/assets/images/background-hero-section.svg)] relative`}
		>
			<div className="flex flex-col gap-11.5 mt-57.75 ml-26">
				<h1 className="text-h1 text-[84px] text-white bg-text-link-bg/60 pl-9 pt-7.5 pb-13.75 max-w-330">
					{"The pan-European infrastructure for Arts & Humanities scholars"}
				</h1>
				<div className="flex gap-16.25">
					<Button variant="secondary-blue">{"Get involved"}</Button>
					<Button variant="secondary-black">{"Learn more about DARIAH-EU"}</Button>
				</div>
			</div>
			<div className="h-42.5 bg-white pl-32.5 w-221 flex items-center absolute bottom-0 left-0">
				<p className="text-h1 font-heading text-[85px] font-light">{"Stay updated"}</p>
			</div>
		</section>
	);
}
