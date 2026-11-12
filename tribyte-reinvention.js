"use strict";
/* TRIBYTE — Reinvention Experience
 * Patterns translated into vanilla JS from React Bits concepts:
 * Scroll Stack, Magic Bento, Text Pressure, Aurora and Animated Content.
 * Progressive enhancement: semantic controls work without JS.
 */
(() => {
 const reduced = matchMedia("(prefers-reduced-motion: reduce)");
 const desktop = matchMedia("(min-width: 801px)");
 const fine = matchMedia("(hover:hover) and (pointer:fine)");
 const qs = (sel, root = document) => root.querySelector(sel);
 const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];
 const clamp = (n,min=0,max=1) => Math.max(min,Math.min(max,n));
 const lab=qs(".rx-lab");
 const modes=Object.freeze({
  sites: {
   eyebrow:"01 / SITES",
   headline:"Uma página para mostrar o que você faz.",
   body:"Site institucional, portfólio ou página de apresentação, com informações e contato fáceis de encontrar.",
   image:"assets/service-sites.webp",
   cta:"Site institucional",
   label:"01 / EXPERIÊNCIA WEB"
  },
  sistemas:{
   eyebrow:"02 / SISTEMAS",
   headline:"Um painel para acompanhar sua rotina.",
   body:"Painéis, cadastros e áreas de gestão para reunir informações usadas pela sua equipe.",
   image:"assets/service-systems.webp",
   cta:"Sistema web",
   label:"02 / INTERFACE & LÓGICA"
  },
  landing:{
   eyebrow:"03 / LANDING PAGES",
   headline:"Uma página para uma oferta.",
   body:"Página focada em um produto, serviço ou campanha, com as informações principais e um próximo passo visível.",
   image:"assets/service-landing.webp",
   cta:"Landing page",
   label:"03 / COMUNICAÇÃO DIGITAL"
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

})();
