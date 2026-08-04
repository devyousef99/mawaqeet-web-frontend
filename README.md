# Mawaqeet — Admin & Provider Dashboard (Next.js)

Appointment-booking platform with two independently editable role dashboards —
**admin** and **provider** — in a single Next.js app, deployed as one project.

## Architecture

```
src/
├── app/
│   ├── login/                 shared entry screen
│   ├── (admin)/               ── admin role ──────────────
│   │   ├── layout.tsx           admin chrome (own sidebar/topbar)
│   │   ├── nav.ts               admin navigation (13 items)
│   │   └── admin/…              admin's own pages
│   └── (provider)/            ── provider role ───────────
│       ├── layout.tsx           provider chrome
│       ├── nav.tsx              provider navigation (9 items)
│       └── provider/…           provider's own pages
├── components/                shared primitives + form components
└── lib/                       mock data, theme
```

`(admin)` and `(provider)` are [route groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups)
— the parentheses keep them out of the URL. Each group has its **own layout and
its own navigation**, so the two roles render completely different chrome and can
be modified independently. Their pages are separate files: editing
`/provider/services` never touches `/admin/services`.

Only `src/components` and `src/lib` are shared — the primitives you *want* fixed
in one place (tables, pills, avatars, form bodies).

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

`npm run build && npm start` for production.

## Deploying

One Vercel project, default settings — Root Directory is the repo root and the
framework preset is Next.js. No environment variables required.

## Routes

| Route | Screen |
|---|---|
| `/login` | Login — links into either role |
| **Admin** | |
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
| **Provider** | |
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

- **Change one role only** → edit under `src/app/(admin)/` or `src/app/(provider)/`.
  The other role is untouched.
- **Change both** → edit `src/components`.
- **Each role owns its navigation**: [(admin)/nav.ts](src/app/(admin)/nav.ts) and
  [(provider)/nav.tsx](src/app/(provider)/nav.tsx). `Sidebar` renders whatever it's given.
- Pages are duplicated per role on purpose, so the two can diverge freely.

## Notes

- **Dark mode**: sidebar toggle (and on login); persisted to localStorage.
- **Design tokens**: `src/app/globals.css` (`--color-brand`, `--color-mint`,
  `--color-coral`, `--color-grape`…). Font: Nunito Sans.
- **Mock data**: `src/lib/data.ts` — swap for your API.
- **Auth is a mock**: login just links into each role. Add real auth (and route
  protection) before this handles real data.
- Avatars are generated initials (no external images). Label spellings intentionally
  match the Figma ("Subscribtions", "TUESEDAY"…).

Stack: Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind v4 · recharts · lucide-react.
