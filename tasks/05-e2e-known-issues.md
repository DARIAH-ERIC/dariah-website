# Known issues from the e2e coverage work

Found while extending the e2e suite (2026-10-05). The rss feed links missing from indexable pages were fixed already
(`createAlternates` in `lib/metadata.ts`), and so were 3 and 4 below (marked as fixed); everything else is open. Each
issue names the test that covers it, if any, and how that test is marked.

## How to run the suite

The suite needs the knowledge base api and a typesense instance with the e2e fixtures. Two switches set how the server
is started:

- `EXPOSE_TESTING_API=1` - next's instant navigation testing api, which `instant()` needs.
- `E2E_TEST_PROXY=1` - next's test proxy, which `next.onFetch` needs (newsletter, revalidation and error tests). Set
  it for playwright too: the tests which use `next` are skipped otherwise (see `e2e/lib/test.ts`), so a server without
  the proxy cannot send a real subscription. The proxy turns off the incremental cache in `next start`, which breaks
  the `instant()` tests (see 4), so a production build is tested in two runs.

```sh
# A typesense for testing - not the knowledge base's on 8108: `search:fixtures:load` deletes the collections' content.
pnpm dev:services:up typesense   # set TYPESENSE_PORT / NEXT_PUBLIC_TYPESENSE_PORT if 8108 is taken
pnpm dev:services:setup          # creates the collections, writes the search api key to .env.local
pnpm search:fixtures:load        # e2e/fixtures/search.ts

# Against `next dev` - started by playwright with both switches, unless a server is running already:
E2E_TEST_PROXY=1 pnpm test:e2e

# Against a production build, what the `instant()` tests are for. Without the proxy, `next.onFetch` tests skip:
EXPOSE_TESTING_API=1 bun run build && EXPOSE_TESTING_API=1 bun run start
pnpm test:e2e
# ...then restarted with the proxy, for the `next.onFetch` tests (the `instant()` tests fail in this run):
EXPOSE_TESTING_API=1 E2E_TEST_PROXY=1 bun run start
E2E_TEST_PROXY=1 pnpm test:e2e e2e/newsletters.spec.ts e2e/revalidation.spec.ts e2e/errors.spec.ts
```

If port 3000 is taken, set `PORT` for both the server and playwright (see `instant-nav.rig.md`). Setting
`E2E_TEST_PROXY=1` for playwright against a server without the proxy makes the newsletter success test send a real
subscription to the production api (it uses an `example.com` address).

## App bugs

### 1. "Try again" on the error page crashes react-aria components in firefox and webkit

After the error boundary's retry, react-aria components throw because their localized strings are missing in the
browser:

- firefox: `TypeError: can't access property "longPressMessage", strings is undefined`
- webkit: `TypeError: undefined is not an object (evaluating 'strings[key]')`

`next.config.ts` replaces every react-aria locale module in the browser bundle with an empty one
(`configs/turbopack/empty-locale-module-loader.cjs`, rule `reactAriaLocales`), relying on `<LocalizedStringProvider>` in
`app/(app)/_components/providers.tsx` to supply the strings. After `retry()` in `app/(app)/(default)/error.tsx` they are
no longer available. Chromium passed in some runs, so it may be timing-dependent rather than browser-specific.

Investigated, decision postponed - see `tasks/06-react-aria-strings-after-server-error.md`. In short: the server render
fails, the page is rendered in the browser, and `<LocalizedStringProvider>`'s script never runs; the strings are missing
before the retry already.

- Test: `e2e/errors.spec.ts` › "renders the page again on “Try again”" - `test.fixme`. Remove the `fixme` once fixed.
- Note: that test only runs under `next dev`, see 7.

### 2. The search pages do not work without javascript

`/search` shows only its loading skeleton without javascript: the form and the results are inside a `<Suspense>`
boundary, and react swaps the streamed content in for the fallback with an inline script. The comment on `SearchForm`
(`app/(app)/(default)/_components/search-form.tsx`) says the form still works as a plain `get` form; it is never
rendered. The resource catalogue has the same problem - analysed in `tasks/04-resource-catalogue-architecture.md` - and
`/get-involved/opportunities` likely too (same `SearchForm`, same structure).

- Test: `e2e/search.spec.ts` › "/search without javascript" › "submits the query as an ordinary form" - `test.fixme`.

### 3. `/search` answers an unknown category with `200` to html-limited bots - fixed

`/search?type=unknown` renders the not-found page, but with status `200` for everyone. Other list pages call
`notFound()` in `generateMetadata` for params their codec rejects, so html-limited bots (see `htmlLimitedBots`) get a
real `404` - e.g. `resources/resource-catalogue/page.tsx` and `events/page.tsx`. `search/page.tsx`'s
`generateMetadata` does not parse the search params. Browsers get `200` on every such page by design: the status is
sent before the results stream in.

Fixed: `generateMetadata` parses the search params and calls `notFound()` for ones the codec rejects.

- Test: `e2e/search.spec.ts` › "shows the not-found page for an unknown category" checks the bot's `404` too
  (`e2e/lib/bot.ts`). Under `next dev`, this - like the resource catalogue's - logs an `InvariantError: Route … did not
  produce a static shell`; the response is right.

## Test failures that already existed

Confirmed against the code from before the coverage work (`e2e/lib/test.ts` at `d3447b1`): these fail the same way.

### 4. `instant()` tests fail against the production build - fixed

Against `EXPOSE_TESTING_API=1 bun run build && bun run start`, on all three browsers:

- `e2e/detail-pages.spec.ts` › every `…/[slug]` › "commits the skeleton instantly on a client-side navigation from
  the list…" (7 routes)
- `e2e/lib/paginated-list.ts` › `/news`, `/about/impact-case-studies`, `/get-involved/funding-calls` › `page/[page]` ›
  "commits the whole page instantly…" and "navigates to the next page instantly"

The navigation inside `instant()` never commits, e.g. `expect(page).toHaveURL(/\/news\/page\/2$/)` still sees the list's
first page. 33 of the 40 failures in the last full run.

Cause: `experimental.testProxy` was switched on by `EXPOSE_TESTING_API=1` as well. With the proxy, next sets
`NEXT_PRIVATE_TEST_PROXY`, and `IncrementalCache` then returns nothing (`disableForTestmode`), so `next start` serves
no prerendered page from the build: `/news/page/2` was the generic `/news/page/[page]` shell, with the list resumed per
request - which the instant lock withholds. ("Already existed" above only reverted `e2e/lib/test.ts`, not
`next.config.ts`, where the proxy was added in `10d82f3`.) Fixed by giving the proxy its own switch,
`E2E_TEST_PROXY` - see "How to run the suite". All 18 of these tests pass in firefox; webkit, see 10.

### 5. Table of contents never marks the section being read in chromium

`e2e/table-of-contents.spec.ts` › "links to the sections of a content page, and marks the one being read" fails on
every chromium run, against both `next dev` and the production build: after clicking the last entry, it does not get
`aria-current="true"`.

### 6. Flaky against `next dev`

Under `next dev` with several workers, webkit `instant()` tests fail and some navigation tests are flaky (e.g.
`e2e/navigation.spec.ts` › "closes when following a link…"). Several new tests wait up to 15s for a url change after
typing or choosing a filter for the same reason. The `instant()` tests are meant to run against a production build (see
`instant-nav.rig.md`), but see 4.

## Limits of the test setup

### 7. Some tests only run under one server mode

- `e2e/revalidation.spec.ts` › "expires the tagged api data…" needs a production build: under `next dev`, cached
  functions run on every request, so there is nothing to expire. Skipped otherwise.
- `e2e/errors.spec.ts` causes an error by failing the api request for the search page's content with `next.onFetch`.
  In a production build that content is cached, so there is no request to fail, and the tests skip. The search index
  would be a better target (search results are never cached), but the typesense client does not use `fetch`, and the
  test proxy only intercepts `fetch` and http `GET`s.

So neither mode runs the whole suite. A failure that does not depend on caching would fix the error tests, e.g. an
uncached api request, or a test-only switch.

### 8. Tests depend on the live api's content

Events, the calendar, opportunities, the members map, feeds and "Add to calendar" read from the knowledge base api,
which defaults to production (`NEXT_PUBLIC_API_BASE_URL`). The tests check structure rather than entries - order of
months, every card showing the chosen badge, counts adding up - but still need some content to exist, e.g. events
before 2024-03 and at least one member country. Mocking with `next.onFetch` is not an option for cached data: a mocked
response would be stored in the shared cache and leak into other tests. A staging api, or a local knowledge base with
known content, would make these deterministic.

### 9. Traces contain the api access token

`next.onFetch` records each intercepted request's headers in playwright's report, including `x-api-access-token`.
Traces (`trace: "on-first-retry"`) and html reports should not be shared publicly.

### 10. WebKit stalls for ~10s after following a link on the impact case studies list

`e2e/about.spec.ts` › `/about/impact-case-studies/page/[page]` › "navigates to the next page instantly" fails every
time in webkit against a production build: the navigation commits ~10s after the click, past the 5s `expect` timeout.
Not caused by `instant()` - the same without the lock - nor by a lost click (it reaches the page within ~150ms) or
slow data (the prefetches answer within ~300ms). The page's main thread is blocked for most of those 10s, and only a
handful of frames are rendered. Only with `Desktop Safari`'s `deviceScaleFactor: 2`: at 1 it commits in ~3s. `/news`
blocks for ~0.5s, funding calls for ~2s. Disabling `box-shadow`/`filter`, or hiding the images, did not reliably help.
Likely headless webkit's software rendering (headless chromium's is known to delay paint by seconds), but not
established, and not checked in a real Safari.
