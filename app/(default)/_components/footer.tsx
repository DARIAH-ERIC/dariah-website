import cn from "clsx/lite";
import { getTranslations } from "next-intl/server";
import type { ComponentProps, ReactNode } from "react";

import { NavLink } from "@/app/(default)/_components/nav-link";
import { Image } from "@/components/image";
import { client } from "@/lib/data/client";
import { getMetadata } from "@/lib/i18n/metadata";
import { config as socialMediaConfig } from "@/lib/social-media/social-media.config";
import logo from "@/public/assets/images/logo-dariah-eu.svg";

interface FooterProps extends ComponentProps<"footer"> {}

export async function Footer(props: Readonly<FooterProps>): Promise<ReactNode> {
	const { className, ...rest } = props;

	const t = await getTranslations("(default).Footer");
	const meta = await getMetadata();

	const { secondary: navigation } = await client.navigation();

	return (
		<footer {...rest} className={cn("border-t border-stroke-weak", className)}>
			<div className="container flex flex-col gap-y-6 px-8 py-12 xs:px-16">
				<div className="flex flex-col gap-y-8 xs:flex-row xs:items-center xs:justify-between">
					<NavLink className="mr-auto -ml-1" href={navigation.home.href} size="icon">
						<span className="sr-only">{navigation.home.label}</span>
						<Image
							alt=""
							className="h-8 w-auto"
							decoding="auto"
							fetchPriority="high"
							loading="eager"
							preload={true}
							src={logo}
						/>
					</NavLink>

					<nav aria-label={t("navigation-social-media.label")}>
						<ul className="flex flex-wrap items-center gap-x-4 gap-y-2" role="list">
							{Object.entries(meta.social).map(([_kind, href]) => {
								const kind = _kind as keyof typeof meta.social;

								if (href == null || kind === "email" || kind === "website") {
									return null;
								}

								const label = t(`navigation-social-media.items.${kind}`);
								const Icon = socialMediaConfig[kind].icon;

								return (
									<li key={kind} className="inline-flex shrink-0">
										<NavLink className="touch-target" href={href} size="icon">
											<span className="sr-only">{label}</span>
											<Icon aria-hidden={true} className="size-6" />
										</NavLink>
									</li>
								);
							})}
						</ul>
					</nav>
				</div>

				<div className="flex flex-col gap-y-6">
					<nav aria-label={t("navigation.label")}>
						<ul className="-mx-2.5 flex flex-wrap items-center gap-x-4 gap-y-2" role="list">
							{Object.entries(navigation).map(([id, link]) => {
								if (id === "home") {
									return null;
								}

								return (
									<li key={id}>
										<NavLink href={link.href} size="md">
											{link.label}
										</NavLink>
									</li>
								);
							})}
						</ul>
					</nav>

					<small className="text-xs text-text-weak">
						&copy; <CurrentYear />{" "}
						{meta.social.website != null ? (
							<NavLink href={meta.social.website} size="sm">
								{meta.creator}
							</NavLink>
						) : (
							meta.creator
						)}
					</small>
				</div>
			</div>
		</footer>
	);
}

function CurrentYear() {
	// "use cache";

	return new Date().getUTCFullYear();
}
