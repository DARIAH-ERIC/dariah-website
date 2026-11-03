"use client";

import { ChevronDownIcon, ExternalLinkIcon, MenuIcon, SearchIcon, XIcon } from "lucide-react";
import { useExtracted as useTranslations } from "next-intl";
import { Fragment, type ReactNode, type SyntheticEvent, useEffect, useId, useRef, useState } from "react";

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
 * Keeps one section open at a time: opening one closes the others. Not native `details` sharing a `name`, which does
 * the same, as that is newer than the supported browsers (see browserslist).
 *
 * @see https://caniuse.com/mdn-html_elements_details_name
 */
function closeOtherSections(event: SyntheticEvent<HTMLDetailsElement>): void {
	const section = event.currentTarget;

	if (!section.open) {
		return;
	}

	for (const other of section.closest("ul")?.querySelectorAll<HTMLDetailsElement>(":scope > li > details[open]") ??
		[]) {
		if (other !== section) {
			other.open = false;
		}
	}
}

/**
 * The main navigation as an accordion: top-level links, and sections which disclose their links in place.
 *
 * Sections are native `details`, which keep find-in-page working: browsers open the section holding a match. Only one
 * is open at a time (see `closeOtherSections`). The section holding the link to the current page starts out open, so
 * opening the menu shows where one is; the menu is mounted afresh on every opening of the dialog, so that is worked out
 * each time, and collapsing it afterwards sticks.
 *
 * The menu sits on the dark navigation background; an open section's trigger turns light, and its links sit on the base
 * background below it. The current page is marked in the accent colour on the light panel, and underlined on the dark
 * background, where the accent colour would not be legible. The focus outline follows suit: inverse on dark, accent on
 * light.
 *
 * Neither roving focus nor `Escape` per section, as in the desktop bar: `Tab` is enough inside a dialog, and `Escape`
 * closes the dialog as a whole.
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
			<ul role="list">
				{items.map((item) => (
					<li key={item.id}>
						{item.kind === "submenu" ? (
							<details className="group" onToggle={closeOtherSections} open={item.id === currentSection?.id}>
								{/**
								 * `flex` drops the default disclosure triangle, which the chevron replaces; the webkit pseudo-element is safari's own
								 * marker, which survives the display change.
								 */}
								<summary className="flex cursor-pointer items-center justify-between gap-1.5 px-6 py-4 font-heading text-body font-medium focus-visible-outline [--focus-outline-offset:-3px] group-not-open:[--color-focus-outline:var(--color-focus-outline-inverse)] group-open:bg-background-muted group-open:text-text-strong [&::-webkit-details-marker]:hidden">
									{item.label}
									<ChevronDownIcon
										aria-hidden={true}
										className="-me-0.25 shrink-0 transition-transform block-4 inline-4 group-open:rotate-180 group-open:text-icon-accent"
										strokeWidth={2.5}
									/>
								</summary>
								<ul className="bg-background-base py-3 text-text-strong" role="list">
									{item.children.map((child) => (
										<li key={child.id}>
											<NavigationLink
												className="block px-6 py-2.5 font-heading text-body focus-visible-outline [--focus-outline-offset:-3px] aria-[current=page]:text-text-accent"
												href={unsafeHref(child.href, child.isExternal)}
												onClick={onNavigate}
											>
												{child.label}
												{child.isExternal ? (
													<ExternalLinkIcon
														aria-hidden={true}
														className="ms-2 inline align-[calc(-1rem/12)] text-icon-accent block-4 inline-4"
													/>
												) : null}
											</NavigationLink>
										</li>
									))}
								</ul>
							</details>
						) : (
							<NavigationLink
								className="block px-6 py-4 font-heading text-body font-medium focus-visible-outline [--color-focus-outline:var(--color-focus-outline-inverse)] [--focus-outline-offset:-3px] aria-[current=page]:underline aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-6"
								href={unsafeHref(item.href, item.isExternal)}
								onClick={onNavigate}
							>
								{item.label}
								{item.isExternal ? (
									<ExternalLinkIcon
										aria-hidden={true}
										className="ms-2 inline align-[calc(-1rem/12)] block-4 inline-4"
									/>
								) : null}
							</NavigationLink>
						)}
					</li>
				))}
			</ul>
		</nav>
	);
}

interface MobileNavigationProps {
	className?: string;
	items: NavigationMenuItems;
}

/**
 * The small-screen main navigation: a menu button opening a full-viewport modal dialog which holds the accordion menu,
 * under a logo row and above a search link. A dialog, not a disclosure, because the panel covers the page.
 *
 * A native `dialog`, like the resource catalogue's filters: `showModal()` makes the rest of the page inert, so neither
 * `Tab` nor a screen reader's cursor can reach the page behind it, closes on `Escape` (and on android's back gesture),
 * and returns focus to the menu button. `Tab` can leave the dialog for the browser's own controls, but never for the
 * page. Focus starts on the dialog itself, as it did with react-aria's dialog, rather than on the logo link, its first
 * focusable element. The page's scrolling is locked while it is open; the menu's own scrolling does not chain to the
 * page either.
 *
 * The logo row repeats the header's layout, so logo and button stay in place while the dialog fades in over the page,
 * with the close button where the menu button was.
 *
 * Every link inside closes the dialog on click - right away, not once the navigation lands, so the click registers
 * immediately also for links to the page already shown. The browser's back and forward buttons close it as well, as the
 * page underneath changes without any link being clicked.
 *
 * The menu button sits in a `nav` landmark of its own, as the dialog's content - with the `nav` holding the menu - is
 * only mounted once it is opened, and the desktop bar is hidden: without it, landmark navigation would find no main
 * navigation on small screens. The dialog is not inside that landmark, and while it is open, the landmark is inert like
 * the rest of the page, so there is only ever one "Main" landmark.
 *
 * Hidden via css from `xl` up, where the desktop bar takes over, so both variants prerender without knowing the
 * viewport. The menu is not part of the prerendered html: it is rendered on the first opening, and remounted on every
 * later one.
 */
export function MobileNavigation(props: Readonly<MobileNavigationProps>): ReactNode {
	const { className, items } = props;

	const t = useTranslations();
	const id = useId();
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [isOpen, setIsOpen] = useState(false);
	/** How often the dialog has been opened, which keys the menu, so that it is mounted afresh on every opening. */
	const [openings, setOpenings] = useState(0);

	function open(): void {
		dialogRef.current?.showModal();
		dialogRef.current?.focus();
		setIsOpen(true);
		setOpenings((count) => count + 1);
	}

	function close(): void {
		dialogRef.current?.close();
	}

	/** Lock the page's scrolling while the dialog is open. */
	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const root = document.documentElement;
		const overflow = root.style.overflow;
		root.style.overflow = "hidden";

		return () => {
			root.style.overflow = overflow;
		};
	}, [isOpen]);

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
			dialogRef.current?.close();
		};

		const onMediaQueryChange = (event: MediaQueryListEvent): void => {
			if (event.matches) {
				dialogRef.current?.close();
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
		<Fragment>
			<nav aria-label={t("Main")} className={className}>
				<button
					aria-controls={isOpen ? id : undefined}
					aria-expanded={isOpen}
					aria-label={t("Menu")}
					className="touch-area flex shrink-0 cursor-pointer bg-background-subtle p-3 focus-visible-outline [--focus-outline-offset:-3px] hover:bg-background-accent hover:text-icon-accent focus-visible:bg-background-accent focus-visible:text-icon-accent"
					onClick={open}
					type="button"
				>
					<MenuIcon aria-hidden={true} className="block-5 inline-5" />
				</button>
			</nav>
			{/**
			 * `open:flex`, not `flex`: a closed `dialog` is hidden by `display: none`, which `flex` would override. The fade runs
			 * on `display` and `overlay` too, so the dialog stays shown, and on top, while it fades out.
			 */}
			<dialog
				ref={dialogRef}
				aria-label={t("Menu")}
				className="fixed inset-0 m-0 flex-col border-0 bg-background-navigation p-0 text-text-inverse opacity-0 outline-hidden transition-[opacity,display,overlay] transition-discrete duration-200 block-dvh inline-full max-block-none max-inline-none backdrop:bg-transparent open:flex open:opacity-100 motion-reduce:transition-none starting:open:opacity-0"
				id={id}
				onClose={() => {
					setIsOpen(false);
				}}
				tabIndex={-1}
			>
				<div className="container flex shrink-0 items-center justify-between gap-8 bg-background-base px-[calc(var(--spacing-container)-1rem)] py-3 text-text-strong">
					<NavigationLink
						className="m-4 flex shrink-0 focus-visible-outline [--focus-outline-offset:6px]"
						href={href({ pathname: "/" })}
						onClick={close}
					>
						<Image alt={t("DARIAH-EU Home")} className="block-9.5 inline-auto md:block-12" src={logo} />
					</NavigationLink>
					<button
						aria-label={t("Close menu")}
						className="touch-area flex shrink-0 cursor-pointer bg-background-subtle p-3 focus-visible-outline [--focus-outline-offset:-3px] hover:bg-background-accent hover:text-icon-accent focus-visible:bg-background-accent focus-visible:text-icon-accent"
						onClick={close}
						type="button"
					>
						<XIcon aria-hidden={true} className="block-5 inline-5" />
					</button>
				</div>
				<div className="flex-1 overflow-y-auto overscroll-contain">
					{openings > 0 ? <MobileNavigationMenu key={openings} items={items} onNavigate={close} /> : null}
				</div>
				<NavigationLink
					className="flex shrink-0 items-center gap-4 border-bs border-stroke-inverse px-6 py-4 font-heading text-body font-medium focus-visible-outline [--color-focus-outline:var(--color-focus-outline-inverse)] [--focus-outline-offset:-3px] aria-[current=page]:underline aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-6"
					href={href({ pathname: "/search" })}
					onClick={close}
				>
					<SearchIcon aria-hidden={true} className="block-5 inline-5" />
					{t("Search")}
				</NavigationLink>
			</dialog>
		</Fragment>
	);
}
