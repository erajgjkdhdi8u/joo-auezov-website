/* JOO V27: six isolated progressive enhancements. No custom cursor, no image blur. */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pointer = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const clamp = (v,min=0,max=1)=>Math.max(min,Math.min(max,v));
  const $$=(sel,el=document)=>Array.from(el.querySelectorAll(sel));
  const rafGate = (fn) => { let queued=false; return (...args) => { if (queued) return; queued=true; requestAnimationFrame(()=>{queued=false;fn(...args)}); }; };
  // 1. Hero depth: original school photo + non-interfering HUD layers.
  const hero=document.querySelector('.joo-cinematic-hero');
  if(hero){
    const frame=hero.querySelector('.hero__photo');
    if(frame && pointer && !reduce){
      const pointerMove=rafGate((e)=>{
        const r=frame.getBoundingClientRect();
        const nx=clamp((e.clientX-r.left)/Math.max(1,r.width))*2-1;
        const ny=clamp((e.clientY-r.top)/Math.max(1,r.height))*2-1;
        frame.style.setProperty('--joo-hero-x',`${(-nx*10).toFixed(1)}px`);
        frame.style.setProperty('--joo-hero-y',`${(-ny*10).toFixed(1)}px`);
        frame.style.setProperty('--joo-hud-x',`${(nx*8).toFixed(1)}px`);
        frame.style.setProperty('--joo-hud-y',`${(ny*8).toFixed(1)}px`);
      });
      frame.addEventListener('pointermove',pointerMove,{passive:true});
      frame.addEventListener('pointerleave',()=>{
        for(const [k,v] of Object.entries({'--joo-hero-x':'0px','--joo-hero-y':'0px','--joo-hud-x':'0px','--joo-hud-y':'0px'})) frame.style.setProperty(k,v);
      });
      const scrollHero=rafGate(()=>{
        const y=clamp(window.scrollY/Math.max(hero.offsetHeight,1));
        if(y>.97)return;
        frame.style.setProperty('--joo-hero-y',`${(-y*12).toFixed(1)}px`);
      });
      window.addEventListener('scroll',scrollHero,{passive:true});
    }
    // The 4-second Signature Intro always takes precedence over hero typography.
    // Trigger the extra title reveal AFTER intro finishes, not underneath its overlay.
    const reveal=()=>document.documentElement.classList.add('joo-hero-ready');
    const intro=document.getElementById('jooSignatureIntro');
    if(intro){
      const watcher=new MutationObserver(()=>{
        if(!intro.isConnected){watcher.disconnect();requestAnimationFrame(reveal);}
      });
      watcher.observe(document.documentElement,{childList:true,subtree:true});
      setTimeout(()=>{watcher.disconnect();reveal();},6500);
    }else requestAnimationFrame(reveal);
  }

  // 2. Depth gallery: scroll-driven rail, original circular gallery remains separate.
  const depth=document.querySelector('.joo-depth');
  if(depth){
    const viewport=depth.querySelector('.joo-depth__viewport');
    const track=depth.querySelector('.joo-depth__track');
    const cards=$$('.joo-depth-card',track);
    const meter=depth.querySelector('[data-joo-depth-progress]');
    const counter=depth.querySelector('[data-joo-depth-counter]');
    const mobile=()=>matchMedia('(max-width:760px)').matches || reduce;
    const draw = () => {
      if(!viewport||!track)return;
      let p=0;
      if(mobile()){
        p=clamp(viewport.scrollLeft/Math.max(1,track.scrollWidth-viewport.clientWidth));
        track.style.removeProperty('--joo-depth-x');
        cards.forEach(c=>{c.style.removeProperty('--joo-levitate');c.style.removeProperty('--joo-card-scale');});
      } else {
        const rect=depth.getBoundingClientRect();
        const stickyTop=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--head'))||78;
        const distance=Math.max(1,depth.offsetHeight-viewport.parentElement.offsetHeight-stickyTop);
        p=clamp((stickyTop-rect.top)/distance);
        const available=Math.max(0,track.scrollWidth-viewport.clientWidth);
        track.style.setProperty('--joo-depth-x',`${(Math.min(0,viewport.clientWidth*.04 - available*p)).toFixed(2)}px`);
        const ix=p*(cards.length-1);
        cards.forEach((card,i)=>{
          const d=Math.abs(ix-i);
          card.style.setProperty('--joo-levitate',`${Math.min(26,d*8).toFixed(1)}px`);
          card.style.setProperty('--joo-card-scale',`${(1-Math.min(.055,d*.019)).toFixed(3)}`);
        });
      }
      if(meter)meter.style.transform=`scaleX(${Math.max(.02,p)})`;
      if(counter)counter.textContent=`${String(Math.min(cards.length,Math.floor(p*(cards.length-1)+1.42))).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;
    };
    const update=rafGate(draw);
    window.addEventListener('scroll',update,{passive:true});
    window.addEventListener('resize',update,{passive:true});
    viewport?.addEventListener('scroll',update,{passive:true});
    if('ResizeObserver' in window){const ro=new ResizeObserver(update);ro.observe(viewport);ro.observe(track);}
    draw();
  }

  // 3. Interactive student results; independent of the original poster filtering/dialog.
  const resultBox=document.querySelector('.joo-result-experience');
  if(resultBox){
    const source=$$('.poster[data-profile]');
    const growth=[43,42,43,49,50,39,39,35];
    const profile={'geo-math':'География + математика','info-math':'Информатика + математика','bio-chem':'Биология + химия','geo-bio':'География + биология'};
    const records=source.map((el,i)=>({
      name:el.dataset.name, score:Number(el.querySelector('strong')?.textContent.match(/\d+/)?.[0]),
      growth:growth[i], profile:profile[el.dataset.profile], photo:el.dataset.poster
    }));
    const controls=$$('[data-joo-person]',resultBox);
    const img=resultBox.querySelector('[data-joo-result-photo]');
    const name=resultBox.querySelector('[data-joo-result-name]');
    const prof=resultBox.querySelector('[data-joo-result-profile]');
    const score=resultBox.querySelector('[data-joo-result-score]');
    const inc=resultBox.querySelector('[data-joo-result-progress]');
    const meter=resultBox.querySelector('[data-joo-result-meter]');
    const setActive=(i)=>{
      const m=records[i];if(!m||!img)return;
      controls.forEach((btn,k)=>{const yes=k===i;btn.classList.toggle('is-active',yes);btn.setAttribute('aria-pressed',String(yes));});
      img.src=m.photo;img.alt=`${m.name} — ҰБТ нәтижесінің түпнұсқа постері`;
      if(name)name.textContent=m.name;
      if(prof)prof.textContent=m.profile;
      if(score)score.textContent=String(m.score);
      if(inc)inc.textContent=`+${m.growth}`;
      if(meter)meter.style.width=`${(m.score/140*100).toFixed(2)}%`;
    };
    controls.forEach((btn,i)=>{
      btn.addEventListener('click',()=>setActive(i));
      btn.addEventListener('keydown',e=>{
        if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
        e.preventDefault();
        let next=e.key==='Home'?0:e.key==='End'?controls.length-1:(i+(e.key==='ArrowRight'?1:-1)+controls.length)%controls.length;
        controls[next].focus();setActive(next);
      });
    });
    setActive(0);
    // Reuse visible source labels; never invent data or change original stats.
    if(!reduce && 'IntersectionObserver' in window){
      const numeric=$$('.result-kpis strong,.rg-city strong,.results-chart__aside>strong');
      const io=new IntersectionObserver(entries=>{
        for(const entry of entries){
          if(!entry.isIntersecting)continue;
          io.unobserve(entry.target);const el=entry.target;
          const original=el.textContent.trim();
          if(!/^\d+(?:\.\d+)?$/.test(original))continue;
          const goal=Number(original), precision=original.includes('.')?original.split('.')[1].length:0;
          const length=original.length,duration=1000,begin=performance.now();
          const tick=(now)=>{
            if(!el.isConnected)return;
            const t=clamp((now-begin)/duration), eased=1-Math.pow(1-t,3);
            let val=(goal*eased).toFixed(precision);
            if(t>=1) val=original;
            else if(/^0\d/.test(original))val=val.padStart(length,'0');
            el.textContent=val;
            if(t<1)requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },{threshold:.25});
      numeric.forEach(el=>io.observe(el));
    }
  }

  // 4. Student Journey timeline. All map nodes drive V27's original stage tabs.
  $$('.joo-journey-map').forEach(map=>{
    const host=map.parentElement;
    const stageTabs=$$('[data-journey]',host);
    const mapButtons=$$('[data-joo-stage]',map);
    const counter=map.querySelector('[data-joo-journey-step]');
    const sync=(index)=>{
      map.style.setProperty('--joo-stage-progress',String(index/3));
      mapButtons.forEach((b,i)=>{const yes=i===index;b.classList.toggle('is-active',yes);b.setAttribute('aria-pressed',String(yes));});
      if(counter)counter.textContent=String(index+1).padStart(2,'0');
    };
    mapButtons.forEach((button,i)=>button.addEventListener('click',()=>stageTabs[i]?.click()));
    stageTabs.forEach((b,i)=>b.addEventListener('click',()=>sync(i)));
    stageTabs.forEach((b)=>b.addEventListener('keydown',()=>requestAnimationFrame(()=>sync(Math.max(0,stageTabs.findIndex(e=>e.classList.contains('is-current')))))));
    sync(Math.max(0,stageTabs.findIndex(e=>e.classList.contains('is-current'))));
  });

  // 5. Real team portraits: perspective follows mouse within the card only.
  if(pointer && !reduce){
    $$('.joo-team-portrait').forEach(card=>{
      const rotate=rafGate(e=>{
        const b=card.getBoundingClientRect();
        const x=clamp((e.clientX-b.left)/Math.max(1,b.width))-.5;
        const y=clamp((e.clientY-b.top)/Math.max(1,b.height))-.5;
        card.style.setProperty('--joo-team-tilt-x',`${(-y*4.0).toFixed(2)}deg`);
        card.style.setProperty('--joo-team-tilt-y',`${(x*5.5).toFixed(2)}deg`);
      });
      card.addEventListener('pointermove',rotate,{passive:true});
      card.addEventListener('pointerleave',()=>{card.style.setProperty('--joo-team-tilt-x','0deg');card.style.setProperty('--joo-team-tilt-y','0deg');});
    });
  }

  // 6. Full-screen mega menu: existing anchors and toggle continue to work.
  const menu=document.getElementById('menuPanel');
  if(menu){
    menu.classList.add('joo-mega-enabled');
    const img=menu.querySelector('[data-joo-menu-image]');
    const heading=menu.querySelector('[data-joo-menu-title]');
    const frame=menu.querySelector('.joo-mega-showcase__photograph');
    const mapping={
      'index.html':['БОЛАШАҚҚА ДАЙЫН МЕКТЕП.','students-1200.webp'],
      'about.html':['БІЗДІҢ МЕКТЕП.','exterior-1200.webp'],
      'academics.html':['ОҚУ ТРАЕКТОРИЯСЫ.','classroom-1200.webp'],
      'student-life.html':['МЕКТЕП ӨМІРІ.','assembly-1200.webp'],
      'results.html':['НӘТИЖЕЛЕР.','students-1200.webp'],
      'team.html':['МЕКТЕП КОМАНДАСЫ.','students-1200.webp'],
      'campus.html':['БІЗДІҢ КАМПУС.','hall-1200.webp'],
      'parents.html':['АТА-АНАЛАРҒА.','students-1200.webp'],
      'career.html':['ПРОФОРИЕНТАЦИЯ.','computerlab-1200.webp'],
      'wellbeing.html':['ҚОЛДАУ ОРТАСЫ.','corridor-1200.webp'],
      'resources.html':['ҚАЖЕТТІ РЕСУРСТАР.','classroom-1200.webp'],
      'news.html':['МЕКТЕП ЖАҢАЛЫҚТАРЫ.','assembly-1200.webp'],
      'admissions.html':['МЕКТЕПКЕ ҚАБЫЛДАУ.','exterior-1200.webp'],
      'contacts.html':['БІЗБЕН БАЙЛАНЫС.','exterior-1200.webp']
    };
    // Use page hero headlines already authored on this site, not invented copy.
    const titles={
      'index.html':['БОЛАШАҚҚА ДАЙЫН МЕКТЕП.','Школа, готовящая к будущему.','MADE FOR THE FUTURE.'],
      'about.html':['ӨЗІҢДІ ТАНЫ. БАҒЫТЫҢДЫ ТАП.','УЗНАЙ СЕБЯ. НАЙДИ СВОЙ ПУТЬ.','KNOW YOURSELF. FIND YOUR WAY.'],
      'academics.html':['ТӨРТ КЕЗЕҢ. БІР ТРАЕКТОРИЯ.','ЧЕТЫРЕ ЭТАПА. ОДНА ТРАЕКТОРИЯ.','FOUR STAGES. ONE DIRECTION.'],
      'student-life.html':['МЕКТЕП ӨМІРІ. ШЫНАЙЫ СӘТТЕР.','ШКОЛЬНАЯ ЖИЗНЬ. НАСТОЯЩИЕ МОМЕНТЫ.','LIFE BEYOND THE CLASSROOM.'],
      'results.html':['НӘТИЖЕ — ӨСУДІҢ ІЗІ.','РЕЗУЛЬТАТ — ТРАЕКТОРИЯ РОСТА.','EVERY SCORE TELLS A STORY.'],
      'team.html':['АДАМДАР — МЕКТЕП ЖҮРЕГІ.','ЛЮДИ — СЕРДЦЕ ШКОЛЫ.','PEOPLE MAKE THE DIFFERENCE.'],
      'campus.html':['КЕҢІСТІК ТЕ ҮЙРЕТЕДІ.','ПРОСТРАНСТВО ТОЖЕ УЧИТ.','SPACE TO BECOME MORE.'],
      'parents.html':['БІР МЕКТЕП. БІР КОМАНДА.','ОДНА ШКОЛА. ОДНА КОМАНДА.','FAMILY AND SCHOOL AS ONE.'],
      'career.html':['ПРОФОРИЕНТАЦИЯ.','ПРОФОРИЕНТАЦИЯ.','CAREER GUIDANCE.'],
      'wellbeing.html':['ӘР ОҚУШЫҒА ҚОЛДАУ КЕРЕК.','ПОДДЕРЖКА КАЖДОМУ.','A PLACE TO FEEL SUPPORTED.'],
      'resources.html':['КЕРЕК ДЕРЕК. БІР ЖЕРДЕ.','ВСЁ ВАЖНОЕ. В ОДНОМ МЕСТЕ.','WHAT YOU NEED. WHERE YOU NEED IT.'],
      'news.html':['МЕКТЕП ТЫНЫСЫ. КАДРДА.','ЖИЗНЬ ШКОЛЫ. В КАДРЕ.','STORIES FROM OUR CAMPUS.'],
      'admissions.html':['ЖАҢА ҚАДАМ. ОСЫНАН БАСТАЛАДЫ.','НОВЫЙ ЭТАП. НАЧИНАЕТСЯ ЗДЕСЬ.','YOUR NEXT STEP STARTS HERE.'],
      'contacts.html':['БІР СҰРАҚ. БІР ӘҢГІМЕ.','ЕСТЬ ВОПРОС? ДАВАЙТЕ ОБСУДИМ.','GOOD CONVERSATIONS START HERE.']
    };
    const links=$$('.nav-item',menu);
    const indexTag=document.createElement('span');
    indexTag.className='v35-menu-preview-index';
    indexTag.setAttribute('aria-hidden','true');
    indexTag.textContent='01 / '+String(links.length).padStart(2,'0');
    frame?.appendChild(indexTag);
    const imageCache=new Map();
    let version=0;
    const show=async link=>{
      if(!img||!heading||!link)return;
      // /ru/ and /en/ navigation must resolve to the same filename as /.
      let key='index.html';
      try{
        const name=new URL(link.getAttribute('href'),document.baseURI).pathname.split('/').pop();
        key=name||'index.html';
      }catch(e){ /* Keep the index-page fallback. */ }
      const choice=mapping[key];if(!choice)return;
      const thisRun=++version;
      const lang=document.documentElement.lang;
      const langIndex=lang==='ru'?1:lang==='en'?2:0;
      heading.textContent=titles[key]?.[langIndex] || link.getAttribute('data-'+lang) || choice[0];
      const index=links.indexOf(link);
      if(indexTag && index>=0) indexTag.textContent=String(index+1).padStart(2,'0')+' / '+String(links.length).padStart(2,'0');
      const path='assets/images/'+choice[1];
      if(img.getAttribute('src')===path){frame?.classList.remove('is-changing');return;}
      frame?.classList.add('is-changing');
      if(!imageCache.has(path)){
        const photo=new Image();photo.src=path;
        imageCache.set(path,photo.decode().then(()=>true).catch(()=>false));
      }
      const loaded=await imageCache.get(path);
      if(thisRun!==version)return;
      if(loaded)img.src=path;
      requestAnimationFrame(()=>frame?.classList.remove('is-changing'));
    };
    // Debounce only hover so sweeping over 14 links does not fetch 14 images.
    // Keyboard focus remains immediate.
    let previewTimer=0;
    $('.nav-item',menu).forEach(link=>{
      link.addEventListener('pointerenter',()=>{
        clearTimeout(previewTimer);
        previewTimer=setTimeout(()=>{if(!menu.hidden)show(link);},90);
      });
      link.addEventListener('focus',()=>{
        clearTimeout(previewTimer);
        if(!menu.hidden)show(link);
      });
    });
    menu.addEventListener('pointerleave',()=>clearTimeout(previewTimer));
    const toggle=document.getElementById('menuToggle');
    toggle?.addEventListener('click',()=>{
      if(!menu.hidden)show(menu.querySelector('.nav-item.is-active')||menu.querySelector('.nav-item'));
    });
  }
})();
