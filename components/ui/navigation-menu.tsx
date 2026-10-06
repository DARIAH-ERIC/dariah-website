"use client";

import { clsx as cn } from "clsx";
import { ChevronDownIcon } from "lucide-react";
import {
	type ComponentProps,
	type FocusEvent,
	type KeyboardEvent,
	type ReactNode,
	type RefObject,
	createContext,
	use,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";
import { mergeRefs } from "react-aria/mergeRefs";
import { useOverlayPosition } from "react-aria/useOverlayPosition";

import { NavigationLink, type NavigationLinkProps } from "#/lib/navigation/navigation-link.tsx";

/**
 * A site navigation following the aria practices guide's disclosure navigation menu pattern: a list of top-level links
 * and toggle buttons, where each button shows and hides a nested list of links. Deliberately _not_ the `menu` pattern
 * (nor react-aria's `Menu`), which is meant for application menus and would announce links as menu items, intercept
 * `Tab`, and make screen readers switch into application mode.
 *
 * Every top-level `<li>` holds either a `NavigationMenuLink`, or a `NavigationMenuTrigger` controlling the
 * `NavigationMenuContent` next to it. The guide's "top-level links" variant, where an item is both a link and a
 * disclosure, is deliberately not supported: the site's sections have no landing pages of their own.
 *
 * Only one disclosure is open at a time. It closes on `Escape` (which also moves focus back to the button when focus
 * was in the disclosed list), when focus leaves the item, when a pointer is pressed outside the navigation, and when a
 * link in it is followed. Arrow keys, `Home` and `End` move focus among the top-level items - or, inside a disclosed
 * list, among its links - supplementing `Tab`, which keeps working as usual.
 *
 * This is the desktop bar, where a disclosed list drops down over the page. Small screens get their own accordion
 * inside a dialog instead (see `MobileNavigation`), which shares none of the dropdown's positioning or dismissal.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/
 */

const triggerAttribute = "data-navigation-menu-trigger";
const contentAttribute = "data-navigation-menu-content";
const linkAttribute = "data-navigation-menu-link";

interface NavigationMenuContextValue {
	/** The `id` of the currently disclosed `NavigationMenuContent`, if any. */
	expandedId: string | null;
	setExpandedId: (id: string | null) => void;
}

const NavigationMenuContext = createContext<NavigationMenuContextValue | null>(null);

function useNavigationMenu(): NavigationMenuContextValue {
	const context = use(NavigationMenuContext);

	if (context == null) {
		throw new Error("`NavigationMenu` parts must be rendered inside a `NavigationMenu`.");
	}

	return context;
}

interface NavigationMenuItemContextValue {
	contentId: string;
	isExpanded: boolean;
	setExpanded: (isExpanded: boolean) => void;
	/** The `NavigationMenuTrigger`, which the `NavigationMenuContent` positions itself against. */
	triggerRef: RefObject<HTMLButtonElement | null>;
}

const NavigationMenuItemContext = createContext<NavigationMenuItemContextValue | null>(null);

function useNavigationMenuItem(): NavigationMenuItemContextValue {
	const context = use(NavigationMenuItemContext);

	if (context == null) {
		throw new Error(
			"`NavigationMenuTrigger` and `NavigationMenuContent` must be rendered inside a `NavigationMenuItem`.",
		);
	}

	return context;
}

function isTopLevel(element: Element): boolean {
	return element.closest(`[${contentAttribute}]`) == null;
}

export interface NavigationMenuProps extends Omit<ComponentProps<"nav">, "aria-label" | "children"> {
	children: ReactNode;
	/** Names the navigation landmark, which is required to tell it apart from the other `<nav>`s on the page. */
	label: string;
}

export function NavigationMenu(props: Readonly<NavigationMenuProps>): ReactNode {
	const { children, className, label, onKeyDown, ...rest } = props;

	const [expandedId, setExpandedId] = useState<string | null>(null);
	const ref = useRef<HTMLElement>(null);

	/**
	 * Close a dropdown when a pointer is pressed outside the navigation. Focus-based closing (see `NavigationMenuItem`)
	 * does not cover this on its own: safari does not focus buttons on click, so nothing may have focus which could be
	 * lost.
	 */
	useEffect(() => {
		if (expandedId == null) {
			return;
		}

		const onPointerDown = (event: PointerEvent): void => {
			if (event.target instanceof Node && ref.current?.contains(event.target) === true) {
				return;
			}

			setExpandedId(null);
		};

		document.addEventListener("pointerdown", onPointerDown);

		return () => {
			document.removeEventListener("pointerdown", onPointerDown);
		};
	}, [expandedId]);

	function onNavigationKeyDown(event: KeyboardEvent<HTMLElement>): void {
		onKeyDown?.(event);

		if (event.defaultPrevented) {
			return;
		}

		const nav = event.currentTarget;
		const target = event.target;

		if (!(target instanceof HTMLElement)) {
			return;
		}

		const content = target.closest<HTMLElement>(`[${contentAttribute}]`);

		if (event.key === "Escape") {
			if (expandedId == null) {
				return;
			}

			setExpandedId(null);

			/** Only one list is ever disclosed, so focus inside any content means it is about to be hidden. */
			if (content != null) {
				nav.querySelector<HTMLElement>(`[${triggerAttribute}][aria-expanded="true"]`)?.focus();
			}

			return;
		}

		/**
		 * The optional roving focus: inside a disclosed list, arrow keys move among its links; on the top level, they move
		 * among the links and buttons which are not inside a disclosed list.
		 */
		const nodes =
			content != null
				? Array.from(content.querySelectorAll<HTMLElement>(`[${linkAttribute}]`))
				: Array.from(nav.querySelectorAll<HTMLElement>(`[${triggerAttribute}], [${linkAttribute}]`)).filter((node) =>
						isTopLevel(node),
					);
		const index = nodes.indexOf(target);

		if (index === -1) {
			return;
		}

		let next: HTMLElement | undefined;

		switch (event.key) {
			case "ArrowDown": {
				/** On a disclosed button, move into its list instead of on to the next top-level item. */
				if (content == null && target.getAttribute("aria-expanded") === "true") {
					const firstLink = target
						.closest("li")
						?.querySelector<HTMLElement>(`[${contentAttribute}] [${linkAttribute}]`);

					if (firstLink != null) {
						next = firstLink;
						break;
					}
				}

				next = nodes[Math.min(nodes.length - 1, index + 1)];
				break;
			}

			case "ArrowRight": {
				next = nodes[Math.min(nodes.length - 1, index + 1)];
				break;
			}

			case "ArrowUp":
			case "ArrowLeft": {
				next = nodes[Math.max(0, index - 1)];
				break;
			}

			case "Home": {
				next = nodes[0];
				break;
			}

			case "End": {
				next = nodes.at(-1);
				break;
			}

			default: {
				return;
			}
		}

		event.preventDefault();
		next?.focus();
	}

	const context = useMemo(() => {
		return { expandedId, setExpandedId };
	}, [expandedId]);

	return (
		<NavigationMenuContext value={context}>
			<nav {...rest} ref={ref} aria-label={label} className={className} onKeyDown={onNavigationKeyDown}>
				<ul className="flex flex-wrap gap-x-6 gap-y-2" role="list">
					{children}
				</ul>
			</nav>
		</NavigationMenuContext>
	);
}

export interface NavigationMenuItemProps extends Omit<ComponentProps<"li">, "children"> {
	children: ReactNode;
}

/**
 * One entry in a `NavigationMenu` or in a `NavigationMenuContent`. Holds the disclosure state for the
 * `NavigationMenuTrigger` and `NavigationMenuContent` it may contain.
 */
export function NavigationMenuItem(props: Readonly<NavigationMenuItemProps>): ReactNode {
	const { children, className, onBlur, ...rest } = props;

	const menu = useNavigationMenu();
	const contentId = useId();
	const triggerRef = useRef<HTMLButtonElement>(null);

	const isExpanded = menu.expandedId === contentId;

	/** Close when focus leaves the item, e.g. by tabbing past the last disclosed link. */
	function onItemBlur(event: FocusEvent<HTMLLIElement>): void {
		onBlur?.(event);

		if (!isExpanded) {
			return;
		}
		if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) {
			return;
		}

		menu.setExpandedId(null);
	}

	const context = useMemo(() => {
		return {
			contentId,
			isExpanded,
			setExpanded(isExpanded: boolean): void {
				menu.setExpandedId(isExpanded ? contentId : null);
			},
			triggerRef,
		};
	}, [contentId, isExpanded, menu]);

	return (
		<NavigationMenuItemContext value={context}>
			<li {...rest} className={className} onBlur={onItemBlur}>
				{children}
			</li>
		</NavigationMenuItemContext>
	);
}

export interface NavigationMenuTriggerProps extends Omit<ComponentProps<"button">, "aria-controls" | "aria-expanded"> {}

/** The button which discloses the `NavigationMenuContent` of its `NavigationMenuItem`. */
export function NavigationMenuTrigger(props: Readonly<NavigationMenuTriggerProps>): ReactNode {
	const { children, className, onClick, ref, ...rest } = props;

	const item = useNavigationMenuItem();

	return (
		<button
			{...rest}
			{...{ [triggerAttribute]: "" }}
			ref={mergeRefs(ref, item.triggerRef)}
			aria-controls={item.contentId}
			aria-expanded={item.isExpanded}
			className={cn("group inline-flex cursor-pointer items-center gap-1.5 focus-visible-outline", className)}
			onClick={(event) => {
				onClick?.(event);

				if (event.defaultPrevented) {
					return;
				}

				item.setExpanded(!item.isExpanded);
			}}
			type="button"
		>
			{children}
			<ChevronDownIcon
				aria-hidden={true}
				className="-me-0.25 size-4 shrink-0 text-icon-accent transition-transform group-aria-expanded:rotate-180"
				strokeWidth={2.5}
			/>
		</button>
	);
}

export interface NavigationMenuContentProps extends Omit<ComponentProps<"ul">, "children" | "hidden" | "id"> {
	children: ReactNode;
}

/**
 * The list of links a `NavigationMenuTrigger` discloses. Its items are `NavigationMenuItem`s holding a link each.
 *
 * React-aria's `useOverlayPosition` places it below the trigger's start edge - `start`, so it follows the writing
 * direction - and keeps it inside the viewport: shifted along the bar when it would overflow the end edge, flipped
 * above the trigger when there is no room below, and capped in height (scrolling inside) when there is little. The list
 * stays where it is in the dom, right after its button, so `Tab` order and `aria-controls` are untouched; the hook only
 * writes inline `top`/`left`/`max-height`.
 *
 * Those are document coordinates, so the list must not have a positioned ancestor (no `relative` on the `<li>`, and no
 * `sticky` header): react-aria supports a positioned containing block in principle, but its viewport clamping then
 * mis-transforms the overlay's edges by the container's own offset (`getDelta` in `calculatePosition`, as of react-aria
 * 3.52), which shifts the list by `containerPadding` and never detects a real overflow. With the document as the
 * containing block the hook is on the same path as every portalled popover. The geometry tests in
 * `e2e/navigation.spec.ts` pin this down.
 */
export function NavigationMenuContent(props: Readonly<NavigationMenuContentProps>): ReactNode {
	const { children, className, ref, style, ...rest } = props;

	const item = useNavigationMenuItem();
	const contentRef = useRef<HTMLUListElement>(null);

	const { overlayProps } = useOverlayPosition({
		isOpen: item.isExpanded,
		/** Clears the trigger's bottom border, which stays visible while the list is open. */
		offset: 4,
		overlayRef: contentRef,
		placement: "bottom start",
		targetRef: item.triggerRef,
	});

	return (
		<ul
			{...rest}
			{...{ [contentAttribute]: "" }}
			ref={mergeRefs(ref, contentRef)}
			className={cn(
				"z-10 flex flex-col overflow-y-auto border border-stroke-weak bg-background-base py-2 shadow-lg inline-max min-inline-48",
				className,
			)}
			hidden={!item.isExpanded}
			id={item.contentId}
			role="list"
			/** The hook's `z-index` is meant for portalled overlays; the list stacks within the header's own scale. */
			style={{ ...overlayProps.style, zIndex: undefined, ...style }}
		>
			{children}
		</ul>
	);
}

export interface NavigationMenuLinkProps extends NavigationLinkProps {}

/**
 * A link in a `NavigationMenu`, either top-level or inside a `NavigationMenuContent`. Marks the current page with
 * `aria-current`, and closes the disclosed list when clicked.
 *
 * It closes on click, not once the navigation lands, so the click registers immediately - also for links to the page
 * already shown and for external urls, where no route change would ever follow.
 */
export function NavigationMenuLink(props: Readonly<NavigationMenuLinkProps>): ReactNode {
	const { className, onClick, ...rest } = props;

	const menu = useNavigationMenu();

	return (
		<NavigationLink
			{...rest}
			{...{ [linkAttribute]: "" }}
			className={cn("focus-visible-outline", className)}
			onClick={(event) => {
				onClick?.(event);

				if (event.defaultPrevented) {
					return;
				}

				menu.setExpandedId(null);
			}}
		/>
	);
}
