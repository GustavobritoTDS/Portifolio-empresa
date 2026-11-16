"use strict";

/*
 * TRIBYTE — aplicação da página, carregada com defer após o HTML.
 * Mapa de manutenção: procurar pelos títulos numerados abaixo.
 *
 * 01 Abertura TRI + BYTE: montagem, saída e entrada do hero.
 * 02 Interface: CONTACT e PROJECTS, tema, menu, filtros, diálogos,
 *    perfis, briefing local, relógio e monograma interativo.
 * 03 Efeitos de texto e iluminação dos cartões.
 * 04 Serviços, rolagem e seleção dos perfis.
 * 05 Referências ilustrativas a produtos externos.
 *
 * Cada seção tem escopo próprio para evitar colisões de nomes.
 * A ordem preserva o carregamento anterior dos cinco scripts.
 * site-init.js continua separado: aplica o tema antes da primeira pintura
 * e ativa a abertura. GSAP permanece local e é carregado sob demanda.
 */


// Um erro síncrono em uma seção é reportado sem interromper as seguintes,
// como acontecia quando cada componente era carregado em um script separado.
function runSection(initialize) {
  try {
    initialize();
  } catch (error) {
    if (typeof window.reportError === "function") window.reportError(error);
    else console.error("[TRIBYTE] Falha em " + initialize.name, error);
  }
}

/* 01 — Abertura TRI + BYTE */
/* Abertura TRIBYTE: o wordmark oficial se monta com TRI + BYTE. */
runSection(function initOpening() {
  const hasGsap = () => typeof window.gsap !== "undefined";

  function loadGsap() {
    return new Promise((resolve) => {
      if (hasGsap()) return resolve();
      const script = document.createElement("script");
      script.src = "assets/gsap-3.12.5.min.js";
      script.onload = resolve;
      script.onerror = resolve;
      document.head.append(script);
    });
  }

  function loadIntroStyles() {
    return new Promise((resolve) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "assets/intro-opening.css";
      link.onload = () => resolve(true);
      link.onerror = () => resolve(false);
      document.head.append(link);
    });
  }

  function mount(root, options = {}) {
    const onDone = typeof options.onDone === "function" ? options.onDone : () => {};
    let finished = false;
    let leaving = false;
    let leaveTimer = 0;

    root.replaceChildren();
    root.classList.add("tb-intro");
    root.classList.remove("is-assembling", "is-impact", "is-leaving");
    root.hidden = false;
    root.removeAttribute("aria-hidden");
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-label", "Abertura da marca TRIBYTE");

    const make = (tag, className, parent = root) => {
      const element = document.createElement(tag);
      if (className) element.className = className;
      parent.append(element);
      return element;
    };

    make("div", "tb-intro__background");
    const frame = make("div", "tb-intro__frame");
    for (let i = 0; i < 4; i += 1) make("span", `tb-intro__corner corner-${i + 1}`, frame);

    const meta = make("div", "tb-intro__meta");
    const metaName = make("span", "tb-intro__meta-name", meta);
    metaName.textContent = "TRIBYTE / DESENVOLVIMENTO WEB";
    const metaPlace = make("span", "tb-intro__meta-place", meta);
    metaPlace.textContent = "GOIÁS · BRASIL";

    const composition = make("div", "tb-intro__composition");
    const wordmark = make("div", "tb-intro__wordmark", composition);
    wordmark.setAttribute("aria-hidden", "true");

    const addPiece = (name, src) => {
      const piece = make("span", `tb-intro__piece ${name}`, wordmark);
      const image = make("img", "", piece);
      image.src = src;
      image.alt = "";
      image.draggable = false;
      const echo = make("img", "tb-intro__ghost", piece);
      echo.src = src;
      echo.alt = "";
      echo.draggable = false;
      return piece;
    };
    addPiece("piece-tri", "assets/logo-tribyte-wordmark-light.svg");
    const bytePiece = addPiece("piece-byte", "assets/logo-tribyte-wordmark-red.svg");

    const track = make("div", "tb-intro__track", composition);
    make("span", "tb-intro__track-side track-left", track);
    make("span", "tb-intro__track-side track-right", track);
    for (const side of ["left", "right"]) {
      for (let i = 1; i <= 8; i += 1) {
        const tone = i % 3 === 0 ? " particle-light" : "";
        const particle = make("i", `tb-intro__particle ${side} particle-${i}${tone}`, track);
        particle.setAttribute("aria-hidden", "true");
      }
    }
    const pulse = make("span", "tb-intro__pulse", track);
    pulse.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 4; i += 1) make("i", "", pulse);

    const caption = make("p", "tb-intro__caption", composition);
    caption.textContent = "SITES · SISTEMAS · LANDING PAGES";
    const captionRule = make("span", "tb-intro__caption-rule", composition);
    captionRule.setAttribute("aria-hidden", "true");

    const skip = make("button", "tb-intro__skip");
    skip.type = "button";
    skip.textContent = "Pular abertura";

    const finish = () => {
      if (finished) return;
      const restoreFocus = root.contains(document.activeElement);
      finished = true;
      window.clearTimeout(leaveTimer);
      root.hidden = true;
      root.setAttribute("aria-hidden", "true");
      root.removeAttribute("aria-modal");
      onDone();
      if (restoreFocus) document.querySelector(".wordmark")?.focus({ preventScroll: true });
    };

    const leave = () => {
      if (finished || leaving) return;
      leaving = true;
      root.classList.add("is-leaving");
      leaveTimer = window.setTimeout(finish, 420);
    };

    bytePiece.addEventListener("animationend", (event) => {
      if (event.animationName === "tb-intro-connect-byte" && !leaving) {
        root.classList.add("is-impact");
      }
    });
    skip.addEventListener("click", leave, { once: true });
    root.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        leave();
      } else if (event.key === "Tab") {
        event.preventDefault();
        skip.focus({ preventScroll: true });
      }
    });
    skip.focus({ preventScroll: true });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.add("is-assembling");
        leaveTimer = window.setTimeout(leave, 2550);
      });
    });

    return { skip: leave, destroy: finish };
  }

  function heroEntrance() {
    if (!hasGsap() || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const gsap = window.gsap;
    gsap.from(".hero h1 > span", {
      yPercent: 70,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "expo.out",
      clearProps: "all",
    });
    gsap.from([".hero-intro", ".hero-bottom"], {
      y: 24,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      delay: 0.35,
      ease: "power3.out",
      clearProps: "all",
    });
    gsap.from(".tb-hero-art", {
      scale: 0.88,
      opacity: 0,
      duration: 1.2,
      delay: 0.2,
      ease: "expo.out",
      clearProps: "opacity,scale",
    });
    gsap.from(".site-header", {
      y: -30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      clearProps: "all",
    });
  }

  window.TribyteIntro = { mount, heroEntrance };

  const root = document.getElementById("brand-intro");
  if (root && document.documentElement.classList.contains("tb-intro-on")) {
    Promise.all([loadGsap(), loadIntroStyles()]).then(([, stylesLoaded]) => {
      if (!stylesLoaded) {
        document.documentElement.classList.remove("tb-intro-on");
        root.hidden = true;
        return;
      }
      mount(root, {
        onDone() {
          document.documentElement.classList.remove("tb-intro-on");
          heroEntrance();
        },
      });
    });
  } else if (root) {
    root.hidden = true;
  }
});


/* 02 — Interface: dados, tema, menu, projetos, perfis, briefing e marca */
runSection(function initInterface() {
/* O formulário prepara uma mensagem editável para o WhatsApp.
   O visitante revisa e confirma o envio no próprio aplicativo. */
const CONTACT = Object.freeze({ whatsapp: "5562992106861", email: "" });

/* Conteúdo centralizado para facilitar a manutenção dos estudos de caso. */
const PROJECTS = Object.freeze({
  smart: {
    index: "01",
    title: "SENAI Smart Class",
    liveUrl: "https://senai-smart-class-one.vercel.app/",
    art: "SMART\nCLASS",
    image: "assets/smart-class-sensores-hq.webp",
    category: "PROJETO ACADÊMICO / EDUCAÇÃO",
    description:
      "Projeto acadêmico desenvolvido em equipe no SENAI. O painel reúne leituras de temperatura, umidade, luminosidade e ocupação; com o Arduino UNO R4 WiFi conectado, também permite acionar controles da sala.",
    type: "Projeto acadêmico em equipe",
    focus: "Monitoramento e automação de sala",
    color: "#c8c2d9",
    ink: "#302446",
    features: [
      "Leituras de temperatura, umidade, luminosidade e ocupação.",
      "Controles de iluminação, ventilador e servo motor pelo Arduino.",
      "HTML, CSS, JavaScript, Supabase e Arduino UNO R4 WiFi.",
    ],
    note: "As imagens mostram telas reais do painel. Sem o Arduino conectado, as leituras são simuladas; não são resultados medidos em uma sala em operação.",
  },
  gestao: {
    index: "02",
    title: "Painel comercial (conceito)",
    art: "PAINEL\nCOMERCIAL",
    category: "CONCEITO DE INTERFACE",
    description:
      "Exercício visual de um painel para acompanhamento de vendas e metas. O cartão não representa cliente, empresa ou sistema comercial em produção.",
    type: "Conceito de interface",
    focus: "Visualização comercial",
    color: "#b6c4b1",
    ink: "#203927",
    features: [
      "Composição demonstrativa feita para este portfólio.",
      "Os valores da ilustração são fictícios.",
      "Não há cliente ou resultado comercial associado.",
    ],
    note: "O painel é um conceito. Não é uma captura de um sistema real.",
  },
  vio: {
    index: "03",
    title: "Vio Finanças",
    art: "VIO\nFINANÇAS",
    category: "PROJETO INDIVIDUAL / EM DESENVOLVIMENTO",
    description:
      "Projeto pessoal de Márcio Andrey para organização financeira. Ainda não há uma demonstração pública para apresentar.",
    type: "Em desenvolvimento",
    focus: "Organização financeira pessoal",
    color: "#d9e3d7",
    ink: "#203927",
    features: [
      "Iniciativa individual de Márcio Andrey.",
      "O portfólio não apresenta telas ou funções como concluídas.",
    ],
    note: "A descrição será ampliada quando houver uma versão demonstrável.",
  },
  tribyte: {
    index: "04",
    title: "Portfólio TRIBYTE",
    art: "TRI\nBYTE",
    category: "SITE E IDENTIDADE DA EQUIPE",
    description:
      "Site da equipe, feito em HTML, CSS e JavaScript. A experiência reúne a identidade da TRIBYTE, os projetos e o contato pelo WhatsApp.",
    type: "Projeto da equipe",
    focus: "Site e identidade digital",
    color: "#ff3547",
    ink: "#1b090c",
    features: [
      "Layout adaptado a computador e celular.",
      "Galeria com projetos identificados por status.",
      "Temas claro e escuro e abertura animada da marca.",
    ],
    note: "Este é o portfólio publicado da própria equipe TRIBYTE.",
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
    const href = link.getAttribute("href");
    if (!href?.startsWith("#")) return;
    const target = $(href);
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
$$("[data-project]").forEach((link) =>
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const project = PROJECTS[link.dataset.project];
    if (!project) return;
    $("#project-dialog-title").textContent = project.title;
    $("#project-dialog-category").textContent = project.category;
    $("#project-dialog-description").textContent = project.description;
    $("#project-dialog-note").textContent = project.note;
    $("#smart-modal-gallery").hidden = link.dataset.project !== "smart";
    $("#project-dialog-side-gallery").hidden = link.dataset.project !== "smart";
    const liveLink = $("#project-dialog-live");
    liveLink.hidden = !project.liveUrl;
    if (project.liveUrl) liveLink.href = project.liveUrl;
    else liveLink.removeAttribute("href");
    const artBox = $(".dialog-project-art");
    const artImg = $("#project-dialog-art-img");
    artBox.classList.toggle("has-side-gallery", link.dataset.project === "smart");
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

/* Progresso da página: um único trabalho por frame. */
const progress = $(".scroll-progress");
let scrollQueued = false;
function updateScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
  scrollQueued = false;
}
window.addEventListener("scroll", () => {
  if (scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(updateScroll);
}, { passive: true });
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
});


/* 03 — Efeitos de texto e iluminação dos cartões */
/*
 * TRIBYTE x React Bits — adaptações originais para a stack existente.
 * Referências de comportamento: Split Text, Scroll Reveal, Spotlight Card,
 * Magnet, Scroll Velocity e Click Spark (https://reactbits.dev/).
 * React Bits fornece componentes React; este arquivo não os instala nem usa React.
 * Não bloqueia a rolagem, não intercepta links, não altera formulários.
 */
runSection(function initTextEffects() {
  const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const $all = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  function init() {
    // Split Text: mantém os elementos inline originais (outline, ênfases e quebras).
    const headings = $all("[data-rb-split]");
    const observer = "IntersectionObserver" in window && !motionMedia.matches
      ? new IntersectionObserver((entries, self) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("rb-revealed");
            self.unobserve(entry.target);
          }
        }, { rootMargin: "0px 0px -6% 0px", threshold: 0.07 })
      : null;

    headings.forEach((heading) => {
      if (heading.dataset.rbInit === "true") return;
      heading.dataset.rbInit = "true";

      if (motionMedia.matches || !observer) return;

      // Lê o título antes de modificar o DOM para conservar o nome acessível.
      const accessibleName = (heading.innerText || heading.textContent || "")
        .replace(/\s+/g, " ").trim();
      if (accessibleName) heading.setAttribute("aria-label", accessibleName);

      const walker = document.createTreeWalker(
        heading,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode(node) {
            if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
            if (node.parentElement?.closest("[aria-hidden='true'],.sr-only")) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );
      const textNodes = [];
      while (walker.nextNode()) textNodes.push(walker.currentNode);

      let wordIndex = 0;
      for (const node of textNodes) {
        const fragment = document.createDocumentFragment();
        const parts = node.nodeValue.split(/(\s+)/);
        for (const token of parts) {
          if (!token) continue;
          if (/^\s+$/.test(token)) {
            fragment.append(document.createTextNode(token));
            continue;
          }
          const word = document.createElement("span");
          word.className = "rb-word";
          word.setAttribute("aria-hidden", "true");
          word.style.setProperty("--rb-i", Math.min(wordIndex, 16));
          word.textContent = token;
          fragment.append(word);
          wordIndex += 1;
        }
        node.parentNode.replaceChild(fragment, node);
      }
      if (!wordIndex) return;
      heading.classList.add("rb-split-ready");
      observer.observe(heading);
    });

    // Spotlight Card: um foco leve acompanha o cursor nos próprios projetos.
    if (finePointer.matches && !motionMedia.matches) {
      $all(".project-visual, .team-card").forEach((host) => {
        if (host.classList.contains("rb-spotlight-host")) return;
        const glow = document.createElement("span");
        glow.className = "rb-spotlight-layer";
        glow.setAttribute("aria-hidden", "true");
        host.classList.add("rb-spotlight-host");
        host.append(glow);

        let latestEvent = null;
        let queued = false;
        host.addEventListener("pointermove", (event) => {
          latestEvent = event;
          if (queued) return;
          queued = true;
          requestAnimationFrame(() => {
            queued = false;
            if (!latestEvent || motionMedia.matches) return;
            const rect = host.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            const x = Math.min(100, Math.max(0, (latestEvent.clientX - rect.left) / rect.width * 100));
            const y = Math.min(100, Math.max(0, (latestEvent.clientY - rect.top) / rect.height * 100));
            host.style.setProperty("--rb-mouse-x", x.toFixed(1) + "%");
            host.style.setProperty("--rb-mouse-y", y.toFixed(1) + "%");
          });
        }, { passive: true });
      });
    }

    motionMedia.addEventListener("change", (event) => {
      if (!event.matches) return;
      headings.forEach((heading) => heading.classList.add("rb-revealed"));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
});


/* 04 — Seletor de serviços, rolagem e interação dos perfis */
/* TRIBYTE — Reinvention Experience
 * Patterns translated into vanilla JS from React Bits concepts:
 * Scroll Stack, Magic Bento, Text Pressure, Aurora and Animated Content.
 * Progressive enhancement: semantic controls work without JS.
 */
runSection(function initServicesAndCards() {
 const reduced = matchMedia("(prefers-reduced-motion: reduce)");
 const desktop = matchMedia("(min-width: 801px)");
 const fine = matchMedia("(hover:hover) and (pointer:fine)");
 const qs = (sel, root = document) => root.querySelector(sel);
 const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];
 const clamp = (n,min=0,max=1) => Math.max(min,Math.min(max,n));
 const lab=qs(".rx-lab");
 const modes=Object.freeze({
  sites: {
   eyebrow:"SITES",
   headline:"Uma página para mostrar o que você faz.",
   body:"Site institucional, portfólio ou página de apresentação, com informações e contato fáceis de encontrar.",
   image:"assets/service-sites.webp",
   cta:"Site institucional",
   label:"EXPERIÊNCIA WEB"
  },
  sistemas:{
   eyebrow:"SISTEMAS",
   headline:"Um painel para acompanhar sua rotina.",
   body:"Painéis, cadastros e áreas de gestão para reunir informações usadas pela sua equipe.",
   image:"assets/service-systems.webp",
   cta:"Sistema web",
   label:"INTERFACE & LÓGICA"
  },
  landing:{
   eyebrow:"LANDING PAGES",
   headline:"Uma página para uma oferta.",
   body:"Página focada em um produto, serviço ou campanha, com as informações principais e um próximo passo visível.",
   image:"assets/service-landing.webp",
   cta:"Landing page",
   label:"COMUNICAÇÃO DIGITAL"
  }
 });
 if(lab) {
  const options=qsa("[data-lab-mode]",lab);
  const title=qs("#rx-lab-title",lab);
  const desc=qs("#rx-lab-desc",lab);
  const eyebrow=qs("#rx-lab-eyebrow",lab);
  const art=qs("#rx-lab-image",lab);
  const tag=qs("#rx-lab-tag",lab);
  const cta=qs("#rx-lab-cta",lab);
  const setMode=(id,focus=false)=>{
    const item=modes[id];
    if(!item)return;
    lab.dataset.active=id;
    if(title)title.innerHTML=item.headline;
    if(desc)desc.textContent=item.body;
    if(eyebrow)eyebrow.textContent=item.eyebrow;
    if(art&&art.getAttribute("src")!==item.image)art.setAttribute("src",item.image);
    if(tag)tag.textContent=item.label;
    if(cta)cta.dataset.service=item.cta;
    options.forEach(button=>{
      const selected=button.dataset.labMode===id;
      button.classList.toggle("is-current",selected);
      button.setAttribute("aria-pressed",String(selected));
      if(focus&&selected)button.focus();
    });
  };
  options.forEach((button,i)=>{
    button.addEventListener("click",()=>setMode(button.dataset.labMode));
    button.addEventListener("keydown",(ev)=>{
      if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(ev.key))return;
      ev.preventDefault();
      const delta=ev.key==="ArrowRight"||ev.key==="ArrowDown"?1:-1;
      const target=options[(i+delta+options.length)%options.length];
      setMode(target.dataset.labMode,true);
    });
  });
  setMode("sites");

  if(fine.matches&&!reduced.matches){
    let scheduled=false,px=0,py=0;
    lab.addEventListener("pointermove",ev=>{
      const canvas=qs(".rx-lab-canvas",lab);
      if(!canvas)return;
      const r=canvas.getBoundingClientRect();
      if(ev.clientX<r.left||ev.clientX>r.right||ev.clientY<r.top||ev.clientY>r.bottom)return;
      px=(ev.clientX-r.left)/Math.max(1,r.width)-.5;
      py=(ev.clientY-r.top)/Math.max(1,r.height)-.5;
      if(scheduled)return;
      scheduled=true;
      requestAnimationFrame(()=>{
        scheduled=false;
        lab.style.setProperty("--rx-art-x",(px*18).toFixed(1)+"px");
        lab.style.setProperty("--rx-art-y",(py*18).toFixed(1)+"px");
      });
    },{passive:true});
    lab.addEventListener("pointerleave",()=>{
      lab.style.setProperty("--rx-art-x","0px");
      lab.style.setProperty("--rx-art-y","0px");
    });
  }
 }

 const cards=qsa(".project-card");
 const steps=qsa(".process-steps li");
 let frame=false;
 function paintScroll(){
   frame=false;
   if(reduced.matches)return;
   if(desktop.matches){
     const visibles=cards.filter(card=>!card.hidden);
     visibles.forEach((card,index)=>{
       const next=visibles[index+1];
       if(!next){card.style.setProperty("--rx-deck-scale","1");return;}
       const y=next.getBoundingClientRect().top;
       const p=clamp((innerHeight*.91-y)/(innerHeight*.62));
       card.style.setProperty("--rx-deck-scale",(1-.055*p).toFixed(3));
       card.style.setProperty("--rx-deck-shadow",(p*.45).toFixed(3));
     });
   }else{
     cards.forEach(card=>card.style.removeProperty("--rx-deck-scale"));
   }
   steps.forEach(step=>{
     const rect=step.getBoundingClientRect();
     if(rect.top>innerHeight+100||rect.bottom< -100)return;
     const p=clamp((innerHeight*.80-rect.top)/(innerHeight*.69));
     step.style.setProperty("--rx-step-progress",Math.round(p*100)+"%");
   });
 }
 function schedule(){
   if(frame)return;
   frame=true;
   requestAnimationFrame(paintScroll);
 }
 addEventListener("scroll",schedule,{passive:true});
 addEventListener("resize",schedule,{passive:true});
 document.addEventListener("click",ev=>{
   if(ev.target.closest("[data-filter]"))requestAnimationFrame(schedule);
 });
 reduced.addEventListener("change",schedule);
 desktop.addEventListener("change",schedule);
 schedule();

 /* Open one large service panel at a time, keep native details accessibility. */
 const servicePanels=qsa(".service-item");
 servicePanels.forEach(panel=>{
  panel.addEventListener("toggle",()=>{
   if(!panel.open)return;
   servicePanels.forEach(other=>{
     if(other!==panel&&other.open)other.open=false;
   });
  });
 });

 /* TEAM PROFILE CARDS V3: entire photo/card opens the existing profile
    modal; buttons and external GitHub links retain their own click behavior.
    Keyboard activation is explicit and does not nest interactive elements. */
 const teamCards=qsa(".studio .team-card");
 const profileDialog=qs("#profile-dialog");
 const selectTeamCard=(card)=>{
   teamCards.forEach(item=>item.classList.toggle("is-selected",item===card));
 };
 teamCards.forEach((card)=>{
   const name=(qs(".team-info h3",card)?.innerText || qs(".team-info h3",card)?.textContent || "")
     .replace(/\s+/g," ").trim();
   const profileButton=qs(".profile-open",card);
   if(!profileButton)return;
   card.tabIndex=0;
   card.setAttribute("aria-label","Ver o perfil de "+name+". Pressione Enter para abrir.");
   // Keep article semantics and nested real links/buttons.
   card.addEventListener("click",(event)=>{
     if(event.target.closest("a,button,input,summary,[role='button']"))return;
     selectTeamCard(card);
     profileButton.click();
   });
   card.addEventListener("keydown",(event)=>{
     if(event.target!==card || !["Enter"," "].includes(event.key))return;
     event.preventDefault();
     selectTeamCard(card);
     profileButton.click();
   });
   profileButton.addEventListener("click",()=>selectTeamCard(card));
 });
 if(profileDialog) {
   profileDialog.addEventListener("close",()=>{
     teamCards.forEach(card=>card.classList.remove("is-selected"));
   });
 }

});


/* 05 — Referências ilustrativas: Metabase e Grafana */
/* Referências externas: as telas são ilustrações locais, com dados fictícios. */
runSection(function initReferences() {
  const create = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  const projects = document.querySelector("#projetos");
  if (!projects) return;

  const section = create("section", "system-references");
  section.id = "referencias-de-sistemas";
  section.setAttribute("aria-labelledby", "references-title");
  section.innerHTML = `
    <header class="refs-header">
      <div>
        <h2 id="references-title">Ferramentas que usamos como referência.</h2>
      </div>
    </header>
    <div class="refs-grid"></div>
    <p class="refs-note">Consulte as páginas oficiais para ver os produtos originais.</p>`;

  const examples = [
    {
      name: "Metabase",
      kind: "Análise de dados",
      description: "Referência de dashboard comercial. Esta miniatura é ilustrativa e não mostra dados de uma empresa.",
      source: "https://www.metabase.com/product/pro",
      demo: `<div class="ref-demo-toolbar"><b>METABASE</b><span>PAINEL DE VENDAS</span><i>DADOS DE EXEMPLO</i></div>
        <div class="ref-demo-kpis"><div><small>Receita</small><strong>R$ 42,8 mil</strong><em>Exemplo</em></div><div><small>Pedidos</small><strong>1.284</strong><em>Exemplo</em></div><div><small>Conversão</small><strong>4,8%</strong><em>Exemplo</em></div></div>
        <div class="ref-demo-charts"><div><small>RECEITA POR MÊS</small><div class="ref-demo-bars"><i class="bar-40"></i><i class="bar-57"></i><i class="bar-49"></i><i class="bar-78"></i><i class="bar-67"></i><i class="bar-92"></i><i class="bar-82"></i></div></div><div><small>VENDAS POR CANAL</small><div class="ref-demo-donut"></div><small>Loja · Web · Outros</small></div></div>`,
    },
    {
      name: "Grafana",
      kind: "Observabilidade",
      description: "Referência de monitoramento técnico. A composição não é uma captura oficial e não representa serviços acompanhados pela TRIBYTE.",
      source: "https://grafana.com/",
      demo: `<div class="ref-demo-toolbar"><b>GRAFANA</b><span>MONITORAMENTO</span><i>DADOS DE EXEMPLO</i></div>
        <div class="ref-demo-kpis"><div><small>Disponibilidade</small><strong>99,9%</strong><em>Exemplo</em></div><div><small>CPU</small><strong>29,1%</strong><em>Exemplo</em></div><div><small>Memória</small><strong>46,9%</strong><em>Exemplo</em></div></div>
        <div class="ref-demo-charts"><div><small>USO DE RECURSOS</small><div class="ref-demo-lines"><svg viewBox="0 0 300 110" preserveAspectRatio="none" aria-hidden="true"><polyline points="0,83 30,77 55,91 82,46 112,63 140,38 167,56 193,21 224,44 256,17 300,36" fill="none" stroke="#68d58a" stroke-width="3"/><polyline points="0,98 32,94 66,78 91,88 124,69 149,77 181,59 204,67 243,49 267,56 300,40" fill="none" stroke="#6ca9f7" stroke-width="3"/></svg></div></div><div><small>ALERTAS</small><div class="ref-demo-alert">Exemplo de alerta</div><div class="ref-demo-alert">Exemplo de alerta</div></div></div>`,
    },
  ];

  const grid = section.querySelector(".refs-grid");
  examples.forEach((item, index) => {
    const card = create("article", "ref-card");
    const visual = create("div", "ref-visual");
    const demo = create("div", "ref-dashboard-demo");
    demo.setAttribute("aria-label", `Ilustração demonstrativa de ${item.name}; os dados exibidos são fictícios`);
    demo.innerHTML = item.demo;
    visual.append(demo, create("span", "ref-caption", `${String(index + 1).padStart(2, "0")} / REFERÊNCIA EXTERNA`));

    const body = create("div", "ref-body");
    body.append(create("h3", null, `${item.name} — ${item.kind}`), create("p", null, item.description));
    const link = create("a", null, "Ver produto oficial ↗");
    link.href = item.source;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    body.append(link);
    card.append(visual, body);
    grid.append(card);
  });

  projects.insertAdjacentElement("afterend", section);
});
