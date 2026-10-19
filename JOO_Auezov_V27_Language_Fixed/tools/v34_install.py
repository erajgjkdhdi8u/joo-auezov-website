#!/usr/bin/env python3
"""Install V34 motion assets into exactly 42 KK/RU/EN pages, idempotently.

Images, headings, school identity, forms and existing animation layers stay intact.
"""
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
PAGES=("index","about","academics","admissions","campus","career","contacts",
       "news","parents","resources","results","student-life","team","wellbeing")
CSS='<link href="v34-signature.css" rel="stylesheet"/>'
JS='<script defer src="v34-signature.js"></script>'

def install():
    for asset in ("v34-signature.css","v34-signature.js"):
        assert (ROOT/asset).is_file(), asset
    patched=0
    for lang in ("kk","ru","en"):
        folder=ROOT if lang=="kk" else ROOT/lang
        for name in PAGES:
            path=folder/(name+".html")
            original=path.read_text(encoding="utf-8")
            s=original
            if CSS not in s:
                anchor='<link href="joo-six-effects.css" rel="stylesheet"/>'
                if anchor not in s:
                    raise RuntimeError(f"{path}: missing stylesheet anchor")
                s=s.replace(anchor,anchor+CSS,1)
            if JS not in s:
                anchor='<script defer src="joo-six-effects.js"></script>'
                if anchor not in s:
                    raise RuntimeError(f"{path}: missing JS anchor")
                s=s.replace(anchor,anchor+JS,1)
            assert s.count(CSS)==1 and s.count(JS)==1,(path,"duplicate asset")
            assert 'Created by <strong>Kuralbaev Rasul</strong>' in s,path
            assert 'lang="'+lang+'"' in s,path
            if name=="team":
                for teacher in ("teacher-magzhan.webp","teacher-eldos.webp","teacher-balzhan.webp"):
                    assert teacher in s,(path,teacher)
                assert "Мереке Ұстаз" not in s
            if name=="admissions":
                assert 'data-netlify="true"' in s,path
            if s!=original:
                path.write_text(s,encoding="utf-8")
                patched+=1
    print(f"PASS: V34 assets in 42 trilingual pages; {patched} HTML files updated")

if __name__=="__main__":
    install()
