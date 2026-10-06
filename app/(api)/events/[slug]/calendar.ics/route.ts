import { env } from "#/configs/env.config.ts";
import { getEventBySlug } from "#/lib/data/events.ts";
import { createCalendarFile } from "#/lib/ics.ts";
import { href, serializeHref } from "#/lib/navigation/href.ts";

/** An event as a calendar file, which the event page's "add to calendar" link downloads. */
export async function GET(_request: Request, context: RouteContext<"/events/[slug]/calendar.ics">): Promise<Response> {
	const { slug } = await context.params;

	const event = await getEventBySlug(slug);

	if (event == null) {
		return new Response(null, { status: 404 });
	}

	const url = new URL(
		serializeHref(href({ pathname: "/events/[slug]", params: { slug } })),
		env.NEXT_PUBLIC_APP_BASE_URL,
	);

	const file = createCalendarFile({ event, url: url.href, domain: url.hostname });

	return new Response(file, {
		headers: {
			"content-type": "text/calendar; charset=utf-8",
			"content-disposition": `attachment; filename="${slug}.ics"`,
		},
	});
}
