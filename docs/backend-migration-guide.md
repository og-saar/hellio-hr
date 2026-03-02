# Hellio HR — Backend Migration Guide

What needs to change when replacing the in-memory JSON data with a real backend API.

## Service Layer (primary change)

The service layer (`src/services/`) is the only layer that directly touches data. Replace the JSON imports and in-memory arrays with HTTP calls.

### candidateService.ts

**Current**: imports `candidates.json`, clones it with `structuredClone`, mutates the array in memory.

**Change to**:

```ts
const API_BASE = '/api';

export async function getCandidates(): Promise<Candidate[]> {
  const res = await fetch(`${API_BASE}/candidates`);
  return res.json();
}

export async function getCandidateById(id: string): Promise<Candidate | undefined> {
  const res = await fetch(`${API_BASE}/candidates/${id}`);
  if (!res.ok) return undefined;
  return res.json();
}

export async function searchCandidates(query: string): Promise<Candidate[]> {
  const res = await fetch(`${API_BASE}/candidates?q=${encodeURIComponent(query)}`);
  return res.json();
}

export async function addPositionToCandidate(candidateId: string, positionId: string): Promise<Candidate | undefined> {
  const res = await fetch(`${API_BASE}/candidates/${candidateId}/positions/${positionId}`, { method: 'POST' });
  return res.json();
}

export async function removePositionFromCandidate(candidateId: string, positionId: string): Promise<Candidate | undefined> {
  const res = await fetch(`${API_BASE}/candidates/${candidateId}/positions/${positionId}`, { method: 'DELETE' });
  return res.json();
}
```

Same pattern for `positionService.ts`.

### What stays the same

- Function signatures (`getCandidates`, `getCandidateById`, etc.) remain identical
- Return types (`Promise<Candidate[]>`, `Promise<Position | undefined>`) remain identical
- All hook and component code continues to work without changes

## Custom Hooks (minor changes)

### Error handling

The current hooks ignore errors. Add error state:

```ts
export function useCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCandidates()
      .then(setCandidates)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { candidates, loading, error };
}
```

### Cache invalidation

The hooks currently fetch once on mount. With a real API, you'll want to refetch after mutations. Options:

1. **Manual refetch**: Add a `refetch` function to hooks and call it after mutations
2. **React Query / TanStack Query**: Replace custom hooks with `useQuery` and `useMutation` for automatic cache management, deduplication, and background refetching
3. **SWR**: Similar to React Query but lighter weight

TanStack Query is recommended — it replaces the custom hooks entirely and handles loading, error, caching, and invalidation out of the box.

## CandidateProfilePage (mutation handling)

### Current approach

The page uses local state (`linkedIds`) to optimistically reflect add/remove mutations because the in-memory service updates aren't reflected through the hooks (which captured the initial data).

### With a real API

Replace the local `linkedIds` state with proper cache invalidation:

- **With TanStack Query**: Use `useMutation` with `onSuccess` that calls `queryClient.invalidateQueries(['candidate', id])` to refetch the candidate data
- **Without TanStack Query**: Add a `refetch` function to `useCandidate` and call it after successful mutations

The `handleAdd` / `handleRemove` callbacks can also be simplified since the backend handles the bidirectional relationship — no need to call both `addPositionToCandidate` and `addCandidateToPosition` from the client.

## Vite Dev Server Proxy

During development, proxy API calls to your backend:

```ts
// vite.config.ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
```

## CV File Uploads

### Current
CV files are static PDFs in `public/cvs/`. The `candidate.cvFile` field points to `/cvs/filename.pdf`.

### With backend
- Store CVs in object storage (S3, GCS, etc.) or as database blobs
- `candidate.cvFile` becomes a URL to the storage location or an API endpoint like `/api/candidates/:id/cv`
- Add an upload endpoint for new CV submissions
- Consider signed URLs for secure access

## Authentication & Authorization

Not currently implemented. When adding a backend:

- Add auth middleware (JWT, session-based, or OAuth)
- Protect API routes
- Add a login page and auth context on the frontend
- Conditionally show/hide actions (e.g., only recruiters can link/unlink positions)

## Search

### Current
`searchCandidates` does a simple `toLowerCase().includes()` across name, title, skills, and location client-side.

### With backend
- Move search to a server-side endpoint (`GET /api/candidates?q=...`)
- Consider full-text search (Postgres `tsvector`, Elasticsearch, etc.) for better results
- Add pagination for large result sets — the current list loads all candidates at once

## Pagination

Not needed with 3 candidates and 3 positions, but essential with real data:

- API endpoints should accept `page` and `limit` query params
- Hooks should expose `page`, `totalPages`, and `setPage`
- Add pagination controls to list pages (CandidatesPage, PositionsPage)

## Summary of Changes by File

| File | Change needed | Effort |
| ---- | ------------- | ------ |
| `services/candidateService.ts` | Replace JSON import with `fetch` calls | Medium |
| `services/positionService.ts` | Replace JSON import with `fetch` calls | Medium |
| `hooks/useCandidates.ts` | Add error handling, consider TanStack Query | Low-Medium |
| `hooks/usePositions.ts` | Add error handling, consider TanStack Query | Low-Medium |
| `pages/CandidateProfilePage.tsx` | Remove local `linkedIds` state, use cache invalidation | Low |
| `vite.config.ts` | Add dev proxy | Trivial |
| `types/candidate.ts` | No change (keep as API contract) | None |
| `types/position.ts` | No change (keep as API contract) | None |
| `components/*` | No change | None |
| `pages/CandidatesPage.tsx` | Add pagination, optionally server-side search | Low |
| `pages/PositionsPage.tsx` | Add pagination | Low |
| `data/candidates.json` | Delete (no longer needed) | None |
| `data/positions.json` | Delete (no longer needed) | None |

The architecture was designed so that **components and pages never import data directly** — they always go through hooks, which go through services. This means the migration is contained almost entirely within the `services/` and `hooks/` directories.
