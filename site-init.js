"use strict";

// Aplica o tema salvo antes da primeira pintura.
try {
  const savedTheme = localStorage.getItem("tribyte-theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    document.documentElement.dataset.theme = savedTheme;
  }
} catch (_) {}

// A abertura atual aparece uma vez por sessão.
try {
  if (
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    sessionStorage.getItem("tribyte-intro-v2") !== "seen"
  ) {
    document.documentElement.classList.add("tb-first-visit");
    sessionStorage.setItem("tribyte-intro-v2", "seen");
  }
} catch (_) {}
