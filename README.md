# eClass PH — Grade 11 Visionaries Edition

A static classroom-management portal designed for GitHub Pages.

## Publish on GitHub Pages

1. Extract this ZIP file.
2. Create a new GitHub repository (for example, `eclass-visionaries`).
3. Upload **all files inside this folder** to the repository's root. `index.html` must be at the root.
4. Open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select branch `main` and folder `/ (root)`, then Save.
7. Wait for GitHub Pages to publish the site. Your URL will look like:
   `https://YOUR-USERNAME.github.io/eclass-visionaries/`

## Included modules

- Overview dashboard
- Student registry (LRN field is optional)
- Attendance register
- Classroom officers and resolutions
- Standing committees
- Academic tasks and deadlines
- Calendar and information board
- Finance ledger and classroom inventory
- Classroom operations / inspection log
- Constitution and rules repository
- JSON backup and restore; print support

## Important limitations

This is a **static GitHub Pages version**. Records are saved in the browser's `localStorage` on the device and browser where they were entered.

- It does not provide shared, multi-user synchronization.
- It does not include real sign-in, server-side permissions, or a central database.
- Clearing browser data can erase records. Use the JSON backup regularly.
- Do not store sensitive learner, discipline, health, or financial details in this public static deployment.
- Official grades, disciplinary decisions, and financial approvals remain subject to the appropriate teacher/adviser and school procedures.

For a multi-user system with secure accounts, file uploads, role-based access, and shared records, connect a backend/database rather than relying on GitHub Pages alone.

## Local preview

Open `index.html` in a modern browser. For best results, run a local static server or use GitHub Pages after publishing.

No build step or external JavaScript dependency is required.
