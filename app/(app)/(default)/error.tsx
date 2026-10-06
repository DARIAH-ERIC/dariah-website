"use client";

import { useExtracted as useTranslations } from "next-intl";
import { Fragment, type ReactNode, useEffect, useRef } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import { href } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";

interface ErrorPageProps {
	error: Error & { digest?: string };
	retry: () => void;
}

/**
 * Catches errors thrown while rendering a page, below the default layout, so header, footer and skip link stay. Errors
 * in the root layout itself are left to `app/global-error.tsx`.
 *
 * Metadata exports are not supported for error boundaries, so the title is rendered with react's `<title>`. The site
 * title is not appended as on other pages, because `getSiteMetadata()` is server-only.
 *
 * Focus is moved to the heading, since the error replaces the page without a navigation, and would otherwise not be
 * announced to screen reader users.
 */
export default function ErrorPage(props: Readonly<ErrorPageProps>): ReactNode {
	const { error, retry } = props;

	const t = useTranslations();

	const headingRef = useRef<HTMLHeadingElement>(null);

	useEffect(() => {
		// oxlint-disable-next-line no-console
		console.error(error);
	}, [error]);

	useEffect(() => {
		headingRef.current?.focus();
	}, []);

	return (
		<Fragment>
			{/*
			 * Error boundaries support no metadata exports, see https://github.com/vercel/next.js/issues/45620. On loads
			 * with a warm http cache, the page's own metadata `<title>` can mount after this one, and then wins.
			 */}
			<title>{t("Something went wrong")}</title>
			<Main className="px-main pbs-20 pbe-24">
				<div className="max-inline-measure">
					<h1 ref={headingRef} className="text-title-1 focus:outline-none" tabIndex={-1}>
						{t("Something went wrong")}
					</h1>
					<p className="mbs-6 text-lead font-regular text-text-weak">
						{t("An unexpected error occurred while loading this page. Please try again.")}
					</p>
					{error.digest != null ? (
						<p className="mbs-6 text-caption text-text-weak">
							{t("Error reference: {digest}", { digest: error.digest })}
						</p>
					) : null}
					<div className="mbs-10 flex flex-wrap gap-4">
						<button
							className="inline-flex min-block-15 cursor-pointer items-center border-2 border-stroke-accent bg-background-base px-12 font-heading text-body font-bold text-text-accent underline-offset-4 hover:underline focus-visible-outline"
							onClick={() => {
								retry();
							}}
							type="button"
						>
							{t("Try again")}
						</button>
						<Link
							className="inline-flex min-block-15 items-center border-2 border-stroke-accent bg-background-base px-12 font-heading text-body font-bold text-text-accent underline-offset-4 hover:underline focus-visible-outline"
							href={href({ pathname: "/" })}
						>
							{t("Go to the home page")}
						</Link>
					</div>
				</div>
			</Main>
		</Fragment>
	);
}
