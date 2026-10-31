# Aliciagiks4art

A creative portfolio for Mary Alicia, featuring graphic design, illustration, animation, motion design, and digital experiences.

## Overview

The site brings selected visual work together in a responsive portfolio with project filters, search, image and video previews, service information, an artist profile, and direct contact links. Artwork and video are stored in `public/` and the project catalogue is maintained in `src/data/portfolioData.ts` and `public/geeks4drisony/manifest.json`.

## Tech stack

- React and TypeScript
- Vite
- Tailwind CSS
- Motion for interface animation
- Lucide icons
- Static site output for Cloudflare Pages

## Project structure

```text
.
├── index.html
├── src/
│   ├── App.tsx
│   ├── index.css
│   ├── components/
│   └── data/portfolioData.ts
├── functions/
│   ├── api/                    # Public project/media API and protected admin API
│   └── _lib/                   # R2 and Better Auth helpers
├── public/
│   ├── assets/
│   └── geeks4drisony/
│       ├── manifest.json
│       └── project artwork and video
├── package.json
├── vite.config.ts
└── wrangler.jsonc
```

## Run locally

Install [Bun](https://bun.sh), then run:

```bash
bun install
bun run dev
```

Vite serves the local preview at the address printed in the terminal.

## Deploy to Cloudflare Pages

Connect the `aliciagiks-graphics/Aliciagiks4art` repository to Cloudflare Pages and use:

- Production branch: `main`
- Framework preset: `None`
- Build command: `bun run build`
- Build output directory: `dist`
- Root directory: `/`

`wrangler.jsonc` also sets `pages_build_output_dir` to `dist`. Keep the dashboard output directory and this setting in sync. The build command is required because the browser cannot run the TypeScript and React source files directly; Vite compiles them into the static files in `dist/`.

## R2 uploads and portfolio admin

The upload manager is available at `/admin`. It lets the site owner upload images and videos, require descriptive alt text, update project details, and remove uploaded work. Newly uploaded projects appear alongside the existing bundled portfolio. Uploaded media and project records are stored in a private R2 bucket; Pages Functions serve public portfolio media and require a valid Better Auth session for the configured admin email before any write operation. The bucket does not need a public `r2.dev` URL.

### Cloudflare setup

The website is hosted in the Cloudflare account you choose. Create the R2 and D1 resources in that same hosting account, because a Pages project cannot bind directly to resources owned by another account. This uses the current site origin for `/admin` and `/api`; it does not require separate `admin.` or `media.` subdomains.

1. In the hosting account’s **R2 Object Storage**, create a private bucket named `aliciagiks4art-portfolio-media`.
2. The `wrangler.jsonc` file already declares `PORTFOLIO_BUCKET`; the bucket must exist in this hosting account.
3. Create a D1 database named `aliciagiks4art-auth`. Copy its database ID into the `database_id` field for `AUTH_DB` in `wrangler.jsonc` before deploying. This project uses that Wrangler configuration as the source of truth for bindings.
4. Apply `migrations/0001_better_auth.sql` to that D1 database. You can use the D1 SQL console, or run `npx wrangler d1 execute aliciagiks4art-auth --remote --file=migrations/0001_better_auth.sql` after authenticating Wrangler to the hosting Cloudflare account.
5. `BETTER_AUTH_URL` and `ADMIN_EMAIL` are configured as plain-text `vars` in `wrangler.jsonc` (currently `https://aliciagiks4art.dpdns.org` and `aliciagiks@gmail.com`). Change `ADMIN_EMAIL` there if the owner will sign in with another email. Add these two Production secrets in **Workers & Pages → aliciagiks4art → Settings → Variables and secrets**:
   - `BETTER_AUTH_SECRET`: a new, randomly generated secret of at least 32 characters
   - `SETUP_SECRET`: a separate random one-time setup code
6. Deploy the site after replacing the D1 ID placeholder. Visit `https://aliciagiks4art.dpdns.org/admin`, enter the configured admin email, create a password of at least 12 characters, and provide the one-time setup code.
7. After the first admin account is created, remove `SETUP_SECRET` from the Cloudflare project settings and redeploy. Sign in at `/admin`; public sign-up is disabled.

The admin API verifies the Better Auth session on the server and checks its email against `ADMIN_EMAIL`; it does not trust a client-supplied email. Write requests must also come from the site’s own origin. The API accepts JPEG, PNG, WebP, MP4, and WebM files up to 50 MB. Existing bundled portfolio media remains available; the manager edits uploaded R2 items. Password reset email is not enabled yet; it needs a configured mail provider and will be added as a later step.

## Customize

- Edit the introduction and portfolio presentation in `src/components/`.
- Update featured projects, services, and artist information in `src/data/portfolioData.ts`.
- Add artwork and video under `public/geeks4drisony/`, then update `public/geeks4drisony/manifest.json` to include new work in the archive.
