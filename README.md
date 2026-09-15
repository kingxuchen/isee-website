# isee-website

pnpm Workspace root for independent site Apps. First App: `apps/isee-china`.

See `CONTEXT.md` for Workspace root / App / Independence.

## Setup

```bash
pnpm install
```

## Run the App

```bash
pnpm dev:isee-china
pnpm build:isee-china
pnpm start:isee-china
pnpm lint:isee-china
```

## Deploy

```bash
pnpm deploy:isee-china
```

Builds on the server with:

```bash
docker build -f apps/isee-china/Dockerfile -t isee-china:latest .
```

Site details, research, and design notes live under `apps/isee-china/`.
