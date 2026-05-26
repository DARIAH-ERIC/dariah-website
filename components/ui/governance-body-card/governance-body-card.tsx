import { cn } from "@acdh-oeaw/style-variants";
import type { ElementType, ReactNode } from "react";

import { Button } from "@/components/ui/button/button";
import { GovernanceBodyTag } from "@/components/ui/governance-body-card/governance-body-tag";
import { UsersIcon } from "@/components/ui/icons/users";
import { NavLink } from "@/components/ui/link/nav-link";
import { Typography } from "@/components/ui/typography/typography";
import type { GovernanceVariants, RelationshipType } from "@/types/governance-body";
import {
	getColorsForGovernanceVariant,
	getNameAcronym,
} from "@/utils/organisation-and-governance.utils";

interface GovernanceBodyCardProps {
	variant: GovernanceVariants;
	name: string;
	description?: string;
	usersCount: number;
	href?: string;
	onClick?: () => void;
	relationships: Array<RelationshipType>;
}

export function GovernanceBodyCard(props: Readonly<GovernanceBodyCardProps>): ReactNode {
	const { variant, name, description, usersCount, href, onClick, relationships } = props;
	const { bg, border, borderFocus, text } = getColorsForGovernanceVariant(variant);

	const Component: ElementType = href !== undefined ? NavLink : Button;

	return (
		<Component
			className={cn(
				"group cursor-pointer border flex flex-col rounded-xs p-0! min-h-41.25 w-full [&_span]:gap-0 [&_span]:flex-col",
				bg,
				border,
				"focus:outline-none",
			)}
			href={href}
			onClick={onClick}
			scroll={false}
			variant="unstyled"
		>
			<div className="w-full py-1">
				{variant !== "working-groups" && (
					<Typography
						className="font-heading font-bold text-white py-1 px-4 text-left"
						variant="caption"
					>
						{variant.replaceAll("-", " ").toUpperCase()}
					</Typography>
				)}
			</div>
			<div
				className={cn(
					"bg-white border-4 border-t-0 border-transparent p-3 flex flex-col gap-2 size-full flex-1 justify-between",
					"group-hover:bg-governance-body-card-hover-bg",
					borderFocus,
					"group-focus:bg-governance-body-card-focus-bg",
					"group-pressed:bg-governance-body-card-active-bg group-pressed:border-transparent",
				)}
			>
				<div className={cn("border-l-4 px-4 flex flex-col gap-1", border)}>
					<div className="flex flex-wrap gap-x-2 justify-between items-center">
						<div className="flex gap-2">
							<Typography className={text}>{getNameAcronym(name)}</Typography>
							<Typography>{name}</Typography>
						</div>
						<div className="flex gap-2 py-2 items-center">
							<UsersIcon className="size-5 fill-primary" />
							<Typography>{usersCount}</Typography>
						</div>
					</div>
					<Typography className="text-gray-800" variant="small">
						{description}
					</Typography>
				</div>
				<div className="flex flex-wrap gap-x-6 gap-y-2">
					{relationships.map((relationship) => {
						return <GovernanceBodyTag key={relationship} relationship={relationship} />;
					})}
				</div>
			</div>
		</Component>
	);
}
