---
name: pr-review
argument-hint: "[pr-number]"
---

Review a pull request for the Agenz Website.

1. View the PR summary:
   ```bash
   gh pr view $ARGUMENTS
   ```

2. View the diff:
   ```bash
   gh pr diff $ARGUMENTS
   ```

3. Check the following manually:
   - **Canvas/DOM separation maintained** — no Three.js imports in `/components/dom/`, no DOM-only logic in `/components/canvas/`
   - **ScrollTrigger timers not removed** — the staggered 500/600/800/1000ms refreshes must be present
   - **GSAP timeline cleanup on unmount** — every timeline ref must have a cleanup function
   - **No pricing information added** — check all Service interfaces, data files, and UI text
   - **CSP headers updated** — if any new external service is added, verify it appears in `next.config.js` CSP directives

4. Run the code-reviewer agent for a full automated review.

5. Post your findings:
   ```bash
   gh pr review $ARGUMENTS --comment --body "<findings>"
   ```
   Or approve/request changes:
   ```bash
   gh pr review $ARGUMENTS --approve
   gh pr review $ARGUMENTS --request-changes --body "<required changes>"
   ```
