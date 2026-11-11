"use strict";

const model = document.getElementById("model");
const getValue = (id) => Number(document.getElementById(id).value);
let current;

function play() {
  current?.destroy();
  current = window.TribyteIntro.mount(model, {
    inline: true,
    layers: getValue("layers"),
    depth: getValue("depth"),
    speed: getValue("speed"),
    onDone() {
      const hint = document.createElement("div");
      hint.className = "replay-hint";
      hint.textContent = "Fim da abertura. Clique em “Repetir abertura”.";
      model.classList.remove("tb-intro");
      model.hidden = false;
      model.removeAttribute("aria-hidden");
      model.replaceChildren(hint);
    },
  });
}

document.getElementById("replay").addEventListener("click", play);
["layers", "depth", "speed"].forEach((id) =>
  document.getElementById(id).addEventListener("change", play),
);
play();
