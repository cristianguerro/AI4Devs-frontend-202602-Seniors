---
description: "Use when writing git commit messages, creating commits, or proposing commit text. Enforces strict Conventional Commits format."
name: "Conventional Commits"
---

# Conventional Commits (Strict)

Use Conventional Commits for every commit message.

- Required format: `<type>(<scope>): <subject>`
- Scope is recommended when obvious from the change (for example: `backend`, `frontend`, `candidate-service`).
- Subject must be lowercase, imperative mood, and concise.
- Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- For breaking changes, add `!` after type or scope and include a `BREAKING CHANGE:` footer.
- Optional body: explain why the change was needed and any side effects.
- Optional footer: reference issues, tickets, or PR context.

Do not use non-conventional or vague messages such as `update`, `changes`, or `fix stuff`.

Examples:

- `feat(frontend): add recruiter dashboard filters`
- `fix(backend): validate candidate email before persist`
- `refactor(position-service): split filtering into pure functions`
- `feat(api)!: replace legacy candidate endpoint`
