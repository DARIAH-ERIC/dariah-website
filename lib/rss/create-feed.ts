import { assert, createUrl, keyByToMap } from "@acdh-oeaw/lib";
import { getFormatter } from "next-intl/server";
import { type Entry, rss } from "xast-util-feed";
import { toXml } from "xast-util-to-xml";

import { env } from "@/config/env.config";
import { client } from "@/lib/content/client";
import { defaultLocale } from "@/lib/i18n/locales";
import { getMetadata } from "@/lib/i18n/metadata";
import { createFullUrl } from "@/lib/navigation/create-full-url";

const baseUrl = env.NEXT_PUBLIC_APP_PRODUCTION_BASE_URL;
const locale = defaultLocale;

export async function createFeed(): Promise<string> {
	const meta = await getMetadata(locale);
	const format = await getFormatter({ locale });

	const channel = {
		title: meta.title,
		url: baseUrl,
		feedUrl: String(createUrl({ baseUrl, pathname: "/rss.xml" })),
		lang: locale,
	};

	const entries: Array<Entry> = [];

	const feed = toXml(rss(channel, entries));

	return feed;
}
