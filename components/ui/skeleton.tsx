import cn from "clsx/lite";
import type { ReactNode } from "react";

interface SkeletonProps {
	children: ReactNode;
	/** What is loading, for screen readers, e.g. "Loading events…"; the shapes themselves are empty. */
	label: string;
	className?: string;
}

/**
 * A suspense fallback shaped like the content it stands in for. The layout is the real one, with the same classes, so
 * the page does not shift when the content arrives; only text and images are replaced with placeholder shapes.
 *
 * The label comes last, so it does not count in `:nth-child` selectors the layout may use on the shapes' containers.
 */
export function Skeleton(props: Readonly<SkeletonProps>): ReactNode {
	const { children, label, className } = props;

	return (
		<div className={className}>
			{children}
			<span className="sr-only">{label}</span>
		</div>
	);
}

interface SkeletonShapeProps {
	/** Sizes the shape, e.g. `size-8 rounded-full` for an icon, or an image's aspect ratio. */
	className?: string;
}

/** A placeholder for an image, an icon, a badge, or a figure. */
export function SkeletonShape(props: Readonly<SkeletonShapeProps>): ReactNode {
	const { className } = props;

	return <span className={cn("block skeleton", className)} />;
}

/** The widths a placeholder's line count can change at: a phone's, from `sm`, and from `lg`. */
export type SkeletonRange = "base" | "sm" | "lg";

/** A number of lines, or one for each width range, for text which wraps to more lines on a narrower screen. */
export type SkeletonLines = number | Readonly<Record<SkeletonRange, number>>;

export const skeletonRanges: ReadonlyArray<SkeletonRange> = ["base", "sm", "lg"];

/** Written out in full, for tailwind to find. */
const lineClassNames: Record<SkeletonRange, { hidden: string; short: string }> = {
	base: { hidden: "max-sm:hidden", short: "max-sm:inline-3/5" },
	sm: { hidden: "sm:max-lg:hidden", short: "sm:max-lg:inline-3/5" },
	lg: { hidden: "lg:hidden", short: "lg:inline-3/5" },
};

/** The number of lines in each width range. */
export function getSkeletonLineCounts(lines: SkeletonLines): Readonly<Record<SkeletonRange, number>> {
	return typeof lines === "number" ? { base: lines, sm: lines, lg: lines } : lines;
}

interface SkeletonTextProps {
	/**
	 * The number of lines, or one for each width range; the last of several is shorter, as a paragraph's last line
	 * usually is. Measure the real text at each width rather than guess: a title often takes twice as many lines on a
	 * phone.
	 */
	lines?: SkeletonLines;
	/**
	 * The text's typography, e.g. `text-title-4 leading-heading`, so each line is as tall as a real one, and optionally a
	 * width.
	 */
	className?: string;
}

/**
 * Placeholder lines of text. Each line is a line box of the given typography, with a bar about as tall as its glyphs,
 * so a block of placeholder lines is as tall as the text it stands in for.
 *
 * With a count for each width range, as many lines are rendered as the largest count, and those beyond a range's count
 * are hidden in it.
 */
export function SkeletonText(props: Readonly<SkeletonTextProps>): ReactNode {
	const { lines = 1, className } = props;

	const counts = getSkeletonLineCounts(lines);

	return (
		<span className={cn("flex flex-col", className)}>
			{Array.from({ length: Math.max(counts.base, counts.sm, counts.lg) }, (_, index) => {
				const hidden = skeletonRanges.filter((range) => index >= counts[range]);
				const short = skeletonRanges.filter((range) => counts[range] > 1 && index === counts[range] - 1);

				return (
					<span
						key={index}
						className={cn("flex items-center block-lh", ...hidden.map((range) => lineClassNames[range].hidden))}
					>
						<span
							className={cn(
								"skeleton block-[0.75em]",
								short.length === skeletonRanges.length ? "inline-3/5" : "inline-full",
								...(short.length === skeletonRanges.length ? [] : short.map((range) => lineClassNames[range].short)),
							)}
						/>
					</span>
				);
			})}
		</span>
	);
}

interface SkeletonFieldProps {
	/** The field's label, which is known before the data is, so it is rendered as text rather than a placeholder. */
	label?: string;
	/** The field's width, e.g. `sm:inline-100`. */
	className?: string;
}

/**
 * A placeholder for a filter or search field: its label, and a box as tall as the control. The real control is not
 * rendered, as it would be replaced once the data loads, dropping anything typed or chosen in the meantime.
 */
export function SkeletonField(props: Readonly<SkeletonFieldProps>): ReactNode {
	const { label, className } = props;

	return (
		<div className={cn("flex flex-col gap-y-2", className)}>
			{label != null ? <span className="font-bold">{label}</span> : null}
			<SkeletonShape className="min-block-15" />
		</div>
	);
}
