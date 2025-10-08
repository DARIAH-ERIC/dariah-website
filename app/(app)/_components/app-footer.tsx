import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { NavLink, type NavLinkProps } from "@/components/nav-link";
import { createHref } from "@/lib/create-href";

export function AppFooter(): ReactNode {
	const t = useTranslations("AppFooter");

	const links = {
		imprint: {
			href: createHref({ pathname: "/imprint" }),
			label: t("links.imprint"),
		},
	} satisfies Record<string, { href: NavLinkProps["href"]; label: string }>;

	const oeawLink: { href: string } = {
		href: "https://www.oeaw.ac.at/en/",
	};

	return (
		<footer className="layout-grid grid gap-y-6 border-t border-neutral-200 py-12">
			<div className="grid gap-y-8 xs:flex xs:justify-between">
				<div className="grid gap-y-4">
					<div>DARIAH EU</div>
				</div>
				<div>
					<div>{t("funded-by")}</div>
				</div>
			</div>

			<div className="grid gap-y-8">
				<nav aria-label={t("navigation-secondary")}>
					<ul className="flex items-center gap-x-6 text-small xs:justify-center" role="list">
						<li>
							&copy; {new Date().getUTCFullYear()}{" "}
							<a
								className="focus-visible:focus-outline rounded-0.5 hover:underline"
								href={oeawLink.href}
							>
								OEAW
							</a>
						</li>
						{Object.entries(links).map(([id, link]) => {
							return (
								<li key={id}>
									<NavLink
										className="focus-visible:focus-outline rounded-0.5 hover:underline"
										href={link.href}
									>
										{link.label}
									</NavLink>
								</li>
							);
						})}
					</ul>
				</nav>
			</div>
		</footer>
	);
}
