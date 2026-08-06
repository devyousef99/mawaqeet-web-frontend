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
**Admin and provider can be modified and shipped completely independently** — they
share only what lives in `packages/`.

This uses [Multi-Zones](https://nextjs.org/docs/app/guides/multi-zones), Next.js's
own micro-frontend mechanism. (Module Federation is the other common approach, but
it targets the Pages Router and does not support the App Router / RSC this project
is built on.)

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

Then open **http://localhost:4100** — the shell serves login and proxies `/admin`
and `/provider` to their zones. Visiting a zone port directly (`:4101/admin`) also
works and is faster when you're only working on one zone; a zone's bare root
redirects to its own dashboard.

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

## Deploying (Vercel Microfrontends)

The three apps are joined into one domain by **Vercel Microfrontends**. Path
routing is declared in [apps/shell/microfrontends.json](apps/shell/microfrontends.json)
and handled by Vercel, so no app contains proxy rewrites of its own.

Each app is still its own Vercel project, differing only by **Root Directory**:

| Vercel project | Root Directory | Role |
|---|---|---|
| `shell` | `apps/shell` | default app — owns `/` and `/login` |
| `admin` | `apps/admin` | routed `/admin/:path*` |
| `provider` | `apps/provider` | routed `/provider/:path*` |

> The keys in `microfrontends.json` **must match the Vercel project names
> exactly**. Because the workspace packages are named `@mawaqeet/*`, each entry
> also sets `packageName` so the local proxy can map config → running app.

Dashboard setup (one time):

1. Create a **Microfrontends group** and add all three projects.
2. Set **shell** as the default app.
3. Deploy to **Preview** to verify, then promote to production.
4. Attach your customer-facing domain to the **shell** project.

`withMicrofrontends` injects `assetPrefix` and routing automatically — never set
`assetPrefix` manually, and **`basePath` is not supported**. Cross-app links stay
plain relative paths (`/admin`, `/provider`) so routing resolves on its own.

Each app also has a `vercel.json` that installs from the workspace root so the
shared `packages/*` resolve during the build.

> **Note:** the individual project URLs stay publicly reachable, so a zone can be
> hit directly, bypassing the shell. Put auth in front of them before real data
> goes in.

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

## UI shell

The header ([packages/ui/src/Topbar.tsx](packages/ui/src/Topbar.tsx)) carries the
app-wide controls, and both zones get them automatically:

| Control | Behaviour |
|---|---|
| ☰ Menu | Collapses the sidebar to a 64px icon rail (labels become hover tooltips) |
| ☀ / 🌙 | Light / dark theme |
| Languages + `LTR`/`RTL` | Flips text direction across the whole app |
| 🔔 | Notifications |

All three preferences persist to `localStorage` (`mw-theme`, `mw-dir`,
`mw-collapsed`) and are applied by a small pre-hydration script
([PrefsScript.tsx](packages/ui/src/PrefsScript.tsx)) so a saved dark or RTL
preference doesn't flash the wrong way on first paint.

### RTL

Direction is driven by `dir` on `<html>`. Layout styles use **CSS logical
properties** (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `border-e`) rather than
physical ones (`ml-`, `left-`), so the entire UI mirrors automatically — no
duplicated stylesheets. When adding UI:

- Use `ms-4`, not `ml-4`; `start-0`, not `left-0`; `text-start`, not `text-left`.
- For inline styles use `insetInlineStart`, not `left`.
- For genuinely directional glyphs (arrows), add the `rtl:` variant —
  e.g. `rtl:rotate-180`.

Purely decorative, symmetric elements (the gradient-card blobs) intentionally keep
physical positioning.

### Theming gotcha (important)

Tailwind scans for class names relative to the CSS file but **skips
`node_modules`** — and npm workspaces symlink `packages/ui` into `node_modules`.
Without the explicit `@source "../";` in
[globals.css](packages/ui/src/globals.css), any utility used *only* inside
`packages/ui` silently never compiles, so the component renders unstyled (this is
what once left the sidebar and header white in dark mode). Keep that directive.

Recharts styles tooltips with inline styles that `dark:` cannot reach, so charts
pull theme-aware values from [`useChartTheme()`](packages/ui/src/chart.tsx)
instead of hard-coded hex colours.

## Notes

- **Dark mode**: header toggle (and on login); persisted to localStorage.
- **Design tokens**: `packages/ui/src/globals.css` (`--color-brand`, `--color-mint`,
  `--color-coral`, `--color-grape`…). Font: Nunito Sans.
- **Mock data**: `packages/data/src/index.ts` — swap for your API.
- **Auth is a mock**: login just links into each zone. Add real auth (and a session
  the zones share) before this handles real data.
- Avatars are generated initials (no external images). Label spellings intentionally
  match the Figma ("Subscribtions", "TUESEDAY"…).

Stack: Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind v4 · recharts · lucide-react · npm workspaces.
