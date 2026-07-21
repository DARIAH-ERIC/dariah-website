import { cn } from "@acdh-oeaw/style-variants";
import { useTranslations } from "next-intl";
import { Fragment, type ReactNode } from "react";

import { Link, type LinkProps } from "@/components/ui/link/link";
import type { Person } from "@/lib/data/api-client";
import { sortUserPosition } from "@/utils/person-card.utils";

interface PersonPositionProps {
	position: Person["positions"];
}

export function PersonPositions(props: Readonly<PersonPositionProps>): ReactNode {
	const { position } = props;

	const t = useTranslations("(default).PersonPositions");

	const sortedPosition = sortUserPosition(position);

	if (sortedPosition == null) {
		return null;
	}

	return (
		<Fragment>
			{sortedPosition.map((positionObj, index) => {
				const { role, entity, description } = positionObj;
				const { label: name, type, href } = entity;

				if (role === "is_chair_of" && name.toLowerCase() === "board of directors")
					return (
						<Fragment key={`${role}_${name}_${type}`}>
							<PostitionLink href={href!}>{t("roles.is_president")}</PostitionLink>
							{index < sortedPosition.length - 1 && ", "}
						</Fragment>
					);
				if (role === "is_member_of" && name.toLowerCase() === "board of directors")
					return (
						<Fragment key={`${role}_${name}_${type}`}>
							<PostitionLink href={href!}>{t("roles.is_director")}</PostitionLink>
							{index < sortedPosition.length - 1 && ", "}
						</Fragment>
					);

				if (role === "is_chair_of" && type === "working_group")
					return (
						<Fragment key={`${role}_${name}_${type}`}>
							<PostitionLink href={href!}>{t("roles.is_chair_of_wg", { name })}</PostitionLink>
							{index < sortedPosition.length - 1 && ", "}
						</Fragment>
					);
				if (role === "is_vice_chair_of" && type === "working_group")
					return (
						<Fragment key={`${role}_${name}_${type}`}>
							<PostitionLink href={href!}>{t("roles.is_vice_chair_of_wg", { name })}</PostitionLink>
							{index < sortedPosition.length - 1 && ", "}
						</Fragment>
					);

				if (role === "is_member_of" && name.toLowerCase() === "dariah coordination office") {
					if (description !== null)
						return (
							<Fragment key={`${role}_${name}_${type}`}>
								<PostitionLink href={href!}>{description}</PostitionLink>
								{index < sortedPosition.length - 1 && ", "}
							</Fragment>
						);

					return (
						<Fragment key={`${role}_${name}_${type}`}>
							<PostitionLink href={href!}>
								{t.rich(`roles.capitalized_${role}`, {
									name,
									capitalizedSpan(chunks) {
										return <span className="capitalize">{chunks}</span>;
									},
								})}
							</PostitionLink>
							{index < sortedPosition.length - 1 && ", "}
						</Fragment>
					);
				}

				if ((role === "is_chair_of" || role === "is_vice_chair_of") && type === "governance_body")
					return (
						<Fragment key={`${role}_${name}_${type}`}>
							<PostitionLink href={href!}>
								{t.rich(`roles.capitalized_${role}`, {
									name,
									capitalizedSpan(chunks) {
										return <span className="capitalize">{chunks}</span>;
									},
								})}
							</PostitionLink>
							{index < sortedPosition.length - 1 && ", "}
						</Fragment>
					);

				if (
					[
						"national_coordination_staff",
						"national_coordinator",
						"national_coordinator_deputy",
						"national_representative",
						"national_representative_deputy",
					].includes(role)
				) {
					const label = t(`roles.${role}`, { name });

					return (
						<Fragment key={`${role}_${name}_${type}`}>
							{href != null ? <PostitionLink href={href}>{label}</PostitionLink> : label}
							{index < sortedPosition.length - 1 && ", "}
						</Fragment>
					);
				}

				return (
					<Fragment key={`${role}_${name}_${type}`}>
						{t(`roles.${role}`, { name })}
						{index < sortedPosition.length - 1 && ", "}
					</Fragment>
				);
			})}
		</Fragment>
	);
}

function PostitionLink(props: Readonly<LinkProps>): ReactNode {
	return <Link {...props} className={cn(props.className, "inline")} />;
}
