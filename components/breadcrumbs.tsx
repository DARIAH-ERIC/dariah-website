import { getExtracted as getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { SkeletonText } from "#/components/ui/skeleton.tsx";
import { getNavigationMenu } from "#/lib/data/navigation.ts";
import { type Href, href, serializeHref } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";

interface BreadcrumbsProps {
	/** The current page, as its `href` - looked up in the primary menu to find the section it belongs to. */
	current: Href;
	/**
	 * The current page's label, as the trail's last entry. `null` while the page loads, e.g. in a detail page's skeleton,
	 * whose trail up to its `parent` is known before the page is: a placeholder stands in for the label.
	 */
	label: string | null;
	/**
	 * The page which lists the current one, for a page the menu does not list itself, like a case study under the case
	 * study list. The trail is read from the parent's place in the menu instead, and links to it, with its menu label.
	 */
	parent?: Href;
}

/**
 * Where the current page sits: home, the primary menu section which lists it, and the page itself.
 *
 * The trail is read from the primary menu rather than from the url, so it names sections as the header does. A menu
 * section is a dropdown with no page of its own, so it is named but not linked - nor coloured as a link; a page the
 * menu does not list gets only the home link, unless it names a `parent` the menu does list, in a section or at its top
 * level.
 */
export async function Breadcrumbs(props: Readonly<BreadcrumbsProps>): Promise<ReactNode> {
	const { current, label, parent } = props;

	const t = await getTranslations();
	const menu = await getNavigationMenu("primary");

	const pathname = serializeHref(parent ?? current);
	const section = menu?.items.find(
		(item) => item.kind === "submenu" && item.children.some((child) => !child.isExternal && child.href === pathname),
	);
	/** A parent is found in its section, or - like the projects list - as a top-level menu entry of its own. */
	const parentItem =
		parent == null
			? undefined
			: section?.kind === "submenu"
				? section.children.find((child) => !child.isExternal && child.href === pathname)
				: menu?.items.find((item) => item.kind === "link" && !item.isExternal && item.href === pathname);

	return (
		<nav aria-label={t("Breadcrumbs")}>
			<ol className="flex flex-wrap items-baseline gap-x-2 text-caption uppercase" role="list">
				<li className="flex items-baseline gap-x-2">
					<Link className="text-text-accent hover:underline focus-visible-outline" href={href({ pathname: "/" })}>
						{t("Home")}
					</Link>
					<Separator />
				</li>
				{section != null ? (
					<li className="flex items-baseline gap-x-2">
						<span>{section.label}</span>
						<Separator />
					</li>
				) : null}
				{parent != null && parentItem != null ? (
					<li className="flex items-baseline gap-x-2">
						<Link className="text-text-accent hover:underline focus-visible-outline" href={parent}>
							{parentItem.label}
						</Link>
						<Separator />
					</li>
				) : null}
				<li>
					{label != null ? (
						<span aria-current="page" className="text-text-strong">
							{label}
						</span>
					) : (
						<SkeletonText className="inline-40" />
					)}
				</li>
			</ol>
		</nav>
	);
}

function Separator(): ReactNode {
	return <span aria-hidden={true}>/</span>;
}
