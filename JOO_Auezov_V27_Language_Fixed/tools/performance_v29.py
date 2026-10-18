#!/usr/bin/env python3
"""Preload the real above-the-fold hero without changing the visual design."""
import html
import re
from site_quality_v28 import ROOT, PAGES

PRELOAD = re.compile(r'\s*<!-- JOO V29 HERO PRELOAD -->\s*<link[^>]+rel="preload"[^>]*>', re.I)
IMG = re.compile(r'<img\b[^>]*\bfetchpriority="high"[^>]*>', re.I | re.S)
ATTR = lambda name, tag: (re.search(r'\b' + name + r'="([^"]*)"', tag, re.I) or [None, None])[1]

for page in PAGES:
    path = ROOT / (page + '.html')
    source = path.read_text(encoding='utf-8')
    source = PRELOAD.sub('', source)
    match = IMG.search(source)
    if not match:
        print(page + ': no priority hero')
        continue
    tag = match.group(0)
    src = ATTR('src', tag)
    if not src or not (ROOT / src).is_file():
        raise RuntimeError('Hero image missing: ' + str(src))
    preload = '<!-- JOO V29 HERO PRELOAD --><link rel="preload" as="image" href="' + html.escape(src, quote=True) + '"'
    srcset = ATTR('srcset', tag)
    if srcset:
        preload += ' imagesrcset="' + html.escape(srcset, quote=True) + '" imagesizes="' + html.escape(ATTR('sizes', tag) or '100vw', quote=True) + '"'
    preload += ' fetchpriority="high"/>'
    source = source.replace('</head>', preload + '</head>', 1)
    new_tag = tag
    if 'loading=' not in tag:
        new_tag = new_tag.replace('<img', '<img loading="eager"', 1)
    if 'decoding="async"' in new_tag:
        new_tag = new_tag.replace('decoding="async"', 'decoding="sync"')
    source = source.replace(tag, new_tag, 1)
    path.write_text(source, encoding='utf-8')
    print(page + ': preloaded ' + src)
