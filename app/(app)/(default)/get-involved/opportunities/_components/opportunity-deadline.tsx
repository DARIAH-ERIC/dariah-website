import { type DateTimeFormatOptions, useFormatter, useExtracted as useTranslations } from "next-intl";
import type { ReactNode } from "react";

import type { OpportunityBase } from "#/lib/api/schemas.ts";

/**
 * An opportunity's dates, as what a reader needs from them: the deadline, i.e. `duration.end`, when there is one - when
 * it opens is rarely of interest - and otherwise the day it opens from. They are calendar dates stored as UTC midnight,
 * so they are formatted in UTC, or the day may shift (see `DateRange`).
 */
export function useOpportunityDeadline(duration: OpportunityBase["duration"]): { term: string; date: string } {
	const t = useTranslations();
	const format = useFormatter();

	const options: DateTimeFormatOptions = { dateStyle: "long", timeZone: "UTC" };

	if (duration.end == null) {
		return { term: t("Open from"), date: format.dateTime(new Date(duration.start), options) };
	}

	return { term: t("Deadline"), date: format.dateTime(new Date(duration.end), options) };
}

/** The deadline as a line of text, e.g. "Deadline: 15 March 2026", as a card shows it. */
export function OpportunityDeadline(
	props: Readonly<{ className?: string; duration: OpportunityBase["duration"] }>,
): ReactNode {
	const { className, duration } = props;

	const t = useTranslations();
	const format = useFormatter();

	const options: DateTimeFormatOptions = { dateStyle: "long", timeZone: "UTC" };

	if (duration.end == null) {
		return (
			<p className={className}>{t("Open from {date}", { date: format.dateTime(new Date(duration.start), options) })}</p>
		);
	}

	return (
		<p className={className}>{t("Deadline: {date}", { date: format.dateTime(new Date(duration.end), options) })}</p>
	);
}
