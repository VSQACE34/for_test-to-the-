# PRD — Sethu: Clinical Trial Eligibility Review Dashboard

## Original Problem Statement
Web-based dashboard for Clinical Research Coordinators (CRCs) to review AI-generated volunteer eligibility screenings. "Sethu recommends; you decide." Dual-pane layout (volunteer queue + detail view), deterministic criteria strip (c01..c11), fail-loud UI for missing data and contradictions, prominent "N of 11 cleared" scoring, evaluation metrics quarantined in a collapsible footer, non-dismissible injection banner, in-memory Accept/Exclude decisions, Re-screen button with real 30–60s progress bar. Frontend-only React app; connects to existing FastAPI backend at localhost:8000 with JSON-fixture fallback.

## User Choices (2026-06-01 session)
- Component library: Shadcn UI
- Project setup: use the existing React (CRA) template on port 3000
- Scope: exactly per spec, fixtures for 5–8 volunteers
- Backend at localhost:8000 assumed running externally; app falls back to fixtures when unreachable

## User Personas
- Primary: Clinical Research Coordinators reviewing volunteer eligibility
- Secondary: Hackathon judges evaluating AI screening accuracy and transparency

## Architecture
- Frontend-only: React 19 (CRA/craco), Tailwind, Shadcn UI, React Context + useReducer
- `/app/frontend/src/data/volunteers.js` — fixtures: 7 volunteers x 11 criteria (injection case V-1044, contradiction V-1045 c09, missing V-1046 c05/c07, fails V-1043 c04/c11, V-1048 c08)
- `/app/frontend/src/data/evaluation.js` — evaluation run metrics (quarantined)
- `/app/frontend/src/lib/sethuApi.js` — fetch from localhost:8000 (`/api/volunteers`, `/volunteers`; POST `/api/re-screen`, `/re-screen`) with 2.5s timeout + fixture fallback; injection regex scanner
- `/app/frontend/src/state/AppContext.jsx` — Context+useReducer: volunteers, selectedId, decisions, rescreen, evalOpen
- Components: Header, InjectionBanner, VolunteerQueue, CriteriaStrip, VolunteerDetail, EvaluationFooter
- Env: `REACT_APP_SETHU_API_URL=http://localhost:8000` added to frontend/.env
- No backend (port 8001 template server untouched), no MongoDB, no auth

## Implemented (2026-06-01)
- Dual-pane layout: queue (left, pending-first sort, status badges, cleared counts) + detail (right)
- Criteria strip: fixed c01..c11 ascending order, shape-coded verdict icons (Check/X/Minus) with cross-hatch fail pattern (color-blind safe), confidence, reasoning, mono source excerpts with timestamps
- Fail-loud: "Cannot resolve: data not available" for missing; contradiction boxes with both records + timestamps
- Scoring: prominent "N of 11 cleared" + quiet percentage
- Injection banner: non-dismissible, regex-scans record text
- In-memory Accept/Exclude with queue reordering; resets on refresh
- Re-screen: 35s linear progress bar, POST to backend w/ simulated fallback, confidence jitter on complete, toast
- Collapsible Evaluation Run footer (latency p50/p95, agent vs baseline accuracy) — no reference labels in UI
- Keyboard nav: ArrowUp/Down through queue, aggressive focus rings, aria-live progressbar
- Design per /app/design_guidelines.json (IBM Plex Sans/Mono, clinical dense, Swiss high-contrast)

## Testing
- iteration_1.json: 12/12 checks passed (100% frontend). Expected console errors: ERR_CONNECTION_REFUSED from localhost:8000 fallback attempt. Retest not needed.

## Backlog / Next Tasks
- P1: Wire to real backend response shapes once endpoint contracts are provided (adjust isValidPayload mapping in sethuApi.js)
- P1: Confirm re-screen endpoint contract (trigger-only vs. returns refreshed criteria)
- P2: TypeScript migration if the team standardizes on Vite+TS
- P2: Persist decisions to backend if demo mode ends
- P2: Verdict flip simulation on re-screen (currently confidence jitter only)
