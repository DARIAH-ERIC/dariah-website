"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import type { ReactNode } from "react";

import type { Href } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";

interface TabLinkProps {
	/** The route segment the link goes to, below the layout which renders it, `null` for the layout's own page. */
	segment: string | null;
	href: Href;
	className?: string;
	children: ReactNode;
}

/**
 * A `TabNavigation` link, marked as current when its segment is the selected one. A layout is not re-rendered when
 * navigating between its pages, so only the client knows which one is shown. Every tab is a static route, so the
 * segment is known when prerendering, and the static html already has the right tab marked.
 */
export function TabLink(props: Readonly<TabLinkProps>): ReactNode {
	const { segment, href, className, children } = props;

	const selectedSegment = useSelectedLayoutSegment();

	return (
		<Link
			aria-current={segment === selectedSegment ? "page" : undefined}
			className={className}
			href={href}
			prefetch={true}
			scroll={false}
		>
			{children}
		</Link>
	);
}
