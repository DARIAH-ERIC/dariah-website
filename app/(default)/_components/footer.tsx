import { assert } from "@acdh-oeaw/lib";
import cn from "clsx/lite";
import { getTranslations } from "next-intl/server";
import type { ComponentProps, ReactNode } from "react";

import { NavLink } from "@/app/(default)/_components/nav-link";
import { Image } from "@/components/image";
import { SubscribeNewsletter } from "@/components/navigation/subscribe-newsletter";
import { ChevronForwardIcon } from "@/components/ui/icons/chevron-forward";
import { EmailIcon } from "@/components/ui/icons/email";
import { Link } from "@/components/ui/link/link";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/api-client";
import { getMetadata } from "@/lib/i18n/metadata";
import { convertNavigationMenu } from "@/lib/navigation/convert";
import type {
	NavigationFooterConfig,
	NavigationLink,
	NavigationMenu,
} from "@/lib/navigation/navigation";
import { config as socialMediaConfig } from "@/lib/social-media/social-media.config";
import logoCC from "@/public/assets/images/cc.svg";
import logoDariah from "@/public/assets/images/logo-dariah-eu.svg";

interface FooterProps extends ComponentProps<"footer"> {}

export async function Footer(props: Readonly<FooterProps>): Promise<ReactNode> {
	const { className, ...rest } = props;

	const t = await getTranslations("(default).Footer");
	const meta = await getMetadata();

	const response = await client.navigation.get();
	const navigation = response.data.find((menu) => {
		return menu.name === "secondary";
	});
	assert(navigation != null, "Missing primary navigation.");

	const contact = navigation.items.find((item) => {
		return item.label === "Contact DARIAH";
	});
	const otherItems: NavigationFooterConfig = convertNavigationMenu(
		navigation.items.filter((item) => {
			return item.label !== "Contact DARIAH";
		}),
	) as NavigationFooterConfig;

	const secondary: { home: NavigationLink; contact: NavigationMenu } = {
		home: {
			type: "link",
			label: t("navigation.items.home"),
			href: "/",
		},
		contact: {
			type: "menu",
			label: contact ? contact.label : "Contact Dariah",
		},
	};

	return (
		<footer
			{...rest}
			className={cn("border-t border-stroke-weak shadow-footer z-9 bg-white", className)}
		>
			<div className={cn("pt-14 flex flex-col gap-16", "lg:max-w-480 lg:mx-auto lg:relative")}>
				<NavLink
					aria-label={secondary.home.label}
					className="lg:absolute lg:top-14.5 lg:left-17"
					href={secondary.home.href}
					size="icon"
				>
					<Image
						alt={secondary.home.label}
						className={cn("h-22 w-72.5", "lg:h-38.5 lg:w-107")}
						src={logoDariah}
					/>
				</NavLink>

				<div
					className={cn(
						"flex flex-col gap-16 px-6",
						"lg:flex-row lg:pt-57.5 lg:px-16 2xl:px-35 2xl:gap-32 3xl:gap-63.25",
					)}
				>
					<div className="flex flex-col gap-y-10 lg:max-w-188.25">
						<p className="text-[1.5625rem] font-light font-heading tracking-[-1%] leading-[1.3]">
							{t("navigation.description")}
						</p>
						<div className={cn("flex flex-col gap-10 justify-between", "2xl:gap-0 2xl:flex-row")}>
							<div className="flex flex-col items-start gap-x-4 gap-y-2 min-w-45.75">
								<Typography className="font-heading text-h5" variant="h2">
									{secondary.contact.label}
								</Typography>
								<Link
									className="text-primary! font-regular! p-0! [&>span]:flex! [&>span]:items-center [&>span]:gap-2! [&>span]:text-small"
									href={`mailto:${t("navigation.email")}`}
									startIcon={<EmailIcon className="stroke-primary! fill-transparent! size-4!" />}
								>
									{t("navigation.email")}
								</Link>
							</div>

							{Object.entries(otherItems).map(([id, item]) => {
								return (
									<div key={id} className="flex flex-col items-start gap-x-4 gap-y-2 min-w-45.75">
										<Typography className="font-heading text-h5" variant="h2">
											{item.label}
										</Typography>
										<ul
											className="flex flex-col items-start gap-x-4 gap-y-2 min-w-45.75"
											role="list"
										>
											{item.children &&
												Object.entries(item.children).map(([id, link]) => {
													if (id === "home") {
														return null;
													}

													if (link.type !== "link") return;

													return (
														<li key={id} className="w-58.25">
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
								);
							})}
						</div>
					</div>
					<div className="flex flex-col gap-y-8 lg:max-w-154">
						<SubscribeNewsletter />
						<div className="flex flex-col gap-4">
							<Typography className="font-light" variant="h2">
								{t("navigation-social-media.followUs")}
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
											<NavLink aria-label={label} className="touch-target" href={href} size="icon">
												<Icon className="size-6" />
											</NavLink>
										</li>
									);
								})}
							</ul>
						</div>
					</div>
				</div>

				<div
					className={cn(
						"py-2 px-6 h-fit flex gap-2 items-center bg-primary text-white md:h-16 xl:h-14",
						"xl:py-0 xl:px-10",
					)}
				>
					<Image alt={t("navigation.cc.alt")} className="size-5" src={logoCC} />
					<Typography variant="small">
						{t("navigation.cc.part1")}
						<Link
							className="inline underline hover:text-accent-100!"
							href="https://shs.hal.science/halshs-02106332/document"
							variant="color-bg"
						>
							{t("navigation.cc.part2")}
						</Link>
					</Typography>
				</div>
			</div>
		</footer>
	);
}
