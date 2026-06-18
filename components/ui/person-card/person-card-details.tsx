import type { JSONContent } from "@tiptap/core";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Image } from "@/components/image";
import { RichText } from "@/components/rich-text";
import { EmailIcon } from "@/components/ui/icons/email";
import { Link } from "@/components/ui/link/link";
import { Typography } from "@/components/ui/typography/typography";

interface PersonCardDetailsProps {
	imageUrl?: string | null;
	name: string;
	email?: string;
	position?: string;
	description: JSONContent | undefined;
}

export function PersonCardDetails(props: Readonly<PersonCardDetailsProps>): ReactNode {
	const { imageUrl, name, email, position, description } = props;
	const t = useTranslations("(default).PersonCard");

	const displayedImage = imageUrl ?? "/assets/images/person-placeholder.svg";

	return (
		<div className="flex gap-4">
			<Image alt={name} className="size-43" height={172} src={displayedImage} width={172} />
			<div className="flex flex-col gap-2 px-4">
				<Typography variant="h5">{name}</Typography>
				<Typography variant="regular">{position}</Typography>
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
