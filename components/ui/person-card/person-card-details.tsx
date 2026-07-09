import type { JSONContent } from "@tiptap/core";
import { useTranslations } from "next-intl";
import { Fragment, type ReactNode } from "react";

import { Image } from "@/components/image";
import { RichText } from "@/components/rich-text";
import { EmailIcon } from "@/components/ui/icons/email";
import { Link } from "@/components/ui/link/link";
import { Typography } from "@/components/ui/typography/typography";
import type { Person } from "@/lib/data/api-client";
import { sortUserPosition } from "@/utils/person-card.utils";

interface PersonCardDetailsProps {
	imageUrl?: string | null;
	name: string;
	email?: string;
	position: Person["position"];
	description: JSONContent | undefined;
}

export function PersonCardDetails(props: Readonly<PersonCardDetailsProps>): ReactNode {
	const { imageUrl, name, email, position, description } = props;
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
					if (description !== null)
						return (
							<Fragment key={`${role}_${name}_${type}`}>
								{description}
								{index < sortedPosition.length - 1 && ", "}
							</Fragment>
						);

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
		<div className="flex gap-4">
			<Image
				alt={name}
				className="size-43 object-cover"
				height={172}
				src={displayedImage}
				width={172}
			/>
			<div className="flex flex-col gap-2 px-4">
				<Typography variant="h5">{name}</Typography>
				<Typography className="capitalize" variant="regular">
					{positionNames}
				</Typography>
				{email !== undefined && (
					<Link
						href={`mailto:${email}`}
						startIcon={<EmailIcon className="size-4 stroke-primary fill-transparent!" />}
						variant="tertiary"
					>
						{t("sendMail")}
					</Link>
				)}
				{description !== undefined && (
					<div className="[&_p:first-child]:mt-0!">
						<RichText content={description.content as JSONContent} />
					</div>
				)}
			</div>
		</div>
	);
}
