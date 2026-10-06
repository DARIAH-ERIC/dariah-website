import { ChevronRightIcon, MailIcon } from "lucide-react";
import { getExtracted as getTranslations } from "next-intl/server";
import { Fragment, type ReactNode } from "react";

import { SubscribeForm } from "#/app/(app)/(default)/newsletters/_components/subscribe-form.tsx";
import byLogo from "#/assets/images/by.svg";
import ccLogo from "#/assets/images/cc.svg";
import logo from "#/assets/images/logo-dariah-eu.svg";
import { Image } from "#/components/image.tsx";
import { socialMediaLogos } from "#/components/social-media-logos.ts";
import { getNavigationMenu } from "#/lib/data/navigation.ts";
import { getSiteMetadata } from "#/lib/data/site-metadata.ts";
import { unsafeHref } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";
import { NavigationLink } from "#/lib/navigation/navigation-link.tsx";

/** See `./header.tsx`: both cached entries are part of the app shell. */
export async function Footer(): Promise<ReactNode> {
	const t = await getTranslations();
	const [menu, metadata] = await Promise.all([getNavigationMenu("secondary"), getSiteMetadata()]);

	/** The `website` entry is this site, which the footer would otherwise link to from the page it is on. */
	const socialMedia = metadata.socialMedia.filter((link) => link.type !== "website");

	/**
	 * Two columns from `lg` up: the mission and the menu on the start side, the newsletter and social media on the end
	 * side. The menu's submenus are its columns, each a labelled group of links. From `md` up, the logo is pulled out of
	 * the inline padding, so that the "D" of its wordmark - at 0.54× the logo's height, 44px at `block-20` - lines up
	 * with everything below it at `px-container`. The padding is at least 32px more than that, so the logo keeps clear of
	 * the edge on narrow viewports, where `px-container` is smaller. The two columns' first lines are trimmed to their
	 * cap height, so they line up despite their different font sizes.
	 */
	return (
		<footer className="relative border-bs border-stroke-weak px-container pbs-12 pbe-10 md:ps-[max(var(--spacing-container),4.75rem)]">
			<Image alt="" className="block-20 inline-auto md:-ms-11" src={logo} />

			<div className="mbs-10 grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-[3fr_2fr]">
				<div>
					<p className="max-inline-xl font-heading text-title-3 leading-heading font-light [text-box:trim-start_cap_alphabetic]">
						{t(
							"DARIAH's mission is to empower research communities with digital methods to create, connect and share knowledge about culture and society.",
						)}
					</p>

					<nav aria-label={t("Footer")} className="mbs-10">
						<ul className="flex flex-wrap gap-x-16 gap-y-8" role="list">
							{menu?.items.map((item) => (
								<li key={item.id}>
									{item.kind === "submenu" ? (
										<Fragment>
											<span className="font-heading font-bold">{item.label}</span>
											<ul className="mbs-2 grid gap-y-2" role="list">
												{item.children.map((child) => (
													<li key={child.id}>
														<NavigationLink
															className="flex items-center gap-4 py-1 underline-offset-4 hover:underline focus-visible-outline"
															href={unsafeHref(child.href, child.isExternal)}
														>
															{/* An email address is marked as one, as in the design; other links get the usual chevron. */}
															{child.href.startsWith("mailto:") ? (
																<MailIcon aria-hidden={true} className="size-4 shrink-0 text-icon-accent" />
															) : (
																<ChevronRightIcon
																	aria-hidden={true}
																	className="size-4 shrink-0 text-icon-accent"
																	strokeWidth={2.5}
																/>
															)}
															{child.label}
														</NavigationLink>
													</li>
												))}
											</ul>
										</Fragment>
									) : (
										<NavigationLink
											className="font-heading font-bold underline-offset-4 hover:underline focus-visible-outline"
											href={unsafeHref(item.href, item.isExternal)}
										>
											{item.label}
										</NavigationLink>
									)}
								</li>
							))}
						</ul>
					</nav>
				</div>

				<div className="max-inline-xl">
					<section>
						<h2 className="text-title-1 [text-box:trim-start_cap_alphabetic]">{t("Subscribe to our newsletter")}</h2>

						<p className="mbs-8 leading-reading">
							{t(
								"Get monthly updates on news, events, and resources from DARIAH and our community. Subscribing to it is the ideal way of staying informed!",
							)}
						</p>

						<div className="mbs-5">
							<SubscribeForm />
						</div>
					</section>

					<section className="mbs-12">
						<h2 className="text-title-1">{t("Follow us")}</h2>

						<nav aria-label={t("Social media")} className="mbs-5">
							<ul className="flex flex-wrap items-center gap-x-6 gap-y-4" role="list">
								{socialMedia.map((link) => (
									<li key={link.id}>
										{/* The mark is the link's only content, so it carries its accessible name. */}
										<Link
											className="flex touch-area p-2.5 [--focus-outline-offset:-3px] hover:bg-background-accent focus-visible:bg-background-accent focus-visible-outline"
											href={unsafeHref(link.url, true)}
										>
											<Image alt={link.name} className="block-6 inline-6" src={socialMediaLogos[link.type]} />
										</Link>
									</li>
								))}
							</ul>
						</nav>
					</section>
				</div>
			</div>

			<small className="mbs-16 flex items-center gap-3 text-small">
				{/* Decorative: the licence is named in the sentence next to them. Their colour is `--color-icon-strong`, a step
				    lighter than the text as marks read heavier than type, baked into the files as `#4a5565`. */}
				<span className="flex shrink-0 items-center gap-1">
					<Image alt="" className="block-5 inline-auto" src={ccLogo} />
					<Image alt="" className="block-5 inline-auto" src={byLogo} />
				</span>

				<span>
					{t.rich(
						"Unless otherwise indicated, all site content is licensed under a Creative Commons - Attribution CC-BY 4.0 license. This is in line with <a>DARIAH's Open Access Policy</a>.",
						{
							// oxlint-disable-next-line react/no-unstable-nested-components
							a(chunks) {
								return (
									<a
										className="text-text-accent underline underline-offset-2 focus-visible-outline"
										href="https://shs.hal.science/halshs-02106332/document"
									>
										{chunks}
									</a>
								);
							},
						},
					)}
				</span>
			</small>
		</footer>
	);
}
