/* Progressive enhancements for JOO V27. No scroll lock or custom cursor. */
(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hover = matchMedia('(hover:hover) and (pointer:fine)').matches;
  // Scroll-inspired entrance effects; keep all content visible before they run.
  if(!reduced && 'IntersectionObserver' in window){
    const targets=[...document.querySelectorAll('.section-top h2,.story__heading h2,.rg-head h2,.gallery-band__head h2,.section-head h2,.staff h2,.fx-archive__intro h2,.results-note h2,.home-proof h2,.ecosystem .section-top h2')];
    const observer = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('fx-scroll-in');observer.unobserve(entry.target)}});
    },{threshold:.15,rootMargin:'0px 0px -24px 0px'});
    targets.forEach(el=>observer.observe(el));
  }
  // Cursor-JS / Kinesis inspired card lighting and 3D photo depth.
  // No custom cursor element is ever created.
  if(hover&&!reduced){
    const reactive=[...document.querySelectorAll('.system-card,.profile-tile,.grantee,.metric-card,.guide-card,.partner-card,.staff-card,.rg-stories article')];
    reactive.forEach(card=>card.classList.add('fx-pointer-card'));
    const tiles=[...document.querySelectorAll('.gallery-band__grid figure')];
    let raf=0, pending=null;
    const move=(event)=>{
      const target=event.target.closest('.fx-pointer-card,.gallery-band__grid figure');
      if(!target)return;
      pending={target,clientX:event.clientX,clientY:event.clientY};
      if(raf)return;
      raf=requestAnimationFrame(()=>{
        raf=0;if(!pending)return;
        const {target,clientX,clientY}=pending;
        const rect=target.getBoundingClientRect();
        const x=Math.max(0,Math.min(1,(clientX-rect.left)/Math.max(1,rect.width)));
        const y=Math.max(0,Math.min(1,(clientY-rect.top)/Math.max(1,rect.height)));
        if(target.classList.contains('fx-pointer-card')){
          target.style.setProperty('--fx-x',`${(x*100).toFixed(1)}%`);
          target.style.setProperty('--fx-y',`${(y*100).toFixed(1)}%`);
        }else{
          target.style.setProperty('--fx-rx',`${((.5-y)*5).toFixed(2)}deg`);
          target.style.setProperty('--fx-ry',`${((x-.5)*5).toFixed(2)}deg`);
        }
      });
    };
    document.addEventListener('pointermove',move,{passive:true});
    tiles.forEach(tile=>tile.addEventListener('pointerleave',()=>{
      tile.style.setProperty('--fx-rx','0deg');tile.style.setProperty('--fx-ry','0deg');
    }));
  }
  // Circular thumbnail switcher. Based on effect idea from user's jQuery example,
  // recreated in vanilla JS without external dependencies or blur.
  const buttons=[...document.querySelectorAll('.fx-archive__thumb')];
  const front=document.getElementById('fx-archive-front');
  const back=document.getElementById('fx-archive-back');
  if(buttons.length && front && back){
    const counter=document.getElementById('fx-archive-counter');
    const caption=document.getElementById('fx-archive-caption');
    let current=0, sequence=0;
    const show=async(index)=>{
      index=(index+buttons.length)%buttons.length;
      if(index===current)return;
      const chosen=buttons[index];
      const src=chosen.dataset.src;
      if(!src)return;
      const token=++sequence;
      // Preload next image before transition. Keeps existing image visible on failure.
      const preload=new Image(); preload.src=src;
      try{await preload.decode()}catch(e){return}
      if(token!==sequence)return;
      // Back layer becomes new visible image, then synchronize front after fade.
      back.src=src;
      back.alt=chosen.dataset.kk||'';
      back.classList.add('is-current');
      front.classList.remove('is-current');
      current=index;
      buttons.forEach((button,i)=>{
        const active=i===current;
        button.classList.toggle('is-active',active);
        button.setAttribute('aria-pressed',String(active));
      });
      if(counter)counter.innerHTML=String(index+1).padStart(2,'0')+' <small>/ '+String(buttons.length).padStart(2,'0')+'</small>';
      if(caption)caption.textContent=chosen.dataset.kk||chosen.getAttribute('aria-label')||'';
      const delay=reduced?0:700;
      window.setTimeout(()=>{
        if(token!==sequence)return;
        front.src=src;front.alt=back.alt;
        front.classList.add('is-current');back.classList.remove('is-current');
      },delay);
    };
    buttons.forEach((button,index)=>{
      button.addEventListener('click',()=>show(index));
      button.addEventListener('keydown',event=>{
        if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
        event.preventDefault();
        const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:
          (index+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;
        buttons[next].focus();show(next);
      });
    });
    document.getElementById('fx-archive-prev')?.addEventListener('click',()=>show(current-1));
    document.getElementById('fx-archive-next')?.addEventListener('click',()=>show(current+1));
  }
})();
