# Class Notes (Local PWA) — GitHub Pages

This build is 100% free (no backend). It stores photos in the browser (IndexedDB) and can be installed as a PWA.

## Quick deploy to GitHub Pages

1. **Create a repo** on GitHub (e.g., `class-notes`).
2. Push these files to the repo.
3. Open `.github/workflows/deploy.yml` and replace `REPO_NAME` with your repo name.
4. Commit and push to `main`.
5. The workflow builds and publishes to the `gh-pages` branch.
6. In **Settings → Pages**, set **Source** to **Deploy from a branch**, branch **gh-pages**.
7. Open `https://<your-username>.github.io/REPO_NAME/` on phone/desktop and **Install** the PWA.

Notes:
- The build copies `index.html` to `404.html` so deep-links work on Pages.
- If you rename the repo later, update `GHPAGES_BASE` accordingly and re-deploy.
