# Grade 11 – Visionaries Classroom Dashboard (S.Y. 2026–2027)

The **built site is already in this folder** (`index.html` + `assets/`). Put these files at the **root of your GitHub repo**.

## Publish
Settings → Pages → **Deploy from a branch** → branch `main`, folder **/ (root)**. (Or choose GitHub Actions; the included workflow publishes the same files.) Your site: `https://USERNAME.github.io/REPO/`.

## Editing the source (optional)
Source is in `source/` (React + TypeScript + Vite). `cd source && npm install && npm run dev`. `npm run build` rewrites `index.html` and `assets/` in the repo root; commit them.

Data is saved in the browser (localStorage) and does not sync across devices; use Settings → Export/Import JSON. Keep real grades, attendance and contact details out of the public repo.

## Rebuild after editing source
`cd source && npm install && npm run build` (writes `index.html` and `assets/` to the repo root).
