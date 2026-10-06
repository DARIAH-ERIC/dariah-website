# Decision: resource catalogue architecture

Open architectural choices for `/resources/resource-catalogue`: where the search runs, how the url and the filter
state relate, how the mobile filters dialog is built, and whether the page works without javascript. They depend on
each other, so they are laid out together; the combinations that hang together are at the end.

## Current state (2026-09-29)

- **Search runs on the server.** `ResourcesResults` is an async server component calling `searchResources()`
  (`lib/data/search.ts`, `server-only`, uncached via `connection()`). Results, facet counts and the selected values all
  arrive in the rsc payload.
- **Every change is a navigation.** `SearchForm` submits on each keystroke and each toggled checkbox, not debounced, as
  `router.replace(href, { scroll: false })` inside `startTransition`. The router drops stale navigations; `replace`
  keeps one history entry.
- **The url follows the results.** It changes when the navigation commits, i.e. once the rsc payload has arrived, not
  when the user acts. Measured: with the response delayed by 1.5 s, `?type=service` appeared in the url ~2.3 s after
  the toggle.
- **The inputs run ahead of the url.** The search box and the checkboxes are uncontrolled (`defaultValue`,
  `defaultChecked`), so between an action and the commit the DOM is the only record of it - an implicit optimistic
  state.
- **Mobile filters are a native `<dialog>`** (`_components/facets-panel.tsx`). The server renders the column (hidden
  below `lg`) and the "Show filters" button (hidden from `lg` up), so there is no layout shift; after hydration, below
  `lg`, the column becomes the dialog. The dialog stays mounted while closed, so the checkboxes stay in the form and
  never remount on open or close. Filters apply live; "See N results" only closes it.
- **Without javascript the page shows only the skeleton.** The results stream in behind `<Suspense>`, and the streamed
  html is swapped in by a script. The rendered cards are in the html, hidden. This contradicts the "works without
  javascript" note on `SearchForm`.

## 1. Where the search runs

### A. Server (current)

Browser → Vercel function (rsc render) → typesense → rsc payload.

- ✅ One code path for first load and updates; results are server-rendered html for bots and first paint.
- ✅ No api key in the browser; labels for facet values (consortia, working groups) resolve on the server.
- ❌ Latency. Vercel prod, from Europe, p50 (2026-09-23): **fra1 160–236 ms**, iad1 540–760 ms. Of fra1's figure,
  function → typesense is 18–26 ms and browser → function 56–65 ms; ~100–150 ms is rsc/render overhead that is not the
  search itself.
- ❌ The url and the props lag each user action by that latency (see 2).

### B. Browser-direct

Browser → typesense cluster.

- ✅ Latency: **25–48 ms** p50, either region.
- ✅ Results, url and inputs can change together (see 2B).
- ❌ Needs a search-only, scoped typesense key shipped to the browser, and `sendApiKeyAsQueryParam: true` (typesense-js
  sends a header by default, which costs a cors preflight per distinct url).
- ❌ First load still needs server-rendered results for seo (unfiltered pages are indexed page by page) and first paint,
  so this is really **C**.

### C. Hybrid

The server renders the first load from the url, as now; afterwards the client queries typesense and renders the
results itself.

- ✅ The latency of B for interaction, the html of A for first load and bots.
- ❌ Result rendering exists twice: a server render and a client render of the same cards, or client components used in
  both places, fed from a shared result shape.
- ❌ The facet label maps (consortium and working group names) must be sent to the client.
- ❌ Pagination links and `generateMetadata` (`noindex` for filtered views) keep working from the url, but the client
  must keep the url in sync itself.

The benchmark page is `/search-benchmark` (gated by `SEARCH_BENCHMARK=enabled` at run time).

## 2. How the url relates to the filter state

### A. The url follows the results (current)

The url describes what is on screen: a link copied, a reload or a share mid-request gives the page being looked at. The
inputs run ahead of it:

- **Implicit (current):** uncontrolled inputs; the DOM holds the pending state. Lost if an input remounts during a
  pending navigation - it remounts from the old props, and a second submission inside that window (e.g. typing right
  after closing a dialog which remounted the checkboxes) sends the old selection, and the router drops the earlier
  navigation: the filter is silently lost. Never reverts if a navigation fails.
- **Explicit:** `useOptimistic` over the selection, held above the checkboxes (the form or the facets panel), set in the
  same transition as `router.replace()`; controlled checkboxes read it. Survives remounts, and reverts by itself if the
  navigation fails. Next typically falls back to a full page load on a failed rsc fetch, which re-syncs anyway, so
  reverting is rarely needed.

### B. The url follows the inputs

`history.replaceState` on each change (Next syncs it into `useSearchParams`); inputs are controlled from the url.

- ✅ One source of truth on the client; remounts are harmless; no `useOptimistic`.
- ❌ With 1A, the results lag the url: a link copied mid-request describes results not yet shown. And the rsc fetch
  must be triggered separately - unverified whether `router.replace()` to a url which `replaceState` has already set
  still fetches in this Next version. Two navigation mechanisms side by side.
- ✅ With 1C it is the natural fit: url, inputs and a client-side query change together.

## 3. The mobile filters dialog

### A. Native `<dialog>` (current)

- ✅ Stays mounted while closed, inside the form: one set of checkboxes, no remounts, works with 2A-implicit.
- ✅ `showModal()`: the page is inert (no `Tab` or screen reader cursor out of the dialog), `Escape` closes it, focus
  returns to the trigger.
- ❌ A second dialog pattern beside react-aria's (the mobile navigation).
- ❌ Focus is contained, not wrapped: `Tab` past the last control moves to the browser's own ui, then back into the
  dialog. Not a WCAG issue, but different from react-aria.
- ❌ Scroll lock is a hand-rolled `overflow: hidden` on `<html>`; could use react-aria's `usePreventScroll` instead.
  No enter/exit animation; could be added in css with `@starting-style` (Firefox ≥ 129, Safari ≥ 17.4; older browsers
  get none).

### B. react-aria `Modal` / `Dialog`

- ✅ Same pattern as the mobile navigation: wrapped focus, robust scroll lock (incl. iOS), `entering:`/`exiting:`
  animations.
- ❌ Mounts its content only while open, portalled to `<body>`. The checkboxes must still be in the form while it is
  closed, so they move between a hidden column and the modal, remounting on every open and close - which needs
  2A-explicit (`useOptimistic`) or 2B. And they must stay associated with the form: `UNSTABLE_PortalProvider` into the
  form, or a `form` attribute on each input.

Either way the a11y pattern is the same (APG modal dialog): "Show filters (n)" trigger; dialog named by its "Filters"
heading, which takes focus on open; each facet group a disclosure (button in the `legend`, `aria-expanded`); live
filtering with the result count announced from a status inside the dialog, as the page behind is inert; close and
`Escape` return focus to the trigger, "See results" moves it to the results heading. From `lg` up the facets are a plain
column, not a dialog.

## 4. Javascript-less rendering

### A. Stream behind `<Suspense>` (current)

- ✅ The page shell, header and lead render immediately; the skeleton holds the layout.
- ❌ Without javascript the skeleton never goes away. The facets column, the form and the no-javascript paths in
  `SearchForm` are unreachable.

### B. Await the results in the page

- ✅ Works without javascript: the form submits as a plain `get`, and every result is html.
- ❌ The whole page waits for typesense (one uncached search, ~20–30 ms from fra1 to the cluster), and client
  navigations show nothing new until the results are in - no skeleton.

Also relevant, as the page is dynamic either way: it cannot be prerendered while filters are query params (see
`03-pagination-as-path-segment.md`, which leaves this page out of scope for that reason).

## Combinations

|            | Search    | Url ↔ state | Dialog    | Notes                                                           |
| ---------- | --------- | ----------- | --------- | --------------------------------------------------------------- |
| **Keep**   | 1A server | 2A implicit | 3A native | What ships now. Simplest; ~160–240 ms per interaction on fra1.  |
| **Harden** | 1A server | 2A explicit | 3A or 3B  | `useOptimistic` for correctness on failure; makes 3B viable.    |
| **Fast**   | 1C hybrid | 2B          | 3B        | Interaction at typesense latency; remounts harmless; most code. |

3A works in every row unchanged; 3B only once the selection lives outside the checkboxes (2A explicit or 2B). So
deciding 1 first avoids building optimistic state for a server path which might be replaced.

## Open questions

- Is the Vercel function region pinned to fra1 in the dashboard? iad1 triples the server path's latency.
- Can the ~100–150 ms rsc/render overhead on fra1 be reduced (e.g. by trimming what re-renders per navigation) enough
  to keep 1A?
- Is working without javascript a requirement (4B), or should the note on `SearchForm` be dropped?
- Same questions apply to `/search`, which uses the same `SearchForm` and server search.
