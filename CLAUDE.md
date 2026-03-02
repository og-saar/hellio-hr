# Hellio HR — Project Conventions

## Tech Stack
- React 19 + Vite + TypeScript + Tailwind CSS v4
- React Router for navigation
- No backend — hardcoded JSON data in `src/data/`

## Project Structure
```
src/
  types/         — TypeScript interfaces (Candidate, Position)
  data/          — JSON data files (candidates.json, positions.json)
  services/      — Promise-based service layer (future-proof for API)
  hooks/         — Custom React hooks (useCandidates, usePositions)
  components/    — Reusable UI components
    candidates/  — Candidate-specific components
    positions/   — Position-specific components
    layout/      — Layout components (Navbar, etc.)
  pages/         — Route-level page components
public/cvs/      — Source PDF files for download
```

## Conventions
- Service functions return `Promise<T>` wrapping JSON imports
- Custom hooks manage loading/error/data state
- All components use Tailwind utility classes — no CSS modules
- Use `interface` for types, not `type` aliases
- Prefer named exports
- File names: PascalCase for components, camelCase for services/hooks
- Keep components focused — extract when > 150 lines

## Commands
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build
