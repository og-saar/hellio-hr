# Hellio HR — Candidate Profile Viewer & Diff

A recruitment tool for viewing, searching, and comparing candidate profiles against open positions. Built as a frontend-only React app with hardcoded JSON data and a service layer designed for easy backend migration.

## Features

- **Candidate List** — Search by name, skills, or location. Filter by pipeline status (new, screening, interview, offer, hired, rejected).
- **Candidate Profile** — Full view of work experience, education, skills, certifications, languages, and contact info. Download the original CV as PDF.
- **Position Linking** — Add or remove positions from a candidate's profile. Bidirectional — updates both the candidate and position records.
- **Candidate Compare** — Select two candidates for side-by-side comparison. Skills diff highlights shared and unique skills.
- **Position List & Detail** — Browse open positions with must-have/nice-to-have requirements, responsibilities, tech stack, salary range, and linked candidates.

## Tech Stack

| Layer   | Technology                                          |
| ------- | --------------------------------------------------- |
| Framework | React 19                                          |
| Bundler | Vite                                                |
| Language | TypeScript                                         |
| Styling | Tailwind CSS v4                                     |
| Routing | React Router v7                                     |
| Fonts   | DM Sans + JetBrains Mono (Google Fonts)             |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command             | Description              |
| ------------------- | ------------------------ |
| `npm run dev`       | Start dev server         |
| `npm run build`     | Production build         |
| `npm run preview`   | Preview production build |

## Project Structure

```
src/
  types/           TypeScript interfaces (Candidate, Position)
  data/            Hardcoded JSON data (candidates.json, positions.json)
  services/        Promise-based service layer (swap for API calls later)
  hooks/           Custom React hooks (useCandidates, usePositions)
  components/
    layout/        Sidebar navigation, page layout
    candidates/    CandidateCard, CandidateCompare, StatusBadge
    positions/     PositionStatusBadge, WorkArrangementBadge
  pages/           Route-level page components
public/
  cvs/             Source CV PDFs for download
docs/
  frontend-architecture.md    Detailed frontend documentation
  backend-migration-guide.md  What to change when adding an API
```

## Architecture

Components and pages never touch data directly. The dependency chain is:

```
Pages/Components → Hooks → Services → JSON data
```

The service layer returns `Promise<T>` so replacing JSON imports with `fetch` calls requires zero changes to hooks or components. See [`docs/backend-migration-guide.md`](docs/backend-migration-guide.md) for details.

## Data

Three candidates extracted from source CVs and three positions extracted from job descriptions, cross-linked via ID arrays:

```
Candidate.positionIds[] ←→ Position.candidateIds[]
```

Mutations (add/remove position links) work in-memory using `structuredClone` of the JSON imports.
