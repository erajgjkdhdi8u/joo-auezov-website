/* JOO Auezov V24: accessible interactions without scroll-lock animations or custom cursor */
(() => {
  'use strict';
  const $ = (s, base=document) => base.querySelector(s);
  const $$ = (s, base=document) => [...base.querySelectorAll(s)];
  const root = document.documentElement;
  const menu = $('#menuPanel');
  const menuButton = $('#menuToggle');
  const closeButton = $('#menuClose');
  let lastFocus;
  function setMenu(open){
    if (!menu) return;
    if (open) lastFocus = document.activeElement;
    menu.hidden = !open;
    document.body.classList.toggle('menu-is-open',open);
    menuButton?.setAttribute('aria-expanded',String(open));
    if(open) closeButton?.focus();
    else if(lastFocus instanceof HTMLElement) lastFocus.focus({preventScroll:true});
  }
  menuButton?.addEventListener('click', () => setMenu(menu.hidden));
  closeButton?.addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', (e)=>{if(e.key==='Escape' && menu && !menu.hidden) setMenu(false);});
  $$('.menu-panel a').forEach(a=>a.addEventListener('click',()=>{ menu.hidden=true; document.body.classList.remove('menu-is-open'); }));
  $$('.nav-main-link').forEach(a=>{
    if(a.getAttribute('href')===(document.body.dataset.page||'index')+'.html')a.setAttribute('aria-current','page');
  });
  /* Native scrolling remains available on every page, including Student Life. */
  window.addEventListener('pageshow',()=>{setMenu(false);document.body.style.removeProperty('overflow');root.style.removeProperty('overflow');});
  const langs = ['kk','ru','en'];
  function setLanguage(lang){
    if(!langs.includes(lang)) lang='kk';
    root.lang=lang;
    $$('[data-kk][data-ru][data-en]').forEach(el=>{
      // Some old headings include <em>/<br> or a separately translated child.
      // Never replace their inner elements with textContent.
      if(el.querySelector('[data-kk][data-ru][data-en]')) return;
      const base=el.dataset.kk;
      const rich=window.JOO_I18N?.rich?.[base];
      if(rich && el.innerHTML!==rich[lang]){
        el.innerHTML=rich[lang];
      } else if(!rich && !el.children.length){
        const value=el.getAttribute('data-'+lang);
        if(value!==null && el.textContent!==value) el.textContent=value;
      }
    });
    window.JOO_I18N?.apply(lang);
    $$('[data-lang]').forEach(b=>{const on=b.dataset.lang===lang;b.classList.toggle('is-active',on);b.setAttribute('aria-pressed',String(on));});
    try{localStorage.setItem('joo-language',lang);}catch(e){}
  }
  let saved='kk';try{saved=localStorage.getItem('joo-language')||localStorage.getItem('joo-v24-language')||'kk';}catch(e){}
  setLanguage(saved);
  $$('[data-lang]').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.lang)));
  window.JOO_SET_LANGUAGE=setLanguage;
  /* One journey component can be used on the homepage and on Academics. */
  $$('.journey__tabs').forEach((tabs)=>{
    const host=tabs.parentElement;
    const buttons=$$('[data-journey]',tabs);
    const panels=$$('[data-panel]',host);
    function activate(i,shouldFocus=false){
      buttons.forEach((button,index)=>{const on=index===i;button.classList.toggle('is-current',on);button.setAttribute('aria-selected',String(on));button.tabIndex=on?0:-1;});
      panels.forEach((panel,index)=>{const on=index===i;panel.hidden=!on;panel.classList.toggle('is-current',on);});
      if(shouldFocus)buttons[i]?.focus();
    }
    buttons.forEach((b,i)=>{
      b.addEventListener('click',()=>activate(i));
      b.addEventListener('keydown',(e)=>{
        if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
        e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?buttons.length-1:(i+(e.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;activate(next,true);
      });
    });
    activate(0);
  });
  /* Results: profile filters and poster modal. All stats stay readable without JS. */
  const posterCards=$$('.poster[data-profile]');
  const posterFilters=$$('[data-filter]');
  const profileTiles=$$('[data-profile-filter]');
  function filterPosters(value){
    posterCards.forEach(card=>{card.hidden=value!=='all' && card.dataset.profile!==value;});
    posterFilters.forEach(btn=>{const on=btn.dataset.filter===value;btn.classList.toggle('is-active',on);btn.setAttribute('aria-pressed',String(on));});
    profileTiles.forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.profileFilter===value)));
  }
  posterFilters.forEach(b=>b.addEventListener('click',()=>filterPosters(b.dataset.filter)));
  profileTiles.forEach(b=>b.addEventListener('click',()=>{filterPosters(b.dataset.profileFilter);$('#students')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}));
  const dialog=$('#posterDialog'),large=$('#posterFull'),caption=$('#posterCaption');
  posterCards.forEach(b=>b.addEventListener('click',()=>{
    if(!b.dataset.poster||!dialog||!large)return;
    large.src=b.dataset.poster;large.alt=b.dataset.name||'JOO result poster';
    if(caption)caption.textContent=b.dataset.name||'';
    if(typeof dialog.showModal==='function')dialog.showModal();
  }));
  $('#posterClose')?.addEventListener('click',()=>dialog?.close());
  dialog?.addEventListener('click',(e)=>{if(e.target===dialog)dialog.close();});
  /* Admission request: explicit WhatsApp handoff; no backend storage. */
  const admissionForm = $('#enquiryForm');
  const admissionCopy = $('#enquiryCopy');
  const admissionPreview = $('#enquiryPreview');
  const admissionFeedback = $('#enquiryFeedback');
  function admissionMessage(){
    if(!admissionForm) return '';
    const data = new FormData(admissionForm);
    const parent = String(data.get('parent') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const grade = String(data.get('grade') || '');
    const lang = root.lang;
    if(lang === 'en') return ['Hello! I would like to learn about admission to JOO Auezov.', 'Parent: '+parent, 'Phone: '+phone, 'Grade: '+grade, 'Please share information about school visits and admission requirements.'].join('\n');
    if(lang === 'ru') return ['Здравствуйте! Я хочу узнать о поступлении в JOO Auezov.', 'Родитель: '+parent, 'Телефон: '+phone, 'Класс: '+grade, 'Пожалуйста, расскажите о визите в школу и условиях поступления.'].join('\n');
    return ['Сәлеметсіз бе! JOO Auezov мектебіне қабылдау туралы білгім келеді.', 'Ата-ана: '+parent, 'Телефон: '+phone, 'Сынып: '+grade, 'Мектепке келу және қабылдау шарттары туралы ақпарат жіберсеңіз.'].join('\n');
  }
  function admissionValid(){
    if(!admissionForm) return false;
    const phone = admissionForm.querySelector('[name="phone"]');
    if(phone) phone.setCustomValidity('');
    if(!admissionForm.reportValidity()) return false;
    const digits = String(phone?.value || '').replace(/\D/g, '');
    if(digits.length < 10 || digits.length > 15){
      if(phone){
        phone.setCustomValidity(root.lang==='ru'?'Введите номер из 10–15 цифр.':root.lang==='en'?'Enter a phone number with 10–15 digits.':'10–15 цифрдан тұратын телефон нөмірін енгізіңіз.');
        phone.reportValidity();
      }
      return false;
    }
    return true;
  }
  function admissionUpdatePreview(){
    if(!admissionForm || !admissionPreview) return;
    const parent = admissionForm.querySelector('[name="parent"]')?.value.trim();
    const phone = admissionForm.querySelector('[name="phone"]')?.value.trim();
    const grade = admissionForm.querySelector('[name="grade"]')?.value;
    admissionPreview.textContent = parent && phone && grade ? admissionMessage() : '';
    if(admissionFeedback) admissionFeedback.textContent = '';
  }
  admissionForm?.addEventListener('input', e => {
    if(e.target?.name === 'phone') e.target.setCustomValidity('');
    admissionUpdatePreview();
  });
  admissionForm?.addEventListener('change', admissionUpdatePreview);
  admissionForm?.addEventListener('submit', e => {
    e.preventDefault();
    if(!admissionValid()) return;
    const url = 'https://wa.me/77711230702?text='+encodeURIComponent(admissionMessage());
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    link.remove();
    if(admissionFeedback) admissionFeedback.textContent = root.lang==='ru'?'WhatsApp открыт. Отправку сообщения подтвердите самостоятельно.':root.lang==='en'?'WhatsApp opened. Please confirm sending the message yourself.':'WhatsApp ашылды. Хабарламаны жіберуді өзіңіз растаңыз.';
  });
  admissionCopy?.addEventListener('click', async () => {
    if(!admissionValid()) return;
    const message = admissionMessage();
    let copied = false;
    try {
      if(navigator.clipboard?.writeText){
        await navigator.clipboard.writeText(message);
        copied = true;
      } else {
        const temp = document.createElement('textarea');
        temp.value = message;
        temp.style.position = 'fixed';
        temp.style.opacity = '0';
        document.body.appendChild(temp);
        temp.select();
        copied = document.execCommand('copy');
        temp.remove();
      }
    } catch(_) { copied = false; }
    if(admissionFeedback) admissionFeedback.textContent = copied
      ? (root.lang==='ru'?'Сообщение скопировано.':root.lang==='en'?'Message copied.':'Хабарлама көшірілді.')
      : (root.lang==='ru'?'Не удалось скопировать. Выделите текст выше.':root.lang==='en'?'Could not copy. Select the message above.':'Көшіру мүмкін болмады. Жоғарыдағы мәтінді таңдаңыз.');
  });
  $$('[data-lang]').forEach(button => button.addEventListener('click', admissionUpdatePreview));
  /* Editorial progress: passive indicator, not a floating control or a cursor. */
  const readingLine=document.createElement('div');
  readingLine.className='reading-line';readingLine.setAttribute('aria-hidden','true');
  document.body.appendChild(readingLine);
  let scrollQueued=false;
  const updateProgress=()=>{
    if(scrollQueued)return;scrollQueued=true;
    requestAnimationFrame(()=>{
      const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
      readingLine.style.transform=`scaleX(${Math.max(0,Math.min(1,scrollY/max))})`;
      scrollQueued=false;
    });
  };
  addEventListener('scroll',updateProgress,{passive:true});
  addEventListener('resize',updateProgress,{passive:true});
  updateProgress();
  /* Adapted visual grammar from earlier GSAP experiments: restrained cinematic reveals,
     photo parallax, and card depth with no scroll locking or blur. All content is
     visible before animation runs, so failure never leaves a blank section. */
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduce){
    root.classList.add('enhanced');
    if(window.gsap && window.ScrollTrigger){
      gsap.registerPlugin(ScrollTrigger);
      $$('.section-top h2,.story__heading h2,.home-closing h2,.gallery-band__head h2').forEach(el=>{
        gsap.fromTo(el,{y:21},{y:0,duration:.78,ease:'power2.out',clearProps:'transform',scrollTrigger:{trigger:el,start:'top 94%',once:true}});
      });
      if(matchMedia('(min-width: 900px)').matches){
        $$('.story__visual img,.ecosystem__tile img').forEach(img=>{
          gsap.fromTo(img,{yPercent:-3,scale:1.07},{yPercent:3,scale:1.07,ease:'none',scrollTrigger:{trigger:img.parentElement,start:'top bottom',end:'bottom top',scrub:true}});
        });
      }
      $$('.score-row__track i,.progress-card i').forEach(bar=>{
        gsap.fromTo(bar,{scaleX:.02},{scaleX:1,duration:1.15,ease:'power2.out',scrollTrigger:{trigger:bar,start:'top 92%',once:true}});
      });
    }
  }
})();
