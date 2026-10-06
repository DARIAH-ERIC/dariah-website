import cn from "clsx/lite";
import { RssIcon } from "lucide-react";
import { useExtracted as useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { type FeedName, getFeedHref } from "#/lib/data/feeds.ts";
import { serializeHref } from "#/lib/navigation/href.ts";

/**
 * A visible link to one of the rss feeds, on the page whose content it syndicates. Browsers no longer surface the
 * `<link rel="alternate">` elements which `createAlternates` adds, so without it only feed readers would find the
 * feeds. Styled like the events' `SubscribeMenu` trigger, which offers the events feed as one of its items.
 *
 * A plain `<a>`, since the feed is a route handler, not a page for client-side navigation to render.
 */
export function FeedLink(props: Readonly<{ className?: string; feed: FeedName }>): ReactNode {
	const { className, feed } = props;

	const t = useTranslations();

	return (
		<a
			className={cn(
				"inline-flex items-center gap-x-3 border-2 border-stroke-accent bg-background-base px-8 font-heading text-body font-bold text-text-accent focus-visible-outline min-block-15 hover:bg-background-accent-strong hover:text-text-inverse",
				className,
			)}
			href={serializeHref(getFeedHref(feed))}
			type="application/rss+xml"
		>
			<RssIcon aria-hidden={true} className="size-5 shrink-0" />
			{t("Subscribe via RSS")}
		</a>
	);
}
