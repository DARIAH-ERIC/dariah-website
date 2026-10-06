"use client";

import { useExtracted as useTranslations } from "next-intl";
import { type ErrorInfo, catchError } from "next/error";
import { type ReactNode, useEffect } from "react";

interface SectionErrorFallbackProps {
	/**
	 * Classes for the message's box, usually the section's grid placement, so the section keeps its layout.
	 *
	 * Ignored with `isHidden`.
	 */
	className?: string;
	/** For sections which are extras: on error, nothing is rendered, as if the section had nothing to show. */
	isHidden?: boolean;
}

/**
 * The fallback for a section of a page which fails to load: a short message and a button to try again, or nothing at
 * all. The rest of the page stays. The message replaces the section's loading skeleton, so it is plain text, not a live
 * region.
 */
function SectionErrorFallback(props: Readonly<SectionErrorFallbackProps>, errorInfo: ErrorInfo): ReactNode {
	const { className, isHidden = false } = props;
	const { error, retry } = errorInfo;

	const t = useTranslations();

	useEffect(() => {
		// oxlint-disable-next-line no-console
		console.error(error);
	}, [error]);

	if (isHidden) {
		return null;
	}

	return (
		<div className={className}>
			<p>{t("This section could not be loaded.")}</p>
			<button
				className="mbs-6 inline-flex min-block-15 cursor-pointer items-center border-2 border-stroke-accent bg-background-base px-12 font-heading text-body font-bold text-text-accent underline-offset-4 hover:underline focus-visible-outline"
				onClick={() => {
					retry();
				}}
				type="button"
			>
				{t("Try again")}
			</button>
		</div>
	);
}

/**
 * An error boundary around a section of a page which fetches its own data, so a failed request takes down only that
 * section rather than the whole page. It goes outside the section's `<Suspense>`, so the fallback replaces the loading
 * skeleton and the content alike. `notFound()` and `redirect()` pass through it, and it clears on navigation.
 *
 * Not for a page's main content: that should fail visibly, through the route's `error.tsx`.
 */
export const SectionErrorBoundary = catchError(SectionErrorFallback);
