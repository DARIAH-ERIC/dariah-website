/**
 * Request headers of an html-limited bot (see `htmlLimitedBots`), which gets a page's metadata before the response
 * starts, so a `notFound()` in `generateMetadata` gives it a real `404` status.
 */
export const bot = { "user-agent": "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)" };
