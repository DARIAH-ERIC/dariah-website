import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Image } from "@/components/image";
import { OpenInNewIcon } from "@/components/ui/icons/open-in-new";
import { Link } from "@/components/ui/link/link";
import { Typography } from "@/components/ui/typography/typography";
import { getTopicFromUrl, parseDateForProjectDuration } from "@/utils/project-page.utils";

interface Coordinator {
	id: string;
	acronym: string | null;
	name: string;
	socialMedia: Array<{
		url: string;
		type:
			| "bluesky"
			| "facebook"
			| "instagram"
			| "linkedin"
			| "mastodon"
			| "twitter"
			| "website"
			| "youtube"
			| "vimeo"
			| "other";
	}>;
	type:
		| "country"
		| "institution"
		| "governance_body"
		| "national_consortium"
		| "regional_hub"
		| "eric"
		| "working_group";
}

interface ProjectDetailsProps {
	name: string;
	image: {
		url: string;
	} | null;
	funding: number | null;
	topic: string | null;
	coordinators: Array<Coordinator>;
	start: Date;
	end: Date | undefined;
}

export async function ProjectDetails(props: Readonly<ProjectDetailsProps>): Promise<ReactNode> {
	const t = await getTranslations("ProjectsDetailPage");
	const { name, image, funding, topic, coordinators, start, end } = props;

	const durationStart = parseDateForProjectDuration(start);
	const durationEnd = end !== undefined ? parseDateForProjectDuration(end) : end;

	const topicName = topic !== null ? getTopicFromUrl(topic) : undefined;

	const coordinatorWebsite = coordinators[0]?.socialMedia.find((social) => {
		return social.type === "website";
	});

	return (
		<div className="flex gap-5 px-2 py-10 justify-between items-center">
			<div className="flex flex-col gap-2">
				<div className="flex gap-2">
					<Typography className="font-bold" variant="regular">
						{t("details.name")}
					</Typography>
					<Typography variant="regular">{name}</Typography>
				</div>
				<div className="flex gap-2">
					<Typography className="font-bold" variant="regular">
						{t("details.duration.description")}
					</Typography>
					<Typography variant="regular">
						{durationEnd === undefined
							? durationStart
							: t("details.duration.value", {
									startDate: durationStart,
									endDate: durationEnd,
								})}
					</Typography>
				</div>
				{funding !== null && (
					<div className="flex gap-2">
						<Typography className="font-bold" variant="regular">
							{t("details.funding.description")}
						</Typography>
						<Typography variant="regular">
							{t("details.funding.value", { value: funding.toString() })}
						</Typography>
					</div>
				)}
				{topicName !== undefined && topic !== null && (
					<div className="flex gap-2 items-center">
						<Typography className="font-bold" variant="regular">
							{t("details.topic")}
						</Typography>
						<Link
							className="uppercase"
							endIcon={<OpenInNewIcon className="size-5" />}
							href={topic}
							variant="paragraph"
						>
							{topicName}
						</Link>
					</div>
				)}
				<div className="flex gap-2 items-center">
					<Typography className="font-bold" variant="regular">
						{"Coordinator: "}
					</Typography>
					{coordinatorWebsite?.url !== undefined ? (
						<Link
							endIcon={<OpenInNewIcon className="size-5" />}
							href={coordinatorWebsite.url}
							variant="paragraph"
						>
							{coordinators[0]?.name}
						</Link>
					) : (
						<Typography variant="regular">{coordinators[0]?.name}</Typography>
					)}
				</div>
			</div>
			{image?.url !== undefined && (
				<Image
					alt={name}
					className="w-62.5 h-48 object-contain"
					height={192}
					src={image.url}
					width={250}
				/>
			)}
		</div>
	);
}
