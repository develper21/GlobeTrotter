# 🎨 Design System

### GlobeTrotter — Clean. Clear. Confident Travel Planning.

This document defines the visual design system, UI components, and user experience rules for GlobeTrotter. The goal is a modern, minimal, traveler-friendly interface with a consistent look across every screen.

---

## 1. Design Principles

| | | |
|:---:|:---:|:---:|
| 🧭 **User-Centered** | 🪶 **Minimal & Clean** | 🧩 **Consistent** |
| Simple and intuitive for every kind of traveler. | Reduce clutter and focus on the trip content. | Follow a unified design system everywhere. |

## 2. Color Palette

Primary colors used across the application. All values below are the exact CSS variables in `website/src/index.css` — always use the variables, never raw hex codes in components.

| Swatch | Token | Value | Usage |
|---|---|---|---|
| 🟪 | `--primary` | `#714B67` | Main brand color — buttons, links, active states |
| 🟪 | `--primary-hover` | `#5A3C52` | Primary hover / pressed states |
| 🟦 | `--accent` | `#017E84` | Secondary actions, highlights, success-ish accents |
| 🟢 | `--emerald` | `#28A745` | Success messages, completed states |
| 🔴 | `--rose` | `#DC3545` | Errors, destructive actions, validation alerts |
| 🟡 | Warning | `#F59E0B` | Warnings, over-budget and caution states |
| ⬜ | Surfaces | `--bg #F8F9FA` · `--bg-surface #FFFFFF` · `--bg-deep #E7E9ED` | Page background, cards, section backgrounds |
| ⬛ | Text | `--text-primary #212529` · `--text-secondary #495057` · `--text-muted #6C757D` | Headings, body text, captions |
| ▫️ | Borders | `--border #DEE2E6` · `--border-strong #CED4DA` | Card borders, dividers, inputs |

## 3. Typography

Fonts are loaded once in `website/src/index.css` (Google Fonts import).

| | |
|---|---|
| **Aa** | **Plus Jakarta Sans** — primary body font. Clean, modern and highly readable at small sizes. Used for all UI text and paragraphs. |
| **Aa** | **Outfit** — display font for headings (`h1–h6`, `.page-title`). Geometric, confident, 700–800 weight. |

| Token | Size | Weight | Usage |
|---|---|---|---|
| `.page-title` | 2.25rem | 800 | Page titles |
| `h2` / section headers | 1.5rem | 700 | Section titles |
| Body | 0.95–1rem | 400–500 | Paragraphs, form labels |
| `.badge` / captions | 0.775rem | 600 | Badges, meta text |
| Line height | 1.25 headings · 1.5 body | | Spacing rhythm |

## 4. UI Components

Standard components to be used throughout the app — all styles live in `website/src/index.css`.

### Buttons
| Class | Look | Usage |
|---|---|---|
| `.btn .btn-primary` | Solid plum (`--primary`), white text, soft shadow | Main action on a screen (Create Trip, Save) |
| `.btn .btn-accent` | Solid teal (`--accent`) | Secondary emphasis (Share, Add) |
| `.btn .btn-ghost` | Transparent, 1px border | Tertiary actions (Cancel, filters) |
| `.btn .btn-danger` | Teal-gradient destructive style | Delete trip/expense (with confirm) |
| Sizes | `.btn-sm` · `.btn` · `.btn-lg` · `.btn-icon` | Compact rows, default, heroes, icon-only |

### Cards
- `.glass-card` — white surface, 1px `--border`, `--radius-xl` (10px), `--shadow-md`; hover lifts to `--shadow-lg`. Used for trips, cities, activities, posts.
- `.card-grid` — `repeat(auto-fill, minmax(320px, 1fr))`, 1.75rem gap.

### Forms
- `.form-group` → label + control stack; `.form-label` (0.875rem, 600).
- `.form-control` — white background, `--border`, 6px radius; focus ring `rgba(113, 75, 103, 0.25)`.
- `.input-wrapper` + `.input-icon` — leading-icon inputs for search fields.

### Badges
`.badge` pill with `.badge-cyan/amber/violet/emerald/rose` variants — trip status (Upcoming/Ongoing/Completed), activity types, roles.

### Modals & Overlays
- `.overlay` — rgba(0,0,0,0.5) + 4px blur, fade-in 0.2s.
- `.modal` — centered, max 620px, pop animation `modalPop`. Used for add-stop, add-day, add-activity, confirmations.

### Layout & Spacing
- `.container` — max 1320px, 1.5rem side padding (shrinks responsively).
- Page header pattern: `.page-header` → `.page-title` + `.page-subtitle`, margin-bottom 2.5rem.
- Spacing scale: 0.25 / 0.5 / 0.75 / 1 / 1.5 / 2rem (`.gap-*` utilities).
- Radius scale: 4 / 6 / 8 / 10px / pill. Shadows: `--shadow-sm/md/lg` + brand-tinted `--shadow-cyan/gold`.
- Transitions: `--transition` 0.2s ease-in-out everywhere; hover lifts `translateY(-1px…-2px)`.

## 5. UX Rules

1. Every async screen shows **loading → content | empty state | error** — never a blank area.
2. Destructive actions always require a confirm modal, with the item name repeated in the copy.
3. Feedback through toasts (top-right, 3.5s): green edge for success, teal edge for errors.
4. Responsive first: grids collapse ≤1024px, forms go single-column ≤768px, tab bars scroll horizontally ≤480px.
5. Navigation stays consistent: sidebar (desktop) / bottom bar (mobile), active item highlighted with `--primary`.
6. Empty states explain the next action ("Create your first trip") with a direct button.
