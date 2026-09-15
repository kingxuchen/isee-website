# isee-international

Independent international marketing site in the `isee-website` pnpm workspace.

## Commands

From the workspace root:

```bash
pnpm dev:isee-international
pnpm typecheck:isee-international
pnpm build:isee-international
pnpm test:isee-international
pnpm preview:isee-international
```

Or run the bare scripts from this directory:

```bash
pnpm dev
pnpm typecheck
pnpm build
pnpm test
pnpm preview
```

## Configuration

Set `VITE_SITE_URL` when the deployed origin is known. The local default is `http://localhost:8082`.

The App owns its source, public assets, documentation content, and changelog. It does not import libraries from another App.
