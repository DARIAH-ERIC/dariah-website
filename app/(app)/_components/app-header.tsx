import { cn } from "@acdh-oeaw/style-variants";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { AppNavigation, AppNavigationMobile } from "@/app/(app)/_components/app-navigation";
import { NavLink } from "@/components/nav-link";
import { createHref } from "@/lib/create-href";
import { defaultLocale } from "@/lib/i18n/locales";
import { createSingletonResource } from "@/lib/keystatic/resources";

export async function AppHeader(): Promise<ReactNode> {
	const t = await getTranslations("AppHeader");
	const label = t("navigation-primary");

	const navigation = await createSingletonResource("navigation", defaultLocale).read();
	const { links } = navigation.data;
	const home = {
		type: "link",
		href: createHref({ pathname: "/" }),
		label: t("links.home"),
	} as const;

	const search = {
		type: "link",
		href: createHref({ pathname: `/search` }),
		label: t("links.search"),
	} as const;

	return (
		<header className="border-neutral-200 bg-fill-weaker border-b">
			<div className="flex justify-between gap-x-12 px-6">
				<AppNavigation home={home} label={label} navigation={links} />
				<AppNavigationMobile
					home={home}
					label={label}
					menuCloseLabel={t("navigation-menu-close")}
					menuOpenLabel={t("navigation-menu-open")}
					menuTitleLabel={t("navigation-menu")}
					navigation={links}
				/>

				<div className="flex items-center gap-x-6">
					<NavLink
						className={cn(
							"text-neutral-900 inline-flex px-4 py-6",
							"interactive focus-visible:focus-outline hover:hover-overlay pressed:press-overlay",
							"aria-[current]:select-overlay aria-[current]:select-overlay-border-bottom",
						)}
						href={search.href}
					>
						{search.label}
					</NavLink>
				</div>
			</div>
		</header>
	);
}
