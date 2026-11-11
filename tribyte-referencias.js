"use strict";
/* Galeria de interfaces reais. Créditos explícitos; não são projetos da TRIBYTE. */
(() => {
 const METABASE_IMG="https://www.metabase.com/images/product/pro/your-look-and-feel.png";
 const METABASE_SRC="https://www.metabase.com/product/pro";
 const GRAFANA_IMG="https://us1.discourse-cdn.com/grafana/original/3X/c/b/cb55ba287c1cfc4f10069b635c8885c0c7878820.jpeg";
 const GRAFANA_SRC="https://community.grafana.com/t/grafana-datasource-plugin-for-prtg/144260?page=2";
 const ready=fn=>document.readyState==="loading"?document.addEventListener("DOMContentLoaded",fn,{once:true}):fn();
 const create=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};
 function screenshot(parent,url,alt){
   const image=create("img","rb-real-screenshot");
   image.alt=alt;image.loading="lazy";image.decoding="async";image.referrerPolicy="no-referrer";
   image.addEventListener("load",()=>parent.classList.add("rb-image-loaded"),{once:true});
   image.addEventListener("error",()=>{parent.classList.remove("rb-image-loaded");image.remove();},{once:true});
   image.src=url;parent.append(image);
   if(image.complete&&image.naturalWidth)parent.classList.add("rb-image-loaded");
 }
 ready(()=>{
   const salesButton=document.querySelector('.project-card [data-project="gestao"]');
   const salesCard=salesButton?.closest(".project-card");
   const salesVisual=salesCard?.querySelector(".sales-visual");
   if(salesCard&&salesVisual&&!salesVisual.querySelector(".rb-real-project-shot")){
     salesCard.dataset.projectReference="metabase";
     const frame=create("div","rb-real-project-shot");
     screenshot(frame,METABASE_IMG,"Captura ilustrativa do Metabase: dashboard de e-commerce, software externo à TRIBYTE");
     const credit=create("span","rb-project-source","EXEMPLO EXTERNO: METABASE");
     frame.append(credit);salesVisual.append(frame);
     const label=salesVisual.querySelector(".visual-label");
     if(label)label.textContent="GESTÃO COMERCIAL / CONCEITO + REFERÊNCIA METABASE";
     const info=salesCard.querySelector(".project-info > p");
     if(info)info.textContent="Conceito TRIBYTE; imagem ilustrativa do Metabase, não criada pela equipe.";
   }

   const brandButton=document.querySelector('.project-card [data-project="tribyte"]');
   const brandCard=brandButton?.closest(".project-card");
   const brandVisual=brandCard?.querySelector(".brand-visual");
   if(brandCard&&brandVisual&&!brandVisual.querySelector(".rb-brand-cover")){
     brandCard.dataset.brandRepaired="true";
     const cover=create("div","rb-brand-cover");
     const img=create("img");img.src="assets/logo-tribyte-mark.svg";img.alt="";
     img.loading="lazy";img.decoding="async";
     cover.append(img,create("strong",null,"IDENTIDADE EM MOVIMENTO"),create("small",null,"TRIBYTE / DESIGN × CÓDIGO × EXPERIÊNCIA"));
     brandVisual.append(cover);
   }

   const projects=document.querySelector("#projetos");
   if(!projects||document.getElementById("referencias-de-sistemas"))return;
   const section=create("section","system-references");
   section.id="referencias-de-sistemas";
   section.setAttribute("aria-labelledby","references-title");
   section.innerHTML='<header class="refs-header"><div><span class="refs-eyebrow">REFERÊNCIAS REAIS / INTERFACES EM USO</span><h2 id="references-title">SISTEMAS QUE INSPIRAM.</h2></div><p>Exemplos de dashboards existentes para mostrar diferentes possibilidades de interfaces. São referências externas, não projetos desenvolvidos pela TRIBYTE.</p></header><div class="refs-grid"></div><p class="refs-note">Referências a produtos reais, com visual demonstrativo ilustrativo quando a captura original não carrega. Consulte a fonte oficial.</p>';
   const examples=[
    {name:"Metabase",kind:"Análise comercial",description:"Exemplo de interface comercial. O visual demonstrativo é uma ilustração da categoria; confira o software real na fonte oficial.",url:METABASE_IMG,source:METABASE_SRC},
    {name:"Grafana",kind:"Monitoramento e métricas",description:"Exemplo de interface de monitoramento. O visual demonstrativo é uma ilustração da categoria; confira o software real na fonte oficial.",url:GRAFANA_IMG,source:GRAFANA_SRC}
   ];
   const grid=section.querySelector(".refs-grid");
   examples.forEach((item,i)=>{
      const card=create("article","ref-card");
      const visual=create("div","ref-visual");
      const fallback=create("div","ref-fallback");
      const demo=create("div","ref-dashboard-demo");
      demo.setAttribute("aria-label","Ilustração demonstrativa de interface inspirada na categoria de "+item.name);
      if(item.name==="Metabase"){
        demo.innerHTML='<div class="ref-demo-toolbar"><b>▥ METABASE</b><span>PAINEL DE VENDAS</span><i>● ● ●</i></div><div class="ref-demo-kpis"><div><small>Receita</small><strong>R$ 42,8 mil</strong><em>↗ +12,4%</em></div><div><small>Pedidos</small><strong>1.284</strong><em>↗ +8,2%</em></div><div><small>Conversão</small><strong>4,8%</strong><em>↗ +1,1%</em></div></div><div class="ref-demo-charts"><div><small>RECEITA POR MÊS</small><div class="ref-demo-bars"><i style="--h:40%"></i><i style="--h:57%"></i><i style="--h:49%"></i><i style="--h:78%"></i><i style="--h:67%"></i><i style="--h:92%"></i><i style="--h:82%"></i></div></div><div><small>VENDAS POR CANAL</small><div class="ref-demo-donut"></div><small>Loja • Web • Outros</small></div></div>';
      }else{
        demo.innerHTML='<div class="ref-demo-toolbar"><b>◉ GRAFANA</b><span>MONITORAMENTO</span><i>● LIVE</i></div><div class="ref-demo-kpis"><div><small>Disponibilidade</small><strong>99,9%</strong><em>● Estável</em></div><div><small>CPU</small><strong>29,1%</strong><em>● Normal</em></div><div><small>Memória</small><strong>46,9%</strong><em>● Normal</em></div></div><div class="ref-demo-charts"><div><small>USO DE RECURSOS</small><div class="ref-demo-lines"><svg viewBox="0 0 300 110" preserveAspectRatio="none" aria-hidden="true"><polyline points="0,83 30,77 55,91 82,46 112,63 140,38 167,56 193,21 224,44 256,17 300,36" fill="none" stroke="#68d58a" stroke-width="3"/><polyline points="0,98 32,94 66,78 91,88 124,69 149,77 181,59 204,67 243,49 267,56 300,40" fill="none" stroke="#6ca9f7" stroke-width="3"/></svg></div></div><div><small>ALERTAS</small><div class="ref-demo-alert">● Todos os serviços ativos</div><div class="ref-demo-alert">● Sem incidentes críticos</div></div></div>';
      }
      fallback.append(demo,create("span","ref-demo-disclaimer","VISUAL ILUSTRATIVO — NÃO É CAPTURA DO SOFTWARE ORIGINAL"));
      visual.append(fallback);
      screenshot(visual,item.url,"Imagem de referência externa do sistema "+item.name+", exemplo externo não desenvolvido pela TRIBYTE");
      visual.append(create("span","ref-caption",String(i+1).padStart(2,"0")+" / REFERÊNCIA EXTERNA"));
      const body=create("div","ref-body");
      body.append(create("h3",null,item.name+" — "+item.kind),create("p",null,item.description));
      const link=create("a",null,"VER INTERFACE NA FONTE OFICIAL ↗");
      link.href=item.source;link.target="_blank";link.rel="noopener noreferrer";
      body.append(link);card.append(visual,body);grid.append(card);
   });
   projects.insertAdjacentElement("afterend",section);
 });
})();