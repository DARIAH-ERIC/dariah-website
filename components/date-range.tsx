import { type DateTimeFormatOptions, useFormatter, useExtracted as useTranslations } from "next-intl";
import type { ReactNode } from "react";

interface DateRangeProps {
	/** Iso timestamp, UTC midnight of the first day. */
	start: string;
	/** Iso timestamp, UTC midnight of the last day; open-ended when missing. */
	end?: string;
	className?: string;
}

/**
 * A duration made of calendar dates, like a funding call's or an opportunity's. They are stored as UTC midnight, so
 * they are formatted in UTC, or the day may shift.
 */
export function DateRange(props: Readonly<DateRangeProps>): ReactNode {
	const { start, end, className } = props;

	const t = useTranslations();
	const format = useFormatter();

	const options: DateTimeFormatOptions = { dateStyle: "long", timeZone: "UTC" };

	if (end == null) {
		return <p className={className}>{t("From {date}", { date: format.dateTime(new Date(start), options) })}</p>;
	}

	/** Collapses shared parts, e.g. "1–15 March 2026", and to a single date when both are the same day. */
	return <p className={className}>{format.dateTimeRange(new Date(start), new Date(end), options)}</p>;
}
