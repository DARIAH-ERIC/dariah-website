import { clsx as cn } from "clsx";
import { ExternalLinkIcon, SearchIcon } from "lucide-react";
import { getExtracted as getTranslations } from "next-intl/server";
import { Fragment, type ReactNode } from "react";

import { MobileNavigation } from "#/app/(app)/(default)/_components/mobile-navigation.tsx";
import logo from "#/assets/images/logo-dariah-eu.svg";
import { Image } from "#/components/image.tsx";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuTrigger,
} from "#/components/ui/navigation-menu.tsx";
import type { NavigationMenu as NavigationMenuData } from "#/lib/api/schemas.ts";
import { getNavigationMenu } from "#/lib/data/navigation.ts";
import { href, unsafeHref } from "#/lib/navigation/href.ts";
import { NavigationLink } from "#/lib/navigation/navigation-link.tsx";

interface NavigationMenuItemsProps {
	items: NavigationMenuData["items"];
}

/** An item is either a submenu disclosing its children, or a link. */
function NavigationMenuItems(props: Readonly<NavigationMenuItemsProps>): ReactNode {
	const { items } = props;

	const linkClassName =
		"block px-5 py-1 font-heading text-body [--focus-outline-offset:-3px] hover:bg-background-accent focus-visible:bg-background-accent aria-[current=page]:text-text-accent";
	/**
	 * Top-level items only - submenu links are styled on their own, so none of this is set on the `<nav>` for them to
	 * inherit.
	 *
	 * The trigger already sets its own display, so only links, which are inline by default, are made block. The hover
	 * border is always there but transparent, and replaces part of the bottom padding, so showing it neither shifts nor
	 * grows the item. A trigger also keeps it while its submenu is open. The focus outline is drawn inside the item, over
	 * the border, which is hidden meanwhile: at fractional zoom levels the two are snapped to device pixels differently,
	 * and a sliver of border would otherwise show below the outline. Important, since `aria-expanded:` sorts after
	 * `focus-visible:`.
	 */
	const itemClassName =
		"border-be-2 border-transparent px-3 pbs-2.75 pbe-1.75 font-heading text-body leading-6 font-medium [--focus-outline-offset:-3px] hover:border-stroke-accent aria-expanded:border-stroke-accent focus-visible:border-transparent! aria-[current=page]:text-text-accent";
	const itemLinkClassName = cn("block", itemClassName);

	return items.map((item) => (
		<NavigationMenuItem key={item.id}>
			{item.kind === "submenu" ? (
				<Fragment>
					<NavigationMenuTrigger className={itemClassName}>{item.label}</NavigationMenuTrigger>
					<NavigationMenuContent>
						{item.children.map((child) => (
							<NavigationMenuItem key={child.id}>
								<NavigationMenuLink className={linkClassName} href={unsafeHref(child.href, child.isExternal)}>
									{child.label}
									{child.isExternal ? (
										<ExternalLinkIcon
											aria-hidden={true}
											className="ms-2 inline size-4 align-[calc(-1rem/12)] text-icon-accent"
										/>
									) : null}
								</NavigationMenuLink>
							</NavigationMenuItem>
						))}
					</NavigationMenuContent>
				</Fragment>
			) : (
				<NavigationMenuLink className={itemLinkClassName} href={unsafeHref(item.href, item.isExternal)}>
					{item.label}
					{item.isExternal ? (
						<ExternalLinkIcon
							aria-hidden={true}
							className="ms-2 inline size-4 align-[calc(-1rem/12)] text-icon-accent"
						/>
					) : null}
				</NavigationMenuLink>
			)}
		</NavigationMenuItem>
	));
}

/**
 * Async server component in the root layout: its cached data is fetched during prerender and becomes part of the app
 * shell shared by every route, so it is never re-fetched per page.
 *
 * The main navigation is rendered twice, as the desktop bar and as the mobile menu dialog's accordion, and css decides
 * which one shows. Only one is ever in the accessibility tree: the bar is `display: none` below `xl`, and the dialog's
 * content is not mounted until it is opened. The search link sits at the end of the bar from `xl` up; below that the
 * dialog holds its own copy.
 */
export async function Header(): Promise<ReactNode> {
	const t = await getTranslations();
	const menu = await getNavigationMenu("primary");

	const items = menu?.items ?? [];

	/**
	 * The logo's own `m-4` completes the inset, so it lines up with the page sections' `px-container`. It is a little
	 * smaller on phones, as in the mobile design. Up to `2xl`, the menu is centered between the logo and the search link,
	 * with tighter gaps between its items so it fits on one line at `xl`; from `2xl`, it moves next to the search link.
	 */
	return (
		<header className="flex items-center gap-8 border-be border-stroke-weak px-[calc(var(--spacing-container)-1rem)] py-3">
			<NavigationLink
				className="m-4 flex shrink-0 [--focus-outline-offset:6px] focus-visible-outline"
				href={href({ pathname: "/" })}
			>
				{/**
				 * Eager rather than preloaded: the mark is above the fold, so it should not wait for a lazy-loading heuristic - but it
				 * is never the largest contentful paint on any page, and a `<link rel="preload">` for it would compete in the head with
				 * the image which is.
				 */}
				<Image alt={t("DARIAH-EU Home")} className="block-9.5 inline-auto md:block-12" loading="eager" src={logo} />
			</NavigationLink>
			<NavigationMenu className="max-xl:hidden xl:mx-auto xl:max-2xl:*:gap-x-3 2xl:me-0" label={t("Main")}>
				<NavigationMenuItems items={items} />
			</NavigationMenu>
			<NavigationLink
				aria-label={t("Search")}
				className="flex shrink-0 touch-area bg-background-subtle p-3 [--focus-outline-offset:-3px] hover:bg-background-accent hover:text-icon-accent focus-visible:bg-background-accent focus-visible:text-icon-accent max-xl:hidden 2xl:ms-16 focus-visible-outline"
				href={href({ pathname: "/search" })}
			>
				<SearchIcon aria-hidden={true} className="size-5" />
			</NavigationLink>
			<MobileNavigation className="ms-auto xl:hidden" items={items} />
		</header>
	);
}
