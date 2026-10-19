#!/usr/bin/env python3
"""V33 Cinematic Edition visual smoke test with desktop + mobile rendering.
Keeps the V30 252-case phone regression as a separate broader guard.
"""
from __future__ import annotations
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
SCREEN = ROOT / "v33-cinematic-screenshots"
SCREEN.mkdir(exist_ok=True)
BASE = "http://127.0.0.1:8765/"
PAGES = ("index", "campus", "results", "team")
records = []

with sync_playwright() as pw:
    scenarios = [
        ("chromium-desktop",pw.chromium,dict(viewport={"width":1440,"height":900},
             reduced_motion="no-preference")),
        ("webkit-mobile",pw.webkit,dict(viewport={"width":390,"height":844},
             is_mobile=True,has_touch=True,device_scale_factor=2,reduced_motion="reduce")),
    ]
    for browser_name, engine, options in scenarios:
        browser = engine.launch(headless=True)
        ctx = browser.new_context(**options)
        for lang in ("kk","ru","en"):
            for slug in PAGES:
                page = ctx.new_page()
                errors = []
                page.on("pageerror",lambda error: errors.append(str(error)))
                href = ("" if lang=="kk" else lang+"/")+slug+".html?intro=off"
                item={"browser":browser_name,"language":lang,"page":slug}
                try:
                    response=page.goto(BASE+href,wait_until="domcontentloaded",timeout=30000)
                    page.wait_for_timeout(230)
                    item["status"]=response.status if response else 0
                    item.update(page.evaluate("""() => {
                        const q = s => document.querySelector(s);
                        const title=q('h1.hero__title');
                        const teamNames=['9','10'].map(id => {
                            const e=q('.staff-grid .joo-team-portrait[data-joo-team="'+id+'"] h3');
                            if(!e) return false;
                            const c=getComputedStyle(e),r=e.getBoundingClientRect();
                            return r.width>0 && r.height>0 && c.display!=='none' && c.visibility!=='hidden' && c.opacity!=='0' && e.textContent.trim().length>3;
                        });
                        const bento=q('.v33-bento');
                        const figures=bento?[...bento.querySelectorAll('figure')]:[];
                        return {
                            lang:document.documentElement.lang,
                            assetLinks:!!q('link[href="v33-cinematic.css"]')&&!!q('script[src="v33-cinematic.js"]'),
                            heroWords:document.querySelectorAll('.hero--index .v33-word').length,
                            heroTitleReadable:!!title&&title.getAttribute('aria-label')===title.getAttribute('data-'+document.documentElement.lang),
                            bentoTiles:figures.length,
                            bentoFirstWidth:figures[0]?.getBoundingClientRect().width||0,
                            bentoSecondWidth:figures[1]?.getBoundingClientRect().width||0,
                            scoreRows:document.querySelectorAll('.results-chart .score-row').length,
                            firstScore:q('.score-row strong')?.textContent.trim(),
                            teamNames,
                            brokenLoadedImages:[...document.images].filter(i=>i.complete&&i.naturalWidth===0&&i.getAttribute('src')).map(i=>i.getAttribute('src')).slice(0,6),
                            overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth)
                        };
                    }"""))
                    item["errors"]=errors[:4]
                    if slug=="results" and browser_name=="chromium-desktop":
                        page.locator("#scores").scroll_into_view_if_needed()
                        page.wait_for_timeout(1500)
                        item["animatedScores"]=page.locator("#scores").evaluate(
                            "(e) => e.classList.contains('v33-visible')")
                        item["finalHighScore"]=page.locator("#scores .results-chart__aside>strong").inner_text().strip()
                    if lang=="kk":
                        page.screenshot(path=str(SCREEN/(browser_name+"-"+slug+".png")),
                            full_page=True,animations="disabled",timeout=30000)
                except Exception as exc:
                    item["exception"]=str(exc)
                records.append(item)
                page.close()
        ctx.close()
        browser.close()

issues=[]
for item in records:
    errors=[]
    slug=item["page"]
    if item.get("exception"):errors.append("exception")
    if item.get("status")!=200:errors.append("http")
    if item.get("lang")!=item["language"]:errors.append("language")
    if not item.get("assetLinks"):errors.append("missing V33 assets")
    if item.get("overflow",0)>3:errors.append("horizontal overflow")
    if item.get("errors") or item.get("brokenLoadedImages"):errors.append("js/images")
    if slug=="index":
        if item.get("heroWords",0)<2 or not item.get("heroTitleReadable"):errors.append("cinematic hero typography")
    elif slug=="campus":
        if item.get("bentoTiles")!=5:errors.append("five photo bento")
        if item["browser"]=="chromium-desktop" and item.get("bentoFirstWidth",0)<item.get("bentoSecondWidth",0)*1.5:
            errors.append("large editorial tile")
    elif slug=="results":
        if item.get("scoreRows")!=8 or item.get("firstScore")!="121":errors.append("real eight scores")
        if item["browser"]=="chromium-desktop" and (
            not item.get("animatedScores") or not item.get("finalHighScore","").startswith("121")
        ):errors.append("scores reveal")
    elif slug=="team":
        if item.get("teamNames")!=[True,True]:errors.append("Eldos and Balzhan names visible")
    if errors:
        issues.append({"case":item,"problems":errors})

report={"total":len(records),"failed":len(issues),"failures":issues[:20]}
(ROOT/"v33-cinematic-audit.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
print(json.dumps(report,ensure_ascii=False,indent=2))
if issues: raise SystemExit(1)
