import { cn } from "@acdh-oeaw/style-variants";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import { useTranslations } from "next-intl";
import React, { type ReactNode } from "react";

import { Image } from "@/components/image";
import { NavLink } from "@/components/navigation";
import { ChevronForwardIcon } from "@/components/ui/icons/chevron-forward";
import { Typography } from "@/components/ui/typography/typography";

interface PillarProps {
	title: string;
	description: string;
	image: string | StaticImport;
	href?: string;
}

export function Pillar(props: Readonly<PillarProps>): ReactNode {
	const { title, description, image, href } = props;
	const t = useTranslations("HomePage.PillarsSection");

	return (
		<NavLink
			className="group flex flex-col gap-10 cursor-default items-start p-0!"
			href={href ?? "/"}
		>
			<Image alt="Pilar Technology" height={305} src={image} width={384} />
			<div className="flex flex-col justify-between w-69.75 h-95 font-heading">
				<div className="flex flex-col gap-7">
					<Typography className="text-[24px]" variant="h3">
						{title}
					</Typography>
					<hr className="w-25" />
					<Typography className="text-[24px] tracking-(--letter-spacing-medium)" variant="regular">
						{description}
					</Typography>
				</div>
				<div className="flex gap-2 py-2 items-center">
					<Typography
						className={cn(
							"font-semibold text-regular text-section-text",
							"group-hover:underline group-hover:decoration-[10%] group-hover:text-primary group-hover:underline-offset-[24%]",
							"group-focus-visible:text-section-text group-focus-visible:decoration-[3px] group-focus-visible:underline-offset-[24%] group-focus-visible:underline group-focus-visible:[&>span]:bg-accent-100 group-focus-visible:[&>svg]:fill-black",
							"group-focus-visible:outline-none",
						)}
						variant="regular"
					>
						{t("readMore")}
					</Typography>
					<ChevronForwardIcon className="size-5 fill-primary" />
				</div>
			</div>
		</NavLink>
	);
}
