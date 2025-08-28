import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { CardSection } from "@/components/card-section";
import { MainContent } from "@/components/main-content";
import { defaultLocale } from "@/lib/i18n/locales";
import { createSingletonResource } from "@/lib/keystatic/resources";
import type { FeatureSectionProps, HeroSectionProps } from "@/types/keystatic";

interface IndexPageProps {}

export async function generateMetadata(
	_props: Readonly<IndexPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const _t = await getTranslations("IndexPage");

	const metadata: Metadata = {
		/**
		 * Fall back to `title.default` from `layout.tsx`.
		 *
		 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#title
		 */
		// title: undefined,
	};

	return metadata;
}

export default async function IndexPage(): Promise<ReactNode> {
	try {
		const page = await createSingletonResource("index-page", defaultLocale).read();
		const { hero, main } = page.data;

		return (
			<MainContent className="layout-grid content-start">
				<HeroSection {...hero} />
				<FeaturesSection {...main} />
			</MainContent>
		);
	} catch {
		return notFound();
	}
}

function HeroSection(props: Readonly<HeroSectionProps>): ReactNode {
	const { title, lead, image: _ } = props;

	return (
		<section className="layout-subgrid relative gap-y-10 bg-fill-weaker py-16 xs:py-24">
			<div className="max-w-text grid gap-y-6">
				<h1 className="text-balance font-heading text-display font-strong text-text-strong">
					{title}
				</h1>
				<p className="font-heading text-small text-text-weak xs:text-heading-4">{lead}</p>
			</div>
		</section>
	);
}

function FeaturesSection(props: Readonly<FeatureSectionProps>): ReactNode {
	const { sections } = props;

	return (
		<div>
			{sections.map((section, idx) => {
				return (
					<CardSection
						key={idx}
						cards={section.value.cards}
						className="layout-subgrid relative gap-y-12 border-t border-stroke-weak py-16 xs:py-24"
						title={section.value.title}
					/>
				);
			})}
		</div>
	);
}
