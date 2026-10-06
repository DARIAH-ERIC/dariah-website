import cn from "clsx/lite";
import type { ReactNode } from "react";

interface BadgeProps {
	/**
	 * `"highlight"` for a state which should catch the eye, e.g. an event's "Upcoming" or an opportunity's "Open";
	 * `"muted"` for one which should not, e.g. "Past" or "Closed"; `"accent"` for DARIAH's own, e.g. an opportunity's
	 * source.
	 */
	tone: "accent" | "highlight" | "muted";
	children: ReactNode;
}

const toneClassNames: Record<BadgeProps["tone"], string> = {
	accent: "bg-background-accent-strong text-text-inverse",
	highlight: "bg-background-highlight",
	muted: "bg-background-tag",
};

/**
 * A short uppercase label on a tinted, slightly rounded box, lifted off its surroundings by the design's "Light
 * shadow", e.g. an event's or an opportunity's status. Set in the body font, so it looks the same inside a heading.
 */
export function Badge(props: Readonly<BadgeProps>): ReactNode {
	const { tone, children } = props;

	return (
		<span className={cn("rounded-sm px-1.5 py-0.5 font-body text-badge uppercase shadow-light", toneClassNames[tone])}>
			{children}
		</span>
	);
}
