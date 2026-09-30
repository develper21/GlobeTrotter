# 🧠 Project Memory

### GlobeTrotter — Context, Progress & Important Notes

This document keeps track of the current state of the project, important decisions, and things to remember. It helps maintain continuity across development sessions and for new contributors.

| 📅 **Last Updated** | 👤 **Current Phase** | 🚦 **Status** |
|---|---|---|
| September 30, 2026 | **Complete (Sprint 5)** | All sprints merged |
| 11:00 AM | Documentation & Testing | Stable |

---

## 🎯 Current Status

- ✅ Project setup completed (Express + TypeScript server, React + Vite client)
- ✅ Git repository initialized with client/server split
- ✅ PostgreSQL + Prisma configured and migrated
- ✅ Authentication (register, login, JWT, protected routes) completed
- ✅ Travel master data (countries, cities, activities) completed
- ✅ Trips, multi-city stops and itinerary builder completed
- ✅ Budget, expenses, calendar and dashboard completed
- ✅ Sharing, community, and admin analytics completed
- ✅ Documentation hub + Postman collections completed

## 🔄 In Progress

*Nothing currently in progress — the MVP scope is complete.*

## ✅ Completed Tasks

| # | Task | Completed On |
|---|---|---|
| 1.1 | Initialize Express + TypeScript project | Aug 22, 2026 |
| 1.2 | Configure React + Vite client | Aug 22, 2026 |
| 1.3 | Set up Git repository | Aug 22, 2026 |
| 2.1 | Auth endpoints (register/login/me) | Aug 25, 2026 |
| 2.2 | Login & register pages | Aug 25, 2026 |
| 2.3 | Protect dashboard routes | Aug 26, 2026 |
| 3.1 | Countries/cities/activities endpoints | Aug 28, 2026 |
| 3.2 | Trip CRUD + computed status | Aug 30, 2026 |
| 3.3 | Stops, days & itinerary builder | Sep 2, 2026 |
| 4.1 | Budget & expenses module | Sep 5, 2026 |
| 4.2 | Calendar + dashboard views | Sep 7, 2026 |
| 4.3 | Public sharing & copy trip | Sep 9, 2026 |
| 5.1 | Community posts module | Sep 12, 2026 |
| 5.2 | Admin panel & analytics | Sep 14, 2026 |
| 5.3 | Integration test suite | Sep 16, 2026 |
| 5.4 | Docs hub + Postman collections | Sep 30, 2026 |

## 📝 Important Notes & Decisions

- **Response envelope:** every API response is `{ success, message, data?, meta?, error? }` — frontend code relies on `data` / `meta` keys.
- **Token storage:** the client keeps the JWT in `localStorage.token`; a 401 clears it and redirects to `/login` (axios interceptor in `lib/api.js`).
- **Budget rule:** totals come only from `TripExpense` records; `TripActivity.customCost` is never double-counted.
- **Ownership rule:** other users' trips/expenses/posts return 404 (not 403) to avoid leaking existence.
- **Seed accounts:** `demo@globetrotter.com / Demo@123456` (USER) and `admin@globetrotter.com / AdminSecret99!` (ADMIN).
- **Frontend↔API drift to watch:** the UI sends `PUT /trips/:id/stops/reorder` with `{ orderedIds }`, `PUT /auth/profile`, and `DELETE /trips/:id/stops/:stopId/activities/:actId`, while the API expects `PATCH …/stops/reorder` with `{ stopIds }`, `PATCH /auth/profile`, and `DELETE /api/trip-activities/:id`. Both Postman collections document these; fix one side when touching this code.
- **Rate limit:** 100 requests / 15 min per IP — running full Postman collections repeatedly can hit 429 near the end.

## 🔮 Next Steps

1. Fix the frontend↔API drift listed above (pick one side and align).
2. Clear the post-MVP backlog in TASKS.md (likes/comments first).
3. Add CI (lint + typecheck + tests) on every PR.
4. Monitor production logs on Render/Netlify after launch week.
