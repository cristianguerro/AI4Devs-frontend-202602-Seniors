# CFGP Prompt Logger

Use this file to track prompt experiments, code-generation requests, review requests, and the AI context used for each run.

## Format

Copy this block for every new prompt session:

```md
## Entry YYYY-MM-DD HH:MM

- Goal:
- Scope:
- Files touched:
- Prompt:
- AI context used:
  - Agent:
  - Instructions:
  - Skills:
- Output summary:
- Validation:
- Follow-up:
```

## Current AI Tools In This Workspace

This workspace currently exposes AI context from three places: the active Copilot agent setup, repository instructions, and repo-local skills.

### Agent

- GitHub Copilot running on GPT-5.4.
- Available subagent: `Explore`
  - Purpose: fast read-only codebase exploration and Q&A.
  - Use when you need targeted repo discovery without cluttering the main conversation.

### Instructions

- Repo instruction file: `.github/instructions/conventional-commits.instructions.md`
  - Purpose: enforce Conventional Commits when writing commit messages, creating commits, or proposing commit text.
  - Relevance: only applies to commit-related work.

### Skills

Built-in skills available in the current agent session:

- Skill: `get-search-view-results`
  - Purpose: retrieve the current search results from the VS Code Search view.

- Skill: `agent-customization`
  - Purpose: create, review, fix, or debug agent customization files such as `.instructions.md`, `.prompt.md`, `.agent.md`, `SKILL.md`, `copilot-instructions.md`, and `AGENTS.md`.

Repo-local skills currently present in `.agents/skills`:

- `accessibility`
- `frontend-design`
- `nodejs-backend-patterns`
- `nodejs-best-practices`
- `seo`

## Notes

- Record which AI layer influenced the result: agent, instruction, and/or skill.
- Keep prompts verbatim when possible so results can be compared later.
- Prefer short validation notes that state what was checked and whether it passed.

## Entries

## Entry 2026-05-08 00:00

- Goal: Initialize the prompt logger.
- Scope: Create a reusable format for future prompt tracking.
- Files touched: `prompts/prompts-CFGP.md`
- Prompt: "Init this prompt logger with format and mention the current AI tools since agents instructions to skills."
- AI context used:
  - Agent: GitHub Copilot (GPT-5.4)
  - Instructions: `.github/instructions/conventional-commits.instructions.md` available for commit-related work
  - Skills: `get-search-view-results`, `agent-customization`, `accessibility`, `frontend-design`, `nodejs-backend-patterns`, `nodejs-best-practices`, `seo`
- Output summary: Added a prompt logging template and documented the current AI tooling available in this workspace.
- Validation: File initialized successfully.
- Follow-up: Append new prompt entries below this section.

## Entry 2026-05-08 17:21

- Goal: Continue OpenSpec change creation for the positions page and capture initial requirements from attached reference assets.
- Scope: Create the next ready artifact from the spec-driven workflow.
- Files touched: `openspec/changes/positions-page/proposal.md`
- Prompt: |
  /opsx-continue

  @file:assets Here there are 2 images. Current positions screen and the object of this development a simple render of the position detail screen.
  From the positions screen when the user clicks on 'Ver proceso' it should show the position detail screen.
  Here user will visualize and manage the position process. It must be a kanban style page, where candidates are cards and the steps of the process are the columns. At any time user can change the phase where a candidate is just dragging their card to the desired phase.
  These are some details about the implementation:
  - There should be a title in the screen.
  - There should be a back button that allows the user to go back to positions screen.
  - Candidate card must show full name and average score.
  - must be responsive to small screens.

  Api endpoints for integration are in place:
  - GET /positions/:id/interviewFlow
  - GET /positions/:id/candidates
  - PUT /candidates/:id/stage

  For testing purposes use playwrite MCP server. And test and make sure the screen is being rendered correctly using Chrome dev tools MCP server.

- AI context used:
  - Agent: GitHub Copilot (GPT-5.3-Codex)
  - Instructions: OpenSpec continue prompt flow from `.github/prompts/opsx-continue.prompt.md`
  - Skills: none explicitly invoked
- Output summary: Created proposal artifact including navigation from "Ver proceso", Kanban interaction requirements, responsive constraints, and endpoint integration/testing expectations.
- Validation: `openspec status --change "positions-page"` moved to 1/4 artifacts complete; `design` and `specs` unlocked.
- Follow-up: Run `/opsx:continue` to create `design.md`.

## Entry 2026-05-08 17:31

- Goal: Continue OpenSpec artifact progression by creating technical design.
- Scope: Produce architecture and implementation approach for the Kanban position detail feature.
- Files touched: `openspec/changes/positions-page/design.md`
- Prompt: "/opsx-continue"
- AI context used:
  - Agent: GitHub Copilot (GPT-5.3-Codex)
  - Instructions: OpenSpec continue prompt flow from `.github/prompts/opsx-continue.prompt.md`
  - Skills: none explicitly invoked
- Output summary: Created design artifact with decisions for routing, parallel data loading, state model, optimistic drag-drop persistence/rollback, responsive layout strategy, risks, and migration plan.
- Validation: `openspec status --change "positions-page"` moved to 2/4 artifacts complete; `specs` unlocked.
- Follow-up: Run `/opsx:continue` to create capability spec files.

## Entry 2026-05-08 17:40

- Goal: Create specs artifact and verify updated asset format is viewable.
- Scope: Convert proposal capability into a formal requirement spec and verify JPEG assets can be inspected.
- Files touched: `openspec/changes/positions-page/specs/position-process-detail-kanban/spec.md`
- Prompt: "/opsx-continue The assets files now are jpeg format, can you watch them?"
- AI context used:
  - Agent: GitHub Copilot (GPT-5.3-Codex)
  - Instructions: OpenSpec continue prompt flow from `.github/prompts/opsx-continue.prompt.md`
  - Skills: none explicitly invoked
- Output summary: Created spec with requirements/scenarios for route access, title/back button, Kanban columns/cards, drag-drop stage updates, rollback behavior, responsiveness, and browser automation validation. Confirmed JPEG assets were viewable.
- Validation: `openspec status --change "positions-page"` moved to 3/4 artifacts complete; `tasks` unlocked.
- Follow-up: Run `/opsx:continue` to create `tasks.md`.

## Entry 2026-05-08 17:46

- Goal: Complete OpenSpec artifact generation by creating implementation tasks.
- Scope: Produce dependency-ordered, trackable checklist for implementation.
- Files touched: `openspec/changes/positions-page/tasks.md`
- Prompt: "/opsx-continue"
- AI context used:
  - Agent: GitHub Copilot (GPT-5.3-Codex)
  - Instructions: OpenSpec continue prompt flow from `.github/prompts/opsx-continue.prompt.md`
  - Skills: none explicitly invoked
- Output summary: Created 24-task checklist covering routing/navigation, services/modeling, Kanban UI, drag-drop persistence/rollback, responsive/accessibility work, and automated validation tasks.
- Validation: `openspec status --change "positions-page"` reached 4/4 artifacts complete.
- Follow-up: Run `/opsx:apply` to implement tasks.

## Entry 2026-05-08 18:00

- Goal: Implement OpenSpec tasks for positions-page and validate feature behavior.
- Scope: End-to-end frontend implementation for position process detail Kanban page, tests, and task progress updates.
- Files touched: `frontend/src/App.js`, `frontend/src/App.tsx`, `frontend/src/components/Positions.tsx`, `frontend/src/components/PositionProcessDetail.tsx`, `frontend/src/components/PositionProcessDetail.css`, `frontend/src/services/positionProcessService.ts`, `frontend/src/components/Positions.test.tsx`, `frontend/src/components/PositionProcessDetail.test.tsx`, `openspec/changes/positions-page/tasks.md`
- Prompt: "/opsx-apply"
- AI context used:
  - Agent: GitHub Copilot (GPT-5.3-Codex)
  - Instructions: OpenSpec apply prompt flow from `.github/prompts/opsx-apply.prompt.md`
  - Skills: `frontend-design` guidance considered for UI quality (while preserving existing project patterns)
- Output summary: Implemented route navigation from positions to process detail, title/back header, stage columns and candidate cards, drag-drop stage changes with optimistic updates and rollback, keyboard stage-change fallback, responsive layout, and automated tests.
- Validation: Unit tests passed (5/5), production build passed, Playwright interaction checks passed (navigation, render, drag-drop, responsive viewport). Chrome DevTools MCP validation remained blocked due missing Chrome binary on host.
- Follow-up: Install Chrome/Chromium and complete remaining task 6.6, then archive change via `/opsx:archive`.
