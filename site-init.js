"use strict";

// Aplica o tema salvo antes da primeira pintura.
try {
  const savedTheme = localStorage.getItem("tribyte-theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    document.documentElement.dataset.theme = savedTheme;
  }
} catch (_) {}

// A abertura aparece uma vez por sessão. O parâmetro ?intro permite revê-la.
try {
  const replayIntro = new URLSearchParams(window.location.search).has("intro");
  if (
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    (replayIntro || sessionStorage.getItem("tribyte-intro") !== "seen")
  ) {
    sessionStorage.setItem("tribyte-intro", "seen");
    document.documentElement.classList.add("tb-intro-on");
    window.setTimeout(() => document.documentElement.classList.remove("tb-intro-on"), 8000);
  }
} catch (_) {}
