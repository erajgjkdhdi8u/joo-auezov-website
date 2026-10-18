#!/usr/bin/env python3
"""V28 quality pass: relevant imagery, SEO, image dimensions and accessibility.
Run from the JOO_Auezov_V27_Language_Fixed directory. Safe to re-run.
"""
from __future__ import annotations

import html
import re
from pathlib import Path
from xml.sax.saxutils import escape as xml_escape

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DOMAIN = "https://joo-auezov.netlify.app"
PAGES = {
    "index": ("JOO High School Auezov | Алматы", "JOO High School Auezov — Алматыдағы 2–11 сыныпқа арналған мектеп. Оқу бағдарламасы, ҰБТ нәтижелері, ұстаздар және қабылдау.", "school-lounge.webp"),
    "about": ("JOO Auezov | Мектеп туралы", "JOO Auezov мектебінің миссиясы, білім беру қағидалары және Алматыдағы оқу ортасы туралы біліңіз.", "school-building.webp"),
    "academics": ("JOO Auezov | Оқу бағдарламасы", "JOO Auezov-та 2–11 сынып оқушыларына арналған оқу бағыттары, пәндік дайындық және білім беру тәсілдері.", "school-classroom.webp"),
    "admissions": ("JOO Auezov | Қабылдау", "JOO Auezov мектебіне 2–11 сыныпқа қабылдау тәртібі, құжаттар, тестілеу және WhatsApp арқылы кеңес алу.", "school-reception.webp"),
    "campus": ("JOO Auezov | Кампус", "JOO Auezov мектебінің кампусы: оқу кабинеттері, спортзал, асхана және оқушыларға арналған кеңістіктер.", "school-corridor.webp"),
    "career": ("JOO Auezov | Профориентация", "JOO Auezov-тағы профориентация: Диас Асанов, мамандық таңдау, университетке дайындық және оқушы траекториясы.", "school-students.webp"),
    "contacts": ("JOO Auezov | Байланыс", "JOO High School Auezov байланыс ақпараты: Алматы, Цветочная 1/14, телефон, WhatsApp және мектепке келу жолы.", "school-reception.webp"),
    "news": ("JOO Auezov | Жаңалықтар", "JOO Auezov мектебінің жаңалықтары, оқушылар жетістіктері және мектеп өміріндегі маңызды оқиғалар.", "school-students.webp"),
    "parents": ("JOO Auezov | Ата-аналарға", "JOO Auezov-та ата-аналарға арналған ақпарат: оқу процесі, байланыс арналары және оқушыны қолдау.", "school-students.webp"),
    "resources": ("JOO Auezov | Оқу ресурстары", "JOO Auezov оқушылары мен ата-аналарына арналған оқу ресурстары, дайындық материалдары және пайдалы ақпарат.", "school-classroom.webp"),
    "results": ("JOO Auezov | ҰБТ нәтижелері", "JOO Auezov оқушыларының ҰБТ нәтижелері, университеттер мен гранттар туралы жарияланған нақты деректер.", "school-students.webp"),
    "student-life": ("JOO Auezov | Мектеп өмірі", "JOO Auezov оқушыларының мектеп өмірі: үйірмелер, спорт, достық, жобалар және ортақ іс-шаралар.", "school-gym.webp"),
    "team": ("JOO Auezov | Біздің команда", "JOO Auezov командасы: мектеп басшылығы, пән мұғалімдері және оқушыларға қолдау көрсететін мамандар.", "school-students.webp"),
    "wellbeing": ("JOO Auezov | Қолдау және қауіпсіздік", "JOO Auezov мектебіндегі оқушы әл-ауқаты, қауіпсіздік, психологиялық қолдау және жайлы орта.", "school-lounge.webp"),
}
# Hero replacements only when the current hero is visibly off-topic.
HERO = {
    "academics": "assets/images/computerlab-1200.webp",
    "news": "assets/images/students-1200.webp",
    "wellbeing": "assets/images/v28/school-lounge.webp",
    "contacts": "assets/images/v28/school-lounge.webp",
}
POOL = {
    "students": ["school-students.webp", "students-800.webp", "school-classroom.webp", "school-lounge.webp", "school-gym.webp"],
    "classroom": ["school-classroom.webp", "classroom-800.webp", "computerlab-800.webp", "school-reception.webp"],
    "computerlab": ["computerlab-800.webp", "school-classroom.webp", "classroom-800.webp", "school-reception.webp"],
    "exterior": ["school-building.webp", "exterior-800.webp", "school-corridor.webp", "school-reception.webp"],
    "corridor": ["school-corridor.webp", "corridor-800.webp", "school-lounge.webp", "school-reception.webp"],
    "hall": ["school-lounge.webp", "hall-800.webp", "school-reception.webp", "school-corridor.webp"],
    "assembly": ["assembly-800.webp", "school-gym.webp", "school-students.webp", "school-lounge.webp"],
    "gym": ["school-gym.webp", "assembly-800.webp", "school-students.webp"],
    "cafeteria": ["school-cafeteria.webp", "school-lounge.webp", "hall-800.webp"],
    "reception": ["school-reception.webp", "school-lounge.webp", "school-corridor.webp"],
    "lounge": ["school-lounge.webp", "hall-800.webp", "school-reception.webp"],
    "building": ["school-building.webp", "exterior-800.webp", "school-corridor.webp"],
}
SRC = re.compile(r'''(?<![\w-])src\s*=\s*(["'])(.*?)\1''', re.I | re.S)
IMG = re.compile(r"<img\b[^>]*>", re.I | re.S)
TITLE = re.compile(r"<title\b[^>]*>.*?</title>", re.I | re.S)
DESC = re.compile(r'''<meta\b(?=[^>]*\bname\s*=\s*["']description["'])[^>]*>''', re.I | re.S)
SEO_BLOCK = re.compile(r"\n?<!-- JOO V28 SEO START -->.*?<!-- JOO V28 SEO END -->\n?", re.S)
DIMENSIONS = {}

def local_path(src: str) -> Path | None:
    if not src.startswith("assets/images/") or ".." in Path(src).parts:
        return None
    p = ROOT / src
    return p if p.is_file() else None

def dimension(src: str):
    if src not in DIMENSIONS:
        p = local_path(src)
        if not p:
            DIMENSIONS[src] = None
        else:
            try:
                with Image.open(p) as im:
                    DIMENSIONS[src] = im.size
            except (OSError, ValueError):
                DIMENSIONS[src] = None
    return DIMENSIONS[src]

def kind(src: str):
    stem = Path(src).stem.lower().replace("school-", "")
    for key in POOL:
        if stem.startswith(key):
            return key
    return None

def options(key: str):
    for name in POOL[key]:
        if name.startswith("school-"):
            yield "assets/images/v28/" + name
        else:
            yield "assets/images/" + name

def update_images(page: str, content: str):
    seen = set()
    replaced = 0
    sized = 0
    def transform(match):
        nonlocal replaced, sized
        tag = match.group(0)
        src_match = SRC.search(tag)
        if not src_match:
            return tag
        old = src_match.group(2)
        src = old
        is_menu = "data-joo-menu-image" in tag
        is_hero = bool(re.search(r'''fetchpriority\s*=\s*["']high["']''', tag, re.I))
        if is_hero and page in HERO and local_path(HERO[page]):
            src = HERO[page]
        elif not is_menu and not is_hero and old in seen and kind(old):
            for candidate in options(kind(old)):
                if candidate not in seen and local_path(candidate):
                    src = candidate
                    break
        if src != old:
            tag = SRC.sub(lambda m: "src=" + m.group(1) + src + m.group(1), tag, count=1)
            tag = re.sub(r'''\s+(?:srcset|sizes)\s*=\s*(["']).*?\1''', "", tag, flags=re.I | re.S)
            replaced += 1
        seen.add(src)
        dims = dimension(src)
        if dims:
            if not re.search(r'''\bwidth\s*=\s*["']\d+["']''', tag):
                tag = tag.replace("<img", '<img width="' + str(dims[0]) + '"', 1)
                sized += 1
            if not re.search(r'''\bheight\s*=\s*["']\d+["']''', tag):
                tag = tag.replace("<img", '<img height="' + str(dims[1]) + '"', 1)
        if not re.search(r'''\bdecoding\s*='' ', tag, re.I):
            # No extra layout effect; browsers may decode off-screen images asynchronously.
            tag = tag.replace("<img", '<img decoding="async"', 1)
        return tag
    result = IMG.sub(transform, content)
    return result, replaced, sized

def seo(page: str, content: str):
    title, desc, image_name = PAGES[page]
    url = DOMAIN + ("/" if page == "index" else "/" + page + ".html")
    og_image = DOMAIN + "/assets/images/v28/" + image_name
    quote = lambda s: html.escape(s, quote=True)
    content = SEO_BLOCK.sub("\n", content)
    meta = '<meta name="description" content="' + quote(desc) + '"/>'
    if DESC.search(content):
        content = DESC.sub(lambda _: meta, content, count=1)
    else:
        content = content.replace("</head>", meta + "</head>", 1)
    if not TITLE.search(content):
        raise RuntimeError("Missing title in " + page)
    content = TITLE.sub(lambda _: "<title>" + html.escape(title) + "</title>", content, count=1)
    block = "\n<!-- JOO V28 SEO START -->\n" + "\n".join([
        '<link rel="canonical" href="' + quote(url) + '"/>',
        '<meta property="og:type" content="website"/>',
        '<meta property="og:locale" content="kk_KZ"/>',
        '<meta property="og:site_name" content="JOO High School Auezov"/>',
        '<meta property="og:title" content="' + quote(title) + '"/>',
        '<meta property="og:description" content="' + quote(desc) + '"/>',
        '<meta property="og:url" content="' + quote(url) + '"/>',
        '<meta property="og:image" content="' + quote(og_image) + '"/>',
        '<meta name="twitter:card" content="summary_large_image"/>',
        '<meta name="twitter:title" content="' + quote(title) + '"/>',
        '<meta name="twitter:description" content="' + quote(desc) + '"/>',
        '<meta name="twitter:image" content="' + quote(og_image) + '"/>',
    ]) + "\n<!-- JOO V28 SEO END -->\n"
    return content.replace("</title>", "</title>" + block, 1)

SKIP = ('<a class="skip-link" href="#mainContent" '
        'data-kk="Негізгі мазмұнға өту" '
        'data-ru="Перейти к основному содержимому" '
        'data-en="Skip to main content">Негізгі мазмұнға өту</a>')

def accessibility(page: str, content: str):
    # Career had two duplicate skip links; normalize all pages to exactly one.
    content = re.sub(r'<a\b[^>]*class=["\']skip-link["\'][^>]*>.*?</a>', "", content, flags=re.I | re.S)
    if not re.search(r'''<main\b[^>]*\bid\s*=\s*["']mainContent["']''', content, re.I):
        raise RuntimeError("Missing #mainContent in " + page)
    content, count = re.subn(r"<body\b[^>]*>", lambda m: m.group(0) + SKIP, content, count=1, flags=re.I)
    if count != 1:
        raise RuntimeError("Missing body in " + page)
    if page == "index":
        content = content.replace('<h1 class="joo-intro__brand">', '<div class="joo-intro__brand" role="presentation">')
    return content

def main():
    for page in PAGES:
        path = ROOT / (page + ".html")
        if not path.exists():
            raise RuntimeError("Missing page: " + str(path))
        original = path.read_text(encoding="utf-8")
        revised = accessibility(page, original)
        revised, count, sized = update_images(page, revised)
        revised = seo(page, revised)
        if page == "career" and re.search(r"Мереке Ұстаз|mereke-ustaz", revised, re.I):
            raise RuntimeError("Removed career profile reappeared")
        if revised != original:
            path.write_text(revised, encoding="utf-8")
        print(page + ".html: " + str(count) + " photo swaps, " + str(sized) + " images dimensioned")
    urls = [DOMAIN + ("/" if page == "index" else "/" + page + ".html") for page in PAGES]
    xml = ('<?xml version="1.0" encoding="UTF-8"?>\n'
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
           + "".join("  <url><loc>" + xml_escape(url) + "</loc></url>\n" for url in urls)
           + '</urlset>\n')
    (ROOT / "sitemap.xml").write_text(xml, encoding="utf-8")
    (ROOT / "robots.txt").write_text(
        "User-agent: *\nAllow: /\nSitemap: " + DOMAIN + "/sitemap.xml\n",
        encoding="utf-8")
    print("Wrote sitemap.xml and robots.txt")

if __name__ == "__main__":
    main()
