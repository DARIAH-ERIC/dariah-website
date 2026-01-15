import React, { type ReactNode } from "react";

import { Image } from "@/components/image";
import { Button } from "@/components/ui/button/button";
import { Link } from "@/components/ui/link/link";

export function ResourcesSection(): ReactNode {
	return (
		<section className="relative w-full h-270 bg-[url(/assets/images/background-resources.svg)]">
			<div className="absolute top-0 left-0 backdrop-blur-[50px] bg-(image:--section-news-bg) size-full opacity-80 z-1">
				<div className="absolute top-0 left-0 w-full h-176.75 bg-section-resources-top-bg opacity-40 backdrop-blur-[13.4px] z-3" />
			</div>
			<div className="relative z-2 px-32.25 py-32.75 flex flex-col gap-38.5">
				<div className="flex gap-56.25">
					<p className="text-h2 text-white font-heading text-[85px] font-light w-95 tracking-(--letter-spacing-medium)">
						{"Our Resources"}
					</p>
					<div className="flex flex-col gap-6 text-white w-178.25 pt-7">
						<p className="text-h3">{"Resources Catalogue"}</p>
						<p className="text-h3 font-normal">
							{
								"Our members and partners contribute to the DARIAH infrastructure with a diverse range of resources. Explore the DARIAH Resources Catalogue to discover the richness that DARIAH have to offer."
							}
						</p>
						<Button className="w-62.75 mt-2 [&>span]:py-0.5!" variant="primary">
							{"Browse Catalogue"}
						</Button>
					</div>
				</div>
				<div className="flex gap-30.5 px-1.5">
					<div className="w-117.25">
						<div className="pt-6 pl-10.75 h-37.75 bg-resource-container-bg">
							<Image
								alt="DARIAH Campus Logo"
								height={80}
								src="/assets/images/logo-dariah-campus.svg"
								width={387}
							/>
						</div>
						<div className="flex flex-col gap-1 px-10 pt-8 pb-6 bg-white">
							<p className="text-regular h-27 line-clamp-4">
								{
									"DARIAH-CAMPUS is a discovery framework and a hosting platform for DARIAH and DARIAH-affiliated offerings in training and education."
								}
							</p>
							<Link href={"/"} variant="primary" withRightIcon={true}>
								{"Explore last publication"}
							</Link>
						</div>
					</div>
					<div className="w-117.25">
						<div className="pt-6 pl-10.75 h-37.75 bg-resource-container-bg">
							<Image
								alt="DARIAH Campus Logo"
								height={80}
								src="/assets/images/logo-dariah-transformations.svg"
								width={387}
							/>
						</div>
						<div className="flex flex-col gap-1 px-10 pt-8 pb-6 bg-white">
							<p className="text-regular h-27 line-clamp-4">
								{
									"Transformations: A DARIAH Journal is a multilingual journal focusing on use of digital tools, methods, and resources in Digital Humanities."
								}
							</p>
							<Link href={"/"} variant="primary" withRightIcon={true}>
								{"Explore last publication"}
							</Link>
						</div>
					</div>
					<div className="w-117.25">
						<div className="relative pt-6 pl-10.75 h-37.75 bg-resource-container-bg">
							<Image
								alt="DARIAH Campus Logo"
								height={80}
								src="/assets/images/logo-sshoc.svg"
								width={387}
							/>
						</div>
						<div className="flex flex-col gap-1 px-10 pt-8 pb-6 bg-white">
							<p className="text-regular h-27 line-clamp-4">
								{
									"SSH Open Marketplace is a discovery portal which pools and contextualises resources for Social Sciences and Humanities research."
								}
							</p>
							<Link href={"/"} variant="primary" withRightIcon={true}>
								{"Explore last publication"}
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
