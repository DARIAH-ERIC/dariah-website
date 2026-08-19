import type { JSONContent } from "@tiptap/core";
import { useTranslations } from "next-intl";
import type { ReactNode, Ref } from "react";

import { ApiImage, Image } from "@/components/image";
import { RichText } from "@/components/rich-text";
import { EmailIcon } from "@/components/ui/icons/email";
import { Link } from "@/components/ui/link/link";
import { PersonPositions } from "@/components/ui/person-card/person-positions";
import { Typography } from "@/components/ui/typography/typography";
import type { Person } from "@/lib/data/api-client";
import type { ImageAsset } from "@/lib/images/variants";
import personPlaceholder from "@/public/assets/images/person-placeholder.svg";

interface PersonCardDetailsProps {
	image?: ImageAsset | null;
	name: string;
	email?: string;
	position: Person["positions"];
	description: JSONContent | undefined;
	tabIndex?: number;
	ref?: Ref<HTMLHeadingElement>;
}

export function PersonCardDetails(props: Readonly<PersonCardDetailsProps>): ReactNode {
	const { image, name, email, position, description, tabIndex, ref } = props;
	const t = useTranslations("(default).PersonCard");

	return (
		<div className="flex flex-col gap-4 xl:flex-row">
			{image != null ? (
				<ApiImage
					className="size-43 object-cover"
					height={172}
					image={image}
					sizes="172px"
					width={172}
				/>
			) : (
				<Image
					alt=""
					className="size-43 object-cover"
					height={172}
					src={personPlaceholder}
					width={172}
				/>
			)}
			<div className="flex flex-col gap-2 px-4">
				<Typography ref={ref} tabIndex={tabIndex} variant="h5">
					{name}
				</Typography>
				<Typography variant="regular">
					<PersonPositions position={position} />
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
