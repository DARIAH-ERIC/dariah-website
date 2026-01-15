import React, { type ReactNode } from "react";

import { Image } from "@/components/image";
import { Link } from "@/components/ui/link/link";

export function NetworkSection(): ReactNode {
	return (
		<section className="w-full px-26.25 py-22.5 items-center flex flex-col">
			<p className="text-h1 font-heading text-[85px] font-light w-full px-7.25">{"Our Network"}</p>
			<div className="flex gap-17">
				<div className="relative h-155.75">
					<Image
						alt="DARIAH Campus Logo"
						height={514}
						src="/assets/images/network-countries.svg"
						width={514}
					/>
					<div className="text-text-link-bg flex items-end gap-7.25 absolute bottom-0 left-1/2 -translate-x-1/2">
						<p className="font-heading text-[128px] font-black leading-[1.3] tracking-[0.02em]">
							{"20"}
						</p>
						<p className="pb-5.5 text-h3">{"Member countries"}</p>
					</div>
				</div>

				<div className="relative h-155.75">
					<Image
						alt="DARIAH Campus Logo"
						height={514}
						src="/assets/images/network-institution.svg"
						width={514}
					/>
					<div className="text-text-link-bg flex items-end gap-7.25 absolute bottom-0 left-1/2 -translate-x-1/2">
						<p className="font-heading text-[128px] font-black leading-[1.3] tracking-[0.02em]">
							{"197"}
						</p>
						<p className="pb-5.5 text-h3">{"National Partner Institution"}</p>
					</div>
				</div>

				<div className="relative h-155.75">
					<Image
						alt="DARIAH Campus Logo"
						height={514}
						src="/assets/images/network-partner.svg"
						width={514}
					/>
					<div className="text-text-link-bg flex items-end gap-7.25 absolute bottom-0 left-1/2 -translate-x-1/2">
						<p className="font-heading text-[128px] font-black leading-[1.3] tracking-[0.02em]">
							{"19"}
						</p>
						<p className="pb-5.5 text-h3">{"Cooperating Partners"}</p>
					</div>
				</div>
			</div>
			<div className="bg-text-link-bg w-122.25 max-w-full py-5 px-6.25 flex justify-center mt-8.75">
				<Link href={"/"} variant="color-bg" withRightIcon={true}>
					{"Read more about Members and Partners"}
				</Link>
			</div>
		</section>
	);
}
