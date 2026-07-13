# Holiday Dashboard — Frontend

React SPA for the SOMMER-HQ dashboard. Backend: `../holiday-dashboard-backend`.

## Commands

```bash
bun dev          # dev server on :5173 (proxies /api → 127.0.0.1:8080)
bun run build    # tsr generate + tsc + vite build
bun run lint     # Biome check   (lint:fix to auto-fix)
bun run gen:api  # regenerate the API client from openapi-holiday-dashboard.json (Orval)
```

## Key conventions (mirrors cosy-domain-provider)

- **Routing:** TanStack Router, file-based (`src/routes/` → thin wrappers around `src/pages/`).
  `/` = Konsole (phone control panel), `/tv` = TV Dashboard (wall display).
- **State:** Redux Toolkit is the source of truth (`store/board-slice`). The whole board is one
  object fetched from `GET /api/v1/board`.
- **HTTP:** components only touch `hooks/useDataLoading` (reads) and `hooks/useDataInteractions`
  (mutations). Those call the Orval-generated client, which uses the single `api/axios-instance`
  `customInstance` mutator. Never call `fetch`/axios directly, never edit `src/api/generated/**`.
- **Components:** folder-per-feature under `pages/*/components`; each page has a `useXxxLogic.ts`
  hook holding all non-JSX logic. Shared primitives are flat in `components/ui`.
- **Styling:** Tailwind-first with design tokens from `index.css :root` registered in
  `tailwind.config.ts` (`bg-panel`, `text-muted`, …). Inline `style` only for dynamic/rgba values.
- **i18n:** `src/i18n/resources.ts` — German is authoritative, English matches its shape via
  `DeepStringSchema`. Add every key to both.
