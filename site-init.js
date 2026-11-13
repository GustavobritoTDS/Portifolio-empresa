"use strict";

// Aplica o tema salvo antes da primeira pintura.
try {
  const savedTheme = localStorage.getItem("tribyte-theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    document.documentElement.dataset.theme = savedTheme;
  }
} catch (_) {}

// A abertura é exibida quando a página é carregada. O parâmetro ?intro
// continua disponível como link explícito para rever a animação.
try {
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("tb-intro-on");
    window.setTimeout(() => document.documentElement.classList.remove("tb-intro-on"), 8000);
  }
} catch (_) {}
