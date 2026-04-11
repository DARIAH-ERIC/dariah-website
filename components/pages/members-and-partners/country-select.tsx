import { cn } from "@acdh-oeaw/style-variants";
import { useTranslations } from "next-intl";
import type { ComponentProps, ReactNode } from "react";
import type { Link } from "react-aria-components";

import { NavLink } from "@/components/ui/link/nav-link";
import { Typography } from "@/components/ui/typography/typography";

interface CountrySelectProps extends ComponentProps<typeof Link> {
	title: string;
	label?: "is_member_of" | "is_cooperating_partner_of" | "is_observer_of";
	className?: string;
}

export function CountrySelect(props: Readonly<CountrySelectProps>): ReactNode {
	const { title, label, className, ...rest } = props;
	const t = useTranslations("MembersAndPartnersPage");

	return (
		<NavLink
			className={cn(
				className,
				"group flex flex-col gap-1 px-2 py-1 rounded-[5px] cursor-pointer items-start",
				"hover:bg-gray-300",
				"focus:bg-gray-300 focus:outline-accent-600 focus:outline-2",
				"pressed:bg-primary-600",
			)}
			{...rest}
		>
			<Typography
				className={cn("text-[18px] text-primary font-semibold", "group-pressed:text-white")}
				variant="h5"
			>
				{title}
			</Typography>
			{label !== undefined && (
				<Typography
					className={cn("text-gray-900 font-body", "group-pressed:text-white")}
					variant="caption"
				>
					{t(`status.${label}`)}
				</Typography>
			)}
		</NavLink>
	);
}
