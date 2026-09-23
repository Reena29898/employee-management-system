# Employee Records

A modular employee records application built with React 18+, TypeScript and Vite, as part of the front-end technical assessment.

## Requirements

- Node.js 18 or newer

## Install and run

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Other scripts

```bash
npm run build     # type-check and produce a production build in dist/
npm run preview   # serve the production build locally
npm run test      # run the Vitest/React Testing Library test suite
npm run lint      # run oxlint
```

## Configuration

The app fetches its employee data from a public mock REST API (JSONPlaceholder) by default. To point it at a different API, copy `.env.example` to `.env` and set `VITE_API_BASE_URL`. No API key is required.

```bash
cp .env.example .env
```

## Project structure

```
src/
├── components/    UI components (table, form, modal, search, filters, pagination, export)
├── services/      employeeApi.ts — the only place fetch() is called
├── hooks/         useEmployees (data + CRUD), useDebounce, useMediaQuery
├── types/         shared TypeScript types
├── utils/         sanitize, exportUtils, helpers, roles, duplicates
├── test/          Vitest setup
├── App.tsx
└── main.tsx
```

## Security

A `Content-Security-Policy` is set via a `<meta>` tag in `index.html` (script-src restricted to same-origin, no inline scripts; connect-src scoped to the configured API origin). See the comment above the tag, and `SPEC.md`, for what it does and does not cover from a `<meta>` tag versus an HTTP header.

## Notes for reviewers

- JSONPlaceholder only exposes 10 users. `src/utils/helpers.ts` (`buildEmployeeRoster`) deterministically builds the full first-name × last-name cross product of the fetched roster (10 × 10 = 100 records), so pagination and virtualization have a realistic volume to operate on. Every name and email is distinct — no two records share the same data — and each record is still traceably derived from a real fetched user, not invented data; see `SPEC.md` for the full reasoning.
- A companion `SPEC.md`, in the parent folder, documents every file, library choice and decision made while building this, for interview prep purposes. It is not part of the submission.
