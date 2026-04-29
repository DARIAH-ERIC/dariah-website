import { cn } from "@acdh-oeaw/style-variants";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { MobileRefinementList } from "@/components/pages/resources/dariah-resource-catalogue/refinements/mobile-refinement-list";
import { Button } from "@/components/ui/button/button";
import { DisclosureGroup } from "@/components/ui/disclosure/disclosure";
import { CloseIcon } from "@/components/ui/icons/close";
import { Typography } from "@/components/ui/typography/typography";
import type { ResourceCatalogueFilter } from "@/types/filters";

export function MobileRefinements(
	props: Readonly<{
		refinements: Array<ResourceCatalogueFilter>;
		filtersOpen: boolean;
		handleMobileRefinementsClose: () => void;
	}>,
): ReactNode {
	const t = useTranslations("DariahResourceCataloguePage");
	const { refinements, filtersOpen, handleMobileRefinementsClose } = props;

	return (
		<div
			className={cn(
				"bg-white fixed inset-0 z-10 flex flex-col justify-between w-screen max-w-screen lg:hidden",
				!filtersOpen ? "hidden" : "",
			)}
		>
			<div className="flex flex-col gap-4 overflow-x-auto">
				<div className="p-2 flex justify-between items-center border-b-[0.5px] border-neutral-400 pt-4 mx-4">
					<Typography className="text-[24px]" variant="h4">
						{t("filter.title")}
					</Typography>
					<Button onClick={handleMobileRefinementsClose} variant="icon-button">
						<CloseIcon className="fill-primary! size-6" />
					</Button>
				</div>
				<DisclosureGroup className="flex flex-col w-full px-4">
					{refinements.map(({ name, subfilters, ...rest }) => {
						return (
							<MobileRefinementList key={name} attribute={name} subfilters={subfilters} {...rest} />
						);
					})}
				</DisclosureGroup>
			</div>
			<div className="p-4 shadow-filters-mobile">
				<Button className="w-full" onClick={handleMobileRefinementsClose} variant="secondary-blue">
					{"See results"}
				</Button>
			</div>
		</div>
	);
}
