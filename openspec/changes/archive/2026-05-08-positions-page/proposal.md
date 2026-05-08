## Why

Recruiters can currently view the positions list but cannot open and manage the hiring process for a specific position in a workflow-oriented view. This change is needed now to support day-to-day process operations directly from the positions screen, including candidate stage updates through a visual and interactive board.

## What Changes

- Add navigation from the positions list action `Ver proceso` to a new position detail process screen.
- Implement a position detail page with a clear title and a back button to return to the positions list.
- Build a Kanban-style process board where each interview stage is a column and each candidate is a draggable card.
- Enable drag-and-drop stage reassignment so users can move candidates between columns at any time.
- Display each candidate card with full name and average score.
- Make the position detail process page responsive for small screens.
- Integrate existing backend endpoints for interview flow, candidates, and candidate stage updates.

## Capabilities

### New Capabilities

- `position-process-detail-kanban`: Position-specific process management UI with stage-based Kanban visualization, drag-and-drop candidate transitions, and responsive behavior.

### Modified Capabilities

- None.

## Impact

- Affected frontend components and routing in the positions flow, including list-to-detail navigation and detail page rendering.
- Affected frontend data services for consuming:
  - `GET /positions/:id/interviewFlow`
  - `GET /positions/:id/candidates`
  - `PUT /candidates/:id/stage`
- Affected UX behavior for the positions list action `Ver proceso`.
- Affected test coverage to validate rendering and interactions in browser-based tests (Playwright + Chrome DevTools MCP flow).
- Design alignment reference assets: `docs/assets/positions-screen.avif` and `docs/assets/position-detail-screen.avif`.
