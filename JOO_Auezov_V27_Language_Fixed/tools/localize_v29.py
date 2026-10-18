#!/usr/bin/env python3
"""Build distinct KK/RU/EN SEO entry pages while retaining original design and JS.
Run after site_quality_v28.py. Generated /ru/ and /en/ pages use shared root assets.
"""
from __future__ import annotations

import html
import re
from pathlib import Path
from xml.sax.saxutils import escape as xe

from site_quality_v28 import DOMAIN, PAGES, ROOT

# Hand-written metadata, not machine-translated from page titles.
TRANSLATIONS = {
    "index": {
        "ru": ("JOO High School Auezov | Школа в Алматы", "JOO High School Auezov — школа для 2–11 классов в Алматы. Программа обучения, результаты ЕНТ, учителя и поступление."),
        "en": ("JOO High School Auezov | School in Almaty", "Explore JOO High School Auezov in Almaty: grades 2–11, academic programs, exam results, teachers and admissions."),
    },
    "about": {
        "ru": ("JOO Auezov | О школе", "Узнайте о миссии, образовательных принципах и школьной среде JOO Auezov в Алматы."),
        "en": ("JOO Auezov | About our school", "Discover the mission, learning approach and school community of JOO Auezov in Almaty."),
    },
    "academics": {
        "ru": ("JOO Auezov | Учебная программа", "Учебные направления, подготовка по предметам и образовательный подход JOO Auezov для 2–11 классов."),
        "en": ("JOO Auezov | Academics", "Academic pathways, subject preparation and learning at JOO Auezov for students in grades 2–11."),
    },
    "admissions": {
        "ru": ("JOO Auezov | Поступление", "Узнайте о поступлении в JOO Auezov: классы 2–11, документы, тестирование и консультация в WhatsApp."),
        "en": ("JOO Auezov | Admissions", "Admissions to JOO Auezov for grades 2–11: application steps, required documents and WhatsApp enquiries."),
    },
    "campus": {
        "ru": ("JOO Auezov | Кампус", "Посмотрите школьный кампус JOO Auezov: классы, спортивный зал, столовую и пространства для учеников."),
        "en": ("JOO Auezov | Campus", "Explore JOO Auezov's campus, classrooms, gym, cafeteria and welcoming student spaces."),
    },
    "career": {
        "ru": ("JOO Auezov | Профориентация", "Профориентация в JOO Auezov: Диас Асанов, выбор профессии, подготовка к университету и развитие учеников."),
        "en": ("JOO Auezov | Career guidance", "Career guidance at JOO Auezov: Dias Asanov, subject choices, university preparation and student pathways."),
    },
    "contacts": {
        "ru": ("JOO Auezov | Контакты", "Контакты JOO High School Auezov: Алматы, Цветочная 1/14, телефон, WhatsApp и как добраться до школы."),
        "en": ("JOO Auezov | Contact us", "Contact JOO High School Auezov in Almaty: Tsvetochnaya 1/14, phone, WhatsApp and directions."),
    },
    "news": {
        "ru": ("JOO Auezov | Новости", "Новости школы JOO Auezov, достижения учеников и важные события школьной жизни."),
        "en": ("JOO Auezov | News", "School news, student achievements and community updates from JOO Auezov."),
    },
    "parents": {
        "ru": ("JOO Auezov | Родителям", "Информация для родителей JOO Auezov: учебный процесс, связь со школой и поддержка учеников."),
        "en": ("JOO Auezov | For parents", "Information for JOO Auezov parents: school routines, communication and student support."),
    },
    "resources": {
        "ru": ("JOO Auezov | Учебные ресурсы", "Учебные материалы, подготовка и полезные ресурсы для учеников и родителей JOO Auezov."),
        "en": ("JOO Auezov | Learning resources", "Learning resources, preparation materials and useful information for JOO Auezov families."),
    },
    "results": {
        "ru": ("JOO Auezov | Результаты ЕНТ", "Опубликованные результаты ЕНТ учеников JOO Auezov, информация о грантах и университетах."),
        "en": ("JOO Auezov | Exam results", "Explore published student exam results, university destinations and grants at JOO Auezov."),
    },
    "student-life": {
        "ru": ("JOO Auezov | Школьная жизнь", "Школьная жизнь JOO Auezov: кружки, спорт, проекты, дружба и общие мероприятия."),
        "en": ("JOO Auezov | Student life", "Student life at JOO Auezov: clubs, sports, projects, friendships and community events."),
    },
    "team": {
        "ru": ("JOO Auezov | Наша команда", "Познакомьтесь с командой JOO Auezov: руководство школы, учителя и специалисты поддержки."),
        "en": ("JOO Auezov | Our team", "Meet the JOO Auezov team: school leaders, teachers and student support specialists."),
    },
    "wellbeing": {
        "ru": ("JOO Auezov | Поддержка и безопасность", "Благополучие учеников, безопасность, психологическая поддержка и комфортная среда в JOO Auezov."),
        "en": ("JOO Auezov | Wellbeing and safety", "Student wellbeing, safety, emotional support and a welcoming school environment at JOO Auezov."),
    },
}

META_BLOCK = re.compile(r"\s*<!-- JOO V28 SEO START -->.*?<!-- JOO V28 SEO END -->\s*", re.S)
DESC = re.compile(r'''<meta\b(?=[^>]*\bname\s*=\s*["']description["'])[^>]*>''', re.I | re.S)
TITLE = re.compile(r"<title\b[^>]*>.*?</title>", re.I | re.S)
BASE = re.compile(r'''<base\b[^>]*>''', re.I)
HREF = re.compile(r'''(<a\b[^>]*\bhref\s*=\s*)(["'])(.*?)\2''', re.I | re.S)

def url(lang: str, page: str):
    prefix = "" if lang == "kk" else "/" + lang
    return DOMAIN + prefix + ("/" if page == "index" else "/" + page + ".html")

def local_route(lang: str, page: str):
    prefix = "" if lang == "kk" else "/" + lang
    return prefix + ("/" if page == "index" else "/" + page + ".html")

def rewrite_links(text: str, lang: str, page: str):
    """Preserve local language when following internal page and fragment links."""
    def transform(m):
        raw = html.unescape(m.group(3))
        if raw.startswith("#"):
            dest = local_route(lang, page) + raw
        elif re.fullmatch(r"(?:\./)?(?:index|about|academics|admissions|campus|career|contacts|news|parents|resources|results|student-life|team|wellbeing)\.html(?:#[^?#]*)?", raw):
            path, _, anchor = raw.partition("#")
            slug = Path(path).stem
            dest = local_route(lang, slug) + ("#" + anchor if anchor else "")
        else:
            return m.group(0)
        return m.group(1) + m.group(2) + html.escape(dest, quote=True) + m.group(2)
    return HREF.sub(transform, text)

def meta(lang: str, page: str):
    title, description = (PAGES[page][0], PAGES[page][1]) if lang == "kk" else TRANSLATIONS[page][lang]
    image = DOMAIN + "/assets/images/v28/" + PAGES[page][2]
    locale = {"kk": "kk_KZ", "ru": "ru_RU", "en": "en_US"}[lang]
    q = lambda v: html.escape(v, quote=True)
    lines = [
        '<link rel="canonical" href="' + q(url(lang, page)) + '"/>',
        *('<link rel="alternate" hreflang="' + l + '" href="' + q(url(l, page)) + '"/>' for l in ("kk", "ru", "en")),
        '<link rel="alternate" hreflang="x-default" href="' + q(url("kk", page)) + '"/>',
        '<meta property="og:type" content="website"/>',
        '<meta property="og:locale" content="' + locale + '"/>',
        '<meta property="og:site_name" content="JOO High School Auezov"/>',
        '<meta property="og:title" content="' + q(title) + '"/>',
        '<meta property="og:description" content="' + q(description) + '"/>',
        '<meta property="og:url" content="' + q(url(lang, page)) + '"/>',
        '<meta property="og:image" content="' + q(image) + '"/>',
        '<meta name="twitter:card" content="summary_large_image"/>',
        '<meta name="twitter:title" content="' + q(title) + '"/>',
        '<meta name="twitter:description" content="' + q(description) + '"/>',
        '<meta name="twitter:image" content="' + q(image) + '"/>',
    ]
    return title, description, "\n<!-- JOO V28 SEO START -->\n" + "\n".join(lines) + "\n<!-- JOO V28 SEO END -->\n"

def localize(source: str, lang: str, page: str):
    title, description, seo = meta(lang, page)
    text = META_BLOCK.sub("\n", source)
    text = DESC.sub(lambda _: '<meta name="description" content="' + html.escape(description, quote=True) + '"/>', text, count=1)
    text = TITLE.sub(lambda _: "<title>" + html.escape(title) + "</title>" + seo, text, count=1)
    text = re.sub(r'''(<html\b[^>]*\blang\s*=\s*)(["'])[^"']*\2''',
                  lambda m: m.group(1) + m.group(2) + lang + m.group(2), text, count=1)
    if lang != "kk":
        text = BASE.sub("", text)
        text = text.replace("<head>", '<head><base href="/"/>', 1)
        text = rewrite_links(text, lang, page)
    return text

def main():
    for lang in ("ru", "en"):
        (ROOT / lang).mkdir(exist_ok=True)
    for page in PAGES:
        source = (ROOT / (page + ".html")).read_text(encoding="utf-8")
        for lang in ("kk", "ru", "en"):
            target = ROOT / (page + ".html") if lang == "kk" else ROOT / lang / (page + ".html")
            text = localize(source, lang, page)
            if not target.exists() or target.read_text(encoding="utf-8") != text:
                target.write_text(text, encoding="utf-8")
    sitemap = ['<?xml version="1.0" encoding="UTF-8"?>',
               '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for page in PAGES:
        for lang in ("kk", "ru", "en"):
            sitemap.append('  <url><loc>' + xe(url(lang, page)) + '</loc>')
            for alt in ("kk", "ru", "en"):
                sitemap.append('    <xhtml:link rel="alternate" hreflang="' + alt + '" href="' + xe(url(alt, page)) + '"/>')
            sitemap.append('  </url>')
    sitemap.append('</urlset>')
    (ROOT / "sitemap.xml").write_text("\n".join(sitemap) + "\n", encoding="utf-8")
    print("Generated 42 SEO pages, 3-language canonical/hreflang and sitemap")

if __name__ == "__main__":
    main()
