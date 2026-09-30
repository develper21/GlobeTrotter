# 🏛️ System Architecture

### GlobeTrotter — Travel Planning Platform

This document describes the overall system architecture, technology stack, folder structure, data flow, and key design decisions for the GlobeTrotter application.

---

## 1. High-Level Architecture

GlobeTrotter follows a full-stack architecture using React (Vite) and Express.

```
┌──────────────┐  HTTPS/JSON   ┌─────────────────────┐  REST API   ┌──────────────────────┐   Prisma ORM   ┌─────────────────────────┐
│     User     │ ←───────────→ │   React Frontend    │ ←─────────→ │   Express Backend    │ ←────────────→ │        PostgreSQL       │
│ (Web Browser)│               │   (Vite / SPA)      │  JWT Auth   │ (Controllers/Services)│               │ (via Prisma ORM)        │
└──────────────┘               └─────────────────────┘             └──────────────────────┘               └─────────────────────────┘
```

- The **React SPA** renders all screens and keeps the JWT in `localStorage`.
- The **Express API** validates every request (Zod), enforces auth/roles, and applies business rules in services.
- **Prisma** is the only path to PostgreSQL — no raw SQL in controllers.

## 2. Technology Stack

Technologies used in the project and their purpose.

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 19 (Vite) | UI framework |
| Language | JavaScript (ES2022) | Frontend; TypeScript on the backend |
| Routing | React Router v7 | Client-side navigation & guards |
| Styling | Vanilla CSS with design tokens (`index.css`) | Consistent, themeable UI |
| State | Zustand stores + axios client | Global auth state, typed API calls |
| Backend | Express 4 + TypeScript | REST API, middlewares, validation |
| Database | PostgreSQL 15+ (Prisma 5) | Relational data & migrations |
| Auth | JWT (jsonwebtoken) + bcryptjs | Stateless auth, hashed passwords |
| Uploads | Multer + Cloudinary | Trip cover photos & avatars |
| Testing | Jest + Supertest | Integration tests for the API |
| Deployment | Netlify (web) + Render (server) | Hosting & deployment |
| Version Control | Git & GitHub | Source code management |

## 3. Folder Structure

The project follows a client/server split to keep the code organized and scalable.

```
GlobeTrotter/
├── website/                    # Frontend (React + Vite)
│   └── src/
│       ├── api.js (lib)        # Axios instance + JWT interceptor
│       ├── components/         # Reusable UI components (layout, guards, common)
│       ├── pages/              # One folder per route: auth, trips, cities, ...
│       ├── store/              # Zustand stores (authStore)
│       └── utils/              # Formatters, helpers
├── server/                     # Backend (Express + TypeScript)
│   └── src/
│       ├── config/             # env config + Prisma client singleton
│       ├── controllers/        # HTTP layer (request → response)
│       ├── services/           # Business logic (ownership, rules)
│       ├── repositories/       # Data access helpers
│       ├── validators/         # Zod schemas per feature
│       ├── middlewares/        # auth, role, validate, error, notFound, upload
│       ├── routes/             # Express routers (mounted in routes/index.ts)
│       ├── errors/             # AppError hierarchy
│       ├── utils/              # logger, response helpers
│       └── app.ts / server.ts  # App factory + bootstrap
├── docs/                       # This documentation hub
└── **/postman/postman.json     # API collections (server + website)
```

## 4. Data Flow (Request Lifecycle)

1. The browser calls `api` (axios) → `VITE_API_URL` + `/api/...` with `Authorization: Bearer <token>`.
2. Express middleware chain runs: helmet → CORS → rate limit → JSON parsing → morgan.
3. The matching router applies `authMiddleware` (JWT) and optional `requireRole(ADMIN)`.
4. `validate(schema)` checks params/query/body with Zod → 400 with field details on failure.
5. The controller calls a service; services enforce ownership and business rules via Prisma.
6. Responses always use the standard envelope — `sendSuccess` / `sendCreated` / `sendNoContent`.
7. Errors bubble to the central error middleware → `{ success: false, message, error: { code, details? } }`.

## 5. Key Design Decisions

- **Standard response envelope:** every endpoint returns `{ success, message, data?, meta?, error? }`.
- **Ownership at the service layer:** every trip/expense/post query is filtered by `userId`, so other users' records look like 404.
- **Master data vs user data:** countries/cities/activities are read-only master data; trips/stops/days/expenses are user data.
- **Computed trip status:** UPCOMING / ONGOING / COMPLETED derived from dates, never stored.
- **Budget integrity:** totals use explicit `TripExpense` records only; `TripActivity.customCost` is an itinerary estimate and is never double-counted.
- **Privacy-safe sharing:** `TripShare.shareSlug` exposes a read-only projection of a PUBLIC trip only.
- **Role-based access:** `requireRole(Role.ADMIN)` guards all `/api/admin/*` routes.

## 6. Environments & Deployment

| Environment | Frontend | Backend | Notes |
|---|---|---|---|
| Local | `http://localhost:5173` (vite) | `http://localhost:5000` (nodemon) | `.env.local` on both sides |
| Production | Netlify | Render (`render.yaml`) | `VITE_API_URL` + CORS `ALLOWED_ORIGINS` must match |

Frontend build (`npm run build`) outputs `website/dist`; the server builds with `tsc` to `server/dist` and runs `prisma migrate deploy` on release.
