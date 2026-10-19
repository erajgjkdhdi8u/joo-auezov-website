/* JOO V34 / Signature Motion Pack, progressive enhancements with no new assets. */
(() => {
  'use strict';
  const doc=document, root=doc.documentElement, body=doc.body;
  if (!body || body.dataset.v34Ready) return;
  body.dataset.v34Ready='true';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile=matchMedia('(max-width:760px)').matches;
  const lang=root.lang==='ru'?'ru':root.lang==='en'?'en':'kk';
  const dict={
    kk:{learn:'БІЛІМ',grow:'ӨСУ',lead:'БОЛАШАҚ'},
    ru:{learn:'ЗНАНИЯ',grow:'РАЗВИТИЕ',lead:'БУДУЩЕЕ'},
    en:{learn:'LEARN',grow:'GROW',lead:'LEAD'}
  }[lang];
  // The existing real full-screen menu and all 14 links remain functional.
  const menu=doc.getElementById('menuPanel');
  if(menu){
    menu.classList.add('v34-luxury');
    menu.setAttribute('role','dialog');
    menu.setAttribute('aria-modal','true');
    menu.setAttribute('aria-label',lang==='kk'?'JOO мәзірі':lang==='ru'?'Меню JOO':'JOO navigation');
    [...menu.querySelectorAll('a.nav-item')].forEach((a,i)=>a.style.setProperty('--v34-menu-i',String(i)));
    const onToggle=()=>{
      if(menu.hidden){menu.classList.remove('v34-open');return;}
      menu.classList.remove('v34-open');
      requestAnimationFrame(()=>{if(!menu.hidden)menu.classList.add('v34-open');});
    };
    const watcher=new MutationObserver(onToggle);
    watcher.observe(menu,{attributes:true,attributeFilter:['hidden']});
    menu.addEventListener('keydown',event=>{
      if(event.key!=='Tab' || menu.hidden)return;
      const focusable=[...menu.querySelectorAll('a[href],button:not([disabled])')]
        .filter(el=>el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden');
      if(!focusable.length)return;
      const first=focusable[0],last=focusable[focusable.length-1];
      if(event.shiftKey&&doc.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&doc.activeElement===last){event.preventDefault();first.focus();}
    });
  }
  const main=doc.querySelector('main');
  if(!main)return;
  // Curtain uses two CSS pseudo-elements and never replaces the authentic photo.
  if(!reduced&&!mobile&&'IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        entry.target.classList.add('v34-curtain-open');observer.unobserve(entry.target);
      });
    },{threshold:.2,rootMargin:'0px 0px -30px 0px'});
    [...main.querySelectorAll('.story__visual')].slice(0,3).forEach(el=>{
      el.classList.add('v34-curtain');observer.observe(el);
    });
  }
  // One purely decorative branded ticker per page, translated at creation time.
  if(!main.querySelector('.v34-marquee')){
    const marquee=doc.createElement('div');marquee.className='v34-marquee';
    marquee.setAttribute('aria-hidden','true');
    const track=doc.createElement('div');track.className='v34-marquee__track';
    const phrase=dict.learn+'  ✦  '+dict.grow+'  ✦  '+dict.lead+'  ✦  JOO AUEZOV  ✦  ';
    for(let i=0;i<2;i++){
      const span=doc.createElement('span');span.className='v34-marquee__phrase';
      span.textContent=phrase;track.appendChild(span);
    }
    marquee.appendChild(track);
    const closing=main.querySelector('.home-closing');
    if(closing)closing.before(marquee);else main.appendChild(marquee);
  }
})();
