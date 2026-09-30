# 📜 Development Rules

### GlobeTrotter — Project Guidelines for AI & Human Collaboration

This document defines the development rules, coding standards, and best practices for the GlobeTrotter application. These rules ensure consistency, maintainability, security, and quality. Both AI assistants and human contributors must follow these guidelines.

---

## 1️⃣ General Principles

These rules apply to the entire project.

- ✅ Follow the project documentation (PRD, ARCHITECTURE, DESIGN) before starting any task.
- ✅ Keep the code clean, readable and well-structured.
- ✅ Prioritize simplicity and maintainability.
- ✅ Do not duplicate logic. Reuse existing components, utilities or services.
- ✅ Make small, focused changes instead of large, risky edits.
- ✅ Do not modify unrelated files.
- ✅ Write self-explanatory code with meaningful variable and function names.

## 2️⃣ Technology & Coding Standards

Rules related to the tech stack and coding style.

| Area | Rule |
|---|---|
| 🌐 Language | TypeScript on the server. Avoid `any` unless absolutely necessary. Plain modern JavaScript (ES2022) on the client. |
| 🏗️ Framework | Follow Express best practices (controllers → services → Prisma). Follow React function-component patterns with hooks on the client. |
| 🎨 Styling | Use the shared CSS tokens in `website/src/index.css` and follow DESIGN.md. No ad-hoc hex colors in components. |
| 🔍 Linting | Follow ESLint configs in both `website/` and `server/`; keep `npm run lint` clean. |
| 🖋️ Formatting | Consistent formatting (2-space indent, single quotes on the server). No dead code or commented-out blocks. |
| 📦 Dependencies | Use stable, well-maintained packages only. Do not add a dependency without a strong reason. |
| 🗃️ File Naming | Use clear names: `trip.controller.ts`, `trip.service.ts`, `trip.routes.ts` on the server; `TripsPage.jsx`, `TripCard.jsx` on the client. |
| 🔐 Secrets | Never commit `.env*` files or keys. Only `.env.example` templates belong in Git. |

## 3️⃣ Project Structure

Follow the defined folder structure in ARCHITECTURE.md to keep the codebase organized.

- ✅ Reusable UI components live in `website/src/components/`.
- ✅ Feature-specific code stays in its page folder under `website/src/pages/<feature>/`.
- ✅ Database access lives in services/repositories on the server — never in controllers or the frontend.
- ✅ Common utilities belong in `server/src/utils/` or `website/src/utils/`.
- ✅ Types and interfaces live in `server/src/types/` (server) or next to their feature (client).
- ✅ Do not create new folders without a clear architectural reason.
- ✅ New routes must be registered in `server/src/routes/index.ts` and mirrored in both Postman collections.

## 4️⃣ API & Backend Rules

- ✅ Every endpoint uses the standard response envelope (`success`, `message`, `data?`, `meta?`, `error?`).
- ✅ Validate all input with Zod schemas in `server/src/validators/` — never trust `req.body`.
- ✅ Enforce ownership in services (filter by `userId`); other users' resources must return 404, not 403.
- ✅ Admin-only endpoints must sit behind `authMiddleware` + `requireRole(Role.ADMIN)`.
- ✅ Return proper status codes: 200 OK, 201 Created, 204 No Content, 400/401/403/404/409 as appropriate.
- ✅ Never return `passwordHash` or other sensitive fields — use the safe-projection helpers.
- ✅ Update the Postman collections when an endpoint changes.

## 5️⃣ Frontend Rules

- ✅ All API calls go through `website/src/lib/api.js` (axios instance with the JWT interceptor) — never use `fetch` directly.
- ✅ Store auth in `authStore` (Zustand) + `localStorage`; handle 401 by clearing state and redirecting to `/login`.
- ✅ Show loading, empty and error states for every async screen.
- ✅ Keep routes guarded: `ProtectedRoute`, `PublicRoute`, `AdminRoute` in `App.jsx`.
- ✅ Toasts for user feedback (react-hot-toast); no `alert()`.

## 6️⃣ Git & Collaboration

- ✅ Short-lived feature branches (e.g. `feature/itinerary-reorder`) merged via PR.
- ✅ Commits: small, focused, imperative subject lines ("Add daily budget endpoint").
- ✅ Never commit directly to `main`; never force-push shared branches.
- ✅ PRs must state what changed, why, and how to test it.
- ✅ Run `npm run lint` + `npm test` (server) before requesting review.

## 7️⃣ Security Checklist (Every PR)

- [ ] Input validated (Zod) and output encoded.
- [ ] Auth + role checks on every protected route.
- [ ] Ownership enforced on every read/update/delete.
- [ ] No secrets, tokens or personal data in logs or responses.
- [ ] Rate limiting and CORS origins still correct after changes.
