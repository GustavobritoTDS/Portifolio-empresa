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
    image: "assets/smart-class-sensores-hq.webp",
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
    note: "Imagens reais da interface do projeto acadêmico SENAI Smart Class. Os valores exibidos correspondem às capturas e podem variar no sistema ao vivo.",
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
    requestAnimationFrame(updateScroll);
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
    $("#smart-modal-gallery").hidden = button.dataset.project !== "smart";
    $("#project-dialog-side-gallery").hidden = button.dataset.project !== "smart";
    const liveLink = $("#project-dialog-live");
    liveLink.hidden = !project.liveUrl;
    if (project.liveUrl) liveLink.href = project.liveUrl;
    else liveLink.removeAttribute("href");
    const artBox = $(".dialog-project-art");
    const artImg = $("#project-dialog-art-img");
    artBox.classList.toggle("has-side-gallery", button.dataset.project === "smart");
    if (project.image) {
      artImg.src = project.image;
      artImg.alt = project.title || "";
      artBox.style.setProperty("--dialog-art-image", `url("${project.image}")`);
      artBox.classList.add("has-image");
    } else {
      if (artImg) {
        artImg.removeAttribute("src");
        artImg.alt = "";
      }
      artBox.style.removeProperty("--dialog-art-image");
      artBox.classList.remove("has-image");
    }
    $(".dialog-art-index").textContent = project.index;
    $(".dialog-art-name").textContent = project.art;
    $(".dialog-art-name").style.whiteSpace = "pre-line";
    artBox.style.background = project.color;
    artBox.style.color = project.ink;
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
  setTimeout(() => $("#message").focus({ preventScroll: true }), 0);
});
$$("[data-open-privacy]").forEach((button) =>
  button.addEventListener("click", () => openDialog($("#privacy-dialog"))),
);

/* Perfis da equipe: abre a biografia completa em um diálogo. */
const profileDialog = $("#profile-dialog");
$$("[data-profile]").forEach((button) =>
  button.addEventListener("click", () => {
    const card = button.closest(".team-card");
    const name = $(".team-info h3", card);
    const bio = $(".team-bio", card);
    const photo = $(".team-photo", card);
    if (!name || !bio || !photo) return;

    // Uma tag <br> não adiciona espaços em textContent.
    const fullName = Array.from(name.childNodes, (node) =>
      node.nodeName === "BR" ? " " : node.textContent,
    )
      .join("")
      .replace(/\s+/g, " ")
      .trim();
    $("#profile-dialog-title").textContent = fullName;
    $("#profile-dialog-bio").textContent = bio.textContent.trim();
    const dialogPhoto = $("#profile-dialog-photo");
    dialogPhoto.src = photo.getAttribute("src");
    dialogPhoto.alt = photo.alt;
    openDialog(profileDialog);
  }),
);

/* Um serviço escolhido abre a conversa já com a primeira frase escrita. */
const SERVICE_OPENERS = Object.freeze({
  "Site institucional": "Quero um site institucional para ",
  "Sistema web": "Quero um sistema web para ",
  "Landing page": "Quero uma landing page para ",
});
const briefingForm = $("#briefing-form");
const messageField = $("#message");
$$("[data-service]").forEach((link) =>
  link.addEventListener("click", () => {
    $("#service").value = link.dataset.service;
    if (!messageField.value.trim()) messageField.value = SERVICE_OPENERS[link.dataset.service] || "";
    setTimeout(() => {
      messageField.focus({ preventScroll: true });
      messageField.setSelectionRange(messageField.value.length, messageField.value.length);
      growMessage();
    }, 400);
  }),
);

/* O campo cresce com o texto e sugere, aos poucos, o que o cliente pode contar. */
function growMessage() {
  messageField.style.height = "auto";
  messageField.style.height = `${Math.min(messageField.scrollHeight, 520)}px`;
}
messageField.addEventListener("input", growMessage);
const IDEAS = [
  "Tenho uma clínica e quero que meus pacientes me encontrem e agendem pelo celular…",
  "Preciso de um sistema para controlar as vendas e o estoque da minha loja…",
  "Quero um site que mostre meu trabalho do jeito que eu imagino…",
  "Vou lançar um produto e preciso de uma página que convença quem chegar…",
];
if (!reducedMotion.matches) {
  let idea = 0;
  setInterval(() => {
    if (document.activeElement === messageField || messageField.value) return;
    messageField.placeholder = IDEAS[idea++ % IDEAS.length];
  }, 3800);
}

let briefingText = "";
let senderName = "";
const isValidContact = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.replace(/\D/g, "").length >= 10;
briefingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const nameInput = $("#name");
  const contactInput = $("#contact");
  nameInput.setCustomValidity(nameInput.value.trim().length < 2 ? "Informe um nome com pelo menos 2 caracteres." : "");
  contactInput.setCustomValidity(isValidContact(contactInput.value.trim()) ? "" : "Informe um e-mail válido ou um WhatsApp com DDD.");
  if (!briefingForm.reportValidity()) return;
  const data = new FormData(briefingForm);
  const contact = String(data.get("contact")).trim();
  senderName = String(data.get("name")).trim();
  briefingText = [
    "TRIBYTE — BRIEFING DE PROJETO",
    "",
    `Nome: ${senderName}`,
    `${contact.includes("@") ? "E-mail" : "WhatsApp"}: ${contact}`,
    ...(data.get("service") ? [`Projeto: ${data.get("service")}`] : []),
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
["name", "contact"].forEach((id) =>
  $(`#${id}`).addEventListener("input", (event) => event.target.setCustomValidity("")),
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
const hero = $("#inicio");
const scrollTitles = $$("[data-scroll-title]");
const scrollVisuals = $$(".project-card, .team-card").map((card) => ({
  card,
  visual: $(".project-visual, .team-art", card),
}));
const processSteps = $$(".process-steps li");
const clampProgress = (value) => Math.max(0, Math.min(1, value));

/* Narrativa editorial TRIBYTE.
   Uma só leitura por frame: sem bibliotecas adicionais e sem scroll hijacking. */
const chapterAnchors = $(".chapter-rail a[data-chapter]");
const chapterTargets = chapterAnchors.map((anchor) => ({
  anchor,
  section: document.getElementById(anchor.dataset.chapter),
})).filter(({section}) => section);
const statement = $("#manifesto");
const statementLines = $("[data-story-line]");
const statementSeal = $(".manifesto-seal");
const serviceChapters = $(".service-item");
const contactChapter = $(".contact-copy");
const footerChapter = $(".site-footer");
const processChapterHeading = $(".process-heading h2 em");
let activeChapter = "";

function updateStoryMotion(viewportHeight) {
  let chosen = chapterTargets[0];
  for (const entry of chapterTargets) {
    if (entry.section.getBoundingClientRect().top <= viewportHeight * .43)
      chosen = entry;
  }
  if (chosen && chosen.anchor.dataset.chapter !== activeChapter) {
    activeChapter = chosen.anchor.dataset.chapter;
    chapterTargets.forEach(({anchor}) => {
      const current = anchor === chosen.anchor;
      anchor.classList.toggle("is-current", current);
      if (current) anchor.setAttribute("aria-current", "location");
      else anchor.removeAttribute("aria-current");
    });
  }
  if (reducedMotion.matches) return;

  if (statement) {
    const rect = statement.getBoundingClientRect();
    if (rect.bottom > -viewportHeight * .3 && rect.top < viewportHeight * 1.4) {
      const local = clampProgress((viewportHeight - rect.top) / (viewportHeight + rect.height));
      statementLines.forEach((line, index) => {
        const reveal = clampProgress((local - .09 - index * .065) * 3.8);
        const direction = index % 2 ? 1 : -1;
        line.style.setProperty("--line-y", Math.round((1 - reveal) * 48) + "px");
        line.style.setProperty("--line-x", Math.round(direction * (1 - reveal) * 38) + "px");
        line.style.setProperty("--line-opacity", (.26 + reveal * .74).toFixed(3));
      });
      if (statementSeal) statementSeal.style.setProperty("--seal-spin", Math.round(-14 + 105 * local) + "deg");
    }
  }

  serviceChapters.forEach((item) => {
    const rect = item.getBoundingClientRect();
    if (rect.bottom < -50 || rect.top > viewportHeight + 100) return;
    const local = clampProgress((viewportHeight * .84 - rect.top) / (viewportHeight * .72));
    item.style.setProperty("--service-progress", local.toFixed(3));
  });

  processSteps.forEach((step) => {
    const rect = step.getBoundingClientRect();
    if (rect.bottom < -50 || rect.top > viewportHeight + 100) return;
    const local = clampProgress((viewportHeight * .73 - rect.top) / (viewportHeight * .65));
    step.style.setProperty("--step-progress", local.toFixed(3));
  });

  if (processChapterHeading) {
    const rect = processChapterHeading.getBoundingClientRect();
    if (rect.top < viewportHeight && rect.bottom > 0) {
      const local = clampProgress((viewportHeight * .8 - rect.top) / (viewportHeight * .62));
      processChapterHeading.style.setProperty("--process-title-y", Math.round((1 - local) * 17) + "px");
    }
  }

  if (contactChapter) {
    const rect = contactChapter.getBoundingClientRect();
    if (rect.bottom > -100 && rect.top < viewportHeight + 100) {
      const local = clampProgress((viewportHeight * .9 - rect.top) / viewportHeight);
      contactChapter.style.setProperty("--contact-rotation", Math.round(-38 + 120 * local) + "deg");
      contactChapter.style.setProperty("--contact-title-y", Math.round((1 - local) * 38) + "px");
    }
  }

  if (footerChapter) {
    const rect = footerChapter.getBoundingClientRect();
    if (rect.top < viewportHeight + 100 && rect.bottom > -100) {
      const local = clampProgress((viewportHeight - rect.top) / viewportHeight);
      footerChapter.style.setProperty("--footer-rise", Math.round((1 - local) * 55) + "px");
      footerChapter.style.setProperty("--footer-opacity", (.35 + .65 * local).toFixed(3));
    }
  }
}
let scrollQueued = false;
function updateScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;

  if (!reducedMotion.matches) {
    const viewportHeight = window.innerHeight;
    const heroProgress = clampProgress(window.scrollY / (hero.offsetHeight * 0.85));
    hero.style.setProperty("--hero-copy-shift", `${Math.round(heroProgress * -105)}px`);
    hero.style.setProperty("--hero-copy-opacity", (1 - heroProgress * 0.68).toFixed(3));
    hero.style.setProperty("--hero-art-shift", `${Math.round(heroProgress * 130)}px`);
    hero.style.setProperty("--hero-art-turn", `${Math.round(heroProgress * -28)}deg`);
    hero.style.setProperty("--hero-art-spin", `${Math.round(heroProgress * 13)}deg`);
    hero.style.setProperty("--hero-art-scale", (1 - heroProgress * 0.24).toFixed(3));

    scrollTitles.forEach((title) => {
      const top = title.parentElement.getBoundingClientRect().top;
      const reveal = clampProgress((viewportHeight * 0.95 - top) / (viewportHeight * 0.5));
      title.style.setProperty("--title-shift", `${Math.round((1 - reveal) * 54)}px`);
      title.style.setProperty("--title-opacity", (0.35 + reveal * 0.65).toFixed(3));
    });

    scrollVisuals.forEach(({ card, visual }) => {
      if (card.hidden) return;
      const top = card.getBoundingClientRect().top;
      const reveal = clampProgress((viewportHeight * 0.94 - top) / (viewportHeight * 0.7));
      visual.style.setProperty("--scroll-clip", `${Math.round((1 - reveal) * 34)}%`);
      visual.style.setProperty("--scroll-shift", `${Math.round((1 - reveal) * 28)}px`);
      visual.style.setProperty("--scroll-scale", (1.045 - reveal * 0.045).toFixed(3));
      visual.style.setProperty("--visual-line", (.2 + reveal * .8).toFixed(3));
    });

    const nextStep = processSteps.findIndex((step) =>
      step.getBoundingClientRect().bottom > viewportHeight * 0.52,
    );
    const activeStep = nextStep < 0 ? processSteps.length - 1 : nextStep;
    processSteps.forEach((step, index) =>
      step.classList.toggle("is-current", index === activeStep),
    );
  }
  updateStoryMotion(window.innerHeight);
  scrollQueued = false;
}
document.documentElement.classList.toggle("scroll-motion", !reducedMotion.matches);
reducedMotion.addEventListener("change", () => {
  document.documentElement.classList.toggle("scroll-motion", !reducedMotion.matches);
  updateScroll();
});
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

/* Ponteiro: uma atualização por frame, compartilhada por cursor, hero e cartões. */
function onPointerFrame(el, update, reset) {
  let queued = false, last;
  el.addEventListener("pointermove", (event) => {
    last = event;
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { update(last); queued = false; });
  }, { passive: true });
  if (reset) el.addEventListener("pointerleave", reset);
}
const finePointer = window.matchMedia("(hover:hover) and (pointer:fine)").matches && !reducedMotion.matches;
const relPos = (el, event) => {
  const box = el.getBoundingClientRect();
  return [(event.clientX - box.left) / box.width - 0.5, (event.clientY - box.top) / box.height - 0.5];
};

/* Cursor complementar: mantém o cursor nativo e não roda em telas de toque. */
if (finePointer) {
  const halo = $(".cursor-halo");
  onPointerFrame(document, (event) => {
    halo.style.left = `${event.clientX}px`;
    halo.style.top = `${event.clientY}px`;
    halo.style.opacity = "1";
  });
  document.addEventListener("pointerover", (event) =>
    halo.classList.toggle("is-hovering", Boolean(event.target.closest("a,button,summary,label"))));
  document.addEventListener("pointerout", (event) => { if (!event.relatedTarget) halo.style.opacity = "0"; });
  document.addEventListener("visibilitychange", () => { if (document.hidden) halo.style.opacity = "0"; });
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
if (finePointer) {
  const heroArt = $(".tb-hero-art");
  const stage = $(".tb-hero-stage");
  onPointerFrame(heroArt, (event) => {
    const [x, y] = relPos(heroArt, event);
    stage.style.setProperty("--tilt-x", (-y * 8).toFixed(2) + "deg");
    stage.style.setProperty("--tilt-y", (x * 8).toFixed(2) + "deg");
  }, () => { stage.style.removeProperty("--tilt-x"); stage.style.removeProperty("--tilt-y"); });
  $$(".project-card, .team-card").forEach((card) =>
    onPointerFrame(card, (event) => {
      const [x, y] = relPos(card, event);
      card.style.setProperty("--card-x", (-y * 3).toFixed(2) + "deg");
      card.style.setProperty("--card-y", (x * 3).toFixed(2) + "deg");
      card.style.setProperty("--shine-x", (x + 0.5) * 100 + "%");
      card.style.setProperty("--shine-y", (y + 0.5) * 100 + "%");
      card.style.setProperty("--shine-opacity", "1");
    }, () => {
      card.style.removeProperty("--card-x");
      card.style.removeProperty("--card-y");
      card.style.setProperty("--shine-opacity", "0");
    }));
}

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
