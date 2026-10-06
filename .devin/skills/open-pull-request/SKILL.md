---
name: open-pull-request
description: Use when the user asks to commit, push, open, or update a pull request in this repo. Defines branch naming, Conventional Commits, the verification gate (check, lint, build), security checks, and the PR body structure.
---

# Open a Pull Request (cobraComoPro-colombia)

The app lives in `app/` (SvelteKit 2, Svelte 5, Bun). Use `.github/pull_request_template.md` as the PR body.

## 1. Inspect before acting
- Run `git status --short --branch`, `git diff --stat`, `git log --oneline -5`.
- Never discard or overwrite changes you did not make. Never switch branches with a dirty tree without asking.
- Base is `main`. Do not commit directly to `main`.

## 2. Branch
- Format: `<type>/<short-kebab-description>` where type is `feat | fix | chore | docs | refactor | test | ci`.
- Add a ticket ID only if the user supplies one. Never invent one.
- Keep branches short-lived and PRs focused on one concern.

## 3. Commits (Conventional Commits)
- `type(scope): imperative lowercase summary` (<= 72 chars), body explains *why*.
- One logical change per commit. Mark breaking changes with `!` and a `BREAKING CHANGE:` footer.
- Do not add generated noise (`.DS_Store`, build output, `.env*`, `.windsurf/`).

## 4. Verification gate (run from `app/`; report real results)
1. `bun run check` (svelte-check, must have 0 errors)
2. `bun run lint`
3. `bun run build`
If a step cannot run (e.g. environment issue), say so explicitly in the PR; never claim it passed.

## 5. Security checklist (block the PR if any fails)
- No secrets, tokens, or `.env*` contents in the diff or commit history (`git diff --cached` review).
- Do not weaken security config (rate limiting, headers, auth) without stating it in the PR.
- New dependencies: justify them, prefer versions published >= 7 days ago, no floating `latest`/`*`.
- Data changes (`tarifas-2026.json`): state source, period, and generation method; keep Zod schema validation passing.

## 6. Push and open the PR
- Push only when the user asked; never force-push shared branches.
- Title = the main Conventional Commit line.
- Body = filled template: Summary, Why, Changes, How verified, Risks/rollback, Screenshots (UI), Checklist.
- Use `gh pr create --base main --title "..." --body-file <file>` when `gh` is available; otherwise print title and body for the user.
- Keep the PR small (aim < 400 changed lines); if larger, propose splitting.

## 7. After opening
- Report the PR URL, verification results, and any known gaps. Do not merge without explicit approval.
