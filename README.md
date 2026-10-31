# Grade 11 – Visionaries Classroom Dashboard (S.Y. 2026–2027)

React + TypeScript + Vite. Data is saved in your browser's localStorage (schema v1). It does **not** sync across devices or browsers; use Settings → Export/Import JSON to back up and transfer.

## Run
    npm install
    npm run dev      # development
    npm run build    # production build in dist/

## Deploy (GitHub Pages)
1. Push to `main`. 2. Repo → Settings → Pages → Source: **GitHub Actions**. The workflow in `.github/workflows/deploy.yml` builds and publishes. `base: './'` and hash navigation (`#/page`) make refreshes and subpaths work.

## Constitution alignment
Officers (Art. VII), five committees (Art. VIII), meeting types (Art. X), Treasurer ledger (Art. XI), resolutions and minutes (Art. XII), tardiness notice at 6 consecutive instances with suspension days excluded (Art. XV §1a), and the Mon–Fri monthly board with crossed-out no-class days, side notes and daily cleaners.

## Privacy
This is a public static site. Do not commit real grades, attendance, or student contact details. Seed data contains no student names. Never store passwords or API keys here.
