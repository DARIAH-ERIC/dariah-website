# React aria's strings are missing after a server error

Investigation of issue 1 in `tasks/05-e2e-known-issues.md` ("Try again" on the error page crashes react-aria
components), 2026-10-05/06, next 16.3.8, react 19.3, react-aria-components 1.21.1 / react-aria 3.52.1.

**Status: decision postponed.** Nothing is changed in the app; the test is still `test.fixme`. A fix was tried and works
(appendix A), but it was not clear yet whether the underlying behaviour is a bug - in next, in react aria, or in neither -
and which fix fits best.

## The symptom

`e2e/errors.spec.ts` › "renders the page again on “Try again”": the api request for the search page's content
(`/api/v1/pages/slugs/search`) is failed with a `503` through next's test proxy, the error page appears, the failure is
switched off, "Try again" is clicked - and instead of the search page, react aria throws:

- firefox: `TypeError: can't access property "longPressMessage", strings is undefined`
- webkit: `TypeError: undefined is not an object (evaluating 'strings[key]')`

Only runs under `next dev` with the test proxy (`E2E_TEST_PROXY=1` for the server and for playwright): in a production
build the search page's content is cached, so there is no request to fail.

## Background: how the two kinds of i18n strings reach the browser

- **next-intl** - `NextIntlClientProvider` (in `app/(app)/_components/providers.tsx`) is a context provider. It renders
  on the server, but its messages travel as props of a client component, in the rsc payload. Any client component,
  e.g. `error.tsx`, gets them through context, however the tree was rendered.
- **react aria** - `<LocalizedStringProvider locale={locale} />` (same file) is _not_ a context provider: it takes no
  children. It renders a `<script>` whose content sets two globals, `window[Symbol.for('react-aria.i18n.locale')]` and
  `window[Symbol.for('react-aria.i18n.strings')]` (`react-aria/dist/private/i18n/server.cjs`). React aria's hooks read
  these globals directly (`LocalizedStringDictionary.getGlobalDictionaryForPackage` in `@internationalized/string`);
  without them they fall back to the strings bundled with each package. `next.config.ts` empties all those bundled
  locale modules in the browser bundle (rule `reactAriaLocales`, `configs/turbopack/empty-locale-module-loader.cjs`),
  following https://github.com/adobe/react-spectrum/pull/10462, so the globals are the only source.

The globals are set only when the script _runs_, and a browser only runs a script that the html parser comes across - not
one that is inserted into the document by javascript, as react does when it renders on the client. React warns about
this in the console: _"Encountered a script tag while rendering React component. Scripts inside React components are
never executed when rendering on the client."_

On a normal page that is fine: the html is server-rendered, the script runs while parsing, before hydration. Client-side
navigations keep the same `window`, so the globals persist. Checked on `/`, `/search` and `/news`: locale `en-GB`, 23
packages.

## Findings

Each was measured with a throwaway playwright spec against `next dev` with the test proxy (see appendix B).

1. **The error page rendered is `app/(app)/(default)/error.tsx`**, not `app/global-error.tsx` - with header and footer,
   and its paragraph "An unexpected error occurred while loading this page" (the global one says "An unexpected error
   occurred."). Both have the heading "Something went wrong".

2. **What throws**: `getPageBySlug("search")` (`lib/data/pages.ts`) gets the `503`, which is not a `404`, so
   `result.unwrap()` panics (`Panic: Unwrap called on Err: HttpError`). It is called by `generateMetadata` and by
   `SearchPage`. As a `"use cache"` function which throws stores nothing, the failing request is made twice. (When the
   first call succeeds, the second reuses its cache entry - so failing "only the second request" does not isolate
   anything.)

3. **The page's own error is enough to fail the server render.** With `generateMetadata` made to swallow the error
   (temporary `.catch(() => null)`), the page alone throwing still gives:
   - status `500`, `<html id="__next_error__">`;
   - a body of only `<div hidden><!--$?--><template id="B:0"></template><!--/$--></div>` and the rsc payload;
   - no header, no `error.tsx` markup, no react aria script in the html.

   `SearchPage` awaits `getPageBySlug` at its top level - for the title and introduction - outside any `<Suspense>`;
   only `SearchResults` is inside one.

4. **Why `error.tsx` does not catch it on the server**: react's server renderer does not use error boundaries. A thrown
   error goes to the nearest `<Suspense>` boundary, which is sent as its fallback and rendered in the browser instead,
   where the error boundary catches it. With no `<Suspense>` above, the shell itself fails - and next then sends the bare
   document above, and the browser renders the whole tree from the rsc payload: root layout, providers, error boundary.
   Throwing _inside_ `<Suspense>` would keep the layout, with the script, server-rendered (by react's design - not
   tested here).

5. **So the strings are missing from the start, not because of the retry.** The `<script>` element is in the dom (found
   in `<body>`), but was created by react, so it never ran: `strings: 0` right after the error page appeared.

6. **Why nothing throws until "Try again"**: the first react aria code that needs a string is `useMenuTrigger`, which
   formats `longPressMessage` on every render (`react-aria/dist/private/menu/useMenuTrigger.mjs`). It is used by
   `useSelect` and `useComboBox`. The error page, the footer, and the header - whose navigation is our own
   `components/ui/navigation-menu.tsx`, not react aria's menu - use none. "Try again" (`retry()`, which refetches the
   segment and re-renders it on the client) renders the search page, whose category filter is a react aria `Select`
   (`components/ui/select.tsx`), which throws. Any `Select`/`ComboBox` in a client-rendered document would do the same.

7. **`global-error.tsx` "works"** because it is client-rendered the same way but renders no react aria component that
   needs strings; its own `HtmlDocument` has no `LocalizedStringProvider` anyway.

8. **"Chromium passed in some runs"** (from the original report) was not reproduced - no Google Chrome on this machine.
   A plausible explanation: turbopack's persistent dev cache (`.next/dev`) does not pick up a change to a
   `turbopack.rules` condition. With the tried fix reverted, the test still passed until `.next/dev` was moved aside;
   then it failed with the error above.

## Is it a bug, and whose?

Every piece behaves as designed, as far as checked:

- react: no error boundaries during server rendering; errors outside `<Suspense>` fail the shell.
- next: a failed shell is answered with a `500` error document, and the app is rendered in the browser from the rsc
  payload, where `error.tsx` catches the error. Observed under `next dev` only - see open questions.
- browsers and react: scripts rendered on the client do not run (react warns).

Two ways to see it - not settled:

1. **React aria's limitation.** `LocalizedStringProvider` assumes its script is always in server-parsed html, which
   next does not guarantee for the layout. React aria could fall back, e.g. by also setting the globals from a client
   component - which may be worth raising in react-spectrum.
2. **Next could keep the shell.** An error page should arguably not throw away the server-rendered layout - with it,
   the script would be parsed and run, as on every normal page. React's server renderer cannot do this on its own (no
   error boundaries), but next knows its segments, and the rsc payload already records the error at the failed
   segment: next could render the segment's `error.tsx` in its place on the server. That would even keep the `500`:
   the status is sent with the shell, which has not been sent yet when the page throws - unlike option B below, which
   costs the `500`.

### Points for "next could do better"

- **Not only errors.** In the "metadata-only" variant of finding 3 - `SearchPage` swallowing the error, getting `null`
  and calling `notFound()` outside `<Suspense>` - the response was just as bare: status `404`, `<html
  id="__next_error__">`, the not-found page rendered only in the browser. So under `next dev`, not even `notFound()`
  gets a server-rendered layout here. Whether that is intended is unclear, and the strongest hint that this may be worth
  reporting.

### Points for "production rarely gets here"

Reasoning, not measured: with cache components, everything outside `<Suspense>` must be prerenderable, so in a
production build the shell (layout, script) is usually prerendered and sent before any request-time code runs, and a
request-time failure happens inside a `<Suspense>` hole - the layout stays. `getPageBySlug` is cached: a failure at
build time fails the build, a failed background revalidation keeps the stale entry. A blocking revalidation after a
cache entry's `expire` is the only path to a request-time failure outside `<Suspense>` that comes to mind. So the
bare-document behaviour may hardly reach users - but `next dev` hits it on every such failure.

### Next step: a minimal reproduction

To tell bug from design, before deciding on a fix:

1. A fresh next 16.3 app with `cacheComponents: true`: a root layout containing an inline
   `<script dangerouslySetInnerHTML={{ __html: "window.marker = 1" }} />` and some visible markup, an `error.tsx`, and
   three pages:
   - one which throws outside `<Suspense>` (an uncached `fetch` to a failing url, or `connection()` then `throw`);
   - one which calls `notFound()` outside `<Suspense>`;
   - one which throws inside `<Suspense>`, as the control.
2. For each, under `next dev` and `next build && next start`: the status, whether the html is `<html
   id="__next_error__">` or contains the layout markup, and whether `window.marker` is set.
3. Search next's issues and discussions for the bare error document / `__next_error__` with `error.tsx` or
   `not-found.tsx` (dev and prod), and check `app-render` in next's source for where the error document is chosen.
4. Depending on the result: report to next (shell discarded where it could be kept), or to react-spectrum (provider
   relies on parsed html), or neither - and pick an option below.

## Options

|     | Fix                                                                                                                                                                                               | Cost                                                                                                                                                                                                                                       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A   | Keep react aria's bundled `en-US` modules (its fallback for `en-GB`), empty the rest - appendix A                                                                                                 | at most ~4.3kB gzipped JS (24 packages' `en-US.mjs`, 23.5kB raw; only imported packages are bundled), cached                                                                                                                               |
| A'  | A, and drop `<LocalizedStringProvider>`: for a single-locale site the bundled `en-US` covers every page                                                                                           | saves the inline script on every document: 7.1kB raw / 2.2kB gzipped, present twice (`<script>` plus its copy in the rsc payload). `I18nProvider` in `client-providers.tsx` gets the locale explicitly, so nothing needs the locale global |
| B   | `<Suspense>` around the pages (in the `(default)` layout around `children`, or a `loading.tsx`), so a page error only client-renders that boundary and the layout and script stay server-rendered | errors would answer `200` instead of `500` (the status is sent with the shell); changes the loading ui and the prerendered shells - check against the `instant()` tests                                                                    |
| C   | A client component which receives the strings as props and sets the globals before react aria reads them                                                                                          | duplicates ~23kB raw of strings in every page's rsc payload                                                                                                                                                                                |
| D   | "Try again" as `window.location.reload()`                                                                                                                                                         | does not fix it: the strings are missing before the retry; a reload only helps if the server render now succeeds, and loses client state                                                                                                   |

Decide after the minimal reproduction. If next is not going to keep the shell, A or A' (status `500` kept, works however
a page was rendered); B is a separate decision about error responses. Even if next changes, A' still saves the inline
script on every document.

## Open questions

- What does a **production build** send for a failed shell - the same bare `__next_error__` document? The error tests
  cannot reach it (the content is cached there). The minimal reproduction above answers it; in this app it would need
  an uncached failure, or a test-only switch (see issue 7 in `tasks/05-e2e-known-issues.md`).
- Is next _meant_ to discard the layout for an error - or a `notFound()` - outside `<Suspense>`? See the minimal
  reproduction above.
- Does react-spectrum PR 10462, where the locale-emptying approach comes from, say anything about client-rendered
  documents?
- Chromium: does it really pass, or was that the stale dev cache?

## Appendix A: the tried fix

Verified on a fresh `.next/dev`, in firefox and webkit: the test passes with it and fails without it.

```diff
--- a/next.config.ts
+++ b/next.config.ts
+/**
+ * React aria's locale modules, emptied in the browser bundle: `<LocalizedStringProvider>` sends the strings for the
+ * app's locale with the html instead, in an inline script.
+ *
+ * Except for `en-US`, which react aria falls back to for `en-GB`. The inline script only runs when the html is parsed,
+ * so it does not when the page is rendered in the browser instead - e.g. after a server error, whose response is next's
+ * bare error document - and without the fallback, react aria's components then throw on the missing strings.
+ */
 const reactAriaLocales = `**/{${reactAriaPackages.join(",")}}/**/??-??.{js,cjs,mjs,json}`;
+const reactAriaFallbackLocale = /\/en-US\.[^/]+$/;
@@
 			[reactAriaLocales]: {
-				condition: { all: ["foreign", "browser"] },
+				condition: { all: ["foreign", "browser", { not: { path: reactAriaFallbackLocale } }] },
```

and `test.fixme` → `test` in `e2e/errors.spec.ts`.

## Appendix B: how to reproduce the measurements

- Run against `next dev` started by playwright: `E2E_TEST_PROXY=1 pnpm test:e2e <spec> --project=firefox --workers=1`.
- **After changing `turbopack.rules` in `next.config.ts`, move `.next/dev` aside before trusting a result** (finding 8).
- Probe spec (a temporary `e2e/zz-probe.tmp.spec.ts`; delete it afterwards):

```ts
import { test } from "#/e2e/lib/test.ts";

test("probe", async ({ page, next }) => {
	let isFailing = true;
	next.onFetch((request) =>
		isFailing && new URL(request.url).pathname === "/api/v1/pages/slugs/search"
			? Response.json({ message: "Service Unavailable" }, { status: 503 })
			: "continue",
	);
	page.on("pageerror", (error) => console.log("pageerror", error.message));
	const response = await page.goto("/search");
	const html = (await response?.text()) ?? "";
	const markup = html.replace(/<script[\s\S]*?<\/script>/g, "");
	await page.getByRole("heading", { name: "Something went wrong" }).waitFor();
	console.log({
		status: response?.status(), // 500
		htmlTag: /<html[^>]*>/.exec(html)?.[0], // <html id="__next_error__">
		ssrHeader: /<header/.test(markup), // false
		ssrScript: /<script>window\[Symbol\.for\('react-aria/.test(html), // false
		...(await page.evaluate(() => ({
			paragraph: document.querySelector("main p")?.textContent, // error.tsx's
			strings: Object.keys((window as any)[Symbol.for("react-aria.i18n.strings")] ?? {}).length, // 0
		}))),
	});
	isFailing = false;
	await page.getByRole("button", { name: "Try again" }).click(); // pageerror: strings is undefined
});
```

- Page-only failure (finding 3): temporarily change `generateMetadata`'s call in `search/page.tsx` to
  `await getPageBySlug("search").catch(() => null)`.
