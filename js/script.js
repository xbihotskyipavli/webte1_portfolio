// Shared script for all pages
const SEMESTER_START = new Date(2026, 8, 21); // 21.09.2026
const SEMESTER_END = new Date(2026, 11, 18, 23, 59, 59); // 18.12.2026


// Marks the document so CSS can enable JS-only features
document.documentElement.classList.add("js");

// Hamburger menu: toggle button, Escape key and focus handling
function initNavToggle() {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");
  if (!nav || !toggle) return;

  function setOpen(isOpen) {
    nav.classList.toggle("nav--open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  }

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("nav--open")) {
      setOpen(false);
      toggle.focus();
    }
  });
}

document.addEventListener("DOMContentLoaded", initNavToggle);


/* ===== Workspace page ===== */

const WORKSPACE_HOTSPOTS = [
  {
    id: "computer",
    label: "Môj počítač",
    title: "Môj počítač",
    text: "Na tomto notebooku som počas 48 hodín písal serverovú časť, REST API a napájal som platobnú bránu a e-mailovú službu.",
    x: 38, y: 62,
    side: "bottom", align: "center"
  },
  {
    id: "zakhar",
    label: "Môj kamarát Zakhar",
    title: "Zakhar",
    text: "Môj kamarát Zakhar. Navrhol dizajn webovej stránky nášho produktu ktorý sme vytvorili v rámci Hackathonu.",
    x: 88, y: 50,
    side: "bottom", align: "end"
  },
  {
    id: "oleh",
    label: "Môj kamarát Oleh",
    title: "Oleh",
    text: "Môj kamarát Oleh. Prepájal používateľské rozhranie s mojím API a písal testy.",
    x: 35, y: 24,
    side: "top", align: "center"
  },
  {
    id: "other-team",
    label: "Iný tím",
    title: "Iný tím",
    text: "Súperi od vedľajšieho stola. Riešili inú úlohu, ale mali sme čas sa s nimi zoznamiť. Vymenili sme si tipy na techniky prezentácií.",
    x: 67, y: 12,
    side: "bottom", align: "end"
  },
  {
    id: "snacks",
    label: "Občerstvenie pre súťažiacich",
    title: "Občerstvenie",
    text: "Organizátori poskytovali nám pizzu, ovocie a nápoje aby sme nemrhali čas a sustredili sa na riešení zadania.",
    x: 9, y: 40,
    side: "top", align: "start"
  }
];

// Builds one hotspot (button + panel) from a data object
function createWorkspaceHotspot(item, index) {
  const hotspot = document.createElement("div");
  hotspot.className = "hotspot";
  hotspot.dataset.side = item.side;
  hotspot.dataset.align = item.align;
  hotspot.style.setProperty("--x", item.x + "%");
  hotspot.style.setProperty("--y", item.y + "%");

  const button = document.createElement("button");
  button.className = "hotspot__btn";
  button.type = "button";
  button.setAttribute("aria-label", item.label);
  button.setAttribute("aria-describedby", "hotspot-panel-" + item.id);

  const badge = document.createElement("span");
  badge.className = "hotspot__badge";
  badge.setAttribute("aria-hidden", "true");
  badge.textContent = String(index + 1);
  button.appendChild(badge);

  const panel = document.createElement("div");
  panel.className = "hotspot__panel";
  panel.id = "hotspot-panel-" + item.id;

  const title = document.createElement("h3");
  title.className = "hotspot__title";
  title.textContent = item.title;

  const text = document.createElement("p");
  text.className = "hotspot__text";
  text.textContent = item.text;

  panel.append(title, text);
  hotspot.append(button, panel);
  return hotspot;
}

function initWorkspaceHotspots() {
  const overlay = document.querySelector("[data-hotspot-overlay]");
  if (!overlay) return; // not the workspace page

  WORKSPACE_HOTSPOTS.forEach((item, index) => {
    overlay.appendChild(createWorkspaceHotspot(item, index));
  });
  overlay.closest(".workspace__stage").classList.add("workspace__stage--ready");
}

document.addEventListener("DOMContentLoaded", initWorkspaceHotspots);

// ==== Schedule page ====

const DAY_NAMES = ["Nedeľa", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota"];
const TYPE_NAMES = { lecture: "prednáška", exercise: "cvičenie" };
const HOURS_PER_WEEK = 24 * 7;
 
function formatHour(hour) {
  return hour + ":00";
}
 
function initSchedule() {
  const table = document.getElementById("schedule-table");
  if (!table) return;
 
  const status = document.getElementById("schedule-status");
  const emptyMessage = document.getElementById("schedule-empty");
  const scrollBox = document.getElementById("schedule-scroll");
  const filterButtons = document.querySelectorAll("[data-filter]");
 
  const lessons = Array.from(table.querySelectorAll(".schedule__cell")).map((cell) => ({
    cell: cell,
    name: cell.querySelector("strong").textContent,
    day: Number(cell.dataset.day),
    start: Number(cell.dataset.start),
    end: Number(cell.dataset.end),
    type: cell.dataset.type,
  }));
 
  // Hours until the lesson starts next time (wraps to next week)
  function getHoursUntil(lesson, currentDay, currentHour) {
    let diff = ((lesson.day - currentDay + 7) % 7) * 24 + lesson.start - currentHour;
    if (diff <= 0) diff += HOURS_PER_WEEK;
    return diff;
  }
 
  function updateCurrentLesson() {
    const now = new Date();
    const currentDay = now.getDay();
    const currentHour = now.getHours() + now.getMinutes() / 60;
 
    lessons.forEach((lesson) => lesson.cell.classList.remove("schedule__cell--now"));
 
    const running = lessons.filter(
      (lesson) => lesson.day === currentDay && currentHour >= lesson.start && currentHour < lesson.end
    );
 
    if (running.length > 0) {
      running.forEach((lesson) => lesson.cell.classList.add("schedule__cell--now"));
      const text = running
        .map((lesson) => lesson.name + " (" + TYPE_NAMES[lesson.type] + ", do " + formatHour(lesson.end) + ")")
        .join(" a ");
      status.textContent = "Práve prebieha: " + text + ".";
      return;
    }
 
    const next = lessons
      .slice()
      .sort((a, b) => getHoursUntil(a, currentDay, currentHour) - getHoursUntil(b, currentDay, currentHour))[0];
    const isToday = next.day === currentDay && getHoursUntil(next, currentDay, currentHour) < 24;
    const when = isToday ? "dnes" : DAY_NAMES[next.day];
    status.textContent =
      "Práve neprebieha žiadna výučba. Najbližšia hodina: " +
      when + " o " + formatHour(next.start) + ", " + next.name + " (" + TYPE_NAMES[next.type] + ").";
  }
 
  function applyFilter(type) {
    let visibleCount = 0;
    lessons.forEach((lesson) => {
      const show = type === "all" || lesson.type === type;
      lesson.cell.classList.toggle("is-filtered-out", !show);
      if (show) visibleCount++;
    });
    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === type;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    emptyMessage.hidden = visibleCount > 0;
    scrollBox.hidden = visibleCount === 0;
  }
 
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => applyFilter(button.dataset.filter));
  });
 
  updateCurrentLesson();
  setInterval(updateCurrentLesson, 60000);
}

initSchedule();