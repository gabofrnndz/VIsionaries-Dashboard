const STORAGE_KEY = "classroom-dashboard-v1";
const pageInfo = {
  dashboard: ["Dashboard", "Good day, Visionaries.", "Your classroom information, organized in one place."],
  announcements: ["Announcements", "Announcements", "Class notices, updates, and important reminders."],
  calendar: ["Calendar", "Academic calendar", "Keep track of important dates and activities."],
  assignments: ["Assignments", "Assignments & projects", "Organize requirements and keep deadlines in sight."],
  grades: ["Grade Tracker", "Grade tracker", "A personal workspace for monitoring academic progress."],
  directory: ["Class Directory", "Class directory", "Keep class roles and responsibilities organized."],
  attendance: ["Attendance", "Attendance", "Attendance tracking prototype for authorized use."],
  governance: ["Class Governance", "Class governance", "Document meetings, resolutions, committees, and projects."],
  resources: ["Resources", "Learning resources", "Keep useful learning links easy to find."],
  settings: ["Settings", "Settings", "Customize the dashboard and manage your local data."]
};
const defaultData = { announcements: [], events: [], assignments: [], resources: [], directory: [], resolutions: [], meetings: [], attendance: [], grades: [] };
let data = loadData();
let currentPage = "dashboard";
let currentKind = "announcements";

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return saved && typeof saved === "object" ? { ...structuredClone(defaultData), ...saved } : structuredClone(defaultData);
  } catch { return structuredClone(defaultData); }
}
function saveData() { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}
function dateLabel(value) {
  if (!value) return "No date set";
  const date = new Date(value.length === 10 ? `${value}T12:00:00` : value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
function all(kind) { return Array.isArray(data[kind]) ? data[kind] : []; }
function setPage(page) {
  currentPage = pageInfo[page] ? page : "dashboard";
  document.querySelectorAll(".nav-item").forEach(btn => btn.classList.toggle("active", btn.dataset.page === currentPage));
  document.getElementById("pageCrumb").textContent = pageInfo[currentPage][0];
  document.getElementById("pageTitle").textContent = pageInfo[currentPage][1];
  document.getElementById("pageDescription").textContent = pageInfo[currentPage][2];
  document.getElementById("welcomeEyebrow").textContent = currentPage === "dashboard" ? "CLASS WORKSPACE" : "CLASSROOM TOOLS";
  document.getElementById("sidebar").classList.remove("open");
  renderPage();
}
function statCard(label, value, icon, note) {
  return `<article class="stat-card"><div class="stat-top"><span>${label}</span><span class="stat-icon">${icon}</span></div><div class="stat-number">${value}</div><div class="stat-foot">${note}</div></article>`;
}
function panel(title, subtitle, content, action = "") {
  return `<section class="panel"><div class="panel-heading"><div><h2>${title}</h2>${subtitle ? `<p>${subtitle}</p>` : ""}</div>${action}</div>${content}</section>`;
}
function empty(message, detail = "Add your first item to get started.") {
  return `<div class="empty-state"><strong>${message}</strong>${detail}</div>`;
}
function previewRows(kind, icon, limit = 4) {
  const items = [...all(kind)].sort((a,b) => (b.createdAt || "").localeCompare(a.createdAt || "")).slice(0, limit);
  if (!items.length) return empty("Nothing here yet.");
  return `<div class="list">${items.map(item => `<div class="list-row"><div class="list-icon">${icon}</div><div class="list-main"><strong>${escapeHTML(item.title)}</strong><p>${escapeHTML(item.details || item.date || "No additional details")}</p></div>${item.status ? `<span class="badge">${escapeHTML(item.status)}</span>` : ""}</div>`).join("")}</div>`;
}
function dashboardPage() {
  const pending = all("assignments").filter(x => !["Completed","Submitted"].includes(x.status)).length;
  const upcoming = all("events").filter(x => !x.date || x.date >= new Date().toISOString().slice(0,10)).length;
  const recentAnnouncements = all("announcements").length;
  const complete = all("assignments").filter(x => ["Completed","Submitted"].includes(x.status)).length;
  const total = all("assignments").length;
  const progress = total ? Math.round(complete / total * 100) : 0;
  return `<div class="stats-grid">
    ${statCard("Upcoming activities", upcoming, "▦", "Events in your calendar")}
    ${statCard("Pending assignments", pending, "✓", "Requirements to work on")}
    ${statCard("Announcements", recentAnnouncements, "▤", "Saved class notices")}
    ${statCard("Task completion", `${progress}%`, "↗", `${complete} of ${total} completed`)}
  </div>
  <div class="content-grid"><div>
    ${panel("Upcoming activities", "Your saved calendar events", previewRows("events", "▦"), `<button class="text-button" data-go="calendar">View calendar →</button>`)}
    ${panel("Recent announcements", "Latest class notices", previewRows("announcements", "▤"), `<button class="text-button" data-go="announcements">View all →</button>`)}
  </div><div>
    ${panel("Assignments", "Your current requirements", previewRows("assignments", "✓"), `<button class="text-button" data-go="assignments">View all →</button>`)}
    ${panel("Quick actions", "Create a new record", `<div class="action-grid">
      <button class="action-tile" data-add="announcements"><span>▤</span><strong>Announcement</strong><small>Share a class notice</small></button>
      <button class="action-tile" data-add="events"><span>▦</span><strong>Calendar event</strong><small>Save an important date</small></button>
      <button class="action-tile" data-add="assignments"><span>✓</span><strong>Assignment</strong><small>Track a requirement</small></button>
      <button class="action-tile" data-go="resources"><span>▧</span><strong>Resources</strong><small>Browse learning links</small></button>
    </div>`)}
  </div></div>`;
}
const kindTitles = { announcements: "announcement", events: "calendar event", assignments: "assignment", resources: "resource", directory: "directory entry", resolutions: "class resolution", meetings: "meeting", attendance: "attendance record", grades: "grade record" };
function renderCards(kind) {
  const items = [...all(kind)].sort((a,b) => (a.date || b.createdAt || "").localeCompare(b.date || a.createdAt || ""));
  if (!items.length) return empty(`No ${kindTitles[kind] || "items"} yet.`, "Use the Add button to create your first record.");
  return items.map(item => `<article class="item-card">
    <div class="item-card-top"><div><h3>${escapeHTML(item.title)}</h3><div class="item-meta">${item.category ? `<span class="badge">${escapeHTML(item.category)}</span>` : ""}${item.status ? `<span class="badge ${item.status === "Completed" || item.status === "Submitted" ? "green" : ""}">${escapeHTML(item.status)}</span>` : ""}${item.date ? `<span>${dateLabel(item.date)}</span>` : ""}${item.subject ? `<span>${escapeHTML(item.subject)}</span>` : ""}</div></div><button class="delete-button" title="Delete item" aria-label="Delete ${escapeHTML(item.title)}" data-delete="${kind}" data-id="${escapeHTML(item.id)}">×</button></div>
    ${item.details ? `<p>${escapeHTML(item.details)}</p>` : ""}
    ${item.link ? `<div class="item-meta"><a href="${escapeHTML(item.link)}" target="_blank" rel="noopener noreferrer">Open resource ↗</a></div>` : ""}
  </article>`).join("");
}
function listPage(kind, description) {
  return `<div class="toolbar"><input class="search-input" id="listSearch" placeholder="Search ${kindTitles[kind] || "items"}..." aria-label="Search items"><button class="primary-button" data-add="${kind}">＋ Add ${kindTitles[kind] || "item"}</button></div><div id="itemsContainer">${renderCards(kind)}</div>`;
}
function gradesPage() {
  return `${panel("Grade tracker", "Personal tracking only. Do not enter sensitive data on a public device.", `<p class="muted">This starter provides the section layout. A complete grade calculator should include subject-specific grading weights, score entry, and the applicable school conversion table.</p><div class="action-grid" style="margin-top:16px"><button class="action-tile" data-add="grades"><span>＋</span><strong>Add grade record</strong><small>Record a personal academic note</small></button><button class="action-tile" data-go="settings"><span>⚙</span><strong>Data settings</strong><small>Export or import local data</small></button></div>`)}<div id="itemsContainer">${renderCards("grades")}</div>`;
}
function directoryPage() {
  return `${panel("Directory privacy", "", `<p class="muted">Use sample or non-sensitive information in this prototype. A public GitHub Pages site is not appropriate for private student details.</p>`)}${listPage("directory")}`;
}
function attendancePage() {
  return `${panel("Privacy notice", "", `<p class="muted">Attendance records are sensitive. This demo stores data in this browser and does not provide authentication or secure access controls. Do not enter real student attendance in a public deployment.</p>`)}${listPage("attendance")}`;
}
function governancePage() {
  return `<div class="content-grid"><div>${panel("Class resolutions", "Record decisions and initiatives", listPage("resolutions"))}</div><div>${panel("Meetings", "Agendas, minutes, and action items", listPage("meetings"))}</div></div>`;
}
function settingsPage() {
  return `${panel("Appearance", "Personalize your workspace", `<div class="settings-row"><div><strong>Dark theme</strong><p>Switch between light and dark appearance.</p></div><button class="secondary-button" id="settingsTheme">Toggle theme</button></div>`)}
  ${panel("Data management", "Records are saved in this browser only", `<div class="settings-row"><div><strong>Export a backup</strong><p>Download your dashboard records as a JSON file.</p></div><button class="secondary-button" id="exportButton">Export JSON</button></div>
  <div class="settings-row"><div><strong>Import a backup</strong><p>Restore records from a previously exported JSON file.</p></div><button class="secondary-button" id="importButton">Import JSON</button></div>
  <div class="settings-row"><div><strong>Reset local data</strong><p>Delete records stored by this prototype in the current browser.</p></div><button class="secondary-button" id="resetButton">Reset data</button></div>`)}
  ${panel("Class information", "Prototype defaults", `<div class="settings-row"><div><strong>Class name</strong><p>11 – Visionaries</p></div><span class="badge">Editable in source</span></div><div class="settings-row"><div><strong>School year</strong><p>2026–2027</p></div><span class="badge">Prototype</span></div>`)}`;
}
function renderPage() {
  const root = document.getElementById("pageRoot");
  const pages = {
    dashboard: dashboardPage,
    announcements: () => listPage("announcements"),
    calendar: () => listPage("events"),
    assignments: () => listPage("assignments"),
    grades: gradesPage,
    directory: directoryPage,
    attendance: attendancePage,
    governance: governancePage,
    resources: () => listPage("resources"),
    settings: settingsPage
  };
  root.innerHTML = (pages[currentPage] || dashboardPage)();
  bindPageActions();
}
function addItem(kind, formData) {
  const item = Object.fromEntries(formData.entries());
  item.id = (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);
  item.createdAt = new Date().toISOString();
  if (kind === "assignments" && !item.status) item.status = "Not Started";
  if (kind === "events" && !item.category) item.category = "Class Activity";
  data[kind].unshift(item);
  saveData();
  closeModal();
  renderPage();
}
function openModal(kind) {
  currentKind = kind;
  const title = kindTitles[kind] || "item";
  document.getElementById("modalTitle").textContent = `Add ${title}`;
  const extra = document.getElementById("extraFields");
  let fields = "";
  if (["events","assignments","attendance","grades"].includes(kind)) fields += `<label for="itemDate">${kind === "assignments" ? "Due date" : "Date"}</label><input id="itemDate" name="date" type="date">`;
  if (["events","assignments","resources"].includes(kind)) fields += `<label for="itemCategory">${kind === "assignments" ? "Subject" : "Category"}</label><input id="itemCategory" name="${kind === "assignments" ? "subject" : "category"}" maxlength="80" placeholder="${kind === "assignments" ? "e.g. General Mathematics" : "e.g. School Activity"}">`;
  if (kind === "assignments") fields += `<label for="itemStatus">Status</label><select id="itemStatus" name="status"><option>Not Started</option><option>In Progress</option><option>Completed</option><option>Submitted</option><option>Returned</option></select>`;
  if (kind === "announcements") fields += `<label for="itemCategory">Category</label><select id="itemCategory" name="category"><option>General Announcement</option><option>Academic Reminder</option><option>Examination</option><option>School Activity</option><option>Class Officers</option><option>Urgent Notice</option></select>`;
  if (kind === "resources") fields += `<label for="itemLink">Resource URL</label><input id="itemLink" name="link" type="url" placeholder="https://...">`;
  if (kind === "directory") fields += `<label for="itemCategory">Position / Committee</label><input id="itemCategory" name="category" placeholder="e.g. Class Secretary">`;
  if (kind === "resolutions") fields += `<label for="itemCategory">Resolution status</label><select id="itemCategory" name="category"><option>Draft</option><option>Proposed</option><option>Adopted</option><option>Implemented</option><option>Archived</option></select>`;
  if (kind === "meetings") fields += `<label for="itemDate">Meeting date</label><input id="itemDate" name="date" type="date"><label for="itemCategory">Meeting type</label><input id="itemCategory" name="category" placeholder="e.g. Class officers meeting">`;
  if (kind === "grades") fields += `<label for="itemCategory">Subject / grading period</label><input id="itemCategory" name="category" placeholder="e.g. General Mathematics — Q1">`;
  extra.innerHTML = fields;
  document.getElementById("itemForm").reset();
  document.getElementById("modalBackdrop").classList.remove("hidden");
  document.getElementById("itemTitle").focus();
}
function closeModal() { document.getElementById("modalBackdrop").classList.add("hidden"); }
function exportData() {
  const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), data }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a"); link.href = url; link.download = "classroom-dashboard-backup.json"; link.click();
  URL.revokeObjectURL(url);
}
function importData(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const imported = parsed.data || parsed;
      if (!imported || typeof imported !== "object" || !Array.isArray(imported.announcements)) throw new Error("Invalid backup format");
      const merged = { ...structuredClone(defaultData), ...imported };
      for (const key of Object.keys(defaultData)) if (!Array.isArray(merged[key])) merged[key] = [];
      if (!confirm("Import this backup and replace the current local records?")) return;
      data = merged; saveData(); renderPage(); alert("Backup imported.");
    } catch { alert("Could not import this file. Please select a valid dashboard JSON backup."); }
    document.getElementById("importFile").value = "";
  };
  reader.readAsText(file);
}
function bindPageActions() {
  document.querySelectorAll("[data-go]").forEach(btn => btn.addEventListener("click", () => setPage(btn.dataset.go)));
  document.querySelectorAll("[data-add]").forEach(btn => btn.addEventListener("click", () => openModal(btn.dataset.add)));
  document.querySelectorAll("[data-delete]").forEach(btn => btn.addEventListener("click", () => {
    const kind = btn.dataset.delete, id = btn.dataset.id;
    if (confirm("Delete this item? This cannot be undone.")) { data[kind] = all(kind).filter(item => item.id !== id); saveData(); renderPage(); }
  }));
  const search = document.getElementById("listSearch");
  if (search) search.addEventListener("input", () => {
    const query = search.value.toLowerCase();
    const matches = all(currentPage === "calendar" ? "events" : currentPage).filter(item => JSON.stringify(item).toLowerCase().includes(query));
    document.getElementById("itemsContainer").innerHTML = matches.length ? matches.map(item => `<article class="item-card"><div class="item-card-top"><div><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.details || "")}</p><div class="item-meta">${item.date ? dateLabel(item.date) : ""}</div></div><button class="delete-button" data-delete="${currentPage === "calendar" ? "events" : currentPage}" data-id="${escapeHTML(item.id)}">×</button></div></article>`).join("") : empty("No matching items.", "Try another search.");
    document.querySelectorAll("[data-delete]").forEach(btn => btn.addEventListener("click", () => { const k=btn.dataset.delete; if(confirm("Delete this item?")) { data[k]=all(k).filter(x=>x.id!==btn.dataset.id); saveData(); renderPage(); }}));
  });
  const settingsTheme = document.getElementById("settingsTheme");
  if (settingsTheme) settingsTheme.addEventListener("click", toggleTheme);
  const exportButton = document.getElementById("exportButton");
  if (exportButton) exportButton.addEventListener("click", exportData);
  const importButton = document.getElementById("importButton");
  if (importButton) importButton.addEventListener("click", () => document.getElementById("importFile").click());
  const resetButton = document.getElementById("resetButton");
  if (resetButton) resetButton.addEventListener("click", () => {
    if (confirm("Reset all local dashboard records? This cannot be undone unless you have a backup.")) { data = structuredClone(defaultData); saveData(); renderPage(); }
  });
}
function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("classroom-dashboard-theme", document.body.classList.contains("dark") ? "dark" : "light");
}
document.getElementById("navigation").addEventListener("click", event => {
  const btn = event.target.closest("[data-page]");
  if (btn) setPage(btn.dataset.page);
});
document.getElementById("quickAddButton").addEventListener("click", () => openModal(currentPage === "calendar" ? "events" : currentPage === "assignments" ? "assignments" : currentPage === "resources" ? "resources" : currentPage === "announcements" ? "announcements" : "announcements"));
document.getElementById("itemForm").addEventListener("submit", event => { event.preventDefault(); addItem(currentKind, new FormData(event.currentTarget)); });
document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("cancelModal").addEventListener("click", closeModal);
document.getElementById("modalBackdrop").addEventListener("click", event => { if (event.target.id === "modalBackdrop") closeModal(); });
document.getElementById("themeButton").addEventListener("click", toggleTheme);
document.getElementById("menuButton").addEventListener("click", () => document.getElementById("sidebar").classList.toggle("open"));
document.getElementById("importFile").addEventListener("change", event => { if (event.target.files[0]) importData(event.target.files[0]); });
document.getElementById("todayLabel").textContent = new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
if (localStorage.getItem("classroom-dashboard-theme") === "dark") document.body.classList.add("dark");
setPage("dashboard");
