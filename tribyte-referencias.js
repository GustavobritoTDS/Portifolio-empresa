"use strict";
/* Referências externas: as telas são ilustrações locais, com dados fictícios. */
(() => {
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
        <span class="refs-eyebrow">REFERÊNCIAS EXTERNAS / NÃO SÃO PROJETOS DA EQUIPE</span>
        <h2 id="references-title">Ferramentas que usamos como referência.</h2>
      </div>
      <p>Metabase e Grafana são produtos de terceiros. As telas abaixo são composições demonstrativas feitas para este portfólio; os números são fictícios.</p>
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
})();
