#!/usr/bin/env python3
"""Replace the large career poster PNG with a visually faithful compressed WebP."""
from pathlib import Path
from PIL import Image
from site_quality_v28 import ROOT

original = ROOT / 'assets/images/career/dias-asanov-poster.png'
optimized = ROOT / 'assets/images/career/dias-asanov-poster.webp'
page = ROOT / 'career.html'
if not original.is_file():
    raise RuntimeError('Missing original career portrait')
if not optimized.is_file():
    with Image.open(original) as im:
        if im.mode not in ('RGB', 'RGBA'):
            im = im.convert('RGB')
        im.save(optimized, 'WEBP', quality=82, method=6)
content = page.read_text(encoding='utf-8')
old = 'assets/images/career/dias-asanov-poster.png'
new = 'assets/images/career/dias-asanov-poster.webp'
if old in content:
    page.write_text(content.replace(old, new), encoding='utf-8')
print('Career poster:', original.stat().st_size, '->', optimized.stat().st_size, 'bytes')
