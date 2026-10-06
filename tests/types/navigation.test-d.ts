import { type Href, href } from "#/lib/navigation/href.ts";
import { postDetailSearchParams, postListSearchParams } from "#/tests/types/search-params.fixture.ts";

declare module "next" {
	interface NavigationRouteRegistry {
		"/[locale]/app/archive/[[...parts]]": { locale: string; parts?: Array<string> };
		"/[locale]/app/docs/[...parts]": {
			locale: string;
			parts: Array<string>;
		};
		"/[locale]/app/posts/[id]": { id: string; locale: string };
		"/[locale]/app/posts/create": { locale: string };
	}

	interface NavigationSearchParamsRegistry {
		"/[locale]/app/posts/[id]": typeof postDetailSearchParams;
		"/[locale]/app/posts/create": typeof postListSearchParams;
	}
}

href({ pathname: "/app/posts/create" });
href({ pathname: "/app/posts/[id]", params: { id: "create" } });
href({
	hash: "results",
	pathname: "/app/posts/create",
	searchParams: postListSearchParams.encode({ page: 2, q: "history", tag: ["events"] }),
});
href({
	pathname: "/app/posts/[id]",
	params: { id: "create" },
	searchParams: postDetailSearchParams.encode({ view: "preview" }),
});
href({ pathname: "/app/docs/[...parts]", params: { parts: ["guides", "routing"] } });
href({ pathname: "/app/archive/[[...parts]]" });
href({ pathname: "/app/archive/[[...parts]]", params: { parts: ["2026"] } });
href({ url: "https://example.com" });

// @ts-expect-error -- The concrete value must not be accepted through the dynamic route.
href({ pathname: "/app/posts/create-old" });

// @ts-expect-error -- Dynamic routes require callers to select the pattern and provide params.
href({ pathname: "/app/posts/123" });

// @ts-expect-error -- The locale is provided by next-intl, not href callers.
href({ pathname: "/[locale]/app/posts/create", params: { locale: "en-GB" } });

// @ts-expect-error -- A required dynamic segment needs params.
href({ pathname: "/app/posts/[id]" });

// @ts-expect-error -- A required catch-all must contain at least one segment.
href({ pathname: "/app/docs/[...parts]", params: { parts: [] } });

// @ts-expect-error -- Only the codec discovered for this route can provide its search params.
href({ pathname: "/app/posts/create", searchParams: postDetailSearchParams.encode({ view: "preview" }) });

// @ts-expect-error -- Routes without a discovered codec cannot write search params.
href({ pathname: "/app/docs/[...parts]", params: { parts: ["guide"] }, searchParams: postListSearchParams.encode({}) });

// @ts-expect-error -- External protocols are intentionally allowlisted.
href({ url: "javascript:alert(1)" });

// @ts-expect-error -- Only href() can construct branded navigation descriptors.
const _unbrandedHref: Href = { pathname: "/app/posts/create" };
