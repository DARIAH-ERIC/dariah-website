import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { MapPinIcon } from "@/components/ui/icons/map-pin";
import { Link } from "@/components/ui/link/link";
import { Typography } from "@/components/ui/typography/typography";

interface CountryPopupProps {
	title: string;
	label?: string;
	href?: string;
}

export function CountryPopup(props: Readonly<CountryPopupProps>): ReactNode {
	const { title, label, href } = props;
	const t = useTranslations("MembersAndPartnersPage");
	return (
		<div className="p-4 z-850 flex gap-4 items-center w-100">
			<MapPinIcon className="fill-accent-500" />
			<div className="flex flex-col gap-1.25 w-42">
				<Typography variant="h4">{title}</Typography>
				<Typography className="m-0! text-[16px] text-gray-800" variant="regular">
					{label}
				</Typography>
			</div>
			{href !== undefined && (
				<Link className="font-semibold" href={href} variant="paragraph" withDefaultRightIcon={true}>
					{t("popup.details")}
				</Link>
			)}
		</div>
	);
}
