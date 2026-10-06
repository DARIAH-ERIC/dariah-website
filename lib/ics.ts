import { parseDate } from "@internationalized/date";

import type { Event } from "#/lib/api/schemas.ts";

interface CalendarEntry {
	event: Pick<Event, "duration" | "id" | "isFullDay" | "location" | "publishedAt" | "summary" | "title">;
	/** The event's page, absolute. */
	url: string;
}

interface CalendarOptions {
	/** Qualifies each event's id into a globally unique `UID`, e.g. the site's host. */
	domain: string;
}

/** Escapes a `TEXT` value - see rfc 5545, section 3.3.11. */
function escapeText(value: string): string {
	return value.replaceAll("\\", "\\\\").replaceAll(";", "\\;").replaceAll(",", "\\,").replaceAll(/\r?\n/g, "\\n");
}

/**
 * Folds a content line longer than 75 octets onto continuation lines, which start with a space - see rfc 5545, section
 * 3.1. Counted in utf-8 bytes, without splitting a character.
 */
function foldLine(line: string): string {
	const encoder = new TextEncoder();
	const lines: Array<string> = [];
	let current = "";
	let size = 0;

	for (const character of line) {
		const length = encoder.encode(character).length;
		/** A continuation line's leading space counts towards its 75 octets. */
		const limit = lines.length === 0 ? 75 : 74;

		if (size + length > limit) {
			lines.push(current);
			current = "";
			size = 0;
		}

		current += character;
		size += length;
	}

	lines.push(current);

	return lines.join("\r\n ");
}

/** `2025-11-12T09:30:00.000Z` as `20251112T093000`, with a trailing `Z` when `isUtc`. */
function formatDateTime(value: string, isUtc: boolean): string {
	return value.slice(0, 19).replaceAll(/[-:]/g, "") + (isUtc ? "Z" : "");
}

/**
 * An event as a `VEVENT` component.
 *
 * An all-day event is a range of dates, whose end is exclusive, so the day after its last. A timed event's times are
 * UTC standing in for the event's own timezone (see `EventBase["duration"]`), which is unknown, so they are written as
 * floating times, which a calendar app reads in the user's own timezone, rather than converted.
 */
function createEventLines(entry: CalendarEntry, domain: string): Array<string> {
	const { event, url } = entry;

	const lines = ["BEGIN:VEVENT", `UID:${event.id}@${domain}`, `DTSTAMP:${formatDateTime(event.publishedAt, true)}`];

	if (event.isFullDay) {
		const start = parseDate(event.duration.start.slice(0, 10));
		const end = parseDate((event.duration.end ?? event.duration.start).slice(0, 10)).add({ days: 1 });
		lines.push(
			`DTSTART;VALUE=DATE:${start.toString().replaceAll("-", "")}`,
			`DTEND;VALUE=DATE:${end.toString().replaceAll("-", "")}`,
		);
	} else {
		lines.push(`DTSTART:${formatDateTime(event.duration.start, false)}`);
		if (event.duration.end != null) {
			lines.push(`DTEND:${formatDateTime(event.duration.end, false)}`);
		}
	}

	lines.push(`SUMMARY:${escapeText(event.title)}`);
	if (event.summary.length > 0) {
		lines.push(`DESCRIPTION:${escapeText(event.summary)}`);
	}
	if (event.location.length > 0) {
		lines.push(`LOCATION:${escapeText(event.location)}`);
	}
	lines.push(`URL:${url}`, "END:VEVENT");

	return lines;
}

/** A `VCALENDAR` object, with `properties` describing the calendar itself, folded and terminated by crlf. */
function serialize(domain: string, properties: Array<string>, events: Array<Array<string>>): string {
	const lines = [
		"BEGIN:VCALENDAR",
		"VERSION:2.0",
		`PRODID:-//${domain}//Events//EN`,
		"CALSCALE:GREGORIAN",
		...properties,
		...events.flat(),
		"END:VCALENDAR",
	];

	return `${lines.map((line) => foldLine(line)).join("\r\n")}\r\n`;
}

/** A calendar file holding one event, for "add to calendar". */
export function createCalendarFile(options: CalendarEntry & CalendarOptions): string {
	const { domain, ...entry } = options;

	return serialize(domain, [], [createEventLines(entry, domain)]);
}

interface CalendarFeedOptions extends CalendarOptions {
	name: string;
	description: string;
	/** The page listing the events, absolute. */
	url: string;
	/** How often calendar apps should poll the feed, in seconds. */
	refreshInterval: number;
	events: Array<CalendarEntry>;
}

/**
 * A calendar feed holding many events, for subscribing to. The calendar's name, description and refresh interval are
 * given both as rfc 7986 properties and as the `X-WR-*` / `X-PUBLISHED-TTL` extensions which older calendar apps read
 * instead.
 */
export function createCalendarFeed(options: CalendarFeedOptions): string {
	const { domain, name, description, url, refreshInterval, events } = options;

	const duration = `PT${String(refreshInterval)}S`;

	return serialize(
		domain,
		[
			"METHOD:PUBLISH",
			`NAME:${escapeText(name)}`,
			`X-WR-CALNAME:${escapeText(name)}`,
			`DESCRIPTION:${escapeText(description)}`,
			`X-WR-CALDESC:${escapeText(description)}`,
			`URL:${url}`,
			`REFRESH-INTERVAL;VALUE=DURATION:${duration}`,
			`X-PUBLISHED-TTL:${duration}`,
		],
		events.map((entry) => createEventLines(entry, domain)),
	);
}
