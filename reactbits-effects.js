"use strict";

/*
 * TRIBYTE x React Bits — adaptações originais para a stack existente.
 * Referências de comportamento: Split Text, Scroll Reveal, Spotlight Card,
 * Magnet, Scroll Velocity e Click Spark (https://reactbits.dev/).
 * React Bits fornece componentes React; este arquivo não os instala nem usa React.
 * Não bloqueia a rolagem, não intercepta links, não altera formulários.
 */
(() => {
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
})();
