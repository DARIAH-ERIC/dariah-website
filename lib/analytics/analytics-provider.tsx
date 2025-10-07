"use client";

import { createUrl } from "@acdh-oeaw/lib";
import type { NextWebVitalsMetric } from "next/app";
import { usePathname, useSearchParams } from "next/navigation";
import { useReportWebVitals } from "next/web-vitals";
import { Fragment, type ReactNode, Suspense, useEffect } from "react";

import { env } from "@/config/env.config";

interface AnalyticsProviderProps {
	children?: ReactNode;
}

export function AnalyticsProvider(props: Readonly<AnalyticsProviderProps>): ReactNode {
	const { children } = props;

	useReportWebVitals(reportWebVitals);

	return (
		<Fragment>
			{children}
			<Suspense>
				<PageViewTracker />
			</Suspense>
		</Fragment>
	);
}

function PageViewTracker(): ReactNode {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		const url = createUrl({ baseUrl: env.NEXT_PUBLIC_APP_BASE_URL, pathname, searchParams });
		trackPageView(url);
	}, [pathname, searchParams]);

	return null;
}

function trackPageView(url: URL): void {
	window._paq?.push(["setCustomUrl", url]);
	window._paq?.push(["trackPageView"]);
	window._paq?.push(["enableLinkTracking"]);
}

function reportWebVitals(metric: NextWebVitalsMetric): void {
	window._paq?.push([
		"trackEvent",
		"Analytics",
		`Web Vitals ${metric.id}`,
		metric.name,
		Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
	]);
}
