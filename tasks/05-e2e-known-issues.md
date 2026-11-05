# Known issues from the e2e coverage work

Found while extending the e2e suite (2026-10-05). Only the open issues are listed; fixed ones were removed, and the
remaining ones keep their numbers. Each issue names the test that covers it, if any, and how that test is marked.

## How to run the suite

The suite needs the knowledge base api and a typesense instance with the e2e fixtures. Two switches set how the server
is started:

- `EXPOSE_TESTING_API=1` - next's instant navigation testing api, which `instant()` needs.
- `E2E_TEST_PROXY=1` - next's test proxy, which `next.onFetch` needs (newsletter, revalidation and error tests). Set
  it for playwright too: the tests which use `next` are skipped otherwise (see `e2e/lib/test.ts`), so a server without
  the proxy cannot send a real subscription. With the proxy, next sets `NEXT_PRIVATE_TEST_PROXY`, and
  `IncrementalCache` returns nothing (`disableForTestmode`), so `next start` serves no prerendered page from the build:
  a dynamic route's page is its generic shell, resumed per request, which the instant lock withholds. The `instant()`
  tests fail against such a server, so a production build is tested in two runs.

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

### 2. The search pages do not work without javascript

`/search` shows only its loading skeleton without javascript: the form and the results are inside a `<Suspense>`
boundary, and react swaps the streamed content in for the fallback with an inline script. The comment on `SearchForm`
(`app/(app)/(default)/_components/search-form.tsx`) says the form still works as a plain `get` form; it is never
rendered. The resource catalogue has the same problem - analysed in `tasks/04-resource-catalogue-architecture.md` - and
`/get-involved/opportunities` likely too (same `SearchForm`, same structure).

- Test: `e2e/search.spec.ts` › "/search without javascript" › "submits the query as an ordinary form" - `test.fixme`.

## Test failures that already existed

Confirmed against the code from before the coverage work (`e2e/lib/test.ts` at `d3447b1`): it fails the same way.

### 6. Flaky against `next dev`

Under `next dev` with several workers, webkit `instant()` tests fail and some navigation tests are flaky (e.g.
`e2e/navigation.spec.ts` › "closes when following a link…"). Several new tests wait up to 15s for a url change after
typing or choosing a filter for the same reason. The `instant()` tests are meant to run against a production build (see
`instant-nav.rig.md`).

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
