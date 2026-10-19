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


/* JOO V35 / Cinematic Editorial: one lightweight, shared enhancer across all locales.
   Original content and navigation remain unchanged when scripting is unavailable. */
(() => {
  'use strict';
  const body=document.body;
  const main=document.querySelector('main');
  if(!body || !main || body.dataset.v35Ready) return;
  body.dataset.v35Ready='true';

  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sections=[...main.querySelectorAll(':scope > section')];
  // Chapter styling is decorative only: no blanking, sticky scroll or text rewrites.
  const eligible=['story','home-system','home-journey','ecosystem','home-proof',
    'campus-strip','gsed','gallery-band','results-intro','results-progress'];
  sections.forEach(section=>{
    if(!eligible.some(name=>section.classList.contains(name)))return;
    section.classList.add('v35-chapter');
    section.classList.add(
      section.matches('.editorial--ink,.gallery-band,.home-proof,.results-progress')?
      'v35-chapter--dark':'v35-chapter--light'
    );
    const label=section.querySelector(
      '.story__heading .eyebrow,.section-top>span,.gallery-band__head>div>span,'+
      '.campus-strip__label>span,.home-proof__copy>span,.gsed__intro .eyebrow'
    );
    if(label)label.classList.add('v35-chapter-label');
  });
  if(!reduced && 'IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(!entry.isIntersecting)continue;
        entry.target.classList.add('v35-in');
        io.unobserve(entry.target);
      }
    },{threshold:.08,rootMargin:'0px 0px -24px 0px'});
    main.querySelectorAll('section.v35-chapter').forEach(section=>io.observe(section));
  }

  // Keep the campus five-frame V33 bento as-is; remodel only 3-photo galleries.
  main.querySelectorAll('.gallery-band').forEach(section=>{
    const grid=section.querySelector('.gallery-band__grid');
    if(grid && grid.querySelectorAll(':scope > figure').length===3)
      section.classList.add('v35-photo-editorial');
  });
  const strip=main.querySelector('.campus-strip');
  if(strip?.querySelectorAll('.campus-strip__photos > img').length===3)
    strip.classList.add('v35-photo-editorial');

  // Home-only cinematic composition with a progressive real-photo crossfade.
  // No new videos, no invented images, no image replacement before LCP.
  if(body.dataset.page!=='index')return;
  const hero=main.querySelector('.hero--index.joo-cinematic-hero');
  const frame=hero?.querySelector('.hero__photo');
  if(!hero || !frame || !frame.querySelector(':scope > img'))return;
  hero.classList.add('v35-hero');
  const desktop=window.matchMedia('(hover:hover) and (pointer:fine) and (min-width:901px)');
  if(reduced || !desktop.matches || navigator.connection?.saveData)return;

  const sourcePaths=[
    'assets/images/v28/school-building.webp',
    'assets/images/v28/school-classroom.webp'
  ];
  const slide=document.createElement('img');
  slide.className='v35-hero__slide';
  slide.alt='';
  slide.setAttribute('aria-hidden','true');
  slide.decoding='async';
  slide.loading='lazy';
  const bar=document.createElement('span');
  bar.className='v35-hero-progress';
  bar.setAttribute('aria-hidden','true');
  hero.appendChild(bar);

  let alive=true, timer=0, next=0, mounted=false, preloads=new Map();
  const schedule=ms=>{
    clearTimeout(timer);
    timer=window.setTimeout(showNext,ms);
  };
  const load=src=>{
    if(preloads.has(src))return preloads.get(src);
    const img=new Image();
    img.decoding='async';
    img.src=src;
    const ready=(typeof img.decode==='function')
      ? img.decode().then(()=>true).catch(()=>false)
      : new Promise(resolve=>{img.onload=()=>resolve(true);img.onerror=()=>resolve(false);});
    preloads.set(src,ready);
    return ready;
  };
  const startBar=()=>{
    bar.classList.remove('is-playing');
    // Restart a single finite CSS animation without continuous scripting.
    void bar.offsetWidth;
    bar.classList.add('is-playing');
  };
  async function showNext(){
    if(!alive || !desktop.matches)return;
    if(document.hidden){schedule(3000);return;}
    const src=sourcePaths[next++ % sourcePaths.length];
    const okay=await load(src);
    if(!alive || !desktop.matches)return;
    if(!okay){schedule(6500);return;}
    if(!mounted){
      slide.src=src;
      frame.appendChild(slide);
      mounted=true;
      requestAnimationFrame(()=>slide.classList.add('is-visible'));
      startBar();
      schedule(6500);
      return;
    }
    // Fade back to the original students image, then fade the next real image in.
    slide.classList.remove('is-visible');
    timer=window.setTimeout(()=>{
      if(!alive || !desktop.matches)return;
      slide.src=src;
      requestAnimationFrame(()=>slide.classList.add('is-visible'));
      startBar();
      schedule(6500);
    },1280);
  }
  const start=()=>{
    if(!alive)return;
    // The already-installed Signature Intro gets precedence on the homepage.
    if(document.getElementById('jooSignatureIntro')){
      const observer=new MutationObserver(()=>{
        if(!document.getElementById('jooSignatureIntro')){
          observer.disconnect();
          if(alive)schedule(1900);
        }
      });
      observer.observe(document.documentElement,{childList:true,subtree:true});
      window.addEventListener('pagehide',()=>observer.disconnect(),{once:true});
    }else schedule(1900);
  };
  if(document.readyState==='complete')start();
  else window.addEventListener('load',start,{once:true});
  window.addEventListener('pagehide',()=>{
    alive=false;
    clearTimeout(timer);
  },{once:true});
})();
