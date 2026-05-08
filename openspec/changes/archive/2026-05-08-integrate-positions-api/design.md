## Context

The frontend Positions component currently displays hardcoded mock data. The backend provides a `GET /positions` endpoint that returns a list of position objects. The existing PositionProcessDetail component successfully integrates backend API, providing a reference pattern for service layer design, error handling, and state management.

Current constraints:

- React 18 + TypeScript (CRA with react-scripts 5)
- Bootstrap 5 for styling (consistent with existing Positions component)
- Backend at `http://localhost:3010` (or env `REACT_APP_API_URL`)
- Test suite uses Jest + React Testing Library + Playwright MCP

## Goals / Non-Goals

**Goals:**

- Replace mock data with real data fetched from `GET /positions` API
- Implement loading state during data fetch
- Display user-friendly error message if fetch fails
- Add E2E tests validating data flow: API response → component render → user interactions
- Maintain existing UI layout and styling

**Non-Goals:**

- Implementing filtering/search functionality (search inputs remain non-functional)
- Pagination or lazy loading
- Real-time data synchronization (WebSocket)
- Changing the position card component structure
- Implementing position creation or update flows

## Decisions

### 1. Service Layer Architecture

**Decision**: Create `positionsService.ts` with a `getPositions()` method that calls the backend API.

**Rationale**: Separates API logic from component logic. Mirrors the successful pattern in `positionProcessService.ts`, enabling reuse and testability.

**Alternatives considered**:

- Direct fetch in component: Results in mixed concerns, harder to test and maintain.
- Redux or context API: Overkill for simple list fetch; component state is sufficient.

**Implementation**: Service returns `Position[]` type matching component expectations.

### 2. State Management

**Decision**: Use React component state with `useState` and `useEffect` for loading, error, and data state.

**Rationale**: Simple, aligned with existing PositionProcessDetail pattern. No additional dependencies needed.

**Effect hook**:

- Fetch data on component mount
- Load state set to true while fetching
- Data set on success, error message on failure
- Load state set to false when complete

### 3. Error Handling

**Decision**: Display error alert inline above the positions grid (similar to PositionProcessDetail error pattern). Grid remains visible for retry.

**Rationale**: User can read error message without losing context. Positions grid stays rendered so user can attempt action again.

**Alternative**: Hidden grid on error - worse UX, user loses page context.

### 4. API Response Shape Handling

**Decision**: Service normalizes response to match component's `Position` type exactly (id, title, manager, deadline, status).

**Rationale**: Defensive programming; if backend response shape differs slightly, service adapts rather than component failing.

**Fallback logic**: If endpoint returns unexpected structure, error message clearly indicates fetch failure.

### 5. E2E Testing Strategy

**Decision**: Add Playwright tests that:

- Mock the backend (using MSW or jest-mock-fetch)
- Render component
- Assert positions appear in DOM
- Simulate user interactions (click card, navigate)
- Verify correct API was called with correct params

**Rationale**: Validates complete data flow without touching real backend. Repeatable and fast.

**Alternative**: Integration tests with real backend - slower, less reliable in CI/CD.

## Risks / Trade-offs

| Risk                                                    | Mitigation                                                              |
| ------------------------------------------------------- | ----------------------------------------------------------------------- |
| Backend `GET /positions` endpoint delays / fails        | Implement request timeout (5s), display clear error, allow manual retry |
| Response format mismatch (backend changes contract)     | Service layer normalizes; add type-safe validation on response          |
| Loading state takes too long (perceived lag)            | Keep loading spinner visible to signal progress                         |
| E2E test brittleness (mock data drifts from real data)  | Keep mock data in test close to actual backend schema                   |
| Positions list empty on first load (no positions exist) | Render empty state message: "No positions available"                    |

## Migration Plan

1. Create `positionsService.ts` with `getPositions()` method
2. Update `Positions.tsx` to fetch data in `useEffect`
3. Add loading state UI (spinner) and error alert
4. Add Playwright E2E test validating full flow
5. Test locally against running backend
6. Merge and deploy

## Open Questions

- Should search/filter inputs be wired to API or remain non-functional? (Propose: remain non-functional for this change; scope for future enhancement)
- Should positions list auto-refresh on interval, or only on mount? (Propose: only on mount for this change)
- What is the backend `GET /positions` response format? (Assume: matches Position type; service validates)
