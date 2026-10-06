import { UsersIcon } from "lucide-react";
import { useExtracted as useTranslations } from "next-intl";
import { getExtracted as getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { ApiImage } from "#/components/api-image.tsx";
import type { WorkingGroupBase } from "#/lib/api/schemas.ts";
import { type WorkingGroupStatus, getWorkingGroups } from "#/lib/data/working-groups.ts";
import { href } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";

interface WorkingGroupListProps {
	status: WorkingGroupStatus;
}

/**
 * The working groups with one status, below the status tabs - see
 * `app/(app)/(default)/network/working-groups/(list)/layout.tsx`.
 */
export async function WorkingGroupList(props: Readonly<WorkingGroupListProps>): Promise<ReactNode> {
	const { status } = props;

	const t = await getTranslations();
	const workingGroups = await getWorkingGroups(status);

	return (
		<section className="bg-background-subtle px-main pbs-11 pbe-24">
			<h2 className="sr-only">{status === "active" ? t("Active Working Groups") : t("Past Working Groups")}</h2>
			{/** The same grid as the projects page: as many columns as fit, up to four. */}
			<ul
				className="grid grid-cols-[repeat(auto-fill,minmax(max(min(18rem,100%),(100%_-_3.75rem)/4),1fr))] gap-x-5 gap-y-8"
				role="list"
			>
				{workingGroups.map((workingGroup) => (
					<li key={workingGroup.id} className="flex shadow-card">
						<WorkingGroupCard workingGroup={workingGroup} />
					</li>
				))}
			</ul>
		</section>
	);
}

/** A card image's width, close enough - see the projects page, whose grid this is. */
const cardImageSizes = "(min-width: 85rem) 22vw, (min-width: 60rem) 30vw, (min-width: 41rem) 45vw, calc(100vw - 3rem)";

interface WorkingGroupCardProps {
	workingGroup: WorkingGroupBase;
}

/**
 * A project card (see `app/(app)/(default)/projects/_components/project-list.tsx`) without the duration or the role,
 * which a working group does not have: the image is usually the group's logo, so it is shown whole, on white, and the
 * title's link stretches over the whole card. The title is the group's full name, with its acronym, which alone says
 * little about the group.
 */
function WorkingGroupCard(props: Readonly<WorkingGroupCardProps>): ReactNode {
	const { workingGroup } = props;

	const t = useTranslations();

	return (
		<article className="group relative flex inline-full flex-col shadow-card-edge hover:bg-background-card-hover">
			<div className="relative aspect-3/2 border-be border-stroke-weak bg-background-base">
				{workingGroup.image != null ? (
					<ApiImage alt="" className="object-contain" fill={true} image={workingGroup.image} sizes={cardImageSizes} />
				) : null}
			</div>
			<div className="flex flex-col gap-y-3 px-4 pbs-5 pbe-8">
				<p className="flex items-center gap-x-3">
					<UsersIcon aria-hidden={true} className="size-4 shrink-0 fill-current text-icon-accent" />
					<span className="text-small font-bold text-text-accent uppercase">{t("Working group")}</span>
				</p>
				{/** Unlike a project card's title, this one has no short rule under it: nothing follows it. */}
				<h3 className="font-heading text-title-5 leading-heading group-hover:text-text-accent">
					<Link
						className="underline-offset-4 outline-none group-hover:underline after:absolute after:inset-0 focus-visible:after:outline-3 focus-visible:after:outline-offset-4 focus-visible:after:outline-focus-outline focus-visible:after:outline-solid"
						href={href({ pathname: "/network/working-groups/[slug]", params: { slug: workingGroup.entity.slug } })}
						prefetch="intent"
					>
						{workingGroup.acronym != null ? `${workingGroup.name} (${workingGroup.acronym})` : workingGroup.name}
					</Link>
				</h3>
			</div>
		</article>
	);
}
