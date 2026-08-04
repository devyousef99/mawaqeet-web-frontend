# Mawaqeet — Micro-frontend Dashboard (Next.js Multi-Zones)

Appointment-booking platform split into independently developed and deployed
Next.js applications ("zones"), served under a single domain.

## Architecture

```
mawaqeet/
├── apps/
│   ├── shell/       :4100  host — owns /, /login, routes everything else
│   ├── admin/       :4101  zone — owns /admin/*
│   └── provider/    :4102  zone — owns /provider/*
└── packages/
    ├── ui/                 shared primitives + shell chrome + form components
    ├── data/               mock data and shared types
    └── config/             shared tsconfig base
```

Each zone is a full Next.js app with its own `package.json`, build, and deploy.
**Admin and provider can be modified completely independently** — they share only
what lives in `packages/`.

The shell is the default zone: it holds the entry routes and proxies every other
path to the zone that serves it via `rewrites` in
[apps/shell/next.config.ts](apps/shell/next.config.ts). Each zone sets an
`assetPrefix` (`/admin-static`, `/provider-static`) so their `_next` assets don't
collide once they share a domain.

## Run it

```bash
npm install
npm run dev          # starts all three apps together
```

Then open **http://localhost:4100** — the shell serves the app and proxies
`/admin` and `/provider` to their zones. Visiting a zone port directly
(`:4101/admin`) also works and is often faster while developing one zone.

Individual apps:

```bash
npm run dev:shell
npm run dev:admin
npm run dev:provider
```

Build (all three, or one at a time):

```bash
npm run build
npm run build:admin
```

## Deploying (Vercel)

This repo contains **three apps, so it needs three Vercel projects** — one per app.
There is no Next.js app at the repo root, so a single project pointed at the root
fails with `The file "/vercel/path0/.next/routes-manifest.json" couldn't be found`.

Create three projects from this same repository, changing only the **Root Directory**:

| Vercel project | Root Directory | Purpose |
|---|---|---|
| `mawaqeet-admin` | `apps/admin` | admin zone |
| `mawaqeet-provider` | `apps/provider` | provider zone |
| `mawaqeet-shell` | `apps/shell` | host — attach your real domain here |

Deploy **admin and provider first** so you have their URLs, then set these
environment variables on the **shell** project only:

```bash
ADMIN_DOMAIN=https://mawaqeet-admin.vercel.app
PROVIDER_DOMAIN=https://mawaqeet-provider.vercel.app
```

The shell throws at build time if these are missing in production, rather than
silently proxying to localhost. Point your customer-facing domain at the shell;
users never visit the zone URLs directly.

Each app has a `vercel.json` that installs from the workspace root so the shared
`packages/*` resolve during the build.

> **Note:** the zone URLs stay publicly reachable. If you need them locked to the
> shell, put auth or [`vercelSkewProtection`](https://vercel.com/docs) / a shared
> secret header in front of them — multi-zones does not do this for you.

Locally, `ADMIN_DOMAIN` / `PROVIDER_DOMAIN` default to the dev ports and need no setup.

## Routes

### Shell (`apps/shell`)
| Route | Screen |
|---|---|
| `/login` | Login — links through to either zone |
| `/` | Redirects to `/login` |

### Admin zone (`apps/admin`)
| Route | Screen |
|---|---|
| `/admin` | Admin home — Today's Performance chart + 18 stat cards |
| `/admin/reports` | Month / Year reports |
| `/admin/appointments` (+`/new`, `/[id]`) | Appointments table, create form, detail with status timeline |
| `/admin/employees` (+`/new`, `/[id]`) | Employees table; create + edit employee forms |
| `/admin/services` (+`/new`, `/[id]`) | Services table; create + edit service forms |
| `/admin/loyal-program` (+`/settings`) | Loyalty ranking; program thresholds |
| `/admin/promotions` (+`/new`, `/[id]`) | Promotions; promo-code form with dual calendars |
| `/admin/users` (+`/new`) | User management |
| `/admin/branches/new` | Branch creation with map |
| `/admin/complains`, `/ratings`, `/notifications`, `/subscriptions`, `/settings` | Remaining admin sections |

### Provider zone (`apps/provider`)
| Route | Screen |
|---|---|
| `/provider` | Branch dashboard — weekly sales, stat cards, monthly bars, daily donut |
| `/provider/reports` | Reports |
| `/provider/appointments` (+`/new`, `/[id]`) | Appointments |
| `/provider/employees` (+`/new`, `/[id]`) | Employees |
| `/provider/services` (+`/new`, `/[id]`) | Services |
| `/provider/loyal-program` (+`/settings`) | Loyalty program |
| `/provider/promotions` (+`/new`, `/[id]`) | Promotions |
| `/provider/subscriptions` | Subscription packages (Basic / Pro / Full) |
| `/provider/settings` | Settings |

## Working in this repo

- **Change one role only** → edit that app under `apps/`. Nothing else is affected.
- **Change both** → edit `packages/ui`. Both zones pick it up.
- **Each zone owns its navigation**: [apps/admin/src/app/nav.ts](apps/admin/src/app/nav.ts)
  and [apps/provider/src/app/nav.tsx](apps/provider/src/app/nav.tsx). The `Sidebar`
  renders whatever nav it is given.
- **Cross-zone links must be plain `<a>` tags**, not `next/link` — `Link` prefetches
  and soft-navigates, which does not work between zones. Mark such nav entries
  `external: true`.
- Pages are duplicated per zone on purpose, so the two roles can diverge freely.
  Shared *primitives* (tables, pills, avatars, forms) stay in `packages/ui`.

## Notes

- **Dark mode**: sidebar toggle (and on login); persisted to localStorage.
- **Design tokens**: `packages/ui/src/globals.css` (`--color-brand`, `--color-mint`,
  `--color-coral`, `--color-grape`…). Font: Nunito Sans.
- **Mock data**: `packages/data/src/index.ts` — swap for your API.
- Avatars are generated initials (no external images). Label spellings intentionally
  match the Figma ("Subscribtions", "TUESEDAY"…).

Stack: Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind v4 · recharts · lucide-react · npm workspaces.
