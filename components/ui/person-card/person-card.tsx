import { cn } from "@acdh-oeaw/style-variants";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Image } from "@/components/image";
import { ChevronForwardIcon } from "@/components/ui/icons/chevron-forward";
import { NavLink } from "@/components/ui/link/nav-link";
import { Typography } from "@/components/ui/typography/typography";

interface PersonCardProps {
	href?: string;
	imageUrl?: string | null;
	name: string;
	position: string;
}

export function PersonCard(props: Readonly<PersonCardProps>): ReactNode {
	const { href, imageUrl, name, position } = props;
	const t = useTranslations("(default).PersonCard");

	const displayedImage = imageUrl ?? "/assets/images/person-placeholder.svg";

	return (
		<NavLink
			className={cn(
				"group flex flex-col gap-6 w-full max-w-full items-start",
				"lg:flex-row lg:w-126",
				"focus:outline-2 focus:outline-accent-800",
			)}
			href={href}
		>
			<Image
				alt={name}
				className="object-cover min-w-34 size-34 mt-2"
				height={136}
				src={displayedImage}
				width={136}
			/>
			<div className="flex flex-col py-1 gap-5.5 w-full">
				<Typography variant="h5">{name}</Typography>
				<Typography className="text-gray-800 font-medium" variant="regular">
					{position}
				</Typography>
				<div className="flex gap-2 items-center">
					<Typography
						className={cn(
							"font-semibold",
							"group-hover:text-primary group-hover:underline",
							"group-focus:text-primary group-focus:underline",
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
