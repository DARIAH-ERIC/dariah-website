import cn from "clsx/lite";
import { ArrowRightIcon } from "lucide-react";
import type { ReactNode } from "react";

import type { Href } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";

interface NoResultsAction {
	href: Href;
	label: string;
}

interface NoResultsProps {
	/**
	 * What to try instead, e.g. "Check the spelling, or try a broader term." Not that nothing matched: the list's count
	 * heading, e.g. "0 results", says that already.
	 */
	children: ReactNode;
	/** Links to the likeliest next steps, e.g. to clear the filters, as their urls - see `NoResultsLink`. */
	actions?: ReadonlyArray<NoResultsAction>;
	className?: string;
}

/**
 * The empty state for a list: a short message, then links to what to do next, at the list's start edge where its first
 * item would be, in the body text's style - an empty list is not an event worth an illustration.
 *
 * An action may change a filter the page's form shows, e.g. to clear it. The form's fields follow the url, so they are
 * reset too - see `Select` and `FacetCheckboxGroup`.
 */
export function NoResults(props: Readonly<NoResultsProps>): ReactNode {
	const { children, actions = [], className } = props;

	return (
		<div className={cn("flex flex-col gap-y-6", className)}>
			<p className="max-inline-measure">{children}</p>
			{actions.length > 0 ? (
				<ul className="flex flex-col items-start gap-y-3" role="list">
					{actions.map((action) => (
						<li key={action.label}>
							<NoResultsLink href={action.href}>{action.label}</NoResultsLink>
						</li>
					))}
				</ul>
			) : null}
		</div>
	);
}

/** Set like the events list's "See previous events" link: bold, with an arrow in the accent colour. */
function NoResultsLink(props: Readonly<{ children: ReactNode; href: Href }>): ReactNode {
	const { children, href } = props;

	return (
		<Link
			className="inline-flex items-center gap-x-3 font-heading font-bold underline-offset-4 focus-visible-outline hover:underline"
			href={href}
		>
			{children}
			<ArrowRightIcon aria-hidden={true} className="size-4 shrink-0 text-icon-accent" strokeWidth={2.5} />
		</Link>
	);
}
