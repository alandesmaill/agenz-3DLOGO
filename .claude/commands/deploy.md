---
name: deploy
argument-hint: "[environment]"
---

Deploy the Agenz Website to the target environment (development or production).

1. Run a production build to catch any errors:
   ```bash
   npm run build
   ```

2. Run the linter:
   ```bash
   npm run lint
   ```

3. Check that all required environment variables are set in Vercel:
   - `EMAILJS_SERVICE_ID`
   - `EMAILJS_TEMPLATE_ID`
   - `EMAILJS_USER_TEMPLATE_ID`
   - `EMAILJS_PUBLIC_KEY`
   - `EMAILJS_PRIVATE_KEY`
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
   - `RECAPTCHA_SECRET_KEY`

4. Verify CSP headers in `next.config.js` cover all external services currently in use.

5. Confirm there are no uncommitted changes:
   ```bash
   git status
   ```

6. Push to the development branch:
   ```bash
   git push origin development
   ```

7. **If deploying to production**: open a pull request from `development` → `main` and wait for review/merge.

8. Monitor the Vercel build logs for any errors.

9. After deploy, spot-check these routes in the deployed environment:
   - `/` — 3D fractured logo loads and pieces are clickable
   - `/about` — hero text and mission stats render correctly
   - `/contact` — form renders and submits (test with a real submission if possible)
   - `/services` — bento grid and all four service links work
