# Mawaqeet — Admin Dashboard (Next.js)

Appointment-booking admin platform built from the Figma design: Admin + Branch dashboards,
13 admin sections, create/edit forms, and full dark mode.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

`npm run build && npm start` for production.

## Routes

| Route | Screen |
|---|---|
| `/login` | Login (light glass / dark purple card, wave background) |
| `/admin` | Admin home — Today's Performance chart + 18 stat cards |
| `/admin/reports` | Month / Year reports |
| `/admin/appointments` | Appointments table → row links to detail |
| `/admin/appointments/[id]` | Appointment detail — status timeline, timers, re-assign employee |
| `/admin/appointments/new` | Create appointments — time-slot circles, repeat options |
| `/admin/employees` (+`/new`) | Employees table with booked-slot chips; 7-day working hours form |
| `/admin/services` (+`/new`) | Services table; service form with gradient preview card |
| `/admin/loyal-program` (+`/settings`) | Loyalty ranking; program thresholds |
| `/admin/promotions` (+`/new`) | Promotions with ON/OFF toggles; promo-code form with dual calendars |
| `/admin/users` (+`/new`) | User management; create user with USER TYPE dropdown |
| `/admin/branches/new` | Branch creation with map |
| `/admin/complains`, `/admin/ratings`, `/admin/notifications`, `/admin/subscriptions`, `/admin/settings` | Remaining sections |
| `/branch` | Branch dashboard — weekly sales, stat cards, monthly bars, daily donut |

## Notes

- **Dark mode**: toggle in the sidebar (and on the login screen); persisted to localStorage.
- **Design tokens** live in `src/app/globals.css` (`--color-brand`, `--color-mint`, `--color-coral`, `--color-grape`…). Font: Nunito Sans.
- **Mock data**: `src/lib/data.ts` — swap for your API.
- Avatars are generated initials (no external images). Label spellings intentionally match the Figma ("Subscribtions", "TUESEDAY"…). Fix them in `src/lib/data.ts` / `Sidebar.tsx` whenever you're ready.

Stack: Next.js 16 (App Router) · TypeScript · Tailwind v4 · recharts · lucide-react.
