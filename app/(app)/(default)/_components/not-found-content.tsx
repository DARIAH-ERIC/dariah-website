import { useExtracted as useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import { href } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";

/** Shared by `app/global-not-found.tsx`, for unmatched urls, and `not-found.tsx`, for `notFound()` calls in pages. */
export function NotFoundContent(): ReactNode {
	const t = useTranslations();

	return (
		<Main className="px-main pbs-20 pbe-24">
			<div className="max-inline-measure">
				<p aria-hidden={true} className="font-heading text-display text-text-accent">
					404
				</p>
				<h1 className="mbs-6 text-title-1">{t("Page not found")}</h1>
				<p className="mbs-6 text-lead font-regular text-text-weak">
					{t("The page you are looking for does not exist or has been moved.")}
				</p>
				<Link
					className="mbs-10 inline-flex min-block-15 items-center border-2 border-stroke-accent bg-background-base px-12 font-heading text-body font-bold text-text-accent underline-offset-4 hover:underline focus-visible-outline"
					href={href({ pathname: "/" })}
				>
					{t("Go to the home page")}
				</Link>
			</div>
		</Main>
	);
}
