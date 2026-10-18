#!/usr/bin/env python3
"""Apply the JOO Auezov V28 photo package to the V27 site.

Copy the eleven .webp files from JOO_V28_Photo_Update/assets/images/v28/
into the site's assets/images/v28/ directory first.
Run: python tools/apply_v28_photos.py --dry-run
Then: python tools/apply_v28_photos.py
No CSS, JavaScript, or i18n files are modified.
"""
from __future__ import annotations

import argparse
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IMAGE_DIR = "assets/images/v28/"
PREFERENCES = {
    "exterior": ["school-building.webp", "school-reception.webp", "school-corridor.webp"],
    "classroom": ["school-classroom.webp", "school-cafeteria.webp", "school-reception.webp"],
    "students": ["school-students.webp", "school-lounge.webp", "school-classroom.webp"],
    "corridor": ["school-corridor.webp", "school-lounge.webp", "school-reception.webp"],
    "hall": ["school-reception.webp", "school-lounge.webp", "school-cafeteria.webp"],
    "assembly": ["school-gym.webp", "school-lounge.webp"],
    "computerlab": ["school-classroom.webp", "school-reception.webp"],
}
TEACHERS = [
    ("08", "teacher-magzhan.webp", "Сұлтанайұлы Мағжан", "МАТЕМАТИКА ПӘНІ МҰҒАЛІМІ", "Магжан Султанайулы", "Учитель математики", "Magzhan Sultanaiuly", "Mathematics teacher"),
    ("09", "teacher-eldos.webp", "Әбдіқадыр Елдос", "ДЕНЕ ШЫНЫҚТЫРУ ПӘНІ МҰҒАЛІМІ", "Елдос Абдикадыр", "Учитель физкультуры", "Eldos Abdikadyr", "Physical education teacher"),
    ("10", "teacher-balzhan.webp", "Орақбай Балжан", "БИОЛОГИЯ ПӘНІ МҰҒАЛІМІ", "Балжан Оракбай", "Учитель биологии", "Balzhan Orakbay", "Biology teacher"),
]
IMG_RE = re.compile(r"<img\b[^>]*>", re.I | re.S)
SRC_RE = re.compile(r"""\bsrc\s*=\s*(["'])(.*?)\1""", re.I | re.S)
SRCSET_RE = re.compile(r"""\s+srcset\s*=\s*(["']).*?\1""", re.I | re.S)
SIZES_RE = re.compile(r"""\s+sizes\s*=\s*(["']).*?\1""", re.I | re.S)
ORIG_RE = re.compile(r"^assets/images/(exterior|classroom|students|corridor|hall|assembly|computerlab)(?:-(?:480|800|1200))?\.webp$", re.I)


def escape(value: str) -> str:
    return value.replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;")


def card(info):
    number, filename, kk, subject_kk, ru, subject_ru, en, subject_en = info
    def lang(k, r, e):
        return f'data-kk="{escape(k)}" data-ru="{escape(r)}" data-en="{escape(e)}"'
    return (
        f'<article tabindex="0" class="joo-team-portrait joo-team-prepared joo-team-portrait--poster" '
        f'data-joo-team="{int(number)}" data-joo-v28="teacher">'
        f'<span class="joo-team-portrait__id">JOO / {number}</span>'
        f'<span class="joo-team-portrait__glint" aria-hidden="true"></span>'
        f'<img alt="{escape(kk)} — {escape(subject_kk)}" loading="lazy" decoding="async" '
        f'src="{IMAGE_DIR}{filename}"/>'
        f'<div><small><span {lang(subject_kk, subject_ru, subject_en)}>{subject_kk}</span> '
        f'<span class="joo-team-portrait__arrow" aria-hidden="true">↗</span></small>'
        f'<h3 {lang(kk, ru, en)}>{kk}</h3></div></article>'
    )


def update_team(html: str) -> str:
    if 'data-joo-v28="teacher"' in html:
        return html
    match = re.search(
        r'(<div\s+class="staff-grid staff-grid--teachers"[^>]*>)(.*?)(</div>\s*</section>)',
        html, re.S | re.I
    )
    if not match:
        raise ValueError("team.html: teacher grid not found")
    pos = match.start(3)
    return html[:pos] + "".join(card(teacher) for teacher in TEACHERS) + html[pos:]


def remove_mereke(html: str) -> str:
    if "Мереке Ұстаз" not in html and "mereke-ustaz-poster.png" not in html:
        return html
    section = html.find('id="guides"')
    if section < 0:
        raise ValueError("career.html: guidance section missing")
    start = html.find('<article class="guide-card">', section)
    end = html.find("</article>", start)
    if start < 0 or end < 0:
        raise ValueError("career.html: guide card missing")
    end += len("</article>")
    if "Мереке Ұстаз" not in html[start:end]:
        raise ValueError("career.html: Mereke card is not first; refusing unsafe removal")
    result = html[:start] + html[end:]
    if "Мереке Ұстаз" in result or "mereke-ustaz-poster.png" in result:
        raise ValueError("career.html: other Mereke references remain")
    return result


def update_images(html: str) -> tuple[str, int]:
    used = set()
    seen = Counter()
    count = 0
    def replace(match):
        nonlocal count
        tag = match.group(0)
        found = SRC_RE.search(tag)
        if not found:
            return tag
        original = ORIG_RE.match(found.group(2))
        if not original:
            return tag
        category = original.group(1).lower()
        seen[category] += 1
        if category == "computerlab" and seen[category] == 1:
            return tag
        wide_hero = found.group(2).endswith("-1200.webp")
        for candidate in PREFERENCES[category]:
            if candidate in used:
                continue
            if wide_hero and candidate in {"school-building.webp", "school-classroom.webp", "school-students.webp", "school-reception.webp"}:
                continue
            used.add(candidate)
            count += 1
            newpath = IMAGE_DIR + candidate
            tag = tag[:found.start(2)] + newpath + tag[found.end(2):]
            return SIZES_RE.sub("", SRCSET_RE.sub("", tag))
        return tag
    return IMG_RE.sub(replace, html), count


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    required = {filename for names in PREFERENCES.values() for filename in names}
    required.update(teacher[1] for teacher in TEACHERS)
    missing = sorted(name for name in required if not (ROOT / IMAGE_DIR / name).is_file())
    if missing:
        parser.error("Missing V28 images in assets/images/v28/: " + ", ".join(missing))
    changes = []
    for page in sorted(ROOT.glob("*.html")):
        original = page.read_text(encoding="utf-8")
        updated, replaced = update_images(original)
        if page.name == "team.html":
            updated = update_team(updated)
        if page.name == "career.html":
            updated = remove_mereke(updated)
        if updated != original:
            changes.append((page, original, updated, replaced))
    for page, _, __, replaced in changes:
        print(f"{page.name}: {replaced} photo replacements")
    if args.dry_run:
        print("DRY RUN: no files modified")
        return
    backup = ROOT / ".v28-original-html"
    backup.mkdir(exist_ok=True)
    for page, original, updated, _ in changes:
        backup_file = backup / page.name
        if not backup_file.exists():
            backup_file.write_text(original, encoding="utf-8")
        page.write_text(updated, encoding="utf-8")
    print("V28 photos and teacher cards applied. CSS, JS and language files preserved.")


if __name__ == "__main__":
    main()
