/* JOO QUEST. Facts are from published JOO Auezov site sections.
   Runs fully on-device; no form submissions or personal-data collection. */
(() => {
'use strict';
const $=id=>document.getElementById(id), root=$('questRoot');
if(!root)return;
const lang=location.pathname.startsWith('/ru/')?'ru':location.pathname.startsWith('/en/')?'en':'kk';
document.documentElement.lang=lang;
const li={kk:0,ru:1,en:2}[lang], L=a=>a[li], h=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const t={
kk:{back:'САЙТҚА ҚАЙТУ',skip:'Негізгі мазмұнға өту',eyebrow:'JOO HIGH SCHOOL / INTERACTIVE EXPERIENCE',big:'МЕКТЕПТІ',accent:'ТАНЫ.',lead:'JOO әлеміне кір. 10 сұраққа жауап бер, мектеп туралы қызықты деректерді аш және өз деңгейіңді біл.',start:'КВЕСТТІ БАСТАУ',meta:['10 СҰРАҚ','3 КЕЗЕҢ','≈ 3 МИНУТ'],step:'СҰРАҚ',pts:'ҰПАЙ',chapters:['МЕКТЕППЕН ТАНЫСУ','ОҚУ ЖОЛЫ','НӘТИЖЕ МЕН МҮМКІНДІК'],correct:'ДҰРЫС ЖАУАП!',wrong:'КЕЛЕСІДЕ СӘТТІЛІК!',next:'КЕЛЕСІ СҰРАҚ',finish:'НӘТИЖЕНІ КӨРУ',hint:'Жауапты таңда. 1–4 пернелерін де пайдалануға болады.',done:'МИССИЯ АЯҚТАЛДЫ',result:'СЕНІҢ',result2:'НӘТИЖЕҢ',desc:'Сен JOO High School туралы көбірек білдің. Жаңа білім — жаңа мүмкіндіктердің бастауы.',out:'100 ҰПАЙДАН',count:'дұрыс жауап / 10',again:'ҚАЙТА ОЙНАУ',share:'БӨЛІСУ',save:'КАРТОЧКАНЫ САҚТАУ',copied:'Нәтиже көшірілді!',failed:'Бөлісу мүмкін болмады.',saveFailed:'Суретті сақтау мүмкін болмады.',shareText:'Мен JOO QUEST орындадым!',caption:'МЕКТЕПТІ ҚАНШАЛЫҚТЫ БІЛЕСІҢ?',alt:'JOO High School мектебінің нақты фотосы'},
ru:{back:'НА САЙТ',skip:'Перейти к содержимому',eyebrow:'JOO HIGH SCHOOL / INTERACTIVE EXPERIENCE',big:'ОТКРОЙ',accent:'JOO.',lead:'Отправляйся в мир JOO. Ответь на 10 вопросов, узнай больше о школе и открой свой уровень.',start:'НАЧАТЬ КВЕСТ',meta:['10 ВОПРОСОВ','3 ЭТАПА','≈ 3 МИНУТЫ'],step:'ВОПРОС',pts:'БАЛЛЫ',chapters:['ЗНАКОМСТВО СО ШКОЛОЙ','ПУТЬ УЧЕНИКА','РЕЗУЛЬТАТЫ И ВОЗМОЖНОСТИ'],correct:'ВЕРНО!',wrong:'В СЛЕДУЮЩИЙ РАЗ ПОЛУЧИТСЯ!',next:'СЛЕДУЮЩИЙ ВОПРОС',finish:'МОЙ РЕЗУЛЬТАТ',hint:'Выбери ответ. Можно использовать клавиши 1–4.',done:'МИССИЯ ЗАВЕРШЕНА',result:'ТВОЙ',result2:'РЕЗУЛЬТАТ',desc:'Теперь ты знаешь больше о JOO High School. Новые знания открывают возможности.',out:'ИЗ 100 БАЛЛОВ',count:'верных ответов / 10',again:'ИГРАТЬ СНОВА',share:'ПОДЕЛИТЬСЯ',save:'СОХРАНИТЬ КАРТОЧКУ',copied:'Результат скопирован!',failed:'Не удалось поделиться.',saveFailed:'Не удалось сохранить изображение.',shareText:'Я прошёл JOO QUEST!',caption:'КАК ХОРОШО ТЫ ЗНАЕШЬ ШКОЛУ?',alt:'Настоящее фото JOO High School'},
en:{back:'BACK TO SITE',skip:'Skip to content',eyebrow:'JOO HIGH SCHOOL / INTERACTIVE EXPERIENCE',big:'DISCOVER',accent:'JOO.',lead:'Enter the world of JOO. Answer 10 questions, unlock real school facts and discover your level.',start:'START THE QUEST',meta:['10 QUESTIONS','3 CHAPTERS','≈ 3 MINUTES'],step:'QUESTION',pts:'POINTS',chapters:['MEET THE SCHOOL','YOUR LEARNING JOURNEY','RESULTS & OPPORTUNITIES'],correct:'CORRECT!',wrong:'BETTER LUCK NEXT TIME!',next:'NEXT QUESTION',finish:'SEE MY RESULT',hint:'Choose an answer. You can also use number keys 1–4.',done:'MISSION COMPLETE',result:'YOUR',result2:'RESULT',desc:'You now know more about JOO High School. Every discovery opens up new possibilities.',out:'OUT OF 100 POINTS',count:'correct answers / 10',again:'PLAY AGAIN',share:'SHARE RESULT',save:'SAVE RESULT CARD',copied:'Result copied!',failed:'Sharing failed.',saveFailed:'Could not save the image.',shareText:'I completed JOO QUEST!',caption:'HOW WELL DO YOU KNOW THE SCHOOL?',alt:'Real JOO High School photo'}
}[lang];
/* item: chapter, image, correct index, localized questions, localized option arrays, localized explanations */
const questions=[
[0,'school-building.webp',1,
['JOO High School Auezov қай қалада орналасқан?','В каком городе находится JOO High School Auezov?','Which city is JOO High School Auezov located in?'],
[['Астана','Алматы','Шымкент','Қарағанды'],['Астана','Алматы','Шымкент','Караганда'],['Astana','Almaty','Shymkent','Karaganda']],
['JOO High School Auezov Алматыда орналасқан.','JOO High School Auezov находится в Алматы.','JOO High School Auezov is located in Almaty.']],
[0,'school-classroom.webp',2,
['JOO Auezov мектебінде қай сыныптар оқиды?','Какие классы охватывает JOO Auezov?','Which grades does JOO Auezov serve?'],
[['1–4','5–9','2–11','10–11'],['1–4','5–9','2–11','10–11'],['1–4','5–9','2–11','10–11']],
['Мектеп сайты 2–11 сыныптарға арналғанын көрсетеді.','Согласно сайту, школа охватывает 2–11 классы.','The school website lists grades 2–11.']],
[0,'school-building.webp',0,
['Мектеп Алматының қай ауданында?','В каком районе Алматы расположена школа?','Which Almaty district is the school in?'],
[['Әуезов','Бостандық','Медеу','Наурызбай'],['Ауэзовский','Бостандыкский','Медеуский','Наурызбайский'],['Auezov','Bostandyk','Medeu','Nauryzbay']],
['Мектеп Әуезов ауданында орналасқан.','Школа находится в Ауэзовском районе.','The school is located in the Auezov district.']],
[1,'school-reception.webp',2,
['2–4 сыныптардың оқу кезеңі қалай аталады?','Как называется этап 2–4 классов?','What is the name of the grades 2–4 stage?'],
[['LAUNCH','EXPLORE','START','FOUNDATION'],['LAUNCH','EXPLORE','START','FOUNDATION'],['LAUNCH','EXPLORE','START','FOUNDATION']],
['Сайтта 2–4 сынып кезеңі START деп аталады.','Этап 2–4 классов на сайте обозначен START.','The site labels grades 2–4 as START.']],
[1,'school-students.webp',1,
['7–9 сыныптардың EXPLORE кезеңінде неге мән беріледі?','Что важно на этапе EXPLORE в 7–9 классах?','What is emphasized in the grades 7–9 EXPLORE stage?'],
[['Тек спорт','Ғылым, IT және жобалар','Тек емтихан','Тек өнер'],['Только спорт','Наука, IT и проекты','Только экзамены','Только искусство'],['Only sports','Science, IT and projects','Only exams','Only art']],
['EXPLORE — ғылым, IT және жобалар арқылы қызығушылықты байқап көру кезеңі.','EXPLORE позволяет пробовать науку, IT и работу над проектами.','EXPLORE lets students try science, IT and project work.']],
[1,'school-corridor.webp',1,
['Сайтта қай оқу кеңістігінің фотосы бар?','Какое учебное пространство показано на фото сайта?','Which learning space is pictured on the site?'],
[['Әуежай','Компьютерлік кабинет','Аквариум','Планетарий'],['Аэропорт','Компьютерный кабинет','Аквариум','Планетарий'],['Airport','Computer lab','Aquarium','Planetarium']],
['Сайтта нақты компьютерлік кабинеттің фотосы бар.','На сайте есть настоящее фото компьютерного кабинета.','The website includes a real photo of a computer lab.']],
[1,'school-classroom.webp',0,
['10–11 сыныптардағы LAUNCH кезеңінің бағыты қандай?','На что нацелен этап LAUNCH в 10–11 классах?','What does the grades 10–11 LAUNCH stage focus on?'],
[['ҰБТ, IELTS және келесі оқу бағыты','Тек ойындар','Тек бастауыш пәндер','Оқу жоқ'],['ЕНТ, IELTS и дальнейший путь','Только игры','Только начальные предметы','Нет обучения'],['UNT, IELTS and next study path','Games only','Primary subjects only','No studies']],
['LAUNCH кезеңінде профиль, ҰБТ, IELTS және келесі оқу бағыты көрсетіледі.','LAUNCH включает профиль, ЕНТ, IELTS и будущий учебный путь.','LAUNCH covers subject pathways, UNT, IELTS and future studies.']],
[2,'school-reception.webp',2,
['Қабылдау туралы ақпарат қай бөлімде?','В каком разделе искать информацию о поступлении?','Which section contains admissions information?'],
[['Нәтижелер','Жаңалықтар','Қабылдау','Өмір'],['Результаты','Новости','Поступление','Жизнь школы'],['Results','News','Admissions','School life']],
['«Қабылдау» бөлімінде мектепке түсу және байланыс жолдары көрсетілген.','Раздел «Поступление» объясняет, как обратиться в школу.','The Admissions section explains how to contact the school about applying.']],
[2,'school-students.webp',1,
['Сайттағы ҰБТ нәтижелері қанша ұсынылған оқушы постеріне негізделген?','По скольким предоставленным постерам учеников показаны результаты ЕНТ?','How many supplied student posters underpin the displayed UNT results?'],
[['3','8','20','50'],['3','8','20','50'],['3','8','20','50']],
['Сайттағы сандар 8 ұсынылған постерге ғана қатысты — бүкіл мектепке емес.','Цифры основаны на 8 постерах, а не на статистике всей школы.','The figures reflect 8 supplied posters, not the whole school.']],
[2,'school-students.webp',2,
['Осы 8 постердегі ең жоғары көрсетілген ҰБТ ұпайы қандай?','Какой максимальный балл ЕНТ указан среди этих 8 постеров?','What is the highest displayed UNT score among those 8 posters?'],
[['100','115','121','140'],['100','115','121','140'],['100','115','121','140']],
['Осы постерлер арасындағы ең жоғары нәтиже — 121 балл.','Максимальный показанный результат среди этих постеров — 121 балл.','The highest displayed result among these posters is 121 points.']]
];
const state={step:0,correct:0,selected:null,screen:'intro'},points=()=>state.correct*10;
const url=l=>l==='kk'?'/quest.html':'/'+l+'/quest.html';
function setup(){
 const langs=$('questLocales');langs.innerHTML=['kk','ru','en'].map(l=>'<a href="'+url(l)+'" hreflang="'+l+'"'+(l===lang?' aria-current="page"':'')+'>'+({kk:'ҚАЗ',ru:'РУС',en:'ENG'}[l])+'</a>').join('');
 $('questBack').textContent=t.back;$('questBack').href=lang==='kk'?'/':'/'+lang+'/';
 document.querySelector('.quest-skip').textContent=t.skip;
 $('questFooter').textContent='JOO HIGH SCHOOL • AUEZOV';
}
function view(html,id){root.innerHTML=html;$(id)?.focus({preventScroll:true});}
function intro(){
 state.screen='intro';state.step=0;state.correct=0;state.selected=null;
 view('<section class="quest-intro" aria-labelledby="introTitle"><div class="quest-intro-copy"><div class="quest-kicker">'+h(t.eyebrow)+'</div><h1 id="introTitle" tabindex="-1" class="quest-display">'+h(t.big)+'<span>'+h(t.accent)+'</span></h1><p class="quest-lead">'+h(t.lead)+'</p><button class="quest-button" id="startQuest">'+h(t.start)+' <span aria-hidden="true">↗</span></button><div class="quest-micro">'+t.meta.map(s=>'<span>'+h(s)+'</span>').join('')+'</div></div><div class="quest-intro-art"><img src="/assets/images/v28/school-lounge.webp" width="1448" height="1086" alt="'+h(t.alt)+'"><div class="quest-photo-caption"><span>JOO AUEZOV / ALMATY</span><b>01—10</b></div></div></section>','introTitle');
 $('startQuest').addEventListener('click',()=>{state.screen='question';question();});
}
function question(){
 state.screen='question';
 const q=questions[state.step],picked=state.selected!==null;
 const choices=L(q[4]).map((s,i)=>{
  let cls='quest-option';
  if(picked)cls+=i===q[2]?' is-correct':i===state.selected?' is-wrong':' is-dimmed';
  return '<button class="'+cls+'" type="button" data-answer="'+i+'"'+(picked?' disabled':'')+'><b aria-hidden="true">'+(i+1)+'</b><span>'+h(s)+'</span></button>';
 }).join('');
 const feedback=picked?'<div class="quest-feedback" role="status"><strong>'+h(state.selected===q[2]?t.correct:t.wrong)+'</strong><p>'+h(L(q[5]))+'</p></div><button class="quest-button" id="nextQuestion">'+h(state.step===9?t.finish:t.next)+' <span aria-hidden="true">→</span></button>':'<p class="quest-hint">'+h(t.hint)+'</p>';
 view('<div class="quest-topline"><div class="quest-counter"><span>'+String(state.step+1).padStart(2,'0')+'</span> / 10 <small style="font:700 11px Inter,sans-serif;color:#b7cadf">'+h(t.step)+'</small></div><div class="quest-points">'+h(t.pts)+' '+points()+' / 100</div></div><div class="quest-progress" role="progressbar" aria-label="'+h(t.step)+'" aria-valuemin="0" aria-valuemax="10" aria-valuenow="'+state.step+'"><div class="quest-progress-fill" style="width:'+(state.step*10)+'%"></div></div><section class="quest-question" aria-labelledby="questionTitle"><div class="quest-question-main"><div class="quest-chapter">0'+(q[0]+1)+' / '+h(t.chapters[q[0]])+'</div><h1 id="questionTitle" tabindex="-1">'+h(L(q[3]))+'</h1><div class="quest-options" role="group" aria-label="'+h(t.step)+' '+(state.step+1)+'">'+choices+'</div>'+feedback+'</div><div class="quest-picture"><img src="/assets/images/v28/'+h(q[1])+'" width="1448" height="1086" loading="lazy" alt="'+h(t.alt)+'"><div><span>JOO / SCHOOL EXPERIENCE</span><strong>'+h(t.chapters[q[0]])+'</strong></div></div></section>','questionTitle');
 root.querySelectorAll('[data-answer]').forEach(b=>b.addEventListener('click',()=>choose(Number(b.dataset.answer))));
 if(picked){$('nextQuestion').addEventListener('click',next);$('nextQuestion').focus({preventScroll:true});}
}
function choose(n){
 if(state.screen!=='question'||state.selected!==null||!Number.isInteger(n)||n<0||n>3)return;
 state.selected=n;if(n===questions[state.step][2])state.correct++;question();
}
function next(){
 if(state.screen!=='question'||state.selected===null)return;
 if(state.step===9){result();return;}
 state.step++;state.selected=null;question();
}
const level=()=>points()>=90?3:points()>=70?2:points()>=50?1:0;
const ranks=['JOO ROOKIE','JOO EXPLORER','JOO EXPERT','JOO LEGEND'];
function result(){
 state.screen='result';
 view('<section class="quest-result" aria-labelledby="resultTitle"><div><div class="quest-kicker">'+h(t.done)+'</div><h1 id="resultTitle" tabindex="-1">'+h(t.result)+'<br><em>'+h(t.result2)+'</em></h1><p>'+h(t.desc)+'</p><div class="quest-badge">'+ranks[level()]+'</div><div class="quest-result-actions"><button class="quest-button" id="saveResult">'+h(t.save)+' ↓</button><button class="quest-button quest-button--outline" id="shareResult">'+h(t.share)+' ↗</button><button class="quest-button quest-button--outline" id="replayQuest">'+h(t.again)+' ↺</button></div></div><div><div class="quest-score-ring" style="--score:'+points()+'" role="img" aria-label="'+points()+' '+h(t.out)+'"><div class="quest-score-center"><strong>'+points()+'</strong><small>'+h(t.out)+'</small></div></div><div class="quest-result-stat">'+state.correct+' '+h(t.count)+'</div></div></section>','resultTitle');
 $('replayQuest').addEventListener('click',intro);$('shareResult').addEventListener('click',share);$('saveResult').addEventListener('click',save);
}
function toast(s){
 document.querySelector('.quest-toast')?.remove();
 const n=document.createElement('div');n.className='quest-toast';n.role='status';n.textContent=s;document.body.appendChild(n);
 document.addEventListener('pointerdown',()=>n.remove(),{once:true});
}
function share(){
 const msg=t.shareText+' '+points()+'/100 · '+ranks[level()],link=location.origin+url(lang);
 if(navigator.share)navigator.share({title:'JOO QUEST',text:msg,url:link}).catch(e=>{if(e.name!=='AbortError')toast(t.failed);});
 else if(navigator.clipboard?.writeText)navigator.clipboard.writeText(msg+' '+link).then(()=>toast(t.copied)).catch(()=>toast(t.failed));
 else window.prompt(t.shareText,msg+' '+link);
}
function save(){
 try{
 const cv=document.createElement('canvas');cv.width=1080;cv.height=1600;const g=cv.getContext('2d');if(!g)throw Error('no canvas');
 const bg=g.createLinearGradient(0,0,1080,1600);bg.addColorStop(0,'#153e61');bg.addColorStop(.6,'#071c37');bg.addColorStop(1,'#040f22');g.fillStyle=bg;g.fillRect(0,0,1080,1600);
 g.strokeStyle='#f6d47d';g.lineWidth=5;g.strokeRect(55,55,970,1490);
 g.fillStyle='#f6d47d';g.font='bold 48px Inter,Arial';g.fillText('JOO.',110,170);g.fillStyle='#bbcede';g.font='24px Inter,Arial';g.fillText('HIGH SCHOOL / AUEZOV',110,220);
 g.fillStyle='#f6d47d';g.font='bold 28px Inter,Arial';g.fillText('QUEST COMPLETED',110,450);
 g.fillStyle='#fff';g.font='bold 300px Oswald,Impact,sans-serif';g.fillText(String(points()),100,790);
 g.fillStyle='#f6d47d';g.font='bold 38px Inter,Arial';g.fillText('/ 100 POINTS',110,870);
 g.fillStyle='#fff';g.font='bold 67px Oswald,Impact,sans-serif';g.fillText(ranks[level()],110,1040);
 g.fillStyle='#d5e1ed';g.font='28px Inter,Arial';g.fillText(t.caption,110,1140);
 g.strokeStyle='#71859f';g.lineWidth=2;g.beginPath();g.moveTo(110,1240);g.lineTo(970,1240);g.stroke();
 g.fillStyle='#f6d47d';g.font='bold 31px Inter,Arial';g.fillText('JOO-AUEZOV.NETLIFY.APP/QUEST',110,1320);
 g.fillStyle='#b7c8dc';g.font='24px Inter,Arial';g.fillText('JOO HIGH SCHOOL  •  ALMATY',110,1435);
 const a=document.createElement('a');a.href=cv.toDataURL('image/png');a.download='JOO-QUEST-'+points()+'-points.png';document.body.appendChild(a);a.click();a.remove();
 }catch(_){toast(t.saveFailed);}
}
document.addEventListener('keydown',e=>{
 if(state.screen!=='question'||state.selected!==null||e.ctrlKey||e.metaKey||e.altKey||e.repeat)return;
 const n=/^[1-4]$/.test(e.key)?Number(e.key)-1:['a','b','c','d'].indexOf(e.key.toLowerCase());
 if(n>=0){e.preventDefault();choose(n);}
});
setup();intro();
})();