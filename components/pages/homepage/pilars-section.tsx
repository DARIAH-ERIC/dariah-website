import React, { type ReactNode } from "react";

import { Pillar } from "@/components/pillar/pillar";

export function PilarsSection(): ReactNode {
	return (
		<section className="px-33.5 pt-7.75 pb-23">
			<p className="text-h1 font-heading text-[85px] font-light w-full px-2.5 py-17.5">
				{"Four Pillars of Our Work"}
			</p>
			<div className="flex justify-between">
				<Pillar
					description={
						"We make digital methods and tools an integral part of humanities research, promoting open, sustainable and responsible technologies."
					}
					image={"/assets/images/pillar-technology.svg"}
					title={"Technology"}
				/>
				<Pillar
					description={
						"We foster a culture of shared learning, ensuring that knowledge remains a driving force for innovation and collaboration. "
					}
					image={"/assets/images/pillar-knowledge.svg"}
					title={"Knowledge"}
				/>
				<Pillar
					description={
						"We connect researchers, institution, and networks across disciplines and countries, fostering inclusive collaboration and supportive communities."
					}
					image={"/assets/images/pillar-communities.svg"}
					title={"Communities"}
				/>
				<Pillar
					description={
						"We advocate for and shape inclusive and sustainable research infrastructure."
					}
					image={"/assets/images/pillar-policy.svg"}
					title={"Policy"}
				/>
			</div>
		</section>
	);
}
