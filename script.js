"use strict";

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
