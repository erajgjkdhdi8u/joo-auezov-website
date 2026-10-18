#!/usr/bin/env python3
"""Find untranslated visible text on RU and EN pages. Report-only audit."""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
PAGES=["index","about","academics","admissions","campus","career","contacts","news","parents","resources","results","student-life","team","wellbeing"]
records=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True)
    for lang in ("ru","en"):
        for name in PAGES:
            page=browser.new_page(reduced_motion="reduce")
            page.goto(f"http://127.0.0.1:8765/{lang}/{name}.html?intro=off",wait_until="domcontentloaded",timeout=20000)
            page.wait_for_timeout(100)
            items=page.evaluate("""(lang) => {
              const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
              const out=[];
              let node;
              while((node=walker.nextNode())){
                const parent=node.parentElement;
                if(!parent || parent.closest('script,style,noscript,svg,[aria-hidden="true"],[hidden]')) continue;
                const s=node.nodeValue.trim().replace(/\s+/g,' ');
                if(s.length<4)continue;
                const suspect=lang==='en' ? /[А-Яа-яӘәҒғҚқҢңӨөҰұҮүҺһІі]/.test(s)
                  : /[ӘәҒғҚқҢңӨөҰұҮүҺһІі]/.test(s);
                if(suspect && getComputedStyle(parent).display!=='none') out.push(s.slice(0,180));
              }
              return [...new Set(out)];
            }""",lang)
            records.append({"lang":lang,"page":name,"count":len(items),"samples":items[:28]})
            print(lang,name,len(items),"samples:",json.dumps(items[:40],ensure_ascii=False))
            page.close()
    browser.close()
(ROOT/"v29-translation-audit.json").write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding="utf-8")
print("TOTAL residual text nodes:",sum(x["count"] for x in records))
