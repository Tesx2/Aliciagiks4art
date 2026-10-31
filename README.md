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
│   └── _lib/                   # R2 and Cloudflare Access helpers
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

The upload manager is available at `/admin`. It lets the site owner upload images and videos, require descriptive alt text, update project details, and remove uploaded work. Newly uploaded projects appear alongside the existing bundled portfolio. Uploaded media and project records are stored in a private R2 bucket; the Pages Functions serve public portfolio media and require Cloudflare Access authentication plus an email allowlist for all write operations. The bucket does not need a public `r2.dev` URL.

### Cloudflare setup

1. In **R2 Object Storage**, create a private bucket named `aliciagiks4art-portfolio-media`.
2. The `wrangler.jsonc` file declares the `PORTFOLIO_BUCKET` binding. Keep the bucket name and binding in sync; alternatively add the same binding in **Workers & Pages → aliciagiks4art → Settings → Bindings → Add → R2 bucket**. Redeploy after adding or changing a dashboard binding.
3. In **Zero Trust → Access → Applications**, create a **Self-hosted** application for `aliciagiks4art.dpdns.org/admin*`. Add an **Allow** policy for the owner’s sign-in email. This protects the admin page while leaving the public portfolio open.
4. In **Workers & Pages → aliciagiks4art → Settings → Variables and secrets**, add these Production variables:
   - `ACCESS_TEAM_DOMAIN`: `https://<your-team-name>.cloudflareaccess.com`
   - `ACCESS_AUD`: the Access application’s Audience (AUD) tag
   - `ADMIN_EMAILS`: the allowed admin email address, for example `aliciagiks@gmail.com`
5. Deploy the project. Open `https://aliciagiks4art.dpdns.org/admin`, sign in with the allowlisted email, and upload a small image with alt text to confirm the workflow.

The admin API verifies the signed Cloudflare Access JWT and checks its email against `ADMIN_EMAILS`; it does not trust a client-supplied email or a plain Access header. Write requests also have to come from the site’s own origin. The API accepts JPEG, PNG, WebP, MP4, and WebM files up to 50 MB. Existing bundled portfolio media remains available; the manager edits uploaded R2 items.

## Customize

- Edit the introduction and portfolio presentation in `src/components/`.
- Update featured projects, services, and artist information in `src/data/portfolioData.ts`.
- Add artwork and video under `public/geeks4drisony/`, then update `public/geeks4drisony/manifest.json` to include new work in the archive.
