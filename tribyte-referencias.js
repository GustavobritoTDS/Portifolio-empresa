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
   section.innerHTML='<header class="refs-header"><div><span class="refs-eyebrow">REFERÊNCIAS REAIS / INTERFACES EM USO</span><h2 id="references-title">SISTEMAS QUE INSPIRAM.</h2></div><p>Exemplos de dashboards existentes para mostrar diferentes possibilidades de interfaces. São referências externas, não projetos desenvolvidos pela TRIBYTE.</p></header><div class="refs-grid"></div><p class="refs-note">Capturas provenientes das páginas oficiais dos respectivos produtos. Cada cartão possui um link para a fonte original.</p>';
   const examples=[
    {name:"Metabase",kind:"Análise comercial",description:"Interface real de um dashboard de e-commerce, com gráficos, metas e resultados de vendas.",url:METABASE_IMG,source:METABASE_SRC},
    {name:"Grafana",kind:"Monitoramento e métricas",description:"Interface real de acompanhamento técnico com indicadores, séries temporais e gráficos de operação.",url:GRAFANA_IMG,source:GRAFANA_SRC}
   ];
   const grid=section.querySelector(".refs-grid");
   examples.forEach((item,i)=>{
      const card=create("article","ref-card");
      const visual=create("div","ref-visual");
      const fallback=create("div","ref-fallback");
      fallback.append(create("strong",null,item.name),create("span",null,"Visualização de referência. Consulte a captura real na fonte oficial."));
      visual.append(fallback);
      screenshot(visual,item.url,"Captura do sistema real "+item.name+", exemplo externo não desenvolvido pela TRIBYTE");
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