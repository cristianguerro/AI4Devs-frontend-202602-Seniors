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
