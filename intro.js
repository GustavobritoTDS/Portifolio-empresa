"use strict";
/* TRIBYTE — abertura 3D com tela de carregamento.
   Logo extrudado em camadas CSS 3D (sem WebGL), animado com GSAP quando disponível.
   Sem GSAP, o giro e a saída funcionam por CSS. */
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const PATHS = [
    "M834 201 772 163 761 163 568 250 568 317Z",
    "M730 261 661 291 661 400 728 441Z M749 277 748 475 813 516 814 316Z",
    "M851 210 773 245 869 300 826 324 826 379 896 420 826 457 826 524 966 452 967 392 895 351 936 329 936 261Z",
  ];
  const hasGsap = () => typeof window.gsap !== "undefined";
  const loadGsap = () => new Promise((resolve) => {
    if (hasGsap()) return resolve();
    const script = document.createElement("script");
    script.src = "assets/gsap-3.12.5.min.js";
    script.onload = resolve;
    script.onerror = resolve;
    document.head.append(script);
  });
  const mix = (a, b, t) => Math.round(a + (b - a) * t);

  function buildLayer(index, total, front) {
    const t = index / (total - 1); // 0 = fundo, 1 = frente
    const k = Math.pow(t, 0.9);
    const color = `rgb(${mix(120, 251, k)},${mix(6, 16, k)},${mix(14, 35, k)})`;
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "550 145 440 395");
    svg.setAttribute("class", "tb-layer" + (front ? " is-front" : ""));
    svg.setAttribute("aria-hidden", "true");
    svg.style.setProperty("--c", color);
    PATHS.forEach((d) => {
      const p = document.createElementNS(NS, "path");
      p.setAttribute("d", d);
      svg.append(p);
    });
    return svg;
  }

  function mount(root, options) {
    const o = Object.assign({ layers: 36, depth: 46, speed: 1, minTime: 1600, waitForLoad: true, inline: false, onDone() {} }, options);
    let raf = 0, tl = null, spin = null, finished = false, startTime = 0, destroyed = false;
    root.replaceChildren();
    root.classList.add("tb-intro");
    root.classList.toggle("is-inline", o.inline);
    root.classList.remove("no-gsap", "is-leaving");
    root.hidden = false;
    root.removeAttribute("aria-hidden");
    root.setAttribute("role", o.inline ? "status" : "dialog");
    if (!o.inline) root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-label", "Carregando TRIBYTE");

    const mk = (tag, cls, parent = root) => { const e = document.createElement(tag); if (cls) e.className = cls; parent.append(e); return e; };
    mk("div", "tb-intro-bg");
    const stage = mk("div", "tb-intro-stage");
    const rig = mk("div", "tb-rig", stage);
    mk("div", "tb-floor", stage);
    const layers = [];
    for (let i = 0; i < o.layers; i++) {
      const l = buildLayer(i, o.layers, i === o.layers - 1);
      rig.append(l);
      layers.push(l);
    }
    const zOf = (i) => (i - (o.layers - 1) / 2) * (o.depth / (o.layers - 1));
    layers.forEach((l, i) => { l.style.transform = `translateZ(${zOf(i)}px)`; });
    const top = mk("div", "tb-intro-panel top");
    const bottom = mk("div", "tb-intro-panel bottom");
    const hud = mk("div", "tb-intro-hud");
    const word = mk("div", "tb-intro-word", hud);
    word.setAttribute("aria-hidden", "true");
    "TRIBYTE".split("").forEach((ch) => { const s = document.createElement("span"); s.textContent = ch; word.append(s); });
    const bar = mk("div", "tb-intro-bar", hud);
    const fill = mk("i", "", bar);
    const pct = mk("div", "tb-intro-pct", hud);
    pct.textContent = "0%";
    const skip = mk("button", "tb-intro-skip");
    skip.type = "button";
    skip.textContent = "Pular abertura";

    let loaded = !o.waitForLoad || document.readyState === "complete";
    if (!loaded) window.addEventListener("load", () => { loaded = true; }, { once: true });

    const G = hasGsap();
    if (G) {
      const g = window.gsap;
      g.set(rig, { rotationX: -10, rotationY: -90, scale: 0.55, opacity: 0 });
      g.set(word.children, { yPercent: 120, opacity: 0 });
      g.set([bar, pct], { opacity: 0 });
      layers.forEach((l, i) => g.set(l, { z: zOf(i) + g.utils.random(-260, 260), opacity: 0 }));
      tl = g.timeline({ defaults: { ease: "power3.out" } })
        .to(rig, { opacity: 1, scale: 1, duration: 1.1 / o.speed })
        .to(layers, { z: (i) => zOf(i), opacity: 1, duration: 1.2 / o.speed, stagger: { each: 0.018, from: "end" }, ease: "expo.out" }, 0)
        .to(word.children, { yPercent: 0, opacity: 1, duration: 0.7 / o.speed, stagger: 0.06 }, 0.5 / o.speed)
        .to([bar, pct], { opacity: 1, duration: 0.5 }, 0.7 / o.speed);
      spin = g.to(rig, { rotationY: "+=360", duration: 3.2 / o.speed, ease: "none", repeat: -1 });
    } else {
      root.classList.add("no-gsap");
    }

    function leave() {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      fill.style.transform = "scaleX(1)";
      pct.textContent = "100%";
      const done = () => {
        if (destroyed) return;
        const restoreFocus = !o.inline && root.contains(document.activeElement);
        root.hidden = true;
        root.setAttribute("aria-hidden", "true");
        o.onDone();
        if (restoreFocus) document.querySelector(".wordmark").focus({ preventScroll: true });
      };
      if (!G) { root.classList.add("is-leaving"); setTimeout(done, 650); return; }
      const g = window.gsap;
      spin.kill();
      const target = Math.ceil((g.getProperty(rig, "rotationY") + 40) / 360) * 360;
      g.timeline({ onComplete: done })
        .to(rig, { rotationY: target, rotationX: 0, duration: 1.1 / o.speed, ease: "power3.out" })
        .to(layers, { z: (i) => zOf(i) * 0.4, duration: 0.5, ease: "power2.inOut", yoyo: true, repeat: 1 }, "<0.2")
        .to([bar, pct], { opacity: 0, duration: 0.3 }, "<0.3")
        .to(word.children, { letterSpacing: "0.9em", opacity: 0, duration: 0.5, ease: "power2.in" }, ">-0.1")
        .to(rig, { scale: 2.4, opacity: 0, duration: 0.7, ease: "power3.in" }, "<0.1")
        .to(top, { yPercent: -101, duration: 0.8, ease: "expo.inOut" }, "<0.15")
        .to(bottom, { yPercent: 101, duration: 0.8, ease: "expo.inOut" }, "<")
        .to(root.querySelectorAll(".tb-intro-bg, .tb-intro-skip"), { opacity: 0, duration: 0.5 }, "<");
    }

    function tick(now) {
      if (finished || destroyed) return;
      const elapsed = (now - startTime) * o.speed;
      const target = loaded ? Math.min(1, elapsed / o.minTime) : Math.min(0.9, (elapsed / o.minTime) * 0.9);
      tick.p += (target - tick.p) * 0.07;
      fill.style.transform = `scaleX(${tick.p.toFixed(3)})`;
      pct.textContent = Math.round(tick.p * 100) + "%";
      if (loaded && elapsed >= o.minTime && tick.p > 0.97) return leave();
      raf = requestAnimationFrame(tick);
    }
    tick.p = 0;
    skip.addEventListener("click", leave, { once: true });
    if (!o.inline) {
      skip.addEventListener("keydown", (event) => {
        if (event.key === "Tab") event.preventDefault();
        if (event.key === "Escape") {
          event.preventDefault();
          leave();
        }
      });
      skip.focus({ preventScroll: true });
    }
    requestAnimationFrame((t) => { startTime = t; raf = requestAnimationFrame(tick); });

    return {
      skip: leave,
      destroy() {
        destroyed = true;
        cancelAnimationFrame(raf);
        if (hasGsap()) window.gsap.killTweensOf([rig, ...layers, top, bottom, word.children]);
        tl && tl.kill(); spin && spin.kill();
        root.replaceChildren();
      },
    };
  }

  /* Entrada do hero depois da abertura (ou direto, quando ela não roda). */
  function heroEntrance() {
    if (!hasGsap() || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const g = window.gsap;
    g.from(".hero h1 > span", { yPercent: 70, opacity: 0, duration: 1, stagger: 0.1, ease: "expo.out", clearProps: "all" });
    g.from([".hero-intro", ".hero .button-primary", ".hero-bottom"], { y: 24, opacity: 0, duration: 0.8, stagger: 0.1, delay: 0.35, ease: "power3.out", clearProps: "all" });
    g.from(".tb-hero-art", { scale: 0.88, opacity: 0, duration: 1.2, delay: 0.2, ease: "expo.out", clearProps: "opacity,scale" });
    g.from(".site-header", { y: -30, opacity: 0, duration: 0.8, ease: "power3.out", clearProps: "all" });
  }

  window.TribyteIntro = { mount, heroEntrance };

  const siteRoot = document.getElementById("brand-intro");
  if (siteRoot) {
    if (document.documentElement.classList.contains("tb-intro-on")) {
      loadGsap().then(() => mount(siteRoot, {
        onDone() {
          document.documentElement.classList.remove("tb-intro-on");
          heroEntrance();
        },
      }));
    } else {
      siteRoot.hidden = true;
    }
  }
})();
