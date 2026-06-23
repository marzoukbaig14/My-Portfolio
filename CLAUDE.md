# CLAUDE.md — Agent Contract for this Portfolio Repo

This is the behavioral contract for any agent working in this repository. Read it at the start of every session. The detailed task you are here to do is specified in `FRONTEND_AGENT.md`; read that next.

This repo is a personal Next.js portfolio deployed on Vercel. The current task is building a `/committed` page: a live, in-browser demo of "Committed," a small fine-tuned model that writes Conventional Commits messages from code diffs. The demo calls a separate model API. This repo owns only the presentation.

## Who you are working with

The human has a strong CS and ML background but is still building hands-on experience with deployment and frontend tooling. Explain your choices briefly as you go. The human owns the conceptually important decisions; you handle the scaffolding.

## The rules

1. **Ask when uncertain.** If a path, version, library, or intent is unclear, stop and ask one focused question rather than guessing.

2. **Verify real state; never fabricate it.** Do not assume a command or build worked. Check the actual output, diagnose from real errors, and build only on verified results.

3. **Stay in scope.** Work to `FRONTEND_AGENT.md`. If you think something should be added or changed, propose it and ask first. Do not expand scope on your own.

4. **Match the existing site; do not reinvent it.** Reuse the existing components, design tokens, fonts, and colors. The `/committed` page must look native to this portfolio. Do not introduce a new design language or a UI kit that fights the existing look. Any background effect stays subtle and lightweight and respects `prefers-reduced-motion`.

5. **Do the plumbing; the human owns the core.** You build the page, the states, and the wiring. The human owns the narrative, the real example diffs, the final copy, and the design direction. Use clearly marked placeholders for content you were not given.

6. **Consume the API contract; do not reach into the backend.** The demo calls the model API at `POST /generate` and `GET /health`. The backend lives in a different repo; do not touch it. The backend URL is an environment variable. Build against a local mock that returns the same shape if the backend is not live yet.

7. **Work autonomously; gate only on production.** Permissions are granted broadly in `.claude/settings.json`, so act without asking for routine tool use: edits, builds, tests, installs, and pushing feature branches for Vercel previews. The one hard gate: stop and get explicit confirmation from the human before any production action: merging or pushing to `main`, force-pushing, or otherwise putting changes on the live site. Approval for one production action does not carry to the next. (The Committed page itself is already live; this gate is about how changes reach production, not whether the page exists.)

8. **Nothing depends on local machine state.** The human works from shared machines. Use environment variables for configuration, commit what is needed, and never assume a file is sitting on local disk.

9. **Handle secrets safely.** Never hardcode, print, or commit secrets. The backend URL and any keys come from environment variables.

10. **Write like a professional engineer.** Clear, concise prose in comments and commit messages.

## Stack

Next.js (use whichever router the repo already uses), styled with the existing system, Framer Motion for animation, deployed on Vercel with a preview URL per branch.

## Don't

- Don't reinvent or override the design system; match it.
- Don't write final marketing copy or curate the real example diffs; those are the human's. Placeholders only.
- Don't merge or push to production (`main` / live site) without explicit confirmation; feature-branch previews are fine.
- Don't modify backend or serving code; it lives in a different repo.
- Don't add a 3D engine or heavy dependencies for the background; keep it light and reduced-motion-safe.
