#!/usr/bin/env python3
"""Improve tab semantics, landmark labels and trilingual photo descriptions."""
import re
from site_quality_v28 import ROOT, PAGES

SCENE_ALT = {
    "school-building": ("JOO Auezov мектебінің ғимараты", "Здание школы JOO Auezov", "JOO Auezov school building"),
    "school-classroom": ("Мектептің оқу кабинеті", "Учебный класс школы", "School classroom"),
    "school-students": ("JOO Auezov оқушылары", "Ученики JOO Auezov", "JOO Auezov students"),
    "school-corridor": ("Мектеп дәлізі", "Школьный коридор", "School corridor"),
    "school-reception": ("Мектептің қабылдау аймағы", "Зона приёма школы", "School reception area"),
    "school-lounge": ("Оқушыларға арналған демалыс кеңістігі", "Зона отдыха для учеников", "Student lounge area"),
    "school-cafeteria": ("Мектеп асханасы", "Школьная столовая", "School cafeteria"),
    "school-gym": ("Мектептің спорт залы", "Спортивный зал школы", "School gym"),
    "assembly": ("Мектептегі іс-шара залы", "Зал школьных мероприятий", "School assembly space"),
    "classroom": ("Сабақ өтіп жатқан оқу кабинеті", "Учебный класс", "Classroom learning space"),
    "computerlab": ("Компьютерлік кабинет", "Компьютерный класс", "Computer laboratory"),
    "corridor": ("Мектептің ішкі дәлізі", "Внутренний коридор школы", "School interior corridor"),
    "exterior": ("Мектептің сыртқы көрінісі", "Внешний вид школы", "School exterior"),
    "hall": ("Мектептің ортақ кеңістігі", "Общее пространство школы", "School common area"),
    "students": ("Мектеп оқушылары бірге", "Ученики школы вместе", "Students together at school"),
}
IMG = re.compile(r"<img\b[^>]*>", re.I | re.S)
SRC = re.compile(r'''(?<![\w-])src\s*=\s*(["'])(.*?)\1''', re.I | re.S)
ALT = re.compile(r'''(?<![\w-])alt\s*=\s*(["'])(.*?)\1''', re.I | re.S)

def kind(src):
    if src.startswith("assets/images/v28/school-"):
        return src.rsplit("/", 1)[-1].removesuffix(".webp")
    if src.startswith("assets/images/") and src.count("/") == 2:
        name = src.rsplit("/", 1)[-1].removesuffix(".webp")
        name = re.sub(r"-(?:480|800|1200)$", "", name)
        return name if name in SCENE_ALT else None
    return None

def improve(page):
    path = ROOT / (page + ".html")
    s = path.read_text(encoding="utf-8")
    s = s.replace('aria-label="JOO Auezov home"', 'aria-label="JOO. Auezov home"')
    s = s.replace('aria-label="Language" class="langs"', 'aria-label="Language" role="group" class="langs"')
    s = s.replace('class="joo-journey-map" aria-label=', 'class="joo-journey-map" role="group" aria-label=')
    def tab(m):
        tag = m.group(0)
        if 'role="tab"' in tag: return tag
        index = re.search(r'data-journey="(\d+)"', tag).group(1)
        return tag[:-1] + ' role="tab" id="journeyTab' + index + '" aria-controls="journeyPanel' + index + '">'
    s = re.sub(r'<button\b(?=[^>]*class="journey__tab)(?=[^>]*data-journey="\d+")[^>]*>', tab, s, flags=re.I)
    def panel(m):
        tag = m.group(0)
        if 'role="tabpanel"' in tag: return tag
        index = re.search(r'data-panel="(\d+)"', tag).group(1)
        return tag[:-1] + ' role="tabpanel" id="journeyPanel' + index + '" aria-labelledby="journeyTab' + index + '">'
    s = re.sub(r'<article\b(?=[^>]*class="journey__slide)(?=[^>]*data-panel="\d+")[^>]*>', panel, s, flags=re.I)
    def photo(m):
        tag = m.group(0)
        src = SRC.search(tag)
        alt = ALT.search(tag)
        if not src or not alt or not alt.group(2).strip() or 'data-alt-kk=' in tag:
            return tag
        k = kind(src.group(2))
        if k not in SCENE_ALT: return tag
        kk, ru, en = SCENE_ALT[k]
        tag = ALT.sub(lambda _: 'alt="' + kk + '"', tag, count=1)
        return tag[:-2] + ' data-alt-kk="' + kk + '" data-alt-ru="' + ru + '" data-alt-en="' + en + '"/>' if tag.endswith('/>') else tag[:-1] + ' data-alt-kk="' + kk + '" data-alt-ru="' + ru + '" data-alt-en="' + en + '">'
    s = IMG.sub(photo, s)
    if s != path.read_text(encoding="utf-8"):
        path.write_text(s, encoding="utf-8")
    print(page + ".html accessibility improved")

if __name__ == "__main__":
    for p in PAGES:
        improve(p)
