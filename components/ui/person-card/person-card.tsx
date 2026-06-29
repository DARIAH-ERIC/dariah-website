import { cn } from "@acdh-oeaw/style-variants";
import { useTranslations } from "next-intl";
import { Fragment, type ReactNode } from "react";

import { Image } from "@/components/image";
import { ChevronForwardIcon } from "@/components/ui/icons/chevron-forward";
import { NavLink } from "@/components/ui/link/nav-link";
import { Typography } from "@/components/ui/typography/typography";
import type { Person } from "@/lib/data/api-client";
import { sortUserPosition } from "@/utils/person-card.utils";

interface PersonCardProps {
	href?: string;
	imageUrl?: string | null;
	name: string;
	position: Person["position"];
}

export function PersonCard(props: Readonly<PersonCardProps>): ReactNode {
	const { href, imageUrl, name, position } = props;
	const t = useTranslations("(default).PersonCard");

	const displayedImage = imageUrl ?? "/assets/images/person-placeholder.svg";

	const sortedPosition = sortUserPosition(position);

	const positionNames: Array<ReactNode> = sortedPosition
		? sortedPosition.map((positionObj, index) => {
				const { role, name, description, type } = positionObj;

				if (role === "is_chair_of" && name.toLowerCase() === "board of directors")
					return (
						<Fragment key={`${role}_${name}_${type}`}>
							{t("roles.is_president")}
							{index < sortedPosition.length - 1 && ", "}
						</Fragment>
					);
				if (role === "is_member_of" && name.toLowerCase() === "board of directors")
					return (
						<Fragment key={`${role}_${name}_${type}`}>
							{t("roles.is_director")}
							{index < sortedPosition.length - 1 && ", "}
						</Fragment>
					);

				if (role === "is_chair_of" && type === "working_group")
					return (
						<Fragment key={`${role}_${name}_${type}`}>
							{t("roles.is_chair_of_wg", {
								name,
							})}
							{index < sortedPosition.length - 1 && ", "}
						</Fragment>
					);
				if (role === "is_vice_chair_of" && type === "working_group")
					return (
						<Fragment key={`${role}_${name}_${type}`}>
							{t("roles.is_vice_chair_of_wg", {
								name,
							})}
							{index < sortedPosition.length - 1 && ", "}
						</Fragment>
					);

				if (role === "is_member_of" && name.toLowerCase() === "dariah coordination office") {
					if (description !== null) return description;

					return (
						<Fragment key={`${role}_${name}_${type}`}>
							{t.rich(`roles.capitalized_${role}`, {
								name,
								capitalizedSpan(chunks) {
									return <span className="capitalize">{chunks}</span>;
								},
							})}
							{index < sortedPosition.length - 1 && ", "}
						</Fragment>
					);
				}

				if ((role === "is_chair_of" || role === "is_vice_chair_of") && type === "governance_body")
					return (
						<Fragment key={`${role}_${name}_${type}`}>
							{t.rich(`roles.capitalized_${role}`, {
								name,
								capitalizedSpan(chunks) {
									return <span className="capitalize">{chunks}</span>;
								},
							})}
							{index < sortedPosition.length - 1 && ", "}
						</Fragment>
					);

				return (
					<Fragment key={`${role}_${name}_${type}`}>
						{t(`roles.${role}`, {
							name,
						})}
						{index < sortedPosition.length - 1 && ", "}
					</Fragment>
				);
			})
		: [];

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
					{positionNames}
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
