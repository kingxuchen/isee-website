This is a [Next.js](https://nextjs.org) project (App Router). Production target is a Debian VPS: nginx on **8080**, `next start` on `127.0.0.1:3000`.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Step-by-step: [docs/deploy/VPS.md](docs/deploy/VPS.md).

```bash
./scripts/rsync-to-vps.sh   # Mac → VPS; build on Debian, not on the Mac
```
