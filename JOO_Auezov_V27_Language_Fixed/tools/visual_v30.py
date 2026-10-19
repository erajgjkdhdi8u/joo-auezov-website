#!/usr/bin/env python3
"""V30 editorial photo corrections, deterministic and safe to rerun.
Uses only photographs supplied for JOO Auezov; never changes people/results.
Run after photos_v29.py and before localize_v29.py.
"""
from __future__ import annotations
import re
from pathlib import Path
from PIL import Image
from site_quality_v28 import ROOT
from accessibility_v29 import SCENE_ALT

IMG = re.compile(r"<img\b[^>]*>", re.I | re.S)
SRC = re.compile(r'\bsrc="[^"]*"')
ATTR = re.compile(r'\s+(?:srcset|sizes|data-alt-kk|data-alt-ru|data-alt-en|width|height)\s*=\s*"[^"]*"', re.I)
ALT = re.compile(r'\balt="[^"]*"')
THUMB = re.compile(r'(<button\b(?=[^>]*\bclass="[^"]*\bfx-archive__thumb\b)[^>]*>)(\s*)(<img\b[^>]*>)(\s*</button>)', re.I | re.S)

def kind(src: str):
    if src.startswith("assets/images/v28/school-"):
        return Path(src).stem
    name = re.sub(r"-(480|800|1200)$", "", Path(src).stem)
    return name if name in SCENE_ALT else None

def replace_img(tag: str, src: str, *, decorative=False) -> str:
    image = ROOT / src
    if not image.is_file():
        raise RuntimeError("Missing real school photo: " + src)
    if not SRC.search(tag):
        raise RuntimeError("Image tag has no src")
    with Image.open(image) as photo:
        width, height = photo.size
    tag = ATTR.sub("", tag)
    tag = SRC.sub('src="' + src + '"', tag, count=1)
    alt = ("", "", "") if decorative else SCENE_ALT[kind(src)]
    if not decorative and kind(src) not in SCENE_ALT:
        raise RuntimeError("No translations for image: " + src)
    tag = ALT.sub('alt="' + alt[0] + '"', tag, count=1) if ALT.search(tag) else tag[:-1] + ' alt="' + alt[0] + '">'
    extra = ' width="' + str(width) + '" height="' + str(height) + '"'
    if not decorative:
        extra += ' data-alt-kk="' + alt[0] + '" data-alt-ru="' + alt[1] + '" data-alt-en="' + alt[2] + '"'
    return tag[:-2] + extra + '/>' if tag.endswith('/>') else tag[:-1] + extra + '>'

# Image ordinals are deliberately asserted to avoid changing a portrait if page
# structure is later edited. They refer to current image order, 1-based.
MAP = {
    "academics": {
        13: "assets/images/v28/school-lounge.webp",   # family & school connection
        14: "assets/images/v28/school-students.webp", # career exploration
        16: "assets/images/v28/school-building.webp", # school resources
        17: "assets/images/v28/school-cafeteria.webp",# gallery
        18: "assets/images/exterior-800.webp",        # gallery
        19: "assets/images/corridor-800.webp",        # gallery
    },
    "campus": {
        12: "assets/images/exterior-800.webp",        # EXTERIOR
        13: "assets/images/hall-800.webp",            # HALL
        14: "assets/images/classroom-800.webp",       # CLASSROOM
        15: "assets/images/computerlab-800.webp",     # TECH LAB
        16: "assets/images/assembly-800.webp",        # COMMUNITY
        17: "assets/images/students-800.webp",        # STUDENT LIFE
        21: "assets/images/v28/school-lounge.webp",   # chill zone
        23: "assets/images/v28/school-reception.webp",# safe school environment
        24: "assets/images/v28/school-gym.webp",      # gallery
        25: "assets/images/v28/school-cafeteria.webp",# gallery
        26: "assets/images/v28/school-classroom.webp",# gallery
    },
}
EXPECTED_COUNTS = {"academics": {19}, "campus": {26, 28}}
EXPECTED_DEPTH = ("EXTERIOR", "HALL", "CLASSROOM", "TECH LAB", "COMMUNITY", "STUDENT LIFE")

def fix(page: str):
    path = ROOT / (page + ".html")
    before = path.read_text(encoding="utf-8")
    images = list(IMG.finditer(before))
    if len(images) not in EXPECTED_COUNTS[page]:
        raise RuntimeError(f"{page}: image count changed {len(images)}; review mapping before modifying")
    if page == "campus":
        if len(re.findall(r'\bdata-fx-archive="\d+"', before)) != 6:
            raise RuntimeError("Campus interactive gallery changed: review thumbnails")
        for label in EXPECTED_DEPTH:
            if label not in before:
                raise RuntimeError("Campus depth label missing: " + label)
    count = 0
    def apply(match):
        nonlocal count
        count += 1
        new = MAP[page].get(count)
        return replace_img(match.group(0), new) if new else match.group(0)
    updated = IMG.sub(apply, before)
    if page == "campus":
        thumbs = 0
        def align_thumb(m):
            nonlocal thumbs
            thumbs += 1
            src = re.search(r'\bdata-src="([^"]+)"', m.group(1))
            if not src:
                raise RuntimeError("Missing gallery data-src")
            original = src.group(1)
            preview = re.sub(r"-1200\.webp$", "-480.webp", original)
            if not (ROOT / preview).is_file():
                preview = original
            return m.group(1) + m.group(2) + replace_img(m.group(3), preview, decorative=True) + m.group(4)
        updated = THUMB.sub(align_thumb, updated)
        if thumbs != 6:
            raise RuntimeError(f"Expected six synchronized gallery thumbnails, got {thumbs}")
    if updated != before:
        path.write_text(updated, encoding="utf-8")
    print(page, "real scene updates:", len(MAP[page]), "matched preview thumbnails:", 6 if page == "campus" else 0)

if __name__ == "__main__":
    for name in MAP:
        fix(name)
