import cn from "clsx/lite";
import { getTranslations } from "next-intl/server";
import type { ComponentProps, ReactNode } from "react";

import { NavLink } from "@/app/(default)/_components/nav-link";
import { Image } from "@/components/image";
import { Button } from "@/components/ui/button/button";
import { EmailIcon } from "@/components/ui/icons/email";
import { Link } from "@/components/ui/link/link";
import { TextField } from "@/components/ui/text-field/text-field";
import { client } from "@/lib/data/client";
import { getMetadata } from "@/lib/i18n/metadata";
import { config as socialMediaConfig } from "@/lib/social-media/social-media.config";
import logoDariah from "@/public/assets/images/logo-dariah-eu.svg";
import logoEu from "@/public/assets/images/logo-eu.svg";

interface FooterProps extends ComponentProps<"footer"> {}

export async function Footer(props: Readonly<FooterProps>): Promise<ReactNode> {
	const { className, ...rest } = props;

	const t = await getTranslations("(default).Footer");
	const meta = await getMetadata();

	const { secondary: navigation } = await client.navigation();

	return (
		<footer {...rest} className={cn("border-t border-stroke-weak shadow-footer", className)}>
			<div className="max-w-480 mx-auto relative">
				<NavLink className="absolute top-14.5 left-17" href={navigation.home.href} size="icon">
					<span className="sr-only">{navigation.home.label}</span>
					<Image alt="" className="h-38.5 w-107" src={logoDariah} />
				</NavLink>

				<div className="flex gap-63.25 pt-57.5 px-35 pb-35">
					<div className="flex flex-col gap-y-10 max-w-188.25">
						<p className="text-[25px] font-light font-heading tracking-[-1%] leading-[1.3]">
							{
								"DARIAH's mission is to empower research communities with digital methods to create, connect and share knowledge about culture and society."
							}
						</p>
						<nav aria-label={t("navigation.label")} className="flex justify-between">
							<ul className="flex flex-col items-start gap-x-4 gap-y-2 min-w-45.75" role="list">
								<p className="text-h4 font-heading">{navigation.contact.label}</p>
								<p className="flex gap-2 text-primary">
									<EmailIcon className="stroke-primary fill-transparent" />
									{"info@dariah.pl"}
								</p>
								{Object.entries(navigation.contact.children).map(([id, link]) => {
									if (id === "home") {
										return null;
									}

									return (
										<li key={id}>
											<Link
												href={link.href}
												leftIconReversed={true}
												variant="secondary"
												withLeftIcon={true}
											>
												{link.label}
											</Link>
										</li>
									);
								})}
							</ul>

							<ul className="flex flex-col items-start gap-x-4 gap-y-2 min-w-45.75" role="list">
								<p className="text-h4 font-heading">{navigation.privacy.label}</p>
								{Object.entries(navigation.privacy.children).map(([id, link]) => {
									if (id === "home") {
										return null;
									}

									return (
										<li key={id}>
											<Link
												href={link.href}
												leftIconReversed={true}
												variant="secondary"
												withLeftIcon={true}
											>
												{link.label}
											</Link>
										</li>
									);
								})}
							</ul>

							<ul className="flex flex-col items-start gap-x-4 gap-y-2 min-w-45.75" role="list">
								<p className="text-h4 font-heading">{navigation["quick-menu"].label}</p>
								{Object.entries(navigation["quick-menu"].children).map(([id, link]) => {
									if (id === "home") {
										return null;
									}

									return (
										<li key={id}>
											<Link
												href={link.href}
												leftIconReversed={true}
												variant="secondary"
												withLeftIcon={true}
											>
												{link.label}
											</Link>
										</li>
									);
								})}
							</ul>
						</nav>
					</div>
					<div className="flex flex-col gap-y-8 max-w-154">
						<div className="flex flex-col gap-10">
							<h1 className="text-h1 font-light">{"Subscribe to our newsletter"}</h1>
							<div className="flex flex-col gap-8.5">
								<p className="text-regular">
									{"Get monthly updates on news, events, and resources from"}{" "}
									<span className="font-bold">{"DARIAH"}</span>{" "}
									{"and our community. Subscribing to it is the ideal way of staying informed!"}
								</p>
								<div className="flex gap-0.5">
									<TextField className="flex-1" placeholder="Email address" />
									<Button variant="secondary-blue">{"Subscribe"}</Button>
								</div>
							</div>
						</div>
						<nav aria-label={t("navigation-social-media.label")} className="flex flex-col gap-4">
							<h1 className="text-h1 font-light">{"Follow us"}</h1>
							<ul className="flex flex-wrap items-center gap-x-8 gap-y-2" role="list">
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
				</div>

				<div className="pt-3 pb-13 px-34.5 flex gap-2.5 items-center">
					<Image alt="" className="w-13.75 h-9.25" src={logoEu} />
					{"Creative Commons Attribution (CC BY) licence"}
				</div>
			</div>
		</footer>
	);
}
