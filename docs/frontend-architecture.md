# Hellio HR — Frontend Architecture

## Overview

Hellio HR is a candidate profile viewer and comparison tool built with React 19, Vite, TypeScript, and Tailwind CSS v4. It uses hardcoded JSON data with no backend, but the service layer is designed for easy API migration.

## Tech Stack

| Layer        | Technology                     |
| ------------ | ------------------------------ |
| Framework    | React 19                       |
| Bundler      | Vite                           |
| Language     | TypeScript (strict)            |
| Styling      | Tailwind CSS v4                |
| Routing      | React Router v7                |
| Fonts        | DM Sans (body) + JetBrains Mono (code/dates) via Google Fonts |

## Design System

- **Theme**: Dark navy palette (`navy-950` background, `navy-900` cards) with amber accents
- **Badges**: Semi-transparent colored backgrounds (e.g., `bg-sky-500/15 text-sky-400`)
- **Cards**: `bg-navy-900 rounded-xl border border-navy-700/60`
- **Inputs**: `bg-navy-800 border border-navy-700` with amber focus rings
- **Animations**: `page-enter` fade-in on route transitions, `stagger-item` for list items

## Project Structure

```
src/
  App.tsx                          — Root component with BrowserRouter + routes
  index.css                        — Tailwind import + @theme (colors, fonts, animations)
  types/
    candidate.ts                   — Candidate, WorkExperience, Education, Certification
    position.ts                    — Position
  data/
    candidates.json                — 3 candidates (hardcoded)
    positions.json                 — 3 positions (hardcoded)
  services/
    candidateService.ts            — CRUD + link/unlink operations
    positionService.ts             — CRUD + link/unlink operations
  hooks/
    useCandidates.ts               — useCandidates, useCandidate, useCandidatesByIds
    usePositions.ts                — usePositions, usePosition, usePositionsByIds
  components/
    layout/
      Layout.tsx                   — Sidebar + Outlet wrapper
      Sidebar.tsx                  — Navigation sidebar with branding
    candidates/
      CandidateCard.tsx            — Card for candidate list with compare selection
      CandidateCompare.tsx         — Side-by-side comparison with skills diff
      StatusBadge.tsx              — Candidate status badge (new, screening, etc.)
    positions/
      PositionStatusBadge.tsx      — Position status badge (open, closed, on-hold)
      WorkArrangementBadge.tsx     — Work arrangement badge (remote, hybrid, onsite)
  pages/
    CandidatesPage.tsx             — List with search/filter + compare launcher
    CandidateProfilePage.tsx       — Full profile + add/remove positions
    ComparePage.tsx                — Wrapper for CandidateCompare
    PositionsPage.tsx              — List of positions
    PositionDetailPage.tsx         — Position detail with linked candidates
public/
  cvs/                             — Source PDF files (cv_001.pdf, cv_005.pdf, cv_010.pdf)
```

## Routes

| Path               | Page                   | Description                         |
| ------------------- | ---------------------- | ----------------------------------- |
| `/`                 | —                      | Redirects to `/candidates`          |
| `/candidates`       | CandidatesPage         | Candidate list with search/filter   |
| `/candidates/:id`   | CandidateProfilePage   | Full candidate profile              |
| `/positions`        | PositionsPage          | Position list                       |
| `/positions/:id`    | PositionDetailPage     | Full position detail                |
| `/compare`          | ComparePage            | Side-by-side candidate comparison   |

## Data Layer

### Types

**Candidate** — `id`, `name`, `email`, `phone?`, `location?`, `linkedinUrl?`, `githubUrl?`, `professionalTitle`, `summary`, `skills[]`, `languages?[]`, `workExperience[]`, `education[]`, `certifications?[]`, `positionIds[]`, `cvFile`, `status`

- Status: `'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected'`

**Position** — `id`, `title`, `company`, `contactName?`, `contactEmail?`, `status`, `postedDate`, `timeline?`, `workArrangement`, `salaryRange?`, `summary`, `mustHave[]`, `niceToHave[]`, `responsibilities[]`, `techStack[]`, `candidateIds[]`, `sourceFile?`

- Status: `'open' | 'closed' | 'on-hold'`
- Work arrangement: `'remote' | 'hybrid' | 'onsite'`

### Service Layer

Services wrap JSON data behind `async` functions returning `Promise<T>`. Data is loaded via `structuredClone` of the JSON imports to allow in-memory mutations.

**candidateService.ts**:
- `getCandidates()` — returns all candidates
- `getCandidateById(id)` — returns single candidate
- `searchCandidates(query)` — filters by name, title, skills, location
- `getCandidatesByIds(ids)` — returns candidates matching given IDs
- `addPositionToCandidate(candidateId, positionId)` — links a position
- `removePositionFromCandidate(candidateId, positionId)` — unlinks a position

**positionService.ts**:
- `getPositions()` — returns all positions
- `getPositionById(id)` — returns single position
- `getPositionsByIds(ids)` — returns positions matching given IDs
- `addCandidateToPosition(positionId, candidateId)` — links a candidate
- `removeCandidateFromPosition(positionId, candidateId)` — unlinks a candidate

### Custom Hooks

Hooks wrap service calls with `useState` + `useEffect`, exposing `{ data, loading }`:

- `useCandidates()` — all candidates
- `useCandidate(id)` — single candidate by ID
- `useCandidatesByIds(ids)` — candidates by ID array
- `usePositions()` — all positions
- `usePosition(id)` — single position by ID
- `usePositionsByIds(ids)` — positions by ID array

## Key Features

### Candidate Search & Filter
- Text search across name, professional title, skills, and location
- Tab-based status filter (All, New, Screening, Interview, Offer, Hired, Rejected)

### Candidate Compare
- Select up to 2 candidates from the list page via checkboxes on cards
- Navigate to `/compare?a={id1}&b={id2}` — pre-populates the comparison
- Side-by-side columns showing contact, skills, experience, education, certifications, languages, and linked positions
- Skills diff section: "Only Candidate A" / "Shared" / "Only Candidate B" with color-coded chips

### Position Linking
- On candidate profile, linked positions appear with remove (X) buttons
- Dropdown to add any unlinked position
- Bidirectional: updates both `candidate.positionIds` and `position.candidateIds`
- Uses local React state (`linkedIds`) for immediate UI feedback after mutation

### CV Download
- Amber "Download CV" button on candidate profile links to `/cvs/{filename}.pdf`

## Data Relationships

Candidates and positions have a many-to-many relationship managed through ID arrays on both sides:

```
Candidate.positionIds[] <——> Position.candidateIds[]
```

When linking/unlinking, both sides are updated in the service layer to keep them in sync.
