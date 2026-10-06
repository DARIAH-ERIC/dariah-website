import cn from "clsx/lite";
import { ExternalLinkIcon, PentagonIcon } from "lucide-react";
import { useExtracted as useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { unsafeHref } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";
import type { ResourceDocument, ResourceType } from "#/lib/search/index.ts";

/**
 * Sets `--resource-color`, which a resource's type badge (and a result card's stripe) is drawn in, and
 * `--resource-border-color`, a result card's border.
 */
export const resourceColors: Record<ResourceType, string> = {
	publication:
		"[--resource-border-color:var(--color-resource-publication-border)] [--resource-color:var(--color-resource-publication)]",
	service:
		"[--resource-border-color:var(--color-resource-service-border)] [--resource-color:var(--color-resource-service)]",
	software:
		"[--resource-border-color:var(--color-resource-software-border)] [--resource-color:var(--color-resource-software)]",
	"training-material":
		"[--resource-border-color:var(--color-resource-training-material-border)] [--resource-color:var(--color-resource-training-material)]",
	workflow:
		"[--resource-border-color:var(--color-resource-workflow-border)] [--resource-color:var(--color-resource-workflow)]",
};

export function useResourceTypeLabels(): Record<ResourceType, string> {
	const t = useTranslations();

	return {
		publication: t("Publication"),
		service: t("Service"),
		software: t("Software"),
		"training-material": t("Training material"),
		workflow: t("Workflow"),
	};
}

/** A resource's type, in capitals on its type's colour. */
export function ResourceTypeBadge(props: Readonly<{ type: ResourceType }>): ReactNode {
	const { type } = props;

	const typeLabels = useResourceTypeLabels();

	return (
		<p
			className={cn(
				"rounded-sm bg-(--resource-color) px-2.5 py-1 text-badge text-text-inverse uppercase",
				resourceColors[type],
			)}
		>
			{typeLabels[type]}
		</p>
	);
}

/** Marks a core service, with its icon, in the service type's colour. Community services are not marked. */
export function CoreServiceLabel(): ReactNode {
	const t = useTranslations();

	return (
		<p
			className={cn(
				"flex items-center gap-x-2 text-caption font-medium text-(--resource-color)",
				resourceColors.service,
			)}
		>
			<PentagonIcon aria-hidden={true} className="size-5 shrink-0" />
			{t("Core service")}
		</p>
	);
}

/**
 * A button-like link to where a resource lives upstream, or nothing for a resource without one. Every card has one, so
 * each is named for its resource for a screen reader's list of links.
 *
 * Styled like the landing page hero's "Get involved" link, but with an accent border and the default focus outline, as
 * it sits on a light background rather than a photo. The label is its own flex item, so its cap trim applies.
 *
 * `small` is for a grid of cards, where a full-size link on every one outweighs the titles it belongs to.
 */
export function ResourceLink(
	props: Readonly<{
		className?: string;
		document: Pick<ResourceDocument, "label" | "links" | "source_url">;
		size?: "default" | "small";
	}>,
): ReactNode {
	const { className, document, size = "default" } = props;

	const t = useTranslations();

	const link = document.links[0] ?? document.source_url;

	if (link == null) {
		return null;
	}

	return (
		<Link
			className={cn(
				"flex items-center justify-center gap-x-3 border-2 border-stroke-accent bg-background-accent-strong px-6 py-3 font-heading font-bold text-text-inverse focus-visible-outline hover:bg-background-base hover:text-text-accent",
				size === "small" ? "text-button-small min-block-12" : "min-block-15",
				className,
			)}
			href={unsafeHref(link, /^https?:\/\//.test(link))}
		>
			<span className="[text-box:trim-both_cap_alphabetic]">
				{t("Go to resource")}
				<span className="sr-only">: {document.label}</span>
			</span>
			<ExternalLinkIcon aria-hidden={true} className="size-5" />
		</Link>
	);
}
