"use strict";

/* Edite aqui os contatos comerciais quando estiverem definidos.
   WhatsApp: código do país + DDD + número, apenas dígitos.
   Sem contatos, o formulário funciona como um gerador local de briefing. */
const CONTACT = Object.freeze({ whatsapp: "5562992106861", email: "" });

/* Conteúdo centralizado para facilitar a manutenção dos estudos de caso. */
const PROJECTS = Object.freeze({
  smart: {
    index: "01",
    title: "SENAI Smart Class",
    liveUrl: "https://smart-sala.vercel.app/",
    art: "SMART\nCLASS",
    category: "SISTEMA WEB / EDUCAÇÃO",
    description:
      "Um projeto acadêmico que aproxima a tecnologia do ambiente de aprendizagem. A proposta reúne monitoramento e controles da sala em uma interface acessível.",
    type: "Projeto acadêmico",
    focus: "Interface e controle de sala",
    color: "#c8c2d9",
    ink: "#302446",
    features: [
      "Painel para visualizar informações do ambiente.",
      "Interface para iluminação e climatização.",
      "Experiências de acesso para diferentes perfis.",
    ],
    note: "A prévia do portfólio é uma composição ilustrativa. O projeto é desenvolvido no contexto do curso de Desenvolvimento de Sistemas do SENAI.",
  },
  gestao: {
    index: "02",
    title: "Gestão Comercial",
    art: "GESTÃO\nCOMERCIAL",
    category: "SISTEMA WEB / NEGÓCIOS",
    description:
      "Um projeto de sistema para organizar a rotina comercial: acompanhar vendas, visualizar metas e reunir informações que ajudam a equipe no dia a dia.",
    type: "Projeto de sistema",
    focus: "Vendas e operação comercial",
    color: "#b6c4b1",
    ink: "#203927",
    features: [
      "Visão geral de vendas e metas.",
      "Organização de registros e acompanhamento comercial.",
      "Áreas voltadas à gestão e à equipe de vendas.",
    ],
    note: "A prévia do portfólio é uma composição ilustrativa. Dados comerciais, nomes de clientes e acessos de terceiros não são apresentados.",
  },
  tribyte: {
    index: "03",
    title: "Nosso próprio universo",
    art: "TRI\nBYTE™",
    category: "WEBSITE / IDENTIDADE DIGITAL",
    description:
      "A TRIBYTE apresentada através de uma experiência autoral. Tipografia expressiva, três perspectivas visuais e uma identidade que conecta o estúdio aos seus projetos.",
    type: "Portfólio do estúdio",
    focus: "Design e desenvolvimento web",
    color: "#ff3547",
    ink: "#1b090c",
    features: [
      "Composição responsiva com identidade própria.",
      "Galeria de projetos com filtros e estudos de caso.",
      "Modo claro e escuro e animações adaptadas à preferência do visitante.",
    ],
    note: "Desenvolvido em HTML, CSS e JavaScript puros. Os retratos tipográficos representam a equipe até a inclusão das fotografias oficiais.",
  },
});

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [
  ...context.querySelectorAll(selector),
];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/* Tema persistente, sem depender de serviços externos. */
const themeToggle = $(".theme-toggle");
function updateThemeButton() {
  const isLight = document.documentElement.dataset.theme === "light";
  themeToggle.setAttribute(
    "aria-label",
    isLight ? "Ativar modo escuro" : "Ativar modo claro",
  );
  themeToggle.setAttribute("aria-pressed", String(isLight));
  $('meta[name="theme-color"]').content = isLight ? "#f1f0ea" : "#0b0b0b";
}
themeToggle.addEventListener("click", () => {
  const next =
    document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("tribyte-theme", next);
  } catch (_) {
    /* Tema segue funcional sem armazenamento. */
  }
  updateThemeButton();
});
updateThemeButton();

/* Menu móvel: foco contido, Escape e fechamento após a navegação. */
const menuToggle = $(".menu-toggle");
const mobileMenu = $("#mobile-menu");
function setMenu(open, restoreFocus = false) {
  const wasOpen = !mobileMenu.hidden;
  mobileMenu.hidden = !open;
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  document.body.classList.toggle("menu-open", open);
  if (open) $("a", mobileMenu).focus();
  else if (restoreFocus && wasOpen) menuToggle.focus();
}
menuToggle.addEventListener("click", () =>
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true"),
);
$$("a", mobileMenu).forEach((link) =>
  link.addEventListener("click", () => {
    setMenu(false);
    const target = $(link.getAttribute("href"));
    if (target) {
      target.tabIndex = -1;
      target.focus({ preventScroll: true });
    }
  }),
);
document.addEventListener("keydown", (event) => {
  if (mobileMenu.hidden) return;
  if (event.key === "Escape") {
    setMenu(false, true);
  }
  if (event.key === "Tab") {
    const items = [menuToggle, ...$$("a", mobileMenu)];
    const current = items.indexOf(document.activeElement);
    if (event.shiftKey && current === 0) {
      event.preventDefault();
      items.at(-1).focus();
    } else if (!event.shiftKey && current === items.length - 1) {
      event.preventDefault();
      items[0].focus();
    }
  }
});
window.matchMedia("(min-width: 801px)").addEventListener("change", (event) => {
  if (event.matches) setMenu(false);
});

/* Reveal progressivo: nenhum conteúdo depende da animação para existir. */
if ("IntersectionObserver" in window && !reducedMotion.matches) {
  document.documentElement.classList.add("js-ready");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 },
  );
  $$(".reveal").forEach((element) => revealObserver.observe(element));
}

/* Filtros: aria-pressed e anúncio da quantidade para leitores de tela. */
const filterButtons = $$(".filter-button");
filterButtons.forEach((button) =>
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    let count = 0;
    $$(".project-card").forEach((card) => {
      const show = filter === "all" || card.dataset.category === filter;
      card.hidden = !show;
      if (show) {
        count++;
        card.classList.add("is-visible");
      }
    });
    $("#filter-status").textContent =
      `${count} ${count === 1 ? "projeto exibido" : "projetos exibidos"}.`;
  }),
);

/* Diálogos nativos devolvem o foco ao controle que os abriu. */
function openDialog(dialog) {
  dialog.showModal();
  document.body.classList.add("modal-open");
}
$$("dialog").forEach((dialog) => {
  $(".dialog-close", dialog).addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    const box = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < box.left ||
        event.clientX > box.right ||
        event.clientY < box.top ||
        event.clientY > box.bottom)
    )
      dialog.close();
  });
  dialog.addEventListener("close", () => {
    if (!$("dialog[open]")) document.body.classList.remove("modal-open");
  });
});
const projectDialog = $("#project-dialog");
$$("[data-project]").forEach((button) =>
  button.addEventListener("click", () => {
    const project = PROJECTS[button.dataset.project];
    if (!project) return;
    $("#project-dialog-title").textContent = project.title;
    $("#project-dialog-category").textContent = project.category;
    $("#project-dialog-description").textContent = project.description;
    $("#project-dialog-note").textContent = project.note;
    const liveLink = $("#project-dialog-live");
    liveLink.hidden = !project.liveUrl;
    if (project.liveUrl) liveLink.href = project.liveUrl;
    else liveLink.removeAttribute("href");
    $(".dialog-art-index").textContent = project.index;
    $(".dialog-art-name").textContent = project.art;
    $(".dialog-art-name").style.whiteSpace = "pre-line";
    $(".dialog-project-art").style.background = project.color;
    $(".dialog-project-art").style.color = project.ink;
    const facts = $("#project-dialog-facts");
    facts.replaceChildren();
    [
      ["CONTEXTO", project.type],
      ["FOCO", project.focus],
    ].forEach(([label, value]) => {
      const container = document.createElement("div");
      const small = document.createElement("small");
      small.textContent = label;
      const span = document.createElement("span");
      span.textContent = value;
      container.append(small, span);
      facts.append(container);
    });
    const features = $("#project-dialog-features");
    features.replaceChildren();
    project.features.forEach((text) => {
      const item = document.createElement("li");
      item.textContent = text;
      features.append(item);
    });
    openDialog(projectDialog);
  }),
);
$("#project-dialog-link").addEventListener("click", () => {
  projectDialog.close();
  setTimeout(() => $("#name").focus({ preventScroll: true }), 0);
});
$$("[data-open-privacy]").forEach((button) =>
  button.addEventListener("click", () => openDialog($("#privacy-dialog"))),
);

/* Uma escolha nos serviços chega preenchida ao briefing. */
$$("[data-service]").forEach((link) =>
  link.addEventListener("click", () => {
    const radio = $$('input[name="service"]').find(
      (input) => input.value === link.dataset.service,
    );
    if (radio) radio.checked = true;
  }),
);

const briefingForm = $("#briefing-form");
let briefingText = "";
let senderName = "";
briefingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const nameInput = $("#name");
  const messageInput = $("#message");
  nameInput.setCustomValidity(
    nameInput.value.trim().length < 2
      ? "Informe um nome com pelo menos 2 caracteres."
      : "",
  );
  messageInput.setCustomValidity(
    messageInput.value.trim().length < 10
      ? "Conte um pouco mais sobre a ideia, com pelo menos 10 caracteres."
      : "",
  );
  if (!briefingForm.reportValidity()) return;
  const data = new FormData(briefingForm);
  senderName = String(data.get("name")).trim();
  briefingText = [
    "TRIBYTE — BRIEFING DE PROJETO",
    "",
    `Nome: ${senderName}`,
    `E-mail: ${String(data.get("email")).trim()}`,
    `Projeto: ${data.get("service")}`,
    `Objetivo: ${String(data.get("goal")).trim()}`,
    `Prazo: ${String(data.get("deadline")).trim()}`,
    "",
    "SOBRE A IDEIA",
    String(data.get("message")).trim(),
    "",
    "Briefing preparado no portfólio TRIBYTE. Nenhuma mensagem foi enviada automaticamente.",
  ].join("\n");
  $("#briefing-output").value = briefingText;
  $("#briefing-status").textContent = "";
  openDialog($("#briefing-dialog"));
});
["name", "message"].forEach((id) =>
  $(`#${id}`).addEventListener("input", (event) =>
    event.target.setCustomValidity(""),
  ),
);
$("#copy-briefing").addEventListener("click", async () => {
  try {
    if (!navigator.clipboard?.writeText)
      throw new Error("Clipboard indisponível");
    await navigator.clipboard.writeText(briefingText);
    $("#briefing-status").textContent =
      "Briefing copiado. Você pode colar onde preferir.";
  } catch (_) {
    $("#briefing-output").focus();
    $("#briefing-output").select();
    $("#briefing-status").textContent =
      "Selecionei o texto. Use a opção Copiar do seu dispositivo ou baixe o arquivo.";
  }
});
$("#download-briefing").addEventListener("click", () => {
  const blob = new Blob(["\ufeff", briefingText], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const slug =
    senderName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/gi, "-")
      .toLowerCase()
      .slice(0, 40) || "projeto";
  link.href = url;
  link.download = `briefing-tribyte-${slug}.txt`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  $("#briefing-status").textContent =
    "Seu arquivo está pronto para guardar ou compartilhar.";
});

/* Integração opcional: só aparece quando um contato real for configurado. */
const hasWhatsApp = /^\d{10,15}$/.test(CONTACT.whatsapp);
const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CONTACT.email);
if (hasWhatsApp || hasEmail) {
  const sendButton = $("#send-briefing");
  sendButton.hidden = false;
  $("#contact-help").textContent =
    "Prepare seu briefing e revise a mensagem antes de enviar.";
  sendButton.addEventListener("click", () => {
    const target = hasWhatsApp
      ? `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(briefingText)}`
      : `mailto:${CONTACT.email}?subject=${encodeURIComponent("Novo projeto — TRIBYTE")}&body=${encodeURIComponent(briefingText)}`;
    if (hasWhatsApp) window.open(target, "_blank", "noopener,noreferrer");
    else window.location.href = target;
  });
}

/* Relógio do estúdio: horário de Brasília. */
const clockFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});
function updateClock() {
  const now = new Date();
  $$(".local-time").forEach((clock) => {
    clock.textContent = clockFormatter.format(now);
    clock.dateTime = now.toISOString();
  });
}
updateClock();
setInterval(updateClock, 30000);
$("#current-year").textContent = String(new Date().getFullYear());

/* Rolagem sem trabalho excessivo: uma atualização por frame. */
const progress = $(".scroll-progress");
let scrollQueued = false;
function updateScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
  scrollQueued = false;
}
window.addEventListener(
  "scroll",
  () => {
    if (!scrollQueued) {
      scrollQueued = true;
      requestAnimationFrame(updateScroll);
    }
  },
  { passive: true },
);
window.addEventListener("resize", updateScroll, { passive: true });
updateScroll();
if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting)
          $$(".desktop-nav a").forEach((link) =>
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === `#${entry.target.id}`,
            ),
          );
      }),
    { rootMargin: "-20% 0px -55% 0px", threshold: 0 },
  );
  $$("section[id]").forEach((section) => navObserver.observe(section));
}

/* Cursor complementar: mantém o cursor nativo e não roda em telas de toque. */
if (
  window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !reducedMotion.matches
) {
  const halo = $(".cursor-halo");
  let cursorFrame = false;
  let cursorX = 0;
  let cursorY = 0;
  document.addEventListener(
    "pointermove",
    (event) => {
      cursorX = event.clientX;
      cursorY = event.clientY;
      if (!cursorFrame) {
        cursorFrame = true;
        requestAnimationFrame(() => {
          halo.style.left = `${cursorX}px`;
          halo.style.top = `${cursorY}px`;
          halo.style.opacity = "1";
          cursorFrame = false;
        });
      }
    },
    { passive: true },
  );
  document.addEventListener("pointerover", (event) =>
    halo.classList.toggle(
      "is-hovering",
      Boolean(event.target.closest("a,button,summary,label")),
    ),
  );
  document.addEventListener("pointerout", (event) => {
    if (!event.relatedTarget) halo.style.opacity = "0";
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) halo.style.opacity = "0";
  });
}

/* As três faces da marca têm significado e são operáveis com teclado. */
const pieceInfo = ["Sites com identidade.", "Sistemas que simplificam.", "Landing pages que conectam."];
$$(".tb-piece").forEach((piece, index) => {
  function selectPiece() {
    $$(".tb-piece").forEach((item) => item.classList.toggle("is-active", item === piece));
    $("#tb-piece-caption").textContent = pieceInfo[index];
  }
  piece.addEventListener("click", selectPiece);
  piece.addEventListener("focus", selectPiece);
  piece.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectPiece();
    }
  });
});
if (window.matchMedia("(hover:hover) and (pointer:fine)").matches && !reducedMotion.matches) {
  const heroArt = $(".tb-hero-art");
  const stage = $(".tb-hero-stage");
  let heroFrame = false;
  let heroX = 0, heroY = 0;
  heroArt.addEventListener("pointermove", (event) => {
    const bounds = heroArt.getBoundingClientRect();
    heroX = (event.clientX - bounds.left) / bounds.width - .5;
    heroY = (event.clientY - bounds.top) / bounds.height - .5;
    if (!heroFrame) {
      heroFrame = true;
      requestAnimationFrame(() => {
        stage.style.setProperty("--tilt-x", (-heroY * 8).toFixed(2) + "deg");
        stage.style.setProperty("--tilt-y", (heroX * 8).toFixed(2) + "deg");
        heroFrame = false;
      });
    }
  }, {passive:true});
  heroArt.addEventListener("pointerleave", () => {
    stage.style.removeProperty("--tilt-x");
    stage.style.removeProperty("--tilt-y");
  });
  $$(".project-card, .team-card").forEach((card) => {
    let pending = false, px = 0, py = 0;
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      px = (event.clientX - bounds.left) / bounds.width - .5;
      py = (event.clientY - bounds.top) / bounds.height - .5;
      if (!pending) {
        pending = true;
        requestAnimationFrame(() => {
          card.style.setProperty("--card-x", (-py * 3).toFixed(2) + "deg");
          card.style.setProperty("--card-y", (px * 3).toFixed(2) + "deg");
          card.style.setProperty("--shine-x", ((px + .5) * 100) + "%");
          card.style.setProperty("--shine-y", ((py + .5) * 100) + "%");
          card.style.setProperty("--shine-opacity", "1");
          pending = false;
        });
      }
    }, {passive:true});
    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("--card-x");
      card.style.removeProperty("--card-y");
      card.style.setProperty("--shine-opacity", "0");
    });
  });
}
/* Introdução curta, pulável, uma única vez por sessão; nunca impede uso sem JS. */
try {
  if (!reducedMotion.matches && sessionStorage.getItem("tribyte-intro") !== "seen") {
    sessionStorage.setItem("tribyte-intro", "seen");
    const intro = $("#brand-intro");
    intro.hidden = false;
    intro.removeAttribute("aria-hidden");
    const closeIntro = () => { intro.hidden = true; intro.setAttribute("aria-hidden", "true"); };
    $("#skip-intro").addEventListener("click", closeIntro, {once:true});
    window.setTimeout(closeIntro, 1100);
  }
} catch (_) { /* Sem armazenamento, o site funciona normalmente. */ }

/* Aprimoramento progressivo do formulário: sem JS, todas as etapas são visíveis. */
const wizardSteps = $$(".briefing-step");
const wizardControls = $("#wizard-actions");
const wizardNext = $("#wizard-next");
const wizardPrev = $("#wizard-prev");
const wizardSubmit = $("#briefing-submit");
let wizardIndex = 0;
function showWizardStep(index, moveFocus = false) {
  wizardIndex = index;
  wizardSteps.forEach((section, i) => { section.hidden = i !== index; });
  $("#wizard-progress").hidden = false;
  $("#wizard-progress").textContent = "Etapa " + (index + 1) + " de " + wizardSteps.length;
  wizardPrev.hidden = index === 0;
  wizardNext.hidden = index === wizardSteps.length - 1;
  wizardSubmit.hidden = index !== wizardSteps.length - 1;
  if (moveFocus) {
    const first = $("input:not([type=hidden]), textarea, select", wizardSteps[index]);
    first?.focus({preventScroll:true});
  }
}
wizardControls.hidden = false;
showWizardStep(0);
wizardNext.addEventListener("click", () => {
  const inputs = $$("input, select, textarea", wizardSteps[wizardIndex]);
  for (const input of inputs) {
    if (!input.checkValidity()) { input.reportValidity(); return; }
  }
  showWizardStep(Math.min(wizardIndex + 1, wizardSteps.length - 1), true);
});
wizardPrev.addEventListener("click", () => {
  showWizardStep(Math.max(0, wizardIndex - 1), true);
});
function updateBriefingSummary() {
  const data = new FormData(briefingForm);
  ["service", "goal", "deadline", "message"].forEach((key) => {
    const value = String(data.get(key) || "").trim();
    const target = $("[data-summary='" + key + "']");
    target.textContent = value ? (key === "message" ? value.slice(0, 150) : value) : "A definir";
  });
}
briefingForm.addEventListener("input", updateBriefingSummary);
briefingForm.addEventListener("change", updateBriefingSummary);
updateBriefingSummary();

/* Sensor opcional: só começa após ação explícita e nunca pede permissão sozinho. */
if ("DeviceOrientationEvent" in window && window.matchMedia("(pointer:coarse)").matches && !reducedMotion.matches) {
  const enableMotion = $("#tb-motion-enable");
  const motionStage = $(".tb-hero-stage");
  enableMotion.hidden = false;
  enableMotion.addEventListener("click", async () => {
    try {
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission !== "granted") { enableMotion.textContent = "Movimento indisponível"; return; }
      }
      let scheduled = false, beta = 0, gamma = 0;
      const onOrientation = (event) => {
        if (!Number.isFinite(event.beta) || !Number.isFinite(event.gamma)) return;
        beta = Math.max(-8, Math.min(8, event.beta / 8));
        gamma = Math.max(-8, Math.min(8, event.gamma / 5));
        if (!scheduled) {
          scheduled = true;
          requestAnimationFrame(() => {
            motionStage.style.setProperty("--tilt-x", beta.toFixed(1) + "deg");
            motionStage.style.setProperty("--tilt-y", gamma.toFixed(1) + "deg");
            scheduled = false;
          });
        }
      };
      window.addEventListener("deviceorientation", onOrientation, {passive:true});
      enableMotion.hidden = true;
    } catch (_) {
      enableMotion.textContent = "Movimento indisponível";
    }
  });
}
