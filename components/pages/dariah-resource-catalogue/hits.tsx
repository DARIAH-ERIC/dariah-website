import { useTranslations } from "next-intl";
import type { ElementType, ReactNode } from "react";
import { useHits, type UseHitsProps, useInstantSearch } from "react-instantsearch";

import { ResourceCard } from "@/components/ui/resource-card/resource-card";
import { Typography } from "@/components/ui/typography/typography";
import type { ResourceCollectionDocument } from "@/lib/search/schema";

export function Hit({ hit }: Readonly<{ hit: ResourceCollectionDocument }>): ReactNode {
	const { label, description, type, links } = hit;
	const kind = type === "tool-or-service" ? hit.kind : undefined;

	return (
		<ResourceCard
			description={description}
			resourceCategory={type}
			resourceUrl={links[0]}
			serviceType={kind}
			title={label}
		/>
	);
}

export function Hits(
	props: Readonly<UseHitsProps<ResourceCollectionDocument> & { hitComponent?: ElementType }>,
): ReactNode {
	const t = useTranslations("DariahResourceCataloguePage");
	const { status } = useInstantSearch();
	const { items } = useHits(props);
	const { hitComponent } = props;

	const Component: ElementType = hitComponent ?? Hit;

	if (status === "error") {
		return (
			<div className="max-w-301 w-full">
				<Typography className="text-center" variant="regular">
					{t("hits.error")}
				</Typography>
			</div>
		);
	}

	if (items.length === 0 && status === "idle") {
		return (
			<div className="max-w-301 w-full">
				<Typography className="text-center" variant="regular">
					{t("hits.empty")}
				</Typography>
			</div>
		);
	}

	return (
		<ul className="list-none flex flex-col gap-6 max-w-301">
			{items.map((hit) => {
				return <Component key={hit.objectID} hit={hit} />;
			})}
		</ul>
	);
}
