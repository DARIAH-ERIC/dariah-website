import cn from "clsx/lite";
import { getTranslations } from "next-intl/server";
import type { ComponentProps, ReactNode } from "react";

import { NavLink } from "@/app/(default)/_components/nav-link";
import { Image } from "@/components/image";
import { Button } from "@/components/ui/button/button";
import { ChevronForwardIcon } from "@/components/ui/icons/chevron-forward";
import { EmailIcon } from "@/components/ui/icons/email";
import { Link } from "@/components/ui/link/link";
import { TextField } from "@/components/ui/text-field/text-field";
import { Typography } from "@/components/ui/typography/typography";
import { navigation } from "@/lib/data/client";
import { getMetadata } from "@/lib/i18n/metadata";
import { config as socialMediaConfig } from "@/lib/social-media/social-media.config";
import logoDariah from "@/public/assets/images/logo-dariah-eu.svg";
import logoEu from "@/public/assets/images/logo-eu.svg";

interface FooterProps extends ComponentProps<"footer"> {}

export async function Footer(props: Readonly<FooterProps>): Promise<ReactNode> {
	const { className, ...rest } = props;

	const t = await getTranslations("(default).Footer");
	const meta = await getMetadata();

	const { secondary } = navigation();

	return (
		<footer
			{...rest}
			className={cn("border-t border-stroke-weak shadow-footer z-10 bg-white", className)}
		>
			<div className={cn("px-6 py-14 flex flex-col gap-16", "lg:max-w-480 lg:mx-auto lg:relative")}>
				<NavLink
					className="lg:absolute lg:top-14.5 lg:left-17"
					href={secondary.home.href}
					size="icon"
				>
					<span className="sr-only">{secondary.home.label}</span>
					<Image alt="" className={cn("h-22 w-72.5", "lg:h-38.5 lg:w-107")} src={logoDariah} />
				</NavLink>

				<div
					className={cn(
						"flex flex-col gap-16",
						"xl:flex-row xl:gap-63.25 lg:pt-57.5 lg:px-35 lg:pb-35",
					)}
				>
					<div className="flex flex-col gap-y-10 lg:max-w-188.25">
						<p className="text-[25px] font-light font-heading tracking-[-1%] leading-[1.3]">
							{
								"DARIAH's mission is to empower research communities with digital methods to create, connect and share knowledge about culture and society."
							}
						</p>
						<nav
							aria-label={t("navigation.label")}
							className={cn("flex flex-col gap-10 justify-between", "lg:gap-0 lg:flex-row")}
						>
							<div className="flex flex-col items-start gap-x-4 gap-y-2 min-w-45.75">
								<Typography className="font-heading text-[18px]" variant="h4">
									{secondary.contact.label}
								</Typography>
								<p className="flex gap-2 text-primary">
									<EmailIcon className="stroke-primary fill-transparent" />
									{"info@dariah.pl"}
								</p>
								<ul className="flex flex-col items-start gap-x-4 gap-y-2 min-w-45.75" role="list">
									{Object.entries(secondary.contact.children).map(([id, link]) => {
										if (id === "home") {
											return null;
										}

										return (
											<li key={id}>
												<Link
													href={link.href}
													startIcon={<ChevronForwardIcon />}
													variant="secondary"
												>
													{link.label}
												</Link>
											</li>
										);
									})}
								</ul>
							</div>

							<div className="flex flex-col items-start gap-x-4 gap-y-2 min-w-45.75">
								<Typography className="font-heading text-[18px]" variant="h4">
									{secondary.privacy.label}
								</Typography>
								<ul className="flex flex-col items-start gap-x-4 gap-y-2 min-w-45.75" role="list">
									{Object.entries(secondary.privacy.children).map(([id, link]) => {
										if (id === "home") {
											return null;
										}

										return (
											<li key={id}>
												<Link
													href={link.href}
													startIcon={<ChevronForwardIcon />}
													variant="secondary"
												>
													{link.label}
												</Link>
											</li>
										);
									})}
								</ul>
							</div>

							<div className="flex flex-col items-start gap-x-4 gap-y-2 min-w-45.75">
								<Typography className="font-heading text-[18px]" variant="h4">
									{secondary["quick-menu"].label}
								</Typography>
								<ul className="flex flex-col items-start gap-x-4 gap-y-2 min-w-45.75" role="list">
									{Object.entries(secondary["quick-menu"].children).map(([id, link]) => {
										if (id === "home") {
											return null;
										}

										return (
											<li key={id}>
												<Link
													href={link.href}
													startIcon={<ChevronForwardIcon />}
													variant="secondary"
												>
													{link.label}
												</Link>
											</li>
										);
									})}
								</ul>
							</div>
						</nav>
					</div>
					<div className="flex flex-col gap-y-8 lg:max-w-154">
						<div className="flex flex-col gap-10">
							<Typography className="font-light" variant="h2">
								{t("navigation.newsletter.header")}
							</Typography>
							<div className="flex flex-col gap-8.5">
								<Typography variant="regular">
									{t("navigation.newsletter.description.part1")}
									<span className="font-bold">{t("navigation.newsletter.description.part2")}</span>
									{t("navigation.newsletter.description.part3")}
								</Typography>
								<div className="flex gap-0.5">
									<TextField
										className="flex-1"
										placeholder={t("navigation.newsletter.form.placeholder")}
									/>
									<Button variant="secondary-blue">{t("navigation.newsletter.form.button")}</Button>
								</div>
							</div>
						</div>
						<nav aria-label={t("navigation-social-media.label")} className="flex flex-col gap-4">
							<Typography className="font-light" variant="h2">
								{"Follow us"}
							</Typography>
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

				<div className={cn("py-6 px-0 flex gap-2.5 items-center", "lg:pt-3 lg:pb-13 lg:px-34.5")}>
					<Image alt="" className="w-13.75 h-9.25" src={logoEu} />
					{"Creative Commons Attribution (CC BY) licence"}
				</div>
			</div>
		</footer>
	);
}
