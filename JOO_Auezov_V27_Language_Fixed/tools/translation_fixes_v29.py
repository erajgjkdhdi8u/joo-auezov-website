#!/usr/bin/env python3
"""Correct a few inherited data-ru/data-en attributes that duplicated Kazakh."""
import html
from site_quality_v28 import ROOT

FIXES = {
    "resources": [
        ("Бұл бет әдейі №026, «синяя папка» немесе басқа нақты құжат атауларын ойдан қоспайды. Финал тізімін JOO Auezov admissions командасынан растау керек.",
         "На странице не приводятся неподтверждённые названия документов, например №026 или «синяя папка». Уточните окончательный список у команды приёма JOO Auezov.",
         "This page avoids unverified document names such as No. 026 or a 'blue folder'. Confirm the final list with the JOO Auezov admissions team."),
        ("Қажетті ақпаратты сырттан іздемей, дұрыс бөлімге бірден өтуге болады.",
         "Нужную информацию можно найти прямо в соответствующем разделе сайта.",
         "Find the information you need directly in the relevant section."),
    ],
    "news": [
        ("Информатика–Математика бағыты бойынша пайдаланушы ұсынған расталған ҰБТ нәтижесі.",
         "Подтверждённый результат ЕНТ по направлению «Информатика — Математика», предоставленный пользователем.",
         "Verified national exam result in the Computer Science–Mathematics track, supplied by the user."),
    ],
}
for page, items in FIXES.items():
    path = ROOT / (page + ".html")
    source = path.read_text(encoding="utf-8")
    for kk, ru, en in items:
        old = 'data-en="' + html.escape(kk, quote=True) + '" data-kk="' + html.escape(kk, quote=True) + '" data-ru="' + html.escape(kk, quote=True) + '"'
        new = 'data-en="' + html.escape(en, quote=True) + '" data-kk="' + html.escape(kk, quote=True) + '" data-ru="' + html.escape(ru, quote=True) + '"'
        if old in source:
            source = source.replace(old, new)
        elif new not in source:
            raise RuntimeError("Could not find translation: " + page + " " + kk[:35])
    path.write_text(source, encoding="utf-8")
    print(page, "translated", len(items), "paragraphs")
