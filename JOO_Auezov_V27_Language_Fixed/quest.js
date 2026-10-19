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
kk:{back:'САЙТҚА ҚАЙТУ',skip:'Негізгі мазмұнға өту',eyebrow:'JOO HIGH SCHOOL / INTERACTIVE EXPERIENCE',big:'МЕКТЕПТІ',accent:'ТАНЫ.',lead:'JOO әлеміне кір. 10 сұраққа жауап бер, мектеп туралы қызықты деректерді аш және өз деңгейіңді біл.',start:'КВЕСТТІ БАСТАУ',meta:['10 СҰРАҚ','3 КЕЗЕҢ','≈ 3 МИНУТ'],step:'СҰРАҚ',pts:'ҰПАЙ',chapters:['МЕКТЕППЕН ТАНЫСУ','ОҚУ ЖОЛЫ','НӘТИЖЕ МЕН МҮМКІНДІК'],correct:'ДҰРЫС ЖАУАП!',wrong:'КЕЛЕСІДЕ СӘТТІЛІК!',next:'КЕЛЕСІ СҰРАҚ',finish:'НӘТИЖЕНІ КӨРУ',hint:'Жауапты таңда. 1–4 пернелерін де пайдалануға болады.',done:'МИССИЯ АЯҚТАЛДЫ',result:'СЕНІҢ',result2:'НӘТИЖЕҢ',desc:'Сен JOO High School туралы көбірек білдің. Жаңа білім — жаңа мүмкіндіктердің бастауы.',out:'100 ҰПАЙДАН',count:'дұрыс жауап / 10',again:'ҚАЙТА ОЙНАУ',share:'БӨЛІСУ',save:'КАРТОЧКАНЫ САҚТАУ',copied:'Нәтиже көшірілді!',failed:'Бөлісу мүмкін болмады.',saveFailed:'Суретті сақтау мүмкін болмады.',shareText:'Мен JOO QUEST орындадым!',caption:'МЕКТЕПТІ ҚАНШАЛЫҚТЫ БІЛЕСІҢ?',soundOn:'ДЫБЫС ҚОСУЛЫ',soundOff:'ДЫБЫС ӨШІРУЛІ',shotMade:'ДӘЛ ТҮСТІ!',shotMissed:'МҮЛТ КЕТТІ!',combo:'ҚАТАРЫНАН ДҰРЫС',best:'ЕҢ ҰЗАҚ СЕРИЯ',accuracy:'ДӘЛДІК',chaptersResult:'КЕЗЕҢДЕР БОЙЫНША НӘТИЖЕ',heat:'ON FIRE!',board:'ОЙЫН ТАБЛОСЫ',scoreLabel:'ҰПАЙ',streakLabel:'СЕРИЯ',shotLabel:'ЛАҚТЫРУ',perfectShot:'ДӘЛ ТҮСТІ',missShot:'МҮЛТ КЕТТІ',notPlayed:'КЕЗЕК КҮТУДЕ',fireReady:'FIREBALL ҚОСЫЛДЫ',fireMax:'INFERNO РЕЖИМІ',shooting:'ЛАҚТЫРУ ОРЫНДАЛУДА…',mvp:'JOO MVP',allStar:'JOO ALL-STAR',rising:'JOO RISING STAR',rookie:'JOO ROOKIE',award:'ОЙЫНШЫ МАРАПАТЫ',awardDesc:'Мектеп туралы біліміңді көрсеттің!',slowmo:'SLOW MOTION',arenaLabel:'АРЕНА',arenaNames:['МЕКТЕП АЛАҢЫ','БІЛІМ АРЕНАСЫ','ЧЕМПИОНДАР АРЕНАСЫ'],shots:['ЖАЙ ЛАҚТЫРУ','ҮШ ҰПАЙЛЫҚ','SLAM DUNK'],half:'ҮЗІЛІС ШОУЫ',halfEnd:'КЕЗЕҢ АЯҚТАЛДЫ',halfProgress:'КЕЗЕҢДЕГІ ДҰРЫС ЖАУАП',halfTotal:'ЖАЛПЫ ҰПАЙ',halfNext:'КЕЛЕСІ АРЕНА',halfContinue:'ЖАЛҒАСТЫРУ',achTitle:'ЖЕТІСТІКТЕР',achButton:'МЕНІҢ ЖЕТІСТІКТЕРІМ',achCollection:'МАРАПАТТАР КОЛЛЕКЦИЯСЫ',achBack:'КВЕСТКЕ ҚАЙТУ',achNew:'ЖАҢА!',achGot:'АЛЫНДЫ',achLocked:'ӘЛІ АЛЫНҒАН ЖОҚ',achNow:'ОСЫ ОЙЫНДАҒЫ ЖЕТІСТІКТЕР',achSaved:'БРАУЗЕРДЕ САҚТАЛҒАН',achNames:['АЛҒАШҚЫ ДӘЛ ЛАҚТЫРУ','FIREBALL MASTER','МЕРГЕН ОЙЫНШЫ','PERFECT SHOOTER','ARENA CHAMPION'],achDetails:['Кемінде 1 сұраққа дұрыс жауап бер','5 сұраққа қатарынан дұрыс жауап бер','10 сұрақтың кемінде 8-іне дұрыс жауап бер','Барлық 10 сұраққа дұрыс жауап бер','Үш аренаны толық аяқта'],difficulties:['ЖЕҢІЛ','ОРТАША','ҚИЫН'],sourceText:'ДЕРЕККӨЗІ',alt:'JOO High School мектебінің нақты фотосы'},
ru:{back:'НА САЙТ',skip:'Перейти к содержимому',eyebrow:'JOO HIGH SCHOOL / INTERACTIVE EXPERIENCE',big:'ОТКРОЙ',accent:'JOO.',lead:'Отправляйся в мир JOO. Ответь на 10 вопросов, узнай больше о школе и открой свой уровень.',start:'НАЧАТЬ КВЕСТ',meta:['10 ВОПРОСОВ','3 ЭТАПА','≈ 3 МИНУТЫ'],step:'ВОПРОС',pts:'БАЛЛЫ',chapters:['ЗНАКОМСТВО СО ШКОЛОЙ','ПУТЬ УЧЕНИКА','РЕЗУЛЬТАТЫ И ВОЗМОЖНОСТИ'],correct:'ВЕРНО!',wrong:'В СЛЕДУЮЩИЙ РАЗ ПОЛУЧИТСЯ!',next:'СЛЕДУЮЩИЙ ВОПРОС',finish:'МОЙ РЕЗУЛЬТАТ',hint:'Выбери ответ. Можно использовать клавиши 1–4.',done:'МИССИЯ ЗАВЕРШЕНА',result:'ТВОЙ',result2:'РЕЗУЛЬТАТ',desc:'Теперь ты знаешь больше о JOO High School. Новые знания открывают возможности.',out:'ИЗ 100 БАЛЛОВ',count:'верных ответов / 10',again:'ИГРАТЬ СНОВА',share:'ПОДЕЛИТЬСЯ',save:'СОХРАНИТЬ КАРТОЧКУ',copied:'Результат скопирован!',failed:'Не удалось поделиться.',saveFailed:'Не удалось сохранить изображение.',shareText:'Я прошёл JOO QUEST!',caption:'КАК ХОРОШО ТЫ ЗНАЕШЬ ШКОЛУ?',soundOn:'ЗВУК ВКЛЮЧЕН',soundOff:'ЗВУК ВЫКЛЮЧЕН',shotMade:'ПОПАДАНИЕ!',shotMissed:'ПРОМАХ!',combo:'СЕРИЯ ПОПАДАНИЙ',best:'ЛУЧШАЯ СЕРИЯ',accuracy:'ТОЧНОСТЬ',chaptersResult:'РЕЗУЛЬТАТЫ ПО ЭТАПАМ',heat:'ON FIRE!',board:'ИГРОВОЕ ТАБЛО',scoreLabel:'СЧЁТ',streakLabel:'СЕРИЯ',shotLabel:'БРОСОК',perfectShot:'ПОПАДАНИЕ',missShot:'ПРОМАХ',notPlayed:'НЕ СЫГРАНО',fireReady:'РЕЖИМ FIREBALL',fireMax:'РЕЖИМ INFERNO',shooting:'БРОСОК ВЫПОЛНЯЕТСЯ…',mvp:'JOO MVP',allStar:'JOO ALL-STAR',rising:'JOO RISING STAR',rookie:'JOO ROOKIE',award:'НАГРАДА ИГРОКА',awardDesc:'Ты показал свои знания о школе!',slowmo:'SLOW MOTION',arenaLabel:'АРЕНА',arenaNames:['ШКОЛЬНАЯ ПЛОЩАДКА','АКАДЕМИЧЕСКАЯ АРЕНА','АРЕНА ЧЕМПИОНОВ'],shots:['ОБЫЧНЫЙ БРОСОК','ТРЁХОЧКОВЫЙ','SLAM DUNK'],half:'ШОУ В ПЕРЕРЫВЕ',halfEnd:'ЭТАП ЗАВЕРШЁН',halfProgress:'ВЕРНЫХ ОТВЕТОВ НА ЭТАПЕ',halfTotal:'ОБЩИЙ СЧЁТ',halfNext:'СЛЕДУЮЩАЯ АРЕНА',halfContinue:'ПРОДОЛЖИТЬ',achTitle:'ДОСТИЖЕНИЯ',achButton:'МОИ ДОСТИЖЕНИЯ',achCollection:'КОЛЛЕКЦИЯ НАГРАД',achBack:'НАЗАД К КВЕСТУ',achNew:'НОВОЕ!',achGot:'ПОЛУЧЕНО',achLocked:'ПОКА НЕ ОТКРЫТО',achNow:'НАГРАДЫ ЗА ЭТУ ИГРУ',achSaved:'СОХРАНЕНО В БРАУЗЕРЕ',achNames:['ПЕРВОЕ ПОПАДАНИЕ','FIREBALL MASTER','МЕТКИЙ СТРЕЛОК','PERFECT SHOOTER','ARENA CHAMPION'],achDetails:['Ответь правильно хотя бы один раз','Дай 5 правильных ответов подряд','Ответь верно хотя бы на 8 из 10 вопросов','Ответь верно на все 10 вопросов','Пройди все три арены'],difficulties:['ЛЕГКО','СРЕДНИЙ','СЛОЖНО'],sourceText:'ИСТОЧНИК',alt:'Настоящее фото JOO High School'},
en:{back:'BACK TO SITE',skip:'Skip to content',eyebrow:'JOO HIGH SCHOOL / INTERACTIVE EXPERIENCE',big:'DISCOVER',accent:'JOO.',lead:'Enter the world of JOO. Answer 10 questions, unlock real school facts and discover your level.',start:'START THE QUEST',meta:['10 QUESTIONS','3 CHAPTERS','≈ 3 MINUTES'],step:'QUESTION',pts:'POINTS',chapters:['MEET THE SCHOOL','YOUR LEARNING JOURNEY','RESULTS & OPPORTUNITIES'],correct:'CORRECT!',wrong:'BETTER LUCK NEXT TIME!',next:'NEXT QUESTION',finish:'SEE MY RESULT',hint:'Choose an answer. You can also use number keys 1–4.',done:'MISSION COMPLETE',result:'YOUR',result2:'RESULT',desc:'You now know more about JOO High School. Every discovery opens up new possibilities.',out:'OUT OF 100 POINTS',count:'correct answers / 10',again:'PLAY AGAIN',share:'SHARE RESULT',save:'SAVE RESULT CARD',copied:'Result copied!',failed:'Sharing failed.',saveFailed:'Could not save the image.',shareText:'I completed JOO QUEST!',caption:'HOW WELL DO YOU KNOW THE SCHOOL?',soundOn:'SOUND ON',soundOff:'SOUND OFF',shotMade:'SWISH!',shotMissed:'MISSED!',combo:'HIT STREAK',best:'BEST STREAK',accuracy:'ACCURACY',chaptersResult:'RESULTS BY CHAPTER',heat:'ON FIRE!',board:'LIVE SCOREBOARD',scoreLabel:'SCORE',streakLabel:'STREAK',shotLabel:'SHOT',perfectShot:'MADE',missShot:'MISSED',notPlayed:'UPCOMING',fireReady:'FIREBALL ACTIVE',fireMax:'INFERNO MODE',shooting:'SHOT IN PROGRESS…',mvp:'JOO MVP',allStar:'JOO ALL-STAR',rising:'JOO RISING STAR',rookie:'JOO ROOKIE',award:'PLAYER AWARD',awardDesc:'You showed what you know about the school!',slowmo:'SLOW MOTION',arenaLabel:'ARENA',arenaNames:['SCHOOL COURT','ACADEMIC LAB','CHAMPIONS DOME'],shots:['JUMP SHOT','3-POINT SHOT','SLAM DUNK'],half:'HALFTIME SHOW',halfEnd:'CHAPTER COMPLETE',halfProgress:'CORRECT IN THIS CHAPTER',halfTotal:'TOTAL SCORE',halfNext:'NEXT ARENA',halfContinue:'CONTINUE',achTitle:'ACHIEVEMENTS',achButton:'MY ACHIEVEMENTS',achCollection:'TROPHY COLLECTION',achBack:'BACK TO QUEST',achNew:'NEW!',achGot:'UNLOCKED',achLocked:'NOT YET UNLOCKED',achNow:'EARNED THIS GAME',achSaved:'SAVED IN THIS BROWSER',achNames:['FIRST BUCKET','FIREBALL MASTER','SHARP SHOOTER','PERFECT SHOOTER','ARENA CHAMPION'],achDetails:['Answer at least one question correctly','Get 5 correct answers in a row','Answer at least 8 of 10 questions correctly','Answer all 10 questions correctly','Finish all three arenas'],difficulties:['EASY','MEDIUM','HARD'],sourceText:'SOURCE',alt:'Real JOO High School photo'}
}[lang];
/* item: chapter, image, correct index, localized questions, localized option arrays, localized explanations */
/* Difficulty progression: EASY (1–3), MEDIUM (4–7), HARD (8–10).
   Question explanations cite sources; group-wide and branch-specific figures stay separate.
   Data shape: [chapter, image, correctIndex, translatedQuestion, translatedOptions, translatedExplanation, sourceURL]. */
const questions=[
 [
  0,
  "school-building.webp",
  1,
  [
   "JOO School Auezov Алматының қай көшесінде орналасқан?",
   "На какой улице Алматы находится JOO School Auezov?",
   "On which street in Almaty is JOO School Auezov located?"
  ],
  [
   [
    "Халиуллин көшесі",
    "Цветочная көшесі",
    "Төле би көшесі",
    "Бәйдібек би даңғылы"
   ],
   [
    "Улица Халиуллина",
    "Цветочная улица",
    "Улица Толе би",
    "Проспект Байдибек би"
   ],
   [
    "Khaliullin Street",
    "Tsvetochnaya Street",
    "Tole Bi Street",
    "Baidibek Bi Avenue"
   ]
  ],
  [
   "Auezov филиалының мекенжайы: Алматы, Цветочная көшесі, 1/14.",
   "Адрес филиала Auezov: Алматы, улица Цветочная, 1/14.",
   "The Auezov branch address is 1/14 Tsvetochnaya Street, Almaty."
  ],
  "https://joo-schools.kz/"
 ],
 [
  0,
  "school-reception.webp",
  2,
  [
   "JOO School Auezov қай жылы құрылған?",
   "В каком году была основана JOO School Auezov?",
   "In what year was JOO School Auezov founded?"
  ],
  [
   [
    "2018",
    "2020",
    "2022",
    "2024"
   ],
   [
    "2018",
    "2020",
    "2022",
    "2024"
   ],
   [
    "2018",
    "2020",
    "2022",
    "2024"
   ]
  ],
  [
   "Ауезов мектебінің ресми парағында негізі 2022 жылы қаланғаны жазылған.",
   "Официальная страница школы указывает год основания — 2022.",
   "The Auezov school’s official page states it was founded in 2022."
  ],
  "https://joohs.kz/jooauezov"
 ],
 [
  0,
  "school-students.webp",
  1,
  [
   "JOO мектебінің ресми сипаттамасында форма ретінде не беріледі?",
   "Какие предметы школьной формы указаны на официальной странице JOO?",
   "Which uniform items does JOO list on its official page?"
  ],
  [
   [
    "Көйлек пен галстук",
    "Поло мен бомбер",
    "Костюм мен жилет",
    "Бірдей спорт костюмі"
   ],
   [
    "Рубашка и галстук",
    "Поло и бомбер",
    "Костюм и жилет",
    "Одинаковый спортивный костюм"
   ],
   [
    "Shirt and tie",
    "Polo shirt and bomber jacket",
    "Suit and vest",
    "Matching tracksuit"
   ]
  ],
  [
   "Ресми FAQ бойынша мектеп формасы ретінде поло мен бомбер беріледі, ал күнделікті киім стилі — Smart Casual.",
   "По официальному FAQ выдаются поло и бомбер; повседневный стиль одежды — Smart Casual.",
   "The official FAQ lists a polo shirt and bomber jacket, with Smart Casual as the usual dress style."
  ],
  "https://joohs.kz/jooauezov"
 ],
 [
  1,
  "school-classroom.webp",
  0,
  [
   "JOO Auezov-та 5–6 сыныптар үшін қандай пәндерге басымдық беріледі?",
   "На каких предметах делают акцент в 5–6 классах JOO Auezov?",
   "Which subjects are emphasized for grades 5–6 at JOO Auezov?"
  ],
  [
   [
    "Математика мен ағылшын тілі",
    "Тек ҰБТ тесттері",
    "Университет гранттары",
    "Тек спорттық дайындық"
   ],
   [
    "Математика и английский язык",
    "Только тесты ЕНТ",
    "Гранты университетов",
    "Только спортивная подготовка"
   ],
   [
    "Mathematics and English",
    "Only UNT practice tests",
    "University grants",
    "Only sports training"
   ]
  ],
  [
   "5–6 сыныптарда математика мен ағылшын тіліне басымдық беріліп, НЗМ/БИЛ бағытындағы дайындық қарастырылған.",
   "В 5–6 классах внимание уделяется математике, английскому и подготовке к НИШ/БИЛ.",
   "Grades 5–6 focus on mathematics and English, including preparation for NIS/BIL entry."
  ],
  "https://joo-schools.kz/"
 ],
 [
  1,
  "school-students.webp",
  3,
  [
   "JOO AUEZ UMIT жобасының негізгі бағыты қандай?",
   "Чему посвящён проект JOO AUEZ UMIT?",
   "What is the main purpose of JOO AUEZ UMIT?"
  ],
  [
   [
    "Спорттық рейтинг жасау",
    "Мектепке құжат қабылдау",
    "ҰБТ балын есептеу",
    "Еріктілік пен қоғамға пайдалы іс"
   ],
   [
    "Спортивный рейтинг",
    "Приём документов",
    "Подсчёт баллов ЕНТ",
    "Волонтёрство и общественно полезные дела"
   ],
   [
    "Sports rankings",
    "Processing applications",
    "Calculating UNT scores",
    "Volunteering and community service"
   ]
  ],
  [
   "JOO AUEZ UMIT — оқушылардың жауапкершілігін дамытатын еріктілік және қоғамға пайдалы іс бағыты.",
   "JOO AUEZ UMIT — направление волонтёрства и полезной для общества деятельности.",
   "JOO AUEZ UMIT is a student volunteering and community service initiative."
  ],
  "/student-life.html"
 ],
 [
  1,
  "/assets/images/computerlab-800.webp",
  2,
  [
   "JOO оқу бағдарламасындағы PBL әдісі қалай жүзеге асады?",
   "Как проходит обучение по методу PBL в JOO?",
   "How does JOO use the PBL approach?"
  ],
  [
   [
    "Тек дайын мәтінді жаттау",
    "Тек дәріс тыңдау",
    "Мәселені зерттеп, жоба жасап, қорғау",
    "Сабаққа қатыспай тест тапсыру"
   ],
   [
    "Только заучивать текст",
    "Только слушать лекции",
    "Исследовать проблему, создать и защитить проект",
    "Сдавать тесты без занятий"
   ],
   [
    "Only memorizing notes",
    "Only listening to lectures",
    "Researching problems, creating and presenting projects",
    "Taking tests without lessons"
   ]
  ],
  [
   "PBL оқушыларды мәселені зерттеп, өз шешімін жоба түрінде жасап, оны қорғауға үйретеді.",
   "PBL предполагает исследование проблемы, создание проекта и его защиту.",
   "PBL involves investigating problems, developing a project and presenting the solution."
  ],
  "/academics.html"
 ],
 [
  1,
  "school-reception.webp",
  1,
  [
   "Оқушыға мамандық пен оқу бағытын таңдауға JOO-да кім көмектеседі?",
   "Кто помогает ученику JOO выбрать профессию и направление учёбы?",
   "Who helps JOO students choose a career and study pathway?"
  ],
  [
   [
    "Спорт жаттықтырушысы",
    "Профориентатор",
    "Кітапханашы",
    "Күзет қызметкері"
   ],
   [
    "Спортивный тренер",
    "Профориентатор",
    "Библиотекарь",
    "Сотрудник охраны"
   ],
   [
    "Sports coach",
    "Career guidance specialist",
    "Librarian",
    "Security officer"
   ]
  ],
  [
   "Мектептегі профориентаторлар оқушының қабілеті мен қызығушылығын ескеріп, мамандық таңдауға көмектеседі.",
   "Профориентаторы помогают выбрать профессию с учётом способностей и интересов ученика.",
   "Career guidance specialists help students choose paths based on their abilities and interests."
  ],
  "https://joohs.kz/jooauezov"
 ],
 [
  2,
  "school-classroom.webp",
  1,
  [
   "JOO оқу бағдарламасында 10–11 сыныптағы 90 минуттық сабақ қалай бөлінеді?",
   "Как в программе JOO делится 90-минутное занятие в 10–11 классах?",
   "How does JOO divide a 90-minute lesson for grades 10–11?"
  ],
  [
   [
    "60 минут теория, 30 минут практика",
    "45 минут теория, 45 минут практика",
    "30 минут теория, 60 минут практика",
    "90 минут тек теория"
   ],
   [
    "60 минут теории, 30 практики",
    "45 минут теории, 45 практики",
    "30 минут теории, 60 практики",
    "90 минут только теории"
   ],
   [
    "60 minutes theory, 30 practice",
    "45 minutes theory, 45 practice",
    "30 minutes theory, 60 practice",
    "90 minutes of theory only"
   ]
  ],
  [
   "JOO бағдарламасының сипаттамасында 90 минуттық сабақ 45 минут теория және 45 минут практикадан тұрады.",
   "В описании программы JOO 90-минутный урок состоит из 45 минут теории и 45 минут практики.",
   "JOO's program describes 90 minutes as 45 minutes of theory and 45 minutes of practice."
  ],
  "https://joo-schools.kz/"
 ],
 [
  2,
  "school-students.webp",
  2,
  [
   "JOO Auezov сайтындағы грант қорытындысында қанша мемлекеттік грант көрсетілген?",
   "Сколько государственных грантов показано в итогах JOO Auezov на сайте?",
   "How many state grants are shown in the JOO Auezov website results?"
  ],
  [
   [
    "8",
    "12",
    "25",
    "137"
   ],
   [
    "8",
    "12",
    "25",
    "137"
   ],
   [
    "8",
    "12",
    "25",
    "137"
   ]
  ],
  [
   "«Нәтижелер» бөлімінде 25 мемлекеттік грант бөлек жарияланған. Бұл көрсеткіш 8 ҰБТ постерінің статистикасымен шатастырылмайды.",
   "Раздел «Результаты» отдельно показывает 25 государственных грантов — не путайте их со статистикой 8 постеров ЕНТ.",
   "The Results section separately lists 25 state grants; this is a different dataset from the eight UNT posters."
  ],
  "/results.html"
 ],
 [
  2,
  "school-students.webp",
  2,
  [
   "ҰБТ нәтижелеріне қатысты қай салыстыру дұрыс?",
   "Какое сравнение результатов ЕНТ верное?",
   "Which comparison of UNT results is correct?"
  ],
  [
   [
    "Ауезов постерлері мен бүкіл желіде ең жоғарысы — 121 балл",
    "Ауезовтың 8 постері — 137, бүкіл желі — 121 балл",
    "Ауезовтың 8 постері — 121, JOO желісі — 137 балл",
    "Екі дереккөзде де ең жоғарысы — 137 балл"
   ],
   [
    "Максимум в постерах Ауэзова и по сети — 121 балл",
    "8 постеров Ауэзова — 137, вся сеть — 121 балл",
    "8 постеров Ауэзова — 121, сеть JOO — 137 баллов",
    "Оба источника показывают максимум 137 баллов"
   ],
   [
    "Both the Auezov posters and network show 121",
    "Auezov's eight posters show 137; the network shows 121",
    "Auezov's eight posters show 121; the JOO network shows 137",
    "Both sources show 137"
   ]
  ],
  [
   "Дұрыс: Ауезов сайтындағы 8 постердің максимумы — 121. JOO School желісі жариялаған 137 балл — жалпы желінің нәтижесі.",
   "Верно: максимум среди 8 постеров Ауэзова — 121. Показатель 137 баллов опубликован по всей сети JOO School.",
   "Correct: the eight Auezov posters peak at 121, while the JOO School network reports a separate 137-point result."
  ],
  "/results.html"
 ]
];
const state={step:0,correct:0,selected:null,screen:'intro',streak:0,bestStreak:0,chapterCorrect:[0,0,0],shots:[],shotReady:true,activeShot:'jump',newAchievements:[]},points=()=>state.correct*10;
const url=l=>l==='kk'?'/quest.html':'/'+l+'/quest.html';
const ACH_KEY='joo-arena-achievements-v1';
const achievementDefs=[
 {id:'first',icon:'🏀',check:()=>state.correct>=1},
 {id:'fireball',icon:'🔥',check:()=>state.bestStreak>=5},
 {id:'sharp',icon:'🎯',check:()=>state.correct>=8},
 {id:'perfect',icon:'🏆',check:()=>state.correct===10},
 {id:'champion',icon:'⭐',check:()=>state.step===9&&state.shotReady}
];
function readAchievements(){
 try{
  const data=JSON.parse(window.localStorage.getItem(ACH_KEY)||'[]');
  return new Set(Array.isArray(data)?data.filter(id=>achievementDefs.some(x=>x.id===id)):[]);
 }catch(_){return new Set();}
}
let savedAchievements=readAchievements();
function saveAchievements(){
 try{window.localStorage.setItem(ACH_KEY,JSON.stringify([...savedAchievements]));}catch(_){}
}
function awardCards(activeSet,newSet=new Set()){
 return achievementDefs.map((a,i)=>{
  const earned=activeSet.has(a.id),fresh=newSet.has(a.id);
  return '<div class="quest-achievement'+(earned?' is-unlocked':' is-locked')+(fresh?' is-new':'')+'">'+
   '<span class="quest-achievement__icon" aria-hidden="true">'+(earned?a.icon:'🔒')+'</span>'+
   '<div class="quest-achievement__copy"><strong>'+h(t.achNames[i])+'</strong><p>'+h(t.achDetails[i])+'</p></div>'+
   '<span class="quest-achievement__state">'+h(fresh?t.achNew:earned?t.achGot:t.achLocked)+'</span></div>';
 }).join('');
}
function gallery(){
 state.screen='gallery';
 savedAchievements=readAchievements();
 view('<section class="quest-gallery" aria-labelledby="galleryTitle"><div class="quest-kicker">JOO ARENA / 7.0</div>'+
 '<h1 id="galleryTitle" tabindex="-1">'+h(t.achCollection)+'</h1>'+
 '<div class="quest-gallery__meta">'+h(t.achSaved)+' · '+savedAchievements.size+' / '+achievementDefs.length+'</div>'+
 '<div class="quest-achievements">'+awardCards(savedAchievements)+'</div>'+
 '<button class="quest-button quest-button--outline" id="closeGallery">'+h(t.achBack)+' ←</button></section>','galleryTitle');
 $('closeGallery').addEventListener('click',intro);
}
function setup(){
 const langs=$('questLocales');langs.innerHTML=['kk','ru','en'].map(l=>'<a href="'+url(l)+'" hreflang="'+l+'"'+(l===lang?' aria-current="page"':'')+'>'+({kk:'ҚАЗ',ru:'РУС',en:'ENG'}[l])+'</a>').join('');
 $('questBack').textContent=t.back;$('questBack').href=lang==='kk'?'/':'/'+lang+'/';
 document.querySelector('.quest-skip').textContent=t.skip;
 $('questFooter').textContent='JOO HIGH SCHOOL • AUEZOV';
}
function view(html,id){root.innerHTML=html;$(id)?.focus({preventScroll:true});}
function intro(){
 state.screen='intro';state.step=0;state.correct=0;state.selected=null;state.streak=0;state.bestStreak=0;state.chapterCorrect=[0,0,0];state.shots=[];state.shotReady=true;state.activeShot='jump';state.newAchievements=[];
 view('<section class="quest-intro" aria-labelledby="introTitle"><div class="quest-intro-copy"><div class="quest-kicker">'+h(t.eyebrow)+'</div><h1 id="introTitle" tabindex="-1" class="quest-display">'+h(t.big)+'<span>'+h(t.accent)+'</span></h1><p class="quest-lead">'+h(t.lead)+'</p><button class="quest-button" id="startQuest">'+h(t.start)+' <span aria-hidden="true">↗</span></button><button class="quest-collection-trigger" id="openGallery" type="button">✦ '+h(t.achButton)+' <span>'+readAchievements().size+' / '+achievementDefs.length+'</span></button><div class="quest-micro">'+t.meta.map(s=>'<span>'+h(s)+'</span>').join('')+'</div></div><div class="quest-intro-art"><img src="/assets/images/v28/school-lounge.webp" width="1448" height="1086" alt="'+h(t.alt)+'"><div class="quest-photo-caption"><span>JOO AUEZOV / ALMATY</span><b>01—10</b></div></div></section>','introTitle');
 $('startQuest').addEventListener('click',()=>{state.screen='question';state.activeShot=selectShot();question();});
 $('openGallery').addEventListener('click',gallery);
}

/* No external audio files: synthesize a low-volume throw, net swish and rim clang. */
let soundOn=true, audio=null;
function playShot(made,durationMs=1450,impactRatio=.75,shot='jump'){
 if(!soundOn)return;
 try{
  const Engine=window.AudioContext||window.webkitAudioContext;if(!Engine)return;
  if(!audio)audio=new Engine();
  if(audio.state==='suspended')audio.resume().catch(()=>{});
  const ctx=audio,at=ctx.currentTime+.008;
  function tone(t,f,to,d,v,type='sine'){
   const o=ctx.createOscillator(),a=ctx.createGain();o.type=type;
   o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(Math.max(30,to),t+d);
   a.gain.setValueAtTime(.0001,t);a.gain.exponentialRampToValueAtTime(v,t+.012);a.gain.exponentialRampToValueAtTime(.0001,t+d);
   o.connect(a);a.connect(ctx.destination);o.start(t);o.stop(t+d+.01);
  }
  function rush(t,d,v,f){
   const n=Math.ceil(ctx.sampleRate*d),b=ctx.createBuffer(1,n,ctx.sampleRate),data=b.getChannelData(0);
   for(let i=0;i<n;i++)data[i]=Math.random()*2-1;
   const src=ctx.createBufferSource(),flt=ctx.createBiquadFilter(),amp=ctx.createGain();
   src.buffer=b;flt.type='bandpass';flt.frequency.value=f;flt.Q.value=.8;
   amp.gain.setValueAtTime(.0001,t);amp.gain.linearRampToValueAtTime(v,t+d*.22);amp.gain.exponentialRampToValueAtTime(.0001,t+d);
   src.connect(flt);flt.connect(amp);amp.connect(ctx.destination);src.start(t);src.stop(t+d+.003);
  }
  const hitAt=at+durationMs*impactRatio/1000;
  tone(at,shot==='dunk'?210:shot==='three'?190:155,90,.11,.07,'triangle');
  rush(at+.12,Math.min(.4,durationMs*.26/1000),shot==='three'?.042:.027,shot==='three'?1390:940);
  if(made){rush(hitAt,shot==='dunk'?.38:.28,shot==='dunk'?.19:.12,2700);tone(hitAt+.10,shot==='dunk'?330:580,790,.18,.065);tone(hitAt+.27,810,1060,.22,.068);}
  else{tone(hitAt,320,170,.15,.078,'triangle');tone(hitAt+.015,530,280,.12,.04,'square');tone(hitAt+.22,175,95,.22,.058);}
 }catch(_){/* Audio permission and API support must not affect quiz operation. */}
}
/* Consistent shot selection; types are visual only, still 10 points per correct answer. */
function selectShot(){
 if(state.step===3||state.step===7||state.step===9)return 'three';
 if(state.streak>=3)return 'dunk';
 return 'jump';
}
const shotIndex=()=>state.activeShot==='three'?1:state.activeShot==='dunk'?2:0;
function scoreboard(){
 const recordedScore=state.shots.reduce((total,made)=>total+(made?10:0),0);
 let recordedStreak=0;
 for(let j=state.shots.length-1;j>=0&&state.shots[j];j--)recordedStreak++;
 const hits=state.shots.map((made,i)=>'<span class="quest-shot-mark '+(made?'is-hit':'is-miss')+'" title="'+h((made?t.perfectShot:t.missShot)+' '+(i+1))+'" aria-label="'+h((made?t.perfectShot:t.missShot)+' '+(i+1))+'">'+(made?'✓':'×')+'</span>');
 for(let i=state.shots.length;i<10;i++)hits.push('<span class="quest-shot-mark is-upcoming" title="'+h(t.notPlayed)+'" aria-hidden="true">·</span>');
 const fire=recordedStreak>=5?'<span class="quest-board-fire is-inferno">🔥 '+h(t.fireMax)+'</span>':recordedStreak>=3?'<span class="quest-board-fire">🔥 '+h(t.fireReady)+'</span>':'';
 const arena=t.arenaNames[questions[state.step][0]];
 const shotTitle=t.shots[shotIndex()];
 const cells=[
  [t.scoreLabel,String(recordedScore).padStart(3,'0')+'<small>/100</small>','score'],
  [t.streakLabel,'×'+recordedStreak,'streak'],
  [t.shotLabel,String(state.step+1).padStart(2,'0')+'<small>/10</small>','shot']
 ].map(([label,value,key])=>'<div class="quest-board-cell quest-board-cell--'+key+'"><small>'+h(label)+'</small><strong>'+value+'</strong></div>').join('');
 return '<section class="quest-scoreboard" aria-label="'+h(t.board)+'">'+
   '<div class="quest-scoreboard__head"><span class="quest-scoreboard__live"><i aria-hidden="true"></i> JOO ARENA <b>6.0</b></span>'+
   '<span class="quest-scoreboard__round">'+h(arena)+' · '+h(shotTitle)+'</span></div>'+
   '<div class="quest-scoreboard__main">'+cells+'<div class="quest-scoreboard__streak">'+fire+
   '<div class="quest-scoreboard__shots" role="group" aria-label="'+h(t.shotLabel)+'">'+hits.join('')+'</div></div></div></section>';
}
function scene(picked,made){
 const chapter=questions[state.step][0];
 const shot=state.activeShot;
 const tier=state.streak>=5?2:state.streak>=3?1:0;
 const fire=made||!picked?tier:0;
 const outcome='is-v5 is-v6 shot--'+shot+' '+(!picked?'is-ready':made?'is-made':'is-missed')+
   (fire?' is-fireball':'')+(fire===2?' is-inferno':'');
 const arena=t.arenaNames[chapter];
 const label=picked?'<div class="quest-court__callout"><b>'+h(made?t.shotMade:t.shotMissed)+'</b><small>'+
   (made?(fire?h(tier===2?t.fireMax:t.fireReady)+' · ':'')+'+10 JOO POINTS':'JOO ARENA / TRY AGAIN')+'</small></div>':'';
 const flames=fire?'<span class="quest-ball__fire" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>':'';
 const slowLabel=(state.step===4||state.step===9)?'<div class="quest-arena-slow" aria-hidden="true">◉ '+h(t.slowmo)+'</div>':'';
 const stateLabel=fire?'<div class="quest-arena-fire-status" aria-hidden="true">'+(fire===2?'INFERNO':'FIREBALL')+' <span>×'+state.streak+'</span></div>':'';
 const architecture='<div class="quest-arena-architecture" aria-hidden="true">'+
  '<span class="quest-arena-architecture__windows"></span>'+
  '<span class="quest-arena-architecture__screen">JOO<span> 0'+(chapter+1)+'</span></span>'+
  '<span class="quest-arena-architecture__arc"></span><span class="quest-arena-architecture__ring"></span>'+
  '<span class="quest-arena-architecture__stars"><i></i><i></i><i></i><i></i><i></i></span></div>';
 const tag='<div class="quest-shot-type shot-type--'+shot+'"><span>'+h(t.arenaLabel)+' 0'+(chapter+1)+'</span><strong>'+h(arena)+'</strong><small>'+h(t.shots[shotIndex()])+'</small></div>';
 return '<div class="quest-court '+outcome+' arena-stage--'+(chapter+1)+'" data-shot="'+shot+'" aria-hidden="true">'+
  architecture+'<div class="quest-arena-sky"><div class="quest-arena-sky__stands"></div><div class="quest-arena-sky__lights"><i></i><i></i><i></i></div>'+
  '<div class="quest-arena-sky__banner">JOO <span>HIGH SCHOOL</span></div></div>'+
  '<div class="quest-court__camera"><div class="quest-court__grid"></div><div class="quest-court__floor"></div>'+
  '<div class="quest-court__lane"><span></span></div>'+
  '<div class="quest-hoop"><div class="quest-hoop__board"></div><div class="quest-hoop__support"></div><div class="quest-hoop__rim"></div>'+
  '<svg class="quest-hoop__net" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false" aria-hidden="true"><path d="M2 2 L98 2 M5 3 L22 96 M28 3 L40 97 M51 3 L50 98 M74 3 L61 97 M95 3 L78 96 M5 25 L94 25 M9 48 L89 48 M14 70 L84 70 M21 93 L79 93"/></svg>'+
  '<div class="quest-hoop__rim-front"></div></div><div class="quest-ball__shadow"></div>'+
  '<div class="quest-ball"><span class="quest-ball__trail"></span>'+flames+'</div>'+
  '<div class="quest-court__sparks"><i></i><i></i><i></i><i></i><i></i></div></div>'+
  '<div class="quest-court__hud"><span>JOO ARENA</span><span>SHOT '+String(state.step+1).padStart(2,'0')+' / 10</span></div>'+
  tag+stateLabel+slowLabel+label+'</div>';
}
function soundControl(){
 return '<button id="questSound" type="button" class="quest-sound-toggle" aria-pressed="'+String(soundOn)+'" aria-label="'+h(soundOn?t.soundOn:t.soundOff)+'">'+
 '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9H2v6h3l5 4V5z"/><path class="quest-sound-waves" d="M14 9c1.5 2 1.5 4 0 6M17 6c3 3.5 3 8.5 0 12"/><path class="quest-sound-strike" d="M14 9l7 7m0-7l-7 7"/></svg>'+
 '<span class="quest-sound-title">'+h(soundOn?t.soundOn:t.soundOff)+'</span></button>';
}

function question(){
 state.screen='question';
 const q=questions[state.step],picked=state.selected!==null,made=picked&&state.selected===q[2];
 const choices=L(q[4]).map((s,i)=>{
  let cls='quest-option';
  if(picked)cls+=i===q[2]?' is-correct':i===state.selected?' is-wrong':' is-dimmed';
  return '<button class="'+cls+'" type="button" data-answer="'+i+'"'+(picked?' disabled':'')+'><b aria-hidden="true">'+(i+1)+'</b><span>'+h(s)+'</span></button>';
 }).join('');
 const source=q[6].startsWith('/')?(lang==='kk'?q[6]:'/'+lang+q[6]):q[6];
 const feedback=picked?'<div class="quest-feedback" role="status"><strong>'+h(state.selected===q[2]?t.correct:t.wrong)+'</strong><p>'+h(L(q[5]))+'</p><a class="quest-fact-source" href="'+h(source)+'" target="_blank" rel="noopener noreferrer">'+h(t.sourceText)+' ↗</a></div><button class="quest-button" id="nextQuestion"'+(state.shotReady?'':' disabled aria-disabled="true"')+'>'+h(state.step===9?t.finish:t.next)+' <span aria-hidden="true">→</span></button>':'<p class="quest-hint">'+h(t.hint)+'</p>';
 view(scoreboard()+'<div class="quest-progress" role="progressbar" aria-label="'+h(t.step)+'" aria-valuemin="0" aria-valuemax="10" aria-valuenow="'+state.step+'"><div class="quest-progress-fill" style="width:'+(state.step*10)+'%"></div></div><section class="quest-question'+(picked?(made?' quest-question--made':' quest-question--missed'):'')+(picked&&!state.shotReady?' quest-question--shooting':'')+'" aria-labelledby="questionTitle"><div class="quest-question-main"><div class="quest-chapter">0'+(q[0]+1)+' / '+h(t.chapters[q[0]])+' <span class="quest-difficulty quest-difficulty--'+q[0]+'">'+h(t.difficulties[q[0]])+'</span></div><h1 id="questionTitle" tabindex="-1">'+h(L(q[3]))+'</h1>'+soundControl()+'<div class="quest-options" role="group" aria-label="'+h(t.step)+' '+(state.step+1)+'">'+choices+'</div>'+feedback+'</div><div class="quest-picture"><img src="'+(q[1].startsWith('/')?h(q[1]):'/assets/images/v28/'+h(q[1]))+'" width="1448" height="1086" loading="lazy" alt="'+h(t.alt)+'">'+scene(picked,made)+'</div></section>','questionTitle');
 root.querySelectorAll('[data-answer]').forEach(b=>b.addEventListener('click',()=>choose(Number(b.dataset.answer))));
 $('questSound')?.addEventListener('click',()=>{
  soundOn=!soundOn;const b=$('questSound');
  b?.setAttribute('aria-pressed',String(soundOn));
  b?.setAttribute('aria-label',soundOn?t.soundOn:t.soundOff);
  const label=b?.querySelector('.quest-sound-title');
  if(label)label.textContent=soundOn?t.soundOn:t.soundOff;
 });
 if(picked){
  $('nextQuestion').addEventListener('click',next);
  if(state.shotReady)$('nextQuestion').focus({preventScroll:true});
  // Mobile users answer above the court: reveal the shot instead of animating offscreen.
  try{
   if(window.matchMedia?.('(max-width: 980px)').matches){
    root.querySelector('.quest-picture')?.scrollIntoView({behavior:'auto',block:'center'});
   }
  }catch(_){}
 }
}
/* JOO ARENA 5.0: measured, responsive shot arcs and rim rebounds.
   Ball + hoop are in the same court coordinate system; WAAPI is a progressive enhancement. */
/* JOO ARENA 6.0: 3 distinct trajectories in the same court coordinates.
   The physics transform is WAAPI-only, with instant reduced-motion fallback. */
function runShot(made){
 const court=root.querySelector('.quest-court');
 const ball=court?.querySelector('.quest-ball');
 const rim=court?.querySelector('.quest-hoop__rim');
 const camera=court?.querySelector('.quest-court__camera');
 const shadow=court?.querySelector('.quest-ball__shadow');
 const shot=state.activeShot;
 const slow=state.step===4||state.step===9;
 const reduced=Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
 const impact=shot==='dunk'?.68:shot==='three'?.81:.75;
 const duration=slow?(shot==='three'?2600:2450):shot==='three'?2000:shot==='dunk'?1720:1450;
 const activeQuestion=state.step;
 let done=false;
 function finish(){
  if(done||state.screen!=='question'||state.step!==activeQuestion)return;
  done=true;
  state.shotReady=true;
  state.shots.push(made);
  const board=root.querySelector('.quest-scoreboard');
  if(board)board.outerHTML=scoreboard();
  root.querySelector('.quest-question')?.classList.remove('quest-question--shooting');
  const nextButton=$('nextQuestion');
  if(nextButton){nextButton.disabled=false;nextButton.removeAttribute('aria-disabled');nextButton.focus({preventScroll:true});}
 }
 if(slow)court?.classList.add('is-slowmo');
 if(court)court.style.setProperty('--shot-impact-delay',Math.round(duration*impact)+'ms');
 const canAnimate=!reduced&&Boolean(ball?.animate&&rim?.getBoundingClientRect);
 // When animation is unavailable, play the response immediately instead of
 // leaving a delayed rim sound ringing over the following question.
 playShot(made,canAnimate?duration:120,canAnimate?impact:.10,shot);
 if(!canAnimate){finish();return;}
 try{
  const ballRect=ball.getBoundingClientRect();
  const rimRect=rim.getBoundingClientRect();
  const courtRect=court.getBoundingClientRect();
  if(!courtRect.width||!ballRect.width||!rimRect.width){finish();return;}
  const dx=(rimRect.left+rimRect.width*.5)-(ballRect.left+ballRect.width*.5);
  const dy=(rimRect.top+rimRect.height*.5)-(ballRect.top+ballRect.height*.5);
  const height=courtRect.height;
  // The long three-pointer used to rise above compact phone courts and disappear
  // behind overflow:hidden. Constrain each arc by the actual visible headroom.
  const desiredApex=shot==='three'?Math.max(155,Math.min(330,height*.85)):
     shot==='dunk'?Math.max(95,Math.min(190,height*.47)):
     Math.max(90,Math.min(225,height*.58));
  const startCenter=ballRect.top+ballRect.height*.5-courtRect.top;
  const endCenter=rimRect.top+rimRect.height*.5-courtRect.top;
  const ceiling=Math.max(17,ballRect.height*.52);
  const headroom=(startCenter+endCenter)*.5-ceiling-Math.abs(endCenter-startCenter)*.10;
  const apex=Math.min(desiredApex,Math.max(38,headroom));
  const offsets=shot==='dunk'?[0,.13,.27,.42,.54,impact]:
    shot==='three'?[0,.15,.31,.47,.64,impact]:
    [0,.15,.30,.45,.60,impact];
  const keyframes=offsets.map(t=>{
   const u=t/impact;
   const x=shot==='dunk'?dx*(1-Math.pow(1-u,2.5)):
     shot==='three'?dx*Math.pow(u,1.08):dx*u;
   const y=dy*u-4*apex*u*(1-u);
   const scale=shot==='three'?(.86-u*.26):shot==='dunk'?(1.06-u*.30):(1-u*.35);
   return {offset:t,transform:'translate3d('+x+'px,'+y+'px,0) rotate('+(u*(shot==='dunk'?280:shot==='three'?790:540)-20)+'deg) scale('+scale+')',opacity:1};
  });
  if(made){
   keyframes.push({offset:Math.min(.94,impact+.085),transform:'translate3d('+(dx+2)+'px,'+(dy+ballRect.height*.75)+'px,0) rotate('+(shot==='dunk'?390:800)+'deg) scale(.59)',opacity:1});
   keyframes.push({offset:1,transform:'translate3d('+(dx+5)+'px,'+(dy+ballRect.height*2.5)+'px,0) rotate(880deg) scale(.45)',opacity:0});
  }else{
   const bounce=shot==='dunk'?[-63,-44]:shot==='three'?[66,-53]:[43,-36];
   // First impact compresses the ball, then it ricochets on a shallow, falling arc.
   keyframes.push({offset:Math.min(.90,impact+.045),transform:'translate3d('+(dx+bounce[0]*.5)+'px,'+(dy+bounce[1]*.38)+'px,0) rotate(620deg) scale(.66,.57)',opacity:1});
   keyframes.push({offset:Math.min(.96,impact+.10),transform:'translate3d('+(dx+bounce[0])+'px,'+(dy+bounce[1])+'px,0) rotate(710deg) scale(.68)',opacity:1});
   keyframes.push({offset:1,transform:'translate3d('+(dx+Math.max(130,courtRect.width*.31))+'px,'+(dy+Math.max(145,height*.48))+'px,0) rotate(980deg) scale(.51)',opacity:0});
  }
  const animation=ball.animate(keyframes,{duration,easing:'linear',fill:'forwards'});
  // Move the floor shadow along with the shot; a stationary shadow made mobile
  // three-pointers appear detached from the court.
  if(shadow?.animate){
   const missX=made?dx:dx+Math.max(130,courtRect.width*.31);
   const shadowKeyframes=[
    {offset:0,transform:'translate3d(0,0,0) scale(1)',opacity:.42},
    {offset:impact*.5,transform:'translate3d('+(dx*.52)+'px,0,0) scale(.55)',opacity:.12},
    {offset:impact,transform:'translate3d('+dx+'px,0,0) scale(.78)',opacity:.32},
    {offset:1,transform:'translate3d('+missX+'px,0,0) scale(.46)',opacity:0}
   ];
   shadow.animate(shadowKeyframes,{duration,easing:'linear',fill:'forwards'});
  }
  if(camera?.animate){
   const base={transform:'scale(1) translate3d(0,0,0)',offset:0};
   let motion;
   if(!made)motion=[base,
      {offset:.47,transform:'scale(1.018) translate3d(-.5%,0,0)'},
      {offset:impact,transform:'scale(1.045) translate3d(-1%,0,0)'},
      {offset:Math.min(.94,impact+.09),transform:'scale(1.025) translate3d(.8%,0,0)'},
      {offset:1,transform:'scale(1) translate3d(0,0,0)'}];
   else if(shot==='three')motion=[base,
      {offset:.44,transform:'scale(.95) translate3d(2%,0,0)'},
      {offset:impact,transform:'scale(1.075) translate3d(-2%,-1%,0)'},
      {offset:1,transform:'scale(1.04) translate3d(-1%,0,0)'}];
   else if(shot==='dunk')motion=[base,
      {offset:.43,transform:'scale(1.09) translate3d(-2%,-1%,0)'},
      {offset:impact,transform:'scale(1.17) translate3d(-5%,-2%,0)'},
      {offset:Math.min(.94,impact+.08),transform:'scale(1.14) translate3d(-4%,1%,0)'},
      {offset:1,transform:'scale(1.08) translate3d(-2%,0,0)'}];
   else motion=[base,{offset:.52,transform:'scale(1.035) translate3d(-1%,0,0)'},
      {offset:impact,transform:'scale(1.11) translate3d(-3%,-1%,0)'},
      {offset:1,transform:'scale(1.075) translate3d(-2%,0,0)'}];
   camera.animate(motion,{duration,fill:'forwards',easing:'ease-in-out'});
  }
  animation.finished.then(finish,finish);
  // Page throttling or canceled animations cannot leave the game locked.
  window.setTimeout(finish,duration+180);
 }catch(_){finish();}
}
function choose(n){
 if(state.screen!=='question'||state.selected!==null||!Number.isInteger(n)||n<0||n>3)return;
 state.selected=n;
 const made=n===questions[state.step][2];
 state.shotReady=false;
 if(made){state.correct++;state.streak++;state.bestStreak=Math.max(state.bestStreak,state.streak);state.chapterCorrect[questions[state.step][0]]++;}
 else state.streak=0;
 question();runShot(made);
}
/* Chapter-change presentation after questions 3 and 7 only.
   Skippable immediately; reduced-motion users get a manual Continue. */
function intermission(){
 const nextChapter=questions[state.step][0],completedChapter=nextChapter-1;
 const count=[3,4,3][completedChapter],correct=state.chapterCorrect[completedChapter];
 const newArena=t.arenaNames[nextChapter];
 state.screen='intermission';
 const beams=Array.from({length:7},(_,i)=>'<i style="--beam:'+i+'"></i>').join('');
 view('<section class="quest-intermission arena-stage--'+(nextChapter+1)+'" aria-labelledby="halftimeTitle">'+
  '<div class="quest-intermission__lights" aria-hidden="true">'+beams+'</div>'+
  '<div class="quest-intermission__header"><span>JOO ARENA / 7.0</span><span>0'+(nextChapter+1)+' / 03</span></div>'+
  '<div class="quest-intermission__stage"><div class="quest-intermission__eyebrow">'+h(t.half)+'</div>'+
   '<div class="quest-intermission__finish">'+h(t.halfEnd)+'</div>'+
   '<div class="quest-intermission__stats"><div><span>'+h(t.halfProgress)+'</span><strong>'+correct+' / '+count+'</strong></div>'+
   '<div><span>'+h(t.halfTotal)+'</span><strong>'+points()+' / 100</strong></div></div>'+
   '<div class="quest-intermission__divider"><span>✦</span></div>'+
   '<p class="quest-intermission__next">'+h(t.halfNext)+' <span class="quest-intermission__level">'+h(t.difficulties[nextChapter])+'</span></p>'+
   '<h1 id="halftimeTitle" tabindex="-1">'+h(newArena)+'</h1>'+
   '<div class="quest-intermission__arena" aria-hidden="true"><div class="quest-intermission__court"></div><div class="quest-intermission__ball"></div><div class="quest-intermission__hoop"></div></div>'+
   '<button class="quest-button" id="continueHalftime">'+h(t.halfContinue)+' →</button>'+
  '</div></section>','halftimeTitle');
 const nextStep=state.step;
 const advance=()=>{
  if(state.screen!=='intermission'||state.step!==nextStep)return;
  state.activeShot=selectShot();question();
 };
 $('continueHalftime').addEventListener('click',advance);
 try{
  if(!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
   window.setTimeout(advance,4100);
 }catch(_){/* Manual continue is always available. */}
}
function next(){
 if(state.screen!=='question'||state.selected===null||!state.shotReady)return;
 if(state.step===9){result();return;}
 state.step++;state.selected=null;state.shotReady=true;state.activeShot=selectShot();
 if(state.step===3||state.step===7){intermission();return;}
 question();
}
const level=()=>points()>=90?3:points()>=70?2:points()>=50?1:0;
const ranks=['JOO ROOKIE','JOO EXPLORER','JOO EXPERT','JOO LEGEND'];
function result(){
 state.screen='result';
 // Only completed games can unlock trophies; old records remain in this browser.
 savedAchievements=readAchievements();
 const inThisGame=achievementDefs.filter(a=>a.check()).map(a=>a.id);
 state.newAchievements=inThisGame.filter(id=>!savedAchievements.has(id));
 for(const id of inThisGame)savedAchievements.add(id);
 saveAchievements();
 const chapterSizes=[3,4,3];
 const chapterRows=chapterSizes.map((size,i)=>{
  const correct=state.chapterCorrect[i];
  return '<div class="quest-recap-row"><div><span>'+h(t.chapters[i])+'</span><strong>'+correct+' / '+size+'</strong></div>'+
   '<div class="quest-recap-track"><i style="width:'+(correct/size*100)+'%"></i></div></div>';
 }).join('');
 const recap='<div class="quest-recap" aria-label="'+h(t.chaptersResult)+'">'+
   '<div class="quest-recap-head">'+h(t.chaptersResult)+'</div>'+chapterRows+'</div>';
 const trophies='<section class="quest-awards" aria-label="'+h(t.achTitle)+'">'+
  '<div class="quest-awards__heading"><h2>'+h(t.achNow)+'</h2><span>'+inThisGame.length+' / '+achievementDefs.length+'</span></div>'+
  '<div class="quest-achievements">'+awardCards(new Set(inThisGame),new Set(state.newAchievements))+'</div></section>';
 const trophy=points()>=90?t.mvp:points()>=70?t.allStar:points()>=50?t.rising:t.rookie;
 const ceremony='<div class="quest-mvp-ceremony" role="group" aria-label="'+h(t.award)+'">'+
  '<div class="quest-mvp-ceremony__confetti" aria-hidden="true">'+Array.from({length:18},(_,i)=>'<i style="--piece:'+i+'"></i>').join('')+'</div>'+
  '<div class="quest-mvp-ceremony__cup" aria-hidden="true"><svg viewBox="0 0 120 132" width="92" height="105" fill="none"><defs><linearGradient id="questTrophy" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#FFF5C7"/><stop offset=".55" stop-color="#E9B953"/><stop offset="1" stop-color="#A86A2C"/></linearGradient></defs><path d="M37 15h46v29c0 27-11 37-23 37S37 71 37 44V15Z" fill="url(#questTrophy)" stroke="#FFE9A3" stroke-width="3"/><path d="M38 23H18c0 24 10 38 27 37M82 23h20c0 24-10 38-27 37" stroke="#EDBC62" stroke-width="9" stroke-linecap="round"/><path d="M60 82v17M40 111h40M34 120h52" stroke="#E9BC69" stroke-width="12" stroke-linecap="round"/><path d="m60 28 6 11 12 2-9 9 2 13-11-6-11 6 2-13-9-9 12-2Z" fill="#FDF1BF"/></svg></div>'+
  '<small>'+h(t.award)+'</small><strong>'+h(trophy)+'</strong><p>'+h(t.awardDesc)+'</p></div>';
 view('<section class="quest-result" aria-labelledby="resultTitle"><div><div class="quest-kicker">'+h(t.done)+'</div><h1 id="resultTitle" tabindex="-1">'+h(t.result)+'<br><em>'+h(t.result2)+'</em></h1><p>'+h(t.desc)+'</p><div class="quest-badge">'+ranks[level()]+'</div>'+
 ceremony+'<div class="quest-result-numbers"><div><span>'+h(t.accuracy)+'</span><strong>'+points()+'%</strong></div><div><span>'+h(t.best)+'</span><strong>×'+state.bestStreak+'</strong></div></div>'+
 recap+trophies+
 '<div class="quest-result-actions"><button class="quest-button" id="saveResult">'+h(t.save)+' ↓</button><button class="quest-button quest-button--outline" id="shareResult">'+h(t.share)+' ↗</button><button class="quest-button quest-button--outline" id="replayQuest">'+h(t.again)+' ↺</button></div></div><div><div class="quest-score-ring" style="--score:'+points()+'" role="img" aria-label="'+points()+' '+h(t.out)+'"><div class="quest-score-center"><strong>'+points()+'</strong><small>'+h(t.out)+'</small></div></div><div class="quest-result-stat">'+state.correct+' '+h(t.count)+'</div></div></section>','resultTitle');
 $('replayQuest').addEventListener('click',intro);$('shareResult').addEventListener('click',share);$('saveResult').addEventListener('click',save);
}
function toast(s){
 document.querySelector('.quest-toast')?.remove();
 const n=document.createElement('div');n.className='quest-toast';n.role='status';n.textContent=s;document.body.appendChild(n);
 document.addEventListener('pointerdown',()=>n.remove(),{once:true});
}
function share(){
 const msg=t.shareText+' '+points()+'/100 · '+ranks[level()]+' · '+t.best+': '+state.bestStreak,link=location.origin+url(lang);
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
 g.fillStyle='#f6d47d';g.font='bold 26px Inter,Arial';g.fillText(t.best+': '+state.bestStreak,110,1200);
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