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