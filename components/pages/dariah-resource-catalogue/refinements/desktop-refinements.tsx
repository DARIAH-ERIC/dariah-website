import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { DesktopRefinementList } from "@/components/pages/dariah-resource-catalogue/refinements/desktop-refinement-list";
import { Typography } from "@/components/ui/typography/typography";
import type { ResourceCatalogueFilter } from "@/types/filters";

export function DesktopRefinements(
	props: Readonly<{ refinements: Array<ResourceCatalogueFilter> }>,
): ReactNode {
	const { refinements } = props;
	const t = useTranslations("DariahResourceCataloguePage");

	return (
		<div className="hidden flex-col gap-10 min-w-80 w-83 max-w-83 lg:flex">
			<Typography variant="h4">{t("filter.title")}</Typography>
			{refinements.map(({ name, subfilters, ...rest }) => {
				return (
					<DesktopRefinementList key={name} attribute={name} subfilters={subfilters} {...rest} />
				);
			})}
		</div>
	);
}
