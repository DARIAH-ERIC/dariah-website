# Decision: `use cache` or `use cache: remote` on Vercel

Where this app's `"use cache"` results live once deployed to Vercel, which cached calls that affects, and whether some
of them should move to `"use cache: remote"`. Investigated on 2026-10-06 against next 16.3.8. Still open: read the
docs listed at the end, then decide.

## Current state (2026-10-06)

- **Every data function uses plain `"use cache"`** with an explicit `cacheLife` - `"content"` for knowledge base data
  (`next.config.ts`: stale 5 min, revalidate 1 day, expire 1 year, invalidated by the revalidation webhook through
  `cacheTag`), `"hours"` for `getLatestResources` and `getMonthlyVisits` (`/analytics`, Matomo).
- **No `cacheHandlers` in `next.config.ts`**, so both `"use cache"` and `"use cache: remote"` would use next's
  in-memory LRU, unless the platform provides a handler. Nothing uses `"use cache: remote"` or `"use cache: private"`.
- **Production is Vercel.** There is no `.vercel` link or vercel cli in the repo, so the project's plan and settings
  (e.g. Fluid compute) were not checked.

## What the docs say

### Next (bundled, `node_modules/next/dist/docs/01-app/03-api-reference/`)

- `05-config/01-next-config-js/cacheHandlers.md`: "If you don't configure `cacheHandlers`, Next.js uses an in-memory
  LRU (Least Recently Used) cache for both `default` and `remote`." The default cache "is isolated to each Next.js
  process".
- `01-directives/use-cache.md`, section "Runtime caching considerations": with the default handler, on serverless,
  "Cache entries typically don't persist across requests (each request can be a different instance), or during
  revalidation. Build-time caching works normally." Also: "Neither caching directive carries over to a new deploy,
  because the cache key includes the build (or `deploymentId`) ID."
- `01-directives/use-cache-remote.md`: `"use cache: remote"` stores the output "in a remote cache instead of
  in-memory, providing durable caching shared across all server instances", at the cost of "infrastructure cost and
  network latency during cache lookups". The handler "is configured via `cacheHandlers`, though hosting providers
  should typically provide this automatically".

### Vercel ([Runtime Cache](https://vercel.com/docs/caching/runtime-cache), page updated 2026-08-28)

- On Next 16, `"use cache: remote"` stores into Vercel's Runtime Cache, with no setup beyond `cacheComponents: true`.
  Plain `"use cache"` "is in-memory by default ... ephemeral, and disappears when the instance that served the request
  is shut down".
- Runtime Cache is **regional** (one cache per region), shared by all instances in the region, split by environment
  (production and preview never share), one cache per project on Pro and Enterprise (shared by all projects on Hobby).
- It is **non-durable**: entries are evicted least recently used first when the storage limit is reached. Items up to
  2 MB, up to 128 tags per item. `cacheTag` and `revalidateTag` work.
- Vercel says the storage persists across deployments, but next puts the build id in the cache key (see above), so in
  practice every deploy starts cold.
- It is billed (regional pricing), and observable per project under Observability > Runtime Cache (reads, writes, hit
  rate, revalidations, per tag).
- It is independent of ISR: the page cache and the runtime cache are invalidated separately, or with the same tags.

## Which cached calls this affects

The question is not which functions are cached, but **when they run**.

- **Static shell data is unaffected.** A cached call made while prerendering ends up in the page's static html, which
  Vercel keeps in its page cache (ISR). Requests are served from there; the function only runs again when the page is
  regenerated (the webhook's `revalidateTag`, or the daily `revalidate`). Most `"content"` calls are of this kind, e.g.
  `/news` is `○` in the build output.
- **A cached call made before a component suspends is unaffected too.** Its result is captured in the prerender's
  resume data cache (`next/dist/server/resume-data-cache/`) and reused when the dynamic part resumes at request time.
  Example: `getAdjacentEvents` runs before `connection()` in `events/[slug]/page.tsx`, so the previous/next cards cost
  no api call per request.
- **A cached call made after request data or `connection()` is affected.** It runs at request time, and with plain
  `"use cache"` on Vercel it mostly misses, i.e. calls the api. These are:

  | Route                         | Cached call                                         | Why it runs per request                |
  | ----------------------------- | --------------------------------------------------- | -------------------------------------- |
  | `/events`                     | `getEventsPage` (also in `generateMetadata`)        | anchor defaults to today, searchParams |
  | `/events/calendar`            | `getEventsInRange`                                  | today, month param                     |
  | `/get-involved/opportunities` | `getOpportunitiesPage` (also in `generateMetadata`) | searchParams                           |
  | `/analytics`                  | `getMonthlyVisits` (Matomo)                         | `connection()`, runtime-only token     |
  | `/feeds/events.xml`           | `getEventsFeed(from)`                               | today; see below for its cdn caching   |

  Site search (`searchWebsite`, `searchResources`) is deliberately not cached.

## Done so far (2026-10-06, uncommitted)

- **Date-relative output moved out of cached functions.** A date read inside a cached function is the day the entry
  was created; with the `"content"` profile, a rarely visited page could show it for much longer than a day, since the
  first visitor after `revalidate` still gets the old version. Now read after `connection()`:
  - event badges (already done before: events list, calendar, previous/next cards)
  - funding calls list badges: each badge streams in its own `<Suspense>`; the cards stay in the static shell
    (`/get-involved/funding-calls` is now `◐`, was `○`)
  - opportunities list badges: worked out in `OpportunitiesResults`; they now agree with the api's status filter,
    except just after a deadline, while the cached filtered list still holds an item which has closed since
  - events rss feed: `getEventsFeed(from)` is keyed by today, read in the route (`ƒ`, was `○`). The response has
    `Cache-Control: public, s-maxage=<min(3600, seconds until utc midnight)>`, so feed readers' polls hit the cdn, and
    a new event shows up within the hour instead of immediately after the webhook. Verified on `next start` that the
    header is kept; not yet verified that Vercel's cdn honours it.
- **Kept on purpose:** the homepage's upcoming events still use the cache day (`getUpcomingEvents`), so the homepage
  stays fully static for its first paint; its traffic keeps it at most about a day behind. The same goes for hiding
  ended social media links on member pages (`getMemberOrPartnerBySlug`).
- **`/search-benchmark` and `/api/search-benchmark`** read `SEARCH_BENCHMARK` after `connection()` now, so an
  `ENV_VALIDATION=build` build passes, and the flag works at runtime alone.

## The decision

### Option A: keep plain `"use cache"` everywhere

- No cost, no change.
- The request-time calls in the table above mostly reach the api (or Matomo): more api load, and an api round trip in
  every streamed list.
- Fine if the api copes and the lists' latency is acceptable. The api access token already bypasses rate limits.

### Option B: `"use cache: remote"` for the request-time calls only

- A one-line change per function in the table. The static shell calls stay on plain `"use cache"`, where remote would
  only add a lookup at regeneration time.
- Shared per region, so the hit rate is real after the first request of the day (events) or the first request per
  filter combination (opportunities).
- Costs: Runtime Cache billing, a network round trip per lookup (regional, so small), cold after every deploy.
- Webhook invalidation keeps working through the same tags.
- Watch out: with remote caching, the opportunities list can be up to a `revalidate` behind the api's status filter
  (today the in-memory misses hide this). The badges are already worked out at request time, so they stay right.

### Option C: a custom `cacheHandlers` entry

- Only relevant if self-hosting, or to use a store other than Vercel's. Not needed on Vercel.

## Open questions

- Vercel project settings: plan (Hobby shares one runtime cache across projects), Fluid compute (warm instances can
  serve repeat in-memory hits, which softens option A).
- Runtime Cache pricing for this traffic: see [regional pricing](https://vercel.com/docs/pricing/regional-pricing).
- How often the request-time calls actually reach the api today: the api's access logs for `/events` and
  `/opportunities` requests, or function logs on Vercel. After a switch, Observability > Runtime Cache shows the hit
  rate.
- Does Vercel's cdn cache `/feeds/events.xml` with the `s-maxage` set by the route handler? Check the response's
  `x-vercel-cache` header on a deploy.

## Reading list

- `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-cache.md` - "Runtime caching considerations",
  "Cache keys"
- `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-cache-remote.md` - the comparison table
- `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/cacheHandlers.md`
- `node_modules/next/dist/docs/01-app/02-guides/cdn-caching.md` - how next sets `Cache-Control` per route
- https://vercel.com/docs/caching/runtime-cache
