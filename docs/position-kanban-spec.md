# Position Kanban - Lightweight SDD Specification

## Goal

Create a position detail page where recruiters can visualize and manage candidates by interview stage using a kanban layout.

## Scope

### In scope

- Route `/positions/:positionId`
- Position title
- Back navigation to `/positions`
- Dynamic columns based on interview steps
- Candidate cards grouped by current stage
- Candidate full name and average score
- Drag and drop between stages
- Optimistic update with backend persistence
- Rollback/error message if update fails
- Responsive layout for mobile
- Seed data adjusted to validate all stages

### Out of scope

- Authentication
- Backend endpoint changes
- New database schema
- New drag-and-drop dependencies
- Global frontend refactor
- Replacing Bootstrap
- Rewriting App.js to TypeScript

## Functional requirements

### FR-1 - Navigate to position detail

When the user clicks `Ver proceso` from the positions list, the app must navigate to the selected position detail page.

### FR-2 - Show position context

The page must show the position title and a back button to return to the positions list.

### FR-3 - Render interview stages

The page must render one kanban column for each interview step returned by the backend.

### FR-4 - Render candidates by stage

Each candidate must appear in the column matching its current interview step.

### FR-5 - Move candidates between stages

The user must be able to move a candidate to another interview stage using drag and drop.

### FR-6 - Persist candidate stage

When a candidate is moved, the frontend must call the backend update endpoint and persist the new stage.

### FR-7 - Handle update errors

If the update fails, the UI must rollback the candidate to its previous stage and show an error message.

### FR-8 - Support mobile layout

On small screens, kanban columns must stack vertically and occupy the available width.

## API integration

### Get interview flow

`GET /position/:id/interviewflow`

Used to retrieve:

- position name
- interview steps

### Get candidates

`GET /position/:id/candidates`

Used to retrieve candidates in process for the position.

### Update candidate stage

`PUT /candidates/:id`

Used to persist the new current interview step.

## Technical decisions

- Use existing React Router setup.
- Use Bootstrap/react-bootstrap already present in the project.
- Use native HTML5 drag and drop to avoid adding dependencies.
- Use TypeScript for new frontend files.
- Use small focused components:
  - `PositionDetail`
  - `KanbanBoard`
  - `KanbanColumn`
  - `CandidateCard`
- Keep backend logic unchanged.
- Adjust seed data only to validate the expected kanban scenario.

## Validation

- `npm run build` passes.
- `/positions` works.
- `/positions/1` renders the kanban.
- Candidate cards are displayed in the correct columns.
- Drag and drop updates the stage.
- Page refresh keeps the updated stage.
- Mobile layout stacks columns vertically.

## AI-first workflow

This implementation followed an AI-assisted SDD workflow:

1. Created `AGENTS.md` with project rules.
2. Asked the AI to analyze the repository before modifying code.
3. Defined implementation constraints.
4. Implemented the feature incrementally.
5. Validated build and runtime behavior.
6. Documented prompts in `prompts/prompts-iniciales.md`.