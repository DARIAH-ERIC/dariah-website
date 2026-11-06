import { useExtracted as useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { RelatedContent } from "#/components/related-content.tsx";
import type { RelatedResource } from "#/components/related-links.tsx";
import type { RelatedEntity } from "#/lib/api/schemas.ts";

interface RelatedContentBandProps {
	/** The page's `relatedEntities` - see `lib/api/schemas.ts`. */
	entities?: Array<RelatedEntity>;
	/** The page's `relatedResources` - see `lib/api/schemas.ts`. */
	resources?: Array<RelatedResource>;
}

/**
 * What other pages list beside their content, in a band of its own below it, like an article's "Latest news": it spans
 * the page, so it has to be rendered outside of the page's `px-main`. Without any relations there is no band.
 */
export function RelatedContentBand(props: Readonly<RelatedContentBandProps>): ReactNode {
	const { entities = [], resources = [] } = props;

	const t = useTranslations();

	if (entities.length === 0 && resources.length === 0) {
		return null;
	}

	return (
		<RelatedContent
			card="image"
			className="border-bs border-stroke-weak bg-background-subtle px-main pbs-16 pbe-20"
			entities={entities}
			listClassName="mbs-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-4 2xl:gap-x-16"
			resources={resources}
			title={t("Related Content")}
		/>
	);
}
