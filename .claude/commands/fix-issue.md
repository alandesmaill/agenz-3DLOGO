---
name: fix-issue
argument-hint: "[issue-number]"
---

Fix a GitHub issue for the Agenz Website.

1. View the issue:
   ```bash
   gh issue view $ARGUMENTS
   ```

2. Identify the layer the issue belongs to:
   - **3D canvas** → `/components/canvas/`
   - **DOM/UI** → `/components/dom/`
   - **Routing** → `/app/`
   - **Animation** → GSAP/ScrollTrigger in component files
   - **API/form** → `/app/api/`, `/lib/`

3. Find the relevant files using Glob and Grep before making any changes.

4. Apply a **minimal fix only** — do not refactor surrounding code, rename variables, or clean up unrelated areas.

5. Verify critical invariants are preserved:
   - ScrollTrigger refresh timers (500/600/800/1000ms) must remain intact
   - GSAP timeline cleanup on unmount must be preserved
   - Canvas/DOM separation must not be broken
   - No pricing information introduced

6. Verify the fix builds and lints:
   ```bash
   npm run lint && npm run build
   ```

7. Write a regression test if the issue is reproducible by a test:
   - Unit test in `/__tests__/` for logic issues
   - Playwright test in `/tests/` for UI/navigation issues

8. Commit with a descriptive message:
   ```
   fix: <description of what was fixed> (closes #$ARGUMENTS)
   ```
