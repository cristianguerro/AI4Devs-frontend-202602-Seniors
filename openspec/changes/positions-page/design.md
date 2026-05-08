## Context

The frontend currently provides a positions list view where recruiters can see open roles, but there is no workflow screen to operate a position process. The new change introduces a position detail process page opened from the existing "Ver proceso" action.

The process page must support operational recruiter tasks:

- Understand current process stages for one position
- Visualize candidates grouped by stage
- Move candidates between stages quickly
- Keep data synchronized with backend state

Constraints and known inputs:

- Existing endpoints are available:
  - GET /positions/:id/interviewFlow
  - GET /positions/:id/candidates
  - PUT /candidates/:id/stage
- Current frontend stack is React with existing components and service modules.
- Page must remain usable on small screens.
- Validation should include Playwright-based browser checks and Chrome DevTools MCP-assisted render validation.

## Goals / Non-Goals

**Goals:**

- Add route-level navigation from positions list to a position process detail page.
- Render a Kanban board where columns map to process stages and cards map to candidates.
- Support drag-and-drop card movement across columns with backend persistence.
- Ensure candidate cards show full name and average score.
- Include a clear page title and a back action to return to positions list.
- Deliver responsive behavior for smaller viewports.

**Non-Goals:**

- Redesigning the global application shell or unrelated pages.
- Changing backend contract or endpoint semantics.
- Implementing advanced filtering/search/sorting beyond current scope.
- Adding real-time multi-user synchronization (websocket/live updates).

## Decisions

1. Routing and navigation strategy

- Decision: Introduce a dedicated route for position process detail, using position id from URL params.
- Rationale: URL-driven state enables deep linking, refresh safety, and testability.
- Alternative considered: Modal-over-list flow.
- Why not: Modal limits URL shareability and complicates responsive behavior for a Kanban layout.

2. Data loading strategy

- Decision: Fetch interview flow definition and candidates in parallel on page load; derive stage-grouped view model client-side.
- Rationale: Parallel requests reduce first content latency and keep backend usage aligned to existing endpoints.
- Alternative considered: Sequential loading flow then candidates.
- Why not: Sequential flow increases wait time with no functional gain.

3. Kanban state model

- Decision: Maintain a normalized in-memory map by candidate id and a stage-to-candidate-id list for ordered rendering.
- Rationale: This supports efficient drag/drop updates and stable React rendering.
- Alternative considered: Flat list with repeated stage filtering in render.
- Why not: Repeated filtering scales worse and makes drag/drop updates harder to reason about.

4. Drag-and-drop behavior and persistence

- Decision: Apply optimistic UI update on drop, then call PUT /candidates/:id/stage; revert card to previous stage if API fails and show inline error feedback.
- Rationale: Recruiters need fast perceived interaction; optimistic updates keep interaction fluid.
- Alternative considered: Wait for server success before moving card.
- Why not: Introduces lag and degrades board usability.

5. Responsive layout behavior

- Decision: Use horizontally scrollable columns with fixed minimum column width on narrow screens, keeping card density readable.
- Rationale: Kanban naturally maps to horizontal overflow on mobile and avoids collapsing columns into unusable stacks.
- Alternative considered: Single-column stage accordion.
- Why not: Adds interaction steps and reduces process overview clarity.

6. Component boundaries

- Decision: Split into small focused components:
  - PositionProcessHeader (title + back action)
  - ProcessBoard (columns container)
  - ProcessColumn (stage + cards)
  - CandidateCard (name + average score)
- Rationale: Improves testability and isolates drag/drop concerns.
- Alternative considered: One monolithic page component.
- Why not: Harder to maintain and verify.

7. Testing approach

- Decision: Validate with component/route-level tests plus Playwright E2E for:
  - Navigation from positions to process page
  - Board render with columns/cards
  - Drag/drop stage move with persistence call
  - Responsive viewport checks
- Rationale: Combines fast local confidence with end-to-end behavior verification.
- Alternative considered: Unit tests only.
- Why not: Would miss integration and interaction regressions.

## Risks / Trade-offs

- Drag-and-drop library compatibility risk → Choose a React DnD approach proven for current React version; add smoke test for drag lifecycle.
- Optimistic update inconsistency on API failure → Keep pre-drop snapshot and deterministic rollback path; display non-blocking error notice.
- Stage identifier mismatch between flow and candidate data → Add mapping guardrails and fallback handling for unknown stage values.
- Mobile usability degradation with many columns/cards → Enforce minimum card spacing, touch-friendly drop targets, and horizontal scroll snap cues.
- Accessibility risk for drag-only interaction → Provide keyboard-accessible fallback actions for stage movement where feasible.

## Migration Plan

1. Add route and navigation wiring from positions list action.
2. Introduce process detail page and service integrations.
3. Implement board rendering from flow/candidate data.
4. Add drag/drop stage transitions with optimistic persistence and rollback.
5. Add responsive styles and small-screen refinements.
6. Add automated tests (including Playwright flows).
7. Validate in local browser and Chrome DevTools MCP checks.

Rollback strategy:

- Revert route link exposure from positions list and hide the process detail route entry until fixed.
- Keep backend untouched; rollback is frontend-only and low-risk for data integrity.

## Open Questions

- Should average score be rounded to a fixed precision (for example, one decimal) or displayed as received?
- Is card ordering inside each stage expected to persist after refresh, or can it be natural API order?
- Should stage changes require confirmation for specific terminal stages (if any exist in interviewFlow)?
- Is keyboard-only stage movement mandatory in this increment, or acceptable as follow-up hardening?
