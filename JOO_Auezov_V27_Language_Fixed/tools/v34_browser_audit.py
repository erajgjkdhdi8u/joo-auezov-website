#!/usr/bin/env python3
"""V34 QA: 42 localized assets + 54 Chromium/WebKit mobile/desktop interactions."""
from __future__ import annotations
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
PAGES=("index","academics","campus","team","results","admissions")
NAMES=("index","about","academics","admissions","campus","career","contacts",
       "news","parents","resources","results","student-life","team","wellbeing")
SHOTS=ROOT/"v34-audit-screenshots"
SHOTS.mkdir(exist_ok=True)
issues=[]
checked=0

for lang in ("kk","ru","en"):
    folder=ROOT if lang=="kk" else ROOT/lang
    for name in NAMES:
        s=(folder/(name+".html")).read_text(encoding="utf-8")
        if s.count('v34-signature.css')!=1 or s.count('v34-signature.js')!=1:
            issues.append({"lang":lang,"page":name,"issue":"asset links"})
        if 'Created by <strong>Kuralbaev Rasul</strong>' not in s:
            issues.append({"lang":lang,"page":name,"issue":"credit missing"})

with sync_playwright() as pw:
    configs=[
        ("chromium-desktop",pw.chromium,{"viewport":{"width":1440,"height":900},"reduced_motion":"no-preference"}),
        ("chromium-mobile",pw.chromium,{"viewport":{"width":320,"height":844},"is_mobile":True,"has_touch":True,"reduced_motion":"reduce"}),
        ("webkit-mobile",pw.webkit,{"viewport":{"width":390,"height":844},"is_mobile":True,"has_touch":True,"reduced_motion":"reduce"})
    ]
    for mode,engine,opts in configs:
        browser=engine.launch(headless=True)
        ctx=browser.new_context(**opts)
        for lang in ("kk","ru","en"):
            for name in PAGES:
                checked+=1
                page=ctx.new_page()
                errors=[]
                page.on("pageerror",lambda exc: errors.append(str(exc)))
                prefix="" if lang=="kk" else lang+"/"
                item={"browser":mode,"language":lang,"page":name}
                faults=[]
                try:
                    res=page.goto("http://127.0.0.1:8765/"+prefix+name+".html?intro=off",wait_until="domcontentloaded",timeout=30000)
                    page.wait_for_timeout(150)
                    state=page.evaluate("""() => {
                        const m=document.getElementById('menuPanel'),r=document.querySelector('.v34-marquee');
                        return {
                          lang:document.documentElement.lang,ready:document.body.dataset.v34Ready,
                          menuEnhanced:!!m?.classList.contains('v34-luxury'),
                          menuRole:m?.getAttribute('role'),menuLabel:m?.getAttribute('aria-label'),
                          marqueeCount:document.querySelectorAll('main .v34-marquee').length,
                          marqueePhrases:[...document.querySelectorAll('.v34-marquee__phrase')].map(x=>x.textContent),
                          marqueeHidden:r?.getAttribute('aria-hidden'),
                          chapterNavRemoved:document.querySelectorAll('.v34-chapters').length===0,
                          sceneCount:document.querySelectorAll('main .story__visual').length,
                          curtains:document.querySelectorAll('main .v34-curtain').length,
                          overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth)
                        };
                    }""")
                    item.update(state)
                    if not res or res.status!=200:faults.append("http")
                    if state["lang"]!=lang or state["ready"]!="true":faults.append("language or script")
                    if not state["menuEnhanced"] or state["menuRole"]!="dialog" or not state["menuLabel"]:
                        faults.append("full-screen menu enhancements")
                    if state["marqueeCount"]!=1 or state["marqueeHidden"]!="true" or len(state["marqueePhrases"])!=2:
                        faults.append("marquee structure")
                    elif state["marqueePhrases"][0]!=state["marqueePhrases"][1] or {
                        "kk":"БІЛІМ","ru":"ЗНАНИЯ","en":"LEARN"}[lang] not in state["marqueePhrases"][0]:
                        faults.append("localized marquee")
                    if not state["chapterNavRemoved"]:
                        faults.append("chapter navigation unexpectedly present")
                    if mode.endswith("desktop") and state["sceneCount"]>0:
                        if state["curtains"]!=min(3,state["sceneCount"]):faults.append("curtain targets")
                        section=page.locator('main .story__visual').first
                        section.scroll_into_view_if_needed(timeout=12000)
                        page.wait_for_timeout(300)
                        if not section.evaluate("(el) => el.classList.contains('v34-curtain-open')"):
                            faults.append("photo curtain does not open")
                    if mode.endswith("mobile") and state["curtains"]!=0:faults.append("mobile curtain should be disabled")
                    if state["overflow"]>3:faults.append("horizontal overflow")
                    # Reuse the existing MENU/CLOSE and check modal keyboard control.
                    page.locator("#menuToggle").click(timeout=10000)
                    page.wait_for_timeout(95)
                    if page.locator("#menuPanel").evaluate("(m) => m.hidden"):faults.append("menu did not open")
                    else:
                        menu=page.locator("#menuPanel")
                        if menu.locator("a.nav-item").count()<14:faults.append("menu links lost")
                        if not menu.evaluate("(m) => m.classList.contains('v34-open')"):
                            faults.append("menu open animation class")
                        if mode.endswith("desktop"):
                            z=page.evaluate("""() => {
                                const m=getComputedStyle(document.getElementById('menuPanel'));
                                const h=getComputedStyle(document.querySelector('.masthead'));
                                return [Number(m.zIndex),Number(h.zIndex)];
                            }""")
                            if z[0]<=z[1]:faults.append("menu under sticky header")
                            # Focus cycle with real Tab navigation.
                            page.evaluate("""() => {
                                const menu=document.getElementById('menuPanel');
                                const f=[...menu.querySelectorAll('a[href],button:not([disabled])')]
                                    .filter(x=>x.getClientRects().length&&getComputedStyle(x).visibility!=='hidden');
                                f[f.length-1]?.focus();
                            }""")
                            page.keyboard.press("Tab")
                            if page.evaluate("document.activeElement.id")!="menuClose":
                                faults.append("menu Tab focus not trapped")
                        if lang=="kk" and name in ("index","campus"):
                            page.screenshot(path=str(SHOTS/(mode+"-"+name+"-menu.png")),animations="disabled",full_page=False)
                        page.keyboard.press("Escape")
                        if not menu.evaluate("(m) => m.hidden"):faults.append("Escape did not close menu")
                    if lang=="kk" and name in ("index","academics","campus","team") and mode=="chromium-desktop":
                        page.screenshot(path=str(SHOTS/(mode+"-"+name+"-page.png")),animations="disabled",full_page=False)
                    if errors:faults.append("JavaScript runtime errors")
                except Exception as err:
                    faults.append("exception: "+str(err)[:400])
                if faults:
                    item["issues"]=faults
                    item["jsErrors"]=errors[:3]
                    issues.append(item)
                page.close()
        ctx.close()
        browser.close()

report={"cases":checked,"static_pages":42,"issues":len(issues),"failures":issues[:24]}
(ROOT/"v34-browser-audit.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
print(json.dumps(report,ensure_ascii=False,indent=2))
if issues:raise SystemExit(1)
