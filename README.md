# Heon Heo — personal website

A static React website built with Vite, Tailwind CSS, and daisyUI. Client-side routes use URL hashes so every page works when hosted under a GitHub Pages repository path.

## Development

```bash
npm install
npm run dev
```

Open the URL printed by Vite (normally [http://localhost:5173](http://localhost:5173)).

## Production build

```bash
npm run build
npm run preview
```

The production site is written to `dist/`.

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and deploys the site whenever the `main` branch is pushed. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.

Routes appear after `#`, for example `https://user.github.io/repository/#/research`. This lets direct links and refreshes work without a custom 404 page.

## Notes

- The original Geist and Geist Mono font files are self-hosted in `src/assets/fonts` to preserve the previous design.
- IdeaGraph data is initialized from `ideagraph.json`; browser edits are stored locally because GitHub Pages has no server-side filesystem.
