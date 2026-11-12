"use strict";
/* Abertura TRIBYTE: o wordmark oficial se monta com TRI + BYTE. */
(function () {
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
    gsap.from([".hero-intro", ".hero .button-primary", ".hero-bottom"], {
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
})();
