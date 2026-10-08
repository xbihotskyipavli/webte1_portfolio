// Shared script for all pages

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
    text: "Na tomto notebooku som počas 24 hodín písal serverovú časť a REST API našej aplikácie. Mal som tu otvorený editor, terminál aj dokumentáciu endpointov, teda presne to, čo robím pri vývoji bežne.",
    x: 38, y: 62,
    side: "bottom", align: "center"
  },
  {
    id: "zakhar",
    label: "Môj kamarát Zakhar",
    title: "Zakhar",
    text: "Môj kamarát Zakhar. Navrhol dizajn webovej stránky: rozloženie, farby a prototyp obrazoviek, podľa ktorých sme potom písali kód.",
    x: 88, y: 50,
    side: "bottom", align: "end"
  },
  {
    id: "oleh",
    label: "Môj kamarát Oleh",
    title: "Oleh",
    text: "Môj kamarát Oleh. Prepájal rozhranie s mojím API a testoval, či všetko funguje spolu. Vďaka nemu sme chyby našli skôr než porota.",
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
