# [www.dariah.eu](https://www.dariah.eu) website

## Prerequisites

- [bun](https://bun.com) 1.4
- [pnpm](https://pnpm.io) 12
- [docker](https://docs.docker.com/engine/install/) with compose, for the local search service
- `openssl`, to generate local secrets

## Getting started

```bash
pnpm install               # dependencies, environment variables, route and api types
bun run dev:services:up    # start typesense
bun run dev:services:setup # create search collections and a search-only api key
bun run dev
```

`pnpm install` runs the `prepare` lifecycle script, which creates `.env.local` and `docker/.env` from their
`.example` files - generating a shared typesense admin key and a revalidation webhook secret - and generates
route types and the api client from the knowledge base openapi document.

`dev:services:setup` talks to typesense, so give the container a moment to accept connections after
`dev:services:up`.

## Environment variables

Values which are identical in every environment have a default in `configs/env.schema.ts`, and do not need to be
configured anywhere. Values which differ per environment - the app base url, and the typesense host and port - have
no default on purpose: a development fallback would be baked into the client bundle by a production build, so a
missing value must fail instead.

Preview deployments on vercel derive the app base url from `NEXT_PUBLIC_VERCEL_URL`, which requires "Enable access to
System Environment Variables" in the project settings. Production always needs an explicit
`NEXT_PUBLIC_APP_BASE_URL`.

## Fetching api data

The api client in `lib/api/endpoints.ts` is generated from the knowledge base openapi document by `generate:openapi`.
Every operation is an endpoint object with `request()`, `url()` and `cacheTags()`, the last exposing the `x-cache-tags`
the operation declares. Routes do not call endpoints directly. They await functions in `lib/data/`, which are the cache
boundaries:

- `"use cache"` with the custom `content` profile from `next.config.ts` - long-lived, because entries are invalidated
  on demand by the revalidation webhook, with a daily refresh as safety net - and `cacheTag(...endpoint.cacheTags())`,
  so the invalidation reaches exactly the entries computed from the changed data.
- The request `Result` is unwrapped inside the boundary - it is not serializable, so it cannot cross one. A failed
  request throws, leaving no entry behind, and fails a prerender instead of caching an error. A `404` is mapped to
  `null` where a route wants to answer with its own not-found page.
- Paginated list operations cap their page size, generated as `maxPageSize`; `collectAll()` in `lib/api/paginate.ts`
  walks every page when a route needs the whole list. Ranges of numeric parameters are not part of the types, only of
  the generated doc comments.

Data rendered by the root layout - the navigation menus in the header, the site metadata in the footer - is fetched
the same way. Async server components in `app/(app)/(default)/_components` await the cached functions, so the result is
part of the app shell every route shares, fetched once rather than per page.

Two routes serve as reference examples:

- `app/(app)/(default)/network/working-groups/page.tsx` prerenders entirely at build time, because every input is
  cached and nothing reads request data. Small lists are collected completely inside one cache entry. Its active and
  inactive tabs are two routes sharing one component, so both prerender with the right tab selected.
- `app/(app)/(default)/news/page/[page]/page.tsx` is a paginated list. The page number is a route segment listed by
  `generateStaticParams`, not a search parameter: reading `searchParams` makes a page request-time work on every
  visit, a segment keeps every page static. Each page is its own cache entry; the `news` tag invalidates all of them,
  which a new item at the top requires anyway. Page 1 lives at `/news`.
- `app/(app)/(default)/news/[slug]/page.tsx` is a detail route: every published slug is listed by
  `generateStaticParams`, and a missing slug answers `404` because `params` is awaited at the top of the page.

State which selects among prerendered variants - a tab, a page number, a filter - belongs in the path for the same
reason, not in a query string. `generateStaticParams` is an optimisation, not a whitelist: a page number or slug which
appears after the build is served as app shell on its first visit, then upgraded and cached.

A variant with a canonical short url - page 1 at `/news`, the active tab at `/network/working-groups` - is a wrapper
`page.tsx` which renders the shared component with a constant. The alternative is a rewrite from the short url to the
parameterised route plus the mirror redirect, so the long form does not become a second url for the same page. The
route types are rewrite-aware, so `href()` would keep accepting the short url. It was not chosen because every
collapsed variant then needs two config entries in `next.config.ts` which have to stay in sync with a route elsewhere,
and because the parameterised route has to keep a case - page 1, status active - which the wrapper lets it reject.

## Revalidation webhook

The knowledge base dashboard notifies the website of content changes by sending `POST /api/revalidate` with the shared
`REVALIDATION_WEBHOOK_SECRET` as bearer token, and a `{ "tags": [...] }` body. The tags are the `CacheTag` vocabulary
of the api's openapi document, which also declares the tags each operation reads under `x-cache-tags`; the generated
endpoints expose them via `cacheTags()`, so cached responses must be tagged with exactly those. The handler expires every
delivered tag immediately, so the next request refetches instead of serving a stale entry - editors expect to see their
change on the next load. It answers `404` while no secret is configured, `401` for a
wrong secret, and `400` for a payload with unknown or missing tags.

## Continuous integration

`pnpm install` skips creating environment files when `CI` is set, so a production build never picks up development
values. Jobs which do need a local development environment - end-to-end tests, for example - must run
`bun run dev:env:init` explicitly.

Note that `docker build` does _not_ set `CI`. A Dockerfile must therefore set `ENV CI=1` before installing
dependencies, or the image build will generate a development `.env.local` and bake `http://localhost:3000` into the
client bundle.
