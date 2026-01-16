import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { EventsSection } from "@/components/pages/homepage/events-section";
import { GetInvolvedSection } from "@/components/pages/homepage/get-involved-section";
import { HeroSection } from "@/components/pages/homepage/hero-section";
import { NetworkSection } from "@/components/pages/homepage/network-section";
import { NewsSection } from "@/components/pages/homepage/news-section";
import { PilarsSection } from "@/components/pages/homepage/pilars-section";
import { ResourcesSection } from "@/components/pages/homepage/resources-section";

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

export default function IndexPage(): ReactNode {
	return (
		<Main className="mx-auto flex flex-1 flex-col w-full max-w-480">
			<HeroSection />
			<NewsSection />
			<EventsSection />
			<PilarsSection />
			<ResourcesSection />
			<NetworkSection />
			<GetInvolvedSection />
		</Main>
	);
}
