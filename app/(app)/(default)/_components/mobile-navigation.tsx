"use client";

import { ChevronDownIcon, ExternalLinkIcon, MenuIcon, SearchIcon, XIcon } from "lucide-react";
import { useExtracted as useTranslations } from "next-intl";
import { type ReactNode, useEffect, useState } from "react";
import { Button } from "react-aria-components/Button";
import { Dialog, DialogTrigger } from "react-aria-components/Dialog";
import { Disclosure, DisclosurePanel } from "react-aria-components/Disclosure";
import { DisclosureGroup } from "react-aria-components/DisclosureGroup";
import { Modal } from "react-aria-components/Modal";

import logo from "#/assets/images/logo-dariah-eu.svg";
import { Image } from "#/components/image.tsx";
import type { NavigationMenu as NavigationMenuData } from "#/lib/api/schemas.ts";
import { useIntlPathname } from "#/lib/i18n/navigation.ts";
import { href, isCurrentHref, unsafeHref } from "#/lib/navigation/href.ts";
import { NavigationLink } from "#/lib/navigation/navigation-link.tsx";

/** Matches `--breakpoint-xl` in `styles/index.css`, where the header switches from the menu button to the bar. */
const desktopMediaQuery = "(min-width: 80rem)";

type NavigationMenuItems = NavigationMenuData["items"];

interface MobileNavigationMenuProps {
	items: NavigationMenuItems;
	/** Called when any link is clicked, to close the dialog. */
	onNavigate: () => void;
}

/**
 * The main navigation as an accordion: top-level links, and sections which disclose their links in place.
 *
 * Sections are react-aria disclosures in a group which keeps only one open at a time. Not native `details` sharing a
 * `name`: that is newer than the supported browsers (see browserslist). The panels are hidden with
 * `hidden="until-found"` where supported, so find-in-page still opens them. The section holding the link to the current
 * page starts out open, so opening the menu shows where one is; the menu is mounted on every opening of the dialog, so
 * that is worked out afresh each time.
 *
 * The menu sits on the dark navigation background; an open section's trigger turns light, and its links sit on the base
 * background below it. The current page is marked in the accent colour on the light panel, and underlined on the dark
 * background, where the accent colour would not be legible. The focus outline follows suit: inverse on dark, accent on
 * light.
 *
 * Neither roving focus nor `Escape` per section, as in the desktop bar: `Tab` is enough inside a dialog, and `Escape`
 * closes the dialog as a whole.
 *
 * @see https://caniuse.com/mdn-html_elements_details_name
 */
function MobileNavigationMenu(props: Readonly<MobileNavigationMenuProps>): ReactNode {
	const { items, onNavigate } = props;

	const t = useTranslations();
	const pathname = useIntlPathname();

	const currentSection = items.find(
		(item) =>
			item.kind === "submenu" &&
			item.children.some((child) => isCurrentHref(unsafeHref(child.href, child.isExternal), pathname)),
	);

	return (
		<nav aria-label={t("Main")}>
			<DisclosureGroup defaultExpandedKeys={currentSection != null ? [currentSection.id] : []}>
				<ul role="list">
					{items.map((item) => (
						<li key={item.id}>
							{item.kind === "submenu" ? (
								<Disclosure id={item.id}>
									<Button
										className="group flex cursor-pointer items-center justify-between gap-1.5 px-6 py-4 font-heading text-body font-medium inline-full [--focus-outline-offset:-3px] not-aria-expanded:[--color-focus-outline:var(--color-focus-outline-inverse)] aria-expanded:bg-background-muted aria-expanded:text-text-strong focus-visible-outline"
										slot="trigger"
									>
										{item.label}
										<ChevronDownIcon
											aria-hidden={true}
											className="-me-0.25 size-4 shrink-0 transition-transform group-aria-expanded:rotate-180 group-aria-expanded:text-icon-accent"
											strokeWidth={2.5}
										/>
									</Button>
									<DisclosurePanel className="bg-background-base text-text-strong">
										<ul className="py-3" role="list">
											{item.children.map((child) => (
												<li key={child.id}>
													<NavigationLink
														className="block px-6 py-2.5 font-heading text-body [--focus-outline-offset:-3px] aria-[current=page]:text-text-accent focus-visible-outline"
														href={unsafeHref(child.href, child.isExternal)}
														onClick={onNavigate}
													>
														{child.label}
														{child.isExternal ? (
															<ExternalLinkIcon
																aria-hidden={true}
																className="ms-2 inline size-4 align-[calc(-1rem/12)] text-icon-accent"
															/>
														) : null}
													</NavigationLink>
												</li>
											))}
										</ul>
									</DisclosurePanel>
								</Disclosure>
							) : (
								<NavigationLink
									className="block px-6 py-4 font-heading text-body font-medium [--color-focus-outline:var(--color-focus-outline-inverse)] [--focus-outline-offset:-3px] aria-[current=page]:underline aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-6 focus-visible-outline"
									href={unsafeHref(item.href, item.isExternal)}
									onClick={onNavigate}
								>
									{item.label}
									{item.isExternal ? (
										<ExternalLinkIcon aria-hidden={true} className="ms-2 inline size-4 align-[calc(-1rem/12)]" />
									) : null}
								</NavigationLink>
							)}
						</li>
					))}
				</ul>
			</DisclosureGroup>
		</nav>
	);
}

interface MobileNavigationProps {
	className?: string;
	items: NavigationMenuItems;
}

/**
 * The small-screen main navigation: a menu button opening a full-viewport modal dialog which holds the accordion menu,
 * under a logo row and above a search link. A dialog, not a disclosure, because the panel covers the page: react-aria
 * traps focus, hides the rest of the page from assistive technology, locks scrolling (also on ios, where `overflow:
 * hidden` alone does not), closes on `Escape` and restores focus to the button.
 *
 * The logo row repeats the header's layout, so logo and button stay in place while the dialog fades in over the page,
 * with the close button where the menu button was.
 *
 * Every link inside closes the dialog on click - right away, not once the navigation lands, so the click registers
 * immediately also for links to the page already shown. The browser's back and forward buttons close it as well, as the
 * page underneath changes without any link being clicked.
 *
 * The menu button sits in a `nav` landmark of its own, as the dialog's content - with the `nav` holding the menu - is
 * only mounted while it is open, and the desktop bar is hidden: without it, landmark navigation would find no main
 * navigation on small screens. While the dialog is open, react-aria hides everything outside it from assistive
 * technology, so there is only ever one "Main" landmark.
 *
 * Hidden via css from `xl` up, where the desktop bar takes over, so both variants prerender without knowing the
 * viewport; the dialog's content is only mounted while it is open.
 */
export function MobileNavigation(props: Readonly<MobileNavigationProps>): ReactNode {
	const { className, items } = props;

	const t = useTranslations();

	const [isOpen, setIsOpen] = useState(false);

	function close(): void {
		setIsOpen(false);
	}

	/**
	 * While open, watch for the two things which make the dialog moot without a click inside it: the browser going back
	 * or forward in history (`popstate` - client-side pushes do not fire it), and the viewport growing past the
	 * breakpoint (rotating a tablet, say), where the bar takes over.
	 */
	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const mediaQuery = window.matchMedia(desktopMediaQuery);

		const onPopState = (): void => {
			setIsOpen(false);
		};

		const onMediaQueryChange = (event: MediaQueryListEvent): void => {
			if (event.matches) {
				setIsOpen(false);
			}
		};

		window.addEventListener("popstate", onPopState);
		mediaQuery.addEventListener("change", onMediaQueryChange);

		return () => {
			window.removeEventListener("popstate", onPopState);
			mediaQuery.removeEventListener("change", onMediaQueryChange);
		};
	}, [isOpen]);

	return (
		<nav aria-label={t("Main")} className={className}>
			<DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
				<Button
					aria-label={t("Menu")}
					className="flex shrink-0 cursor-pointer touch-area bg-background-subtle p-3 [--focus-outline-offset:-3px] hover:bg-background-accent hover:text-icon-accent focus-visible:bg-background-accent focus-visible:text-icon-accent focus-visible-outline"
				>
					<MenuIcon aria-hidden={true} className="size-5" />
				</Button>
				<Modal
					className="fixed inset-0 z-50 bg-background-base duration-200 entering:animate-in entering:fade-in exiting:animate-out exiting:fade-out"
					isDismissable={true}
				>
					<Dialog
						aria-label={t("Menu")}
						className="flex flex-col bg-background-navigation text-text-inverse outline-hidden block-dvh"
					>
						<div className="container flex bg-background-base text-text-strong shrink-0 items-center justify-between gap-8 px-[calc(var(--spacing-container)-1rem)] py-3">
							<NavigationLink
								className="m-4 flex shrink-0 [--focus-outline-offset:6px] focus-visible-outline"
								href={href({ pathname: "/" })}
								onClick={close}
							>
								<Image alt={t("DARIAH-EU Home")} className="block-9.5 inline-auto md:block-12" src={logo} />
							</NavigationLink>
							<Button
								aria-label={t("Close menu")}
								className="flex shrink-0 cursor-pointer touch-area bg-background-subtle p-3 [--focus-outline-offset:-3px] hover:bg-background-accent hover:text-icon-accent focus-visible:bg-background-accent focus-visible:text-icon-accent focus-visible-outline"
								slot="close"
							>
								<XIcon aria-hidden={true} className="size-5" />
							</Button>
						</div>
						<div className="flex-1 overflow-y-auto">
							<MobileNavigationMenu items={items} onNavigate={close} />
						</div>
						<NavigationLink
							className="flex shrink-0 items-center gap-4 border-bs border-stroke-inverse px-6 py-4 font-heading text-body font-medium [--color-focus-outline:var(--color-focus-outline-inverse)] [--focus-outline-offset:-3px] aria-[current=page]:underline aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-6 focus-visible-outline"
							href={href({ pathname: "/search" })}
							onClick={close}
						>
							<SearchIcon aria-hidden={true} className="size-5" />
							{t("Search")}
						</NavigationLink>
					</Dialog>
				</Modal>
			</DialogTrigger>
		</nav>
	);
}
