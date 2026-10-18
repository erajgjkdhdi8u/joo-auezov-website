#!/usr/bin/env python3
"""Reduce repeated *scenes* on each page without inventing new school photographs.
Do not replace portraits, results posters or staff photographs.
"""
from __future__ import annotations

import re
from pathlib import Path
from PIL import Image
from site_quality_v28 import ROOT, PAGES

SCENES = {
    "school-building": "assets/images/v28/school-building.webp",
    "school-classroom": "assets/images/v28/school-classroom.webp",
    "school-students": "assets/images/v28/school-students.webp",
    "school-corridor": "assets/images/v28/school-corridor.webp",
    "school-reception": "assets/images/v28/school-reception.webp",
    "school-lounge": "assets/images/v28/school-lounge.webp",
    "school-cafeteria": "assets/images/v28/school-cafeteria.webp",
    "school-gym": "assets/images/v28/school-gym.webp",
    "assembly": "assets/images/assembly-800.webp",
    "classroom": "assets/images/classroom-800.webp",
    "computerlab": "assets/images/computerlab-800.webp",
    "corridor": "assets/images/corridor-800.webp",
    "exterior": "assets/images/exterior-800.webp",
    "hall": "assets/images/hall-800.webp",
    "students": "assets/images/students-800.webp",
}
PREFER = {
    "school-building": ["school-building", "exterior", "school-corridor", "corridor", "school-reception", "hall", "school-lounge"],
    "exterior": ["exterior", "school-building", "school-corridor", "corridor", "school-reception", "hall", "school-lounge"],
    "school-classroom": ["school-classroom", "classroom", "computerlab", "school-students", "students", "school-reception", "school-lounge", "hall"],
    "classroom": ["classroom", "school-classroom", "computerlab", "school-students", "students", "school-reception", "school-lounge", "hall"],
    "computerlab": ["computerlab", "school-classroom", "classroom", "school-reception", "school-students", "students", "hall"],
    "school-students": ["school-students", "students", "school-classroom", "classroom", "assembly", "school-gym", "school-lounge", "hall"],
    "students": ["students", "school-students", "school-classroom", "classroom", "assembly", "school-gym", "school-lounge", "hall"],
    "school-corridor": ["school-corridor", "corridor", "school-reception", "hall", "school-building", "exterior", "school-lounge"],
    "corridor": ["corridor", "school-corridor", "school-reception", "hall", "school-building", "exterior", "school-lounge"],
    "school-reception": ["school-reception", "school-lounge", "hall", "school-corridor", "corridor", "school-building", "exterior"],
    "school-lounge": ["school-lounge", "hall", "school-reception", "school-corridor", "corridor", "school-students", "students"],
    "hall": ["hall", "school-lounge", "school-reception", "school-corridor", "corridor", "school-students", "students"],
    "school-cafeteria": ["school-cafeteria", "school-lounge", "hall", "school-reception"],
    "school-gym": ["school-gym", "assembly", "school-students", "students", "school-lounge", "hall"],
    "assembly": ["assembly", "school-gym", "school-students", "students", "school-lounge", "hall"],
}
IMG = re.compile(r"<img\b[^>]*>", re.I | re.S)
SRC = re.compile(r'''(?<![\w-])src\s*=\s*(["'])(.*?)\1''', re.I | re.S)
ALT = re.compile(r'''(?<![\w-])alt\s*=\s*(["'])(.*?)\1''', re.I | re.S)

def family(src):
    for key, path in SCENES.items():
        if src == path:
            return key
    # Different responsive sizes of the same image are still the same photo.
    stem = Path(src).stem
    stem = re.sub(r"-(?:480|800|1200)$", "", stem)
    return stem if src.startswith("assets/images/") and stem in SCENES else None

def related(key, alt):
    a = alt.lower()
    # A generic gallery caption can use any distinct real campus scene.
    if a.startswith("joo auezov view"):
        return ["school-building", "school-corridor", "school-reception", "school-lounge",
                "school-classroom", "school-students", "school-gym", "school-cafeteria",
                "exterior", "corridor", "hall", "classroom", "computerlab", "students", "assembly"]
    if re.search(r"спорт|gym|sports|физкультур", a):
        key = "school-gym"
    elif re.search(r"асхана|столов|cafeteria|dining", a):
        key = "school-cafeteria"
    elif re.search(r"компьютер|computer|it lab|технолог", a):
        key = "computerlab"
    elif re.search(r"ғимарат|здание|building|сыртқы|exterior", a):
        key = "school-building"
    elif re.search(r"сынып|classroom|кабинет|оқу|академ|lesson|study", a):
        key = "school-classroom"
    elif re.search(r"оқушы|student|ученик|балалар|pbl", a):
        key = "school-students"
    return PREFER[key]

def run(page):
    path = ROOT / (page + ".html")
    source = path.read_text(encoding="utf-8")
    used = set()
    replacements = 0
    def change(m):
        nonlocal replacements
        tag = m.group(0)
        found = SRC.search(tag)
        if not found:
            return tag
        src = found.group(2)
        key = family(src)
        alt = ALT.search(tag)
        caption = alt.group(2) if alt else ""
        # Staff cards retain their real portraits. Repeated portraits in generic
        # editorial sections are replaced by actual campus photos instead.
        if key is None and page == "team" and src.startswith("assets/images/team/") and (
                caption.startswith("JOO Auezov view") or caption.isupper()):
            for alternative in related("school-students", caption):
                candidate = SCENES[alternative]
                if alternative not in used and (ROOT / candidate).is_file():
                    tag = SRC.sub(lambda x: "src=" + x.group(1) + candidate + x.group(1), tag, count=1)
                    tag = re.sub(r'''\s+(?:srcset|sizes)\s*=\s*(["']).*?\1''', "", tag, flags=re.I | re.S)
                    with Image.open(ROOT / candidate) as im:
                        width, height = im.size
                    tag = re.sub(r'''(?<![\w-])width\s*=\s*(["'])\d+\1''', 'width="' + str(width) + '"', tag, count=1)
                    tag = re.sub(r'''(?<![\w-])height\s*=\s*(["'])\d+\1''', 'height="' + str(height) + '"', tag, count=1)
                    used.add(alternative)
                    replacements += 1
                    return tag
        if key is None:
            return tag
        hero = bool(re.search(r'''fetchpriority\s*=\s*["']high["']''', tag, re.I))
        menu = "data-joo-menu-image" in tag
        # Keep hero and menu compositions intact; do not invent visual variety by cropping.
        if key in used and not hero and not menu:
            for alternative in related(key, caption):
                candidate = SCENES[alternative]
                if alternative not in used and (ROOT / candidate).is_file():
                    tag = SRC.sub(lambda x: "src=" + x.group(1) + candidate + x.group(1), tag, count=1)
                    tag = re.sub(r'''\s+(?:srcset|sizes)\s*=\s*(["']).*?\1''', "", tag, flags=re.I | re.S)
                    with Image.open(ROOT / candidate) as im:
                        width, height = im.size
                    tag = re.sub(r'''(?<![\w-])width\s*=\s*(["'])\d+\1''', 'width="' + str(width) + '"', tag, count=1)
                    tag = re.sub(r'''(?<![\w-])height\s*=\s*(["'])\d+\1''', 'height="' + str(height) + '"', tag, count=1)
                    key = alternative
                    replacements += 1
                    break
        used.add(key)
        return tag
    updated = IMG.sub(change, source)
    if updated != source:
        path.write_text(updated, encoding="utf-8")
    counts = {}
    for m in IMG.finditer(updated):
        sm = SRC.search(m.group(0))
        if sm:
            k = family(sm.group(2))
            if k:
                counts[k] = counts.get(k, 0) + 1
    duplicate_scenes = sum(max(0, v - 1) for v in counts.values())
    print(page + ".html: " + str(replacements) + " replacements, " + str(duplicate_scenes) + " remaining repeated scenes")
    return duplicate_scenes

if __name__ == "__main__":
    print("Total repeated scenes:", sum(run(p) for p in PAGES))
