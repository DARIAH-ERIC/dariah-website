"use client";

import { CalendarSyncIcon, CheckIcon, ChevronDownIcon, CopyIcon, RssIcon } from "lucide-react";
import { useExtracted as useTranslations } from "next-intl";
import { type ReactNode, useEffect, useState } from "react";
import { Button } from "react-aria-components/Button";
import { Header } from "react-aria-components/Header";
import { Menu, MenuItem, MenuSection, MenuTrigger } from "react-aria-components/Menu";
import { Popover } from "react-aria-components/Popover";
import { Separator } from "react-aria-components/Separator";
import { Text } from "react-aria-components/Text";

/** How long the copy item reads "Link copied" before it can be used again. */
const copiedDurationMs = 2000;

/** Matches the open list of `Select`. */
const itemClassName =
	"flex cursor-default flex-col gap-y-0.5 px-4 py-2.5 outline-none hover:bg-background-accent focus:bg-background-accent";

const sectionHeaderClassName = "px-4 pbs-2 pbe-1 text-small font-bold text-text-weak uppercase";

/**
 * Ways to subscribe to the events' calendar feed, below both the list and the calendar - where the legacy website
 * offered its feed, too. A calendar app keeps polling a subscribed feed, where an `https:` link would be downloaded and
 * imported once, so:
 *
 * - `webcal:` hands the feed to whichever app handles it, e.g. Apple Calendar, Outlook or Thunderbird.
 * - Google Calendar and Outlook.com subscribe through a url of their own, since a browser has no app for `webcal:` to
 *   hand it to. Neither is documented, but both are what calendar sites commonly link to. Both fetch the feed from
 *   their own servers, so they only work for a publicly reachable deployment.
 * - Otherwise the user copies the feed's url, and pastes it into their app's "subscribe from url" field.
 *
 * The rss feed of the events is the menu's last item, in a section of its own, so that both pages close with a single
 * control (see `SubscribeSection`).
 */
export function SubscribeMenu(props: Readonly<{ className?: string; feedUrl: string; rssHref: string }>): ReactNode {
	const { className, feedUrl, rssHref } = props;

	const t = useTranslations();
	const [isCopied, setIsCopied] = useState(false);

	useEffect(() => {
		if (!isCopied) {
			return undefined;
		}

		const timeout = setTimeout(() => {
			setIsCopied(false);
		}, copiedDurationMs);

		return () => {
			clearTimeout(timeout);
		};
	}, [isCopied]);

	/** `URL` does not switch a special scheme like `https:` to a non-special one, so the scheme is replaced by hand. */
	const webcalUrl = feedUrl.replace(/^https?:/, "webcal:");
	const googleUrl = `https://calendar.google.com/calendar/render?${new URLSearchParams({ cid: webcalUrl }).toString()}`;
	const outlookUrl = `https://outlook.live.com/calendar/0/addfromweb?${new URLSearchParams({ url: feedUrl }).toString()}`;

	async function copyFeedUrl() {
		try {
			await navigator.clipboard.writeText(feedUrl);
			setIsCopied(true);
		} catch {
			/** Denied, e.g. outside a secure context: the item stays as it is, and the other ways are still there. */
		}
	}

	return (
		<div className={className}>
			<MenuTrigger>
				<Button className="group inline-flex min-block-15 items-center gap-x-3 border-2 border-stroke-accent bg-background-base px-8 font-heading text-body font-bold text-text-accent hover:bg-background-accent-strong hover:text-text-inverse focus-visible-outline aria-expanded:bg-background-accent-strong aria-expanded:text-text-inverse">
					<CalendarSyncIcon aria-hidden={true} className="size-5 shrink-0" />
					{t("Subscribe")}
					<ChevronDownIcon
						aria-hidden={true}
						className="size-5 shrink-0 transition-transform group-aria-expanded:rotate-180 motion-reduce:transition-none"
						strokeWidth={2.5}
					/>
				</Button>
				<Popover
					className="min-inline-(--trigger-width) border border-stroke-weak bg-background-base shadow-lg"
					offset={4}
					placement="bottom end"
				>
					<Menu className="max-block-[inherit] overflow-y-auto py-2 outline-none">
						<MenuSection>
							<Header className={sectionHeaderClassName}>{t("Calendar")}</Header>
							<MenuItem className={itemClassName} href={webcalUrl} textValue={t("Calendar app")}>
								<Text className="font-heading" slot="label">
									{t("Calendar app")}
								</Text>
								<Text className="text-small text-text-weak" slot="description">
									{t("Apple Calendar, Outlook, Thunderbird")}
								</Text>
							</MenuItem>
							<MenuItem className={itemClassName} href={googleUrl} textValue="Google Calendar">
								<Text className="font-heading" slot="label">
									Google Calendar
								</Text>
							</MenuItem>
							<MenuItem className={itemClassName} href={outlookUrl} textValue="Outlook.com">
								<Text className="font-heading" slot="label">
									Outlook.com
								</Text>
							</MenuItem>
							<MenuItem
								className={itemClassName}
								onAction={() => {
									void copyFeedUrl();
								}}
								shouldCloseOnSelect={false}
								textValue={t("Copy link")}
							>
								<Text className="flex items-center gap-x-2 font-heading" slot="label">
									{isCopied ? t("Link copied") : t("Copy link")}
									{isCopied ? (
										<CheckIcon aria-hidden={true} className="size-4 shrink-0" strokeWidth={2.5} />
									) : (
										<CopyIcon aria-hidden={true} className="size-4 shrink-0" />
									)}
								</Text>
								<Text className="text-small text-text-weak" slot="description">
									{t("To paste into any other calendar app")}
								</Text>
							</MenuItem>
						</MenuSection>
						<Separator className="mbs-2 mbe-2 border-bs border-stroke-weak" />
						<MenuSection>
							<Header className={sectionHeaderClassName}>{t("Feed reader")}</Header>
							<MenuItem className={itemClassName} href={rssHref} textValue={t("RSS feed")}>
								<Text className="flex items-center gap-x-2 font-heading" slot="label">
									{t("RSS feed")}
									<RssIcon aria-hidden={true} className="size-4 shrink-0" />
								</Text>
								<Text className="text-small text-text-weak" slot="description">
									{t("New events as they are announced")}
								</Text>
							</MenuItem>
						</MenuSection>
					</Menu>
				</Popover>
			</MenuTrigger>
			{/* Outside the popover, so the confirmation is announced while the menu stays open, and after it closes. */}
			<span className="sr-only" role="status">
				{isCopied ? t("Link copied to the clipboard") : null}
			</span>
		</div>
	);
}
