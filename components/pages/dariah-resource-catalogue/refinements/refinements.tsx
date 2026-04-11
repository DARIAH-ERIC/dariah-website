import { useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";

import { DesktopRefinements } from "@/components/pages/dariah-resource-catalogue/refinements/desktop-refinements";
import { MobileRefinements } from "@/components/pages/dariah-resource-catalogue/refinements/mobile-refinements";
import { Button } from "@/components/ui/button/button";
import type { ResourceCatalogueFilter } from "@/types/filters";

export function Refinements(
	props: Readonly<{ refinements: Array<ResourceCatalogueFilter> }>,
): ReactNode {
	const { refinements } = props;
	const [filtersOpen, setFiltersOpen] = useState(false);
	const t = useTranslations("DariahResourceCataloguePage");

	const handleMobileRefinementsToggle = () => {
		document.body.style.overflow = filtersOpen ? "" : "hidden";
		setFiltersOpen((prev) => {
			return !prev;
		});
	};

	return (
		<>
			<DesktopRefinements refinements={refinements} />
			<MobileRefinements
				filtersOpen={filtersOpen}
				handleMobileRefinementsClose={handleMobileRefinementsToggle}
				refinements={refinements}
			/>
			<Button className="w-full lg:hidden" onClick={handleMobileRefinementsToggle}>
				{t("filter.showButton")}
			</Button>
		</>
	);
}
