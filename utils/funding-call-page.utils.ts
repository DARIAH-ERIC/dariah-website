import { CalendarDate, getLocalTimeZone, now } from "@internationalized/date";

import type { FundingCall } from "@/types/funding-calls";

export const convertDateToCalendarDate = (date: Date): CalendarDate => {
	return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
};

export const getFundingCallStatus = (
	startDate: Date,
	endDate: Date,
): "open" | "closed" | "upcoming" => {
	const startCalendarDate = convertDateToCalendarDate(startDate);
	const endCalendarDate = convertDateToCalendarDate(endDate);

	const currentTime = now(getLocalTimeZone());

	if (currentTime.compare(startCalendarDate) <= 0 && currentTime.compare(endCalendarDate) <= 0)
		return "upcoming";
	if (currentTime.compare(startCalendarDate) >= 0 && currentTime.compare(endCalendarDate) <= 0)
		return "open";

	return "closed";
};

export const sortFundingCalls = (fundingCalls: Array<FundingCall>): Array<FundingCall> => {
	const openFundingCalls = fundingCalls.filter((fundingCall) => {
		const {
			duration: { start: startDate, end: endDate },
		} = fundingCall;
		const status = getFundingCallStatus(startDate, endDate ?? startDate);
		return status === "open";
	});

	const otherFundingCalls = fundingCalls.filter((fundingCall) => {
		const {
			duration: { start: startDate, end: endDate },
		} = fundingCall;
		const status = getFundingCallStatus(startDate, endDate ?? startDate);
		return status !== "open";
	});

	openFundingCalls.sort((a, b) => {
		const aTitle = a.title;
		const bTitle = b.title;

		if (aTitle < bTitle) return 1;
		if (aTitle > bTitle) return -1;
		return 0;
	});

	otherFundingCalls.sort((a, b) => {
		const aTitle = a.title;
		const bTitle = b.title;

		if (aTitle < bTitle) return 1;
		if (aTitle > bTitle) return -1;
		return 0;
	});

	return [...openFundingCalls, ...otherFundingCalls];
};
