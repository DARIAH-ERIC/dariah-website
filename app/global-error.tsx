"use client";

import type { ReactNode } from "react";

import { HtmlDocument } from "#/app/(app)/_components/html-document.tsx";
import { defaultLocale } from "#/lib/i18n/locales.ts";

interface GlobalErrorProps {
	error: Error & { digest?: string };
	retry: () => void;
}

/**
 * Replaces the root layout when it throws, so neither the `next-intl` providers nor the header and footer can be relied
 * on here - which is also why the messages are not translated. Metadata exports are not supported for error boundaries,
 * so the title is rendered with react's `<title>` instead.
 *
 * The home page link is a plain anchor, to leave the broken client-side router with a full page load.
 */
export default function GlobalError(props: Readonly<GlobalErrorProps>): ReactNode {
	const { error, retry } = props;

	return (
		<HtmlDocument locale={defaultLocale}>
			<body>
				<title>Something went wrong</title>
				<main className="container px-container">
					<h1>Something went wrong</h1>
					<p>An unexpected error occurred. Please try again.</p>
					{error.digest != null ? <p>Error reference: {error.digest}</p> : null}
					<button
						onClick={() => {
							retry();
						}}
						type="button"
					>
						Try again
					</button>
					{/* oxlint-disable-next-line nextjs/no-html-link-for-pages */}
					<a href="/">Go to the home page</a>
				</main>
			</body>
		</HtmlDocument>
	);
}
