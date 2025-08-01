# dariah-website

next.js app with keystatic cms. supersedes
[dariah-eu-website](https://github.com/DARIAH-ERIC/dariah-eu-website)

## how to run

prerequisites:

- [node.js v22](https://nodejs.org/en/download)
- [pnpm v10](https://pnpm.io/installation)

> [!TIP]
>
> you can use `pnpm` to install the required node.js version with `pnpm env use 22 --global`

set required environment variables in `.env.local`:

```bash
cp .env.local.example .env.local
```

install dependencies:

```bash
pnpm install
```

run a development server on [http://localhost:3000](http://localhost:3000):

```bash
pnpm run dev
```

## how to test

generate a production build and run end-to-end tests with:

```bash
pnpm run build
pnpm run test:e2e
```

visual snapshot tests should be run in the devcontainer - or a comparable debian bookworm based
linux environment -, and can be updated with:

```bash
pnpm run test:e2e:update-snapshots
```
