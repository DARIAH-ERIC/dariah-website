import cn from "clsx/lite";
import { FolderIcon } from "lucide-react";
import { useFormatter, useExtracted as useTranslations } from "next-intl";
import { getExtracted as getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import logo from "#/assets/images/logo-dariah-eu-white.svg";
import { ApiImage } from "#/components/api-image.tsx";
import { Image } from "#/components/image.tsx";
import type { DariahProjectBase } from "#/lib/api/schemas.ts";
import { type DariahProjectStatus, getDariahProjects } from "#/lib/data/dariah-projects.ts";
import { href } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";

interface ProjectListProps {
	status: DariahProjectStatus;
}

/** The projects with one status, below the status tabs - see `app/(app)/(default)/projects/(list)/layout.tsx`. */
export async function ProjectList(props: Readonly<ProjectListProps>): Promise<ReactNode> {
	const { status } = props;

	const t = await getTranslations();
	const projects = await getDariahProjects(status);

	return (
		<section className="bg-background-subtle px-main pbs-11 pbe-24">
			<h2 className="sr-only">{status === "active" ? t("Active Projects") : t("Past Projects")}</h2>
			{/** As many columns as fit, up to four. The impact case studies and spotlight pages keep up to three. */}
			<ul
				className="grid grid-cols-[repeat(auto-fill,minmax(max(min(18rem,100%),(100%_-_3.75rem)/4),1fr))] gap-x-5 gap-y-8"
				role="list"
			>
				{projects.map((project) => (
					<li key={project.id} className="flex shadow-card">
						<ProjectCard project={project} />
					</li>
				))}
			</ul>
		</section>
	);
}

/**
 * A card image's width, close enough: four columns from about 85rem, three from 60rem, two once two 18rem tracks fit
 * beside the page's padding, at about 41rem, and before that the column, the viewport less 1.5rem a side.
 */
const cardImageSizes = "(min-width: 85rem) 22vw, (min-width: 60rem) 30vw, (min-width: 41rem) 45vw, calc(100vw - 3rem)";

interface ProjectCardProps {
	project: DariahProjectBase;
}

/**
 * A coordinator's role tag is tinted blue, so the projects DARIAH leads stand out; the others are grey.
 *
 * The image is usually the project's logo, so it is shown whole, on white, rather than cropped. A project without one
 * gets the same placeholder as a person without a portrait: the white DARIAH logo on grey, as wide relative to the
 * box's height as on the square portrait, so it is not blown up to the card's width. The title's link stretches over
 * the whole card, so its focus outline is drawn on the card's box.
 */
function ProjectCard(props: Readonly<ProjectCardProps>): ReactNode {
	const { project } = props;

	const t = useTranslations();
	const format = useFormatter();

	function getRoleLabel(role: NonNullable<DariahProjectBase["role"]>): string {
		switch (role) {
			case "coordinator": {
				return t("Coordinator");
			}
			case "funder": {
				return t("Funder");
			}
			case "participant": {
				return t("Participant");
			}
			case "affiliated": {
				return t("Affiliated");
			}
		}
	}

	function getDuration({ start, end }: DariahProjectBase["duration"]): string {
		const options = { dateStyle: "long", timeZone: "UTC" } as const;

		return end == null
			? t("Duration: from {date}", { date: format.dateTime(new Date(start), options) })
			: t("Duration: {range}", { range: format.dateTimeRange(new Date(start), new Date(end), options) });
	}

	return (
		<article className="group relative flex inline-full flex-col shadow-card-edge hover:bg-background-card-hover">
			<div className="relative aspect-3/2 border-be border-stroke-weak bg-background-base">
				{project.image != null ? (
					<ApiImage alt="" className="object-contain" fill={true} image={project.image} sizes={cardImageSizes} />
				) : (
					<div className="grid size-full place-items-center bg-background-placeholder">
						<Image alt="" className="block-auto inline-[57%]" src={logo} />
					</div>
				)}
			</div>
			<div className="flex flex-col gap-y-3 px-4 pbs-5 pbe-8">
				<div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
					<p className="flex items-center gap-x-3">
						<FolderIcon aria-hidden={true} className="size-4 shrink-0 fill-current text-icon-accent" />
						<span className="text-small font-bold text-text-accent uppercase">{t("Project")}</span>
					</p>
					{project.role != null ? (
						<p
							className={cn(
								"rounded-sm px-2 pbs-0.5 pbe-0.5 text-caption",
								project.role === "coordinator" ? "bg-background-accent" : "bg-background-tag",
							)}
						>
							{getRoleLabel(project.role)}
						</p>
					) : null}
				</div>
				{/** The title is underlined by a short rule, as the design does, drawn by the heading itself. */}
				<h3 className="font-heading text-title-3 leading-heading group-hover:text-text-accent after:mbs-4 after:block after:block-px after:inline-29 after:bg-stroke-weak">
					<Link
						className="underline-offset-4 outline-none group-hover:underline after:absolute after:inset-0 focus-visible:after:outline-3 focus-visible:after:outline-offset-4 focus-visible:after:outline-focus-outline focus-visible:after:outline-solid"
						href={href({ pathname: "/projects/[slug]", params: { slug: project.entity.slug } })}
						prefetch="intent"
					>
						{project.acronym ?? project.name}
					</Link>
				</h3>
				<p className="text-caption text-text-weak">{getDuration(project.duration)}</p>
			</div>
		</article>
	);
}
