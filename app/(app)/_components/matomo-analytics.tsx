"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { Fragment, type ReactNode, Suspense, useEffect, useRef } from "react";

declare global {
	interface Window {
		_paq?: Array<Array<unknown>>;
	}
}

interface MatomoAnalyticsProps {
	/** With trailing slash. */
	baseUrl: string;
	id: number;
}

/**
 * Page views are tracked by `PageViewTracker` - including the initial one - since client-side navigations do not reload
 * the tracker script. Commands are queued in `window._paq` until `matomo.js` has loaded.
 */
export function MatomoAnalytics(props: Readonly<MatomoAnalyticsProps>): ReactNode {
	const { baseUrl, id } = props;

	return (
		<Fragment>
			<Script id="matomo" strategy="afterInteractive">
				{`
var _paq = (window._paq = window._paq || []);
_paq.push(["disableCookies"]);
_paq.push(["enableHeartBeatTimer"]);
_paq.push(["enableLinkTracking"]);
_paq.push(["setTrackerUrl", ${JSON.stringify(`${baseUrl}matomo.php`)}]);
_paq.push(["setSiteId", ${JSON.stringify(String(id))}]);
				`}
			</Script>
			<Script async={true} src={`${baseUrl}matomo.js`} strategy="afterInteractive" />
			<Suspense fallback={null}>
				<PageViewTracker />
			</Suspense>
		</Fragment>
	);
}

function PageViewTracker(): null {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const previousUrlRef = useRef<string | null>(null);

	useEffect(() => {
		const search = searchParams.toString();
		const url = new URL(search.length > 0 ? `${pathname}?${search}` : pathname, window.location.origin).href;
		const _paq = window._paq ?? [];
		window._paq = _paq;

		if (previousUrlRef.current != null) {
			_paq.push(["setReferrerUrl", previousUrlRef.current]);
		}
		_paq.push(["setCustomUrl", url]);
		_paq.push(["setDocumentTitle", document.title]);
		_paq.push(["trackPageView"]);

		previousUrlRef.current = url;
	}, [pathname, searchParams]);

	return null;
}
