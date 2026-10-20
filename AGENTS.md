<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project notes

- UI text is in Brazilian Portuguese; code, comments and commit messages in English.
- Every table has RLS. New tables need policies and a test in `db-tests/`; run `npm run test:db`.
- Client code never inserts into `schools` or `memberships`; use database functions (e.g. `create_school`).
- Check `requireArea()` and the user's roles in every page and server action of `/painel` and `/familia`.
