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

    // Magnet: não interfere no clique original. Sem movimento para touch/teclado.
    if (finePointer.matches && !motionMedia.matches) {
      const targets = $all(
        ".hero .button-primary, .header-cta, .project-live-link, .service-body > a, " +
        ".contact-form .button-primary, .back-top"
      );
      for (const target of targets) {
        target.classList.add("rb-magnet");
        target.addEventListener("pointermove", (event) => {
          if (motionMedia.matches) return;
          const rect = target.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
          const y = (event.clientY - rect.top - rect.height / 2) / rect.height;
          target.style.setProperty("--rb-tx", (x * 11).toFixed(2) + "px");
          target.style.setProperty("--rb-ty", (y * 9).toFixed(2) + "px");
        }, { passive: true });
        target.addEventListener("pointerleave", () => {
          target.style.setProperty("--rb-tx", "0px");
          target.style.setProperty("--rb-ty", "0px");
        });
      }
    }

    // Click Spark: partículas decorativas que desaparecem após o clique.
    if (!motionMedia.matches && typeof Element.prototype.animate === "function") {
      let sparkLayer = null;
      document.addEventListener("pointerdown", (event) => {
        if (motionMedia.matches || event.button !== 0) return;
        if (!event.target.closest(".button, .header-cta, .project-live-link, .filter-button, .service-body > a")) return;
        if (!sparkLayer) {
          sparkLayer = document.createElement("div");
          sparkLayer.className = "rb-spark-layer";
          sparkLayer.setAttribute("aria-hidden", "true");
          document.body.append(sparkLayer);
        }
        for (let i = 0; i < 9; i++) {
          const angle = (i / 9) * Math.PI * 2;
          const degree = angle * 180 / Math.PI;
          const spark = document.createElement("i");
          spark.className = "rb-spark-particle";
          spark.style.left = event.clientX + "px";
          spark.style.top = event.clientY + "px";
          sparkLayer.append(spark);
          const base = "translate(-50%,-50%) rotate(" + degree + "deg) translateX(";
          const animation = spark.animate(
            [
              { transform: base + "1px) scaleX(.3)", opacity: .85 },
              { transform: base + "26px) scaleX(1)", opacity: 1, offset: .35 },
              { transform: base + "45px) scaleX(.3)", opacity: 0 }
            ],
            { duration: 520, easing: "cubic-bezier(.18,.7,.28,1)", fill: "forwards" }
          );
          animation.finished.then(() => spark.remove(), () => spark.remove());
        }
      }, { passive: true });
    }

    // Scroll Velocity: controla playbackRate da animação CSS já existente.
    const marquee = document.querySelector(".marquee-track");
    if (marquee && !motionMedia.matches && typeof marquee.getAnimations === "function") {
      const animation = marquee.getAnimations().find((item) => item.playState === "running");
      if (animation) {
        let previousY = window.scrollY;
        let previousTime = performance.now();
        let targetRate = 1;
        let currentRate = 1;
        let running = false;
        const animate = () => {
          targetRate += (1 - targetRate) * .085;
          currentRate += (targetRate - currentRate) * .14;
          if (!motionMedia.matches) animation.playbackRate = currentRate;
          if (Math.abs(targetRate - 1) > .025 || Math.abs(currentRate - 1) > .025) {
            requestAnimationFrame(animate);
          } else {
            animation.playbackRate = 1;
            running = false;
          }
        };
        window.addEventListener("scroll", () => {
          if (motionMedia.matches) return;
          const now = performance.now();
          const dy = Math.abs(window.scrollY - previousY);
          const dt = Math.max(12, now - previousTime);
          previousY = window.scrollY;
          previousTime = now;
          const speed = dy / dt;
          targetRate = Math.max(targetRate, Math.min(3.6, 1 + speed * .48));
          if (!running) {
            running = true;
            requestAnimationFrame(animate);
          }
        }, { passive: true });
        document.addEventListener("visibilitychange", () => {
          if (document.hidden) {
            targetRate = 1;
            currentRate = 1;
            animation.playbackRate = 1;
          }
        });
      }
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
