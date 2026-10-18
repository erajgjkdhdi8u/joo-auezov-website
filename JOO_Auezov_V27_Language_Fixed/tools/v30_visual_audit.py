#!/usr/bin/env python3
"""V30 visual regression checks: three languages, four small phone widths,
portrait proportions, actual gallery image/label agreement, no broken assets.
Screenshots are stored as CI artifacts for manual visual review.
"""
from __future__ import annotations
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
PAGES = ["index","about","academics","admissions","campus","career","contacts",
         "news","parents","resources","results","student-life","team","wellbeing"]
SHOTS = ROOT / "v30-visual-screenshots"
SHOTS.mkdir(exist_ok=True)
records = []
with sync_playwright() as playwright:
    modes = [
        ("chromium", playwright.chromium, (320, 360, 375, 390)),
        ("webkit", playwright.webkit, (320, 390)),
    ]
    for browser_name, engine, widths in modes:
        browser = engine.launch(headless=True)
        for width in widths:
            context = browser.new_context(
                viewport={"width": width, "height": 844}, is_mobile=True,
                has_touch=True, device_scale_factor=2, reduced_motion="reduce")
            for lang in ("kk", "ru", "en"):
                for name in PAGES:
                    page = context.new_page()
                    errors = []
                    page.on("pageerror", lambda err: errors.append(str(err)))
                    url = "http://127.0.0.1:8765/" + ("" if lang == "kk" else lang + "/") + name + ".html?intro=off"
                    item = {"browser":browser_name,"width":width,"lang":lang,"page":name}
                    try:
                        response = page.goto(url, wait_until="domcontentloaded", timeout=30000)
                        page.wait_for_timeout(100)
                        item["http"] = response.status if response else 0
                        item.update(page.evaluate("""() => {
                            const rect = e => e.getBoundingClientRect();
                            const h = document.querySelector('.masthead');
                            const brand = h?.querySelector('.wordmark');
                            const actions = h?.querySelector('.nav-actions');
                            const title = document.querySelector('main h1, h1.hero__title');
                            const headings = [...document.querySelectorAll('h1,h2')].filter(e => {
                                const s=getComputedStyle(e), r=rect(e);
                                return s.display!=='none' && s.visibility!=='hidden' && r.width>0;
                            });
                            const outside = headings.filter(e => {
                                const r=rect(e);
                                return r.left < -3 || r.right > innerWidth+3;
                            }).slice(0,4).map(e=>({text:e.textContent.trim().slice(0,55),left:rect(e).left,right:rect(e).right}));
                            return {
                                overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth),
                                h1Count:document.querySelectorAll('h1').length,
                                headingOutside:outside,
                                headerCollision:!!(brand&&actions&&rect(brand).right>rect(actions).left+2),
                                titleClipped:!!(title && getComputedStyle(title).overflowY==='hidden' && title.scrollHeight>title.clientHeight+4),
                                brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth&&i.getAttribute('src')).map(i=>i.getAttribute('src')).slice(0,4),
                                portraitHeights:[...document.querySelectorAll('.staff-grid .joo-team-portrait>img')].map(i=>Math.round(rect(i).height)),
                                portraitFit:[...document.querySelectorAll('.staff-grid .joo-team-portrait--poster>img')].map(i=>getComputedStyle(i).objectFit),
                                campusThumbs:[...document.querySelectorAll('.fx-archive__thumb')].map(b=>({
                                    label:b.getAttribute('aria-label'), src:b.dataset.src,
                                    preview:b.querySelector('img')?.getAttribute('src')
                                })),
                                campusDepth:[...document.querySelectorAll('.joo-depth-card')].map(e=>({
                                    label:e.querySelector('figcaption span')?.textContent.trim(),
                                    image:e.querySelector('img')?.getAttribute('src')
                                }))
                            };
                        }"""))
                        item["jsErrors"] = errors[:3]
                        if browser_name=="chromium" and lang in ("kk","ru","en") and name in ("index","team","academics","campus","results") and width in (320,390):
                            page.screenshot(path=str(SHOTS/f"{browser_name}-{width}-{lang}-{name}.png"), full_page=True, animations="disabled", timeout=25000)
                    except Exception as exc:
                        item["exception"] = str(exc)
                    records.append(item)
                    page.close()
            context.close()
        browser.close()

issues = []
expected_depth = ("exterior","hall","classroom","computerlab","assembly","students")
for r in records:
    problem = []
    if r.get("exception"): problem.append("exception")
    if r.get("http")!=200: problem.append("http")
    if r.get("overflow",0)>3: problem.append("overflow")
    if r.get("headingOutside"): problem.append("headingOutside")
    if r.get("headerCollision"): problem.append("headerCollision")
    if r.get("titleClipped"): problem.append("titleClipped")
    if r.get("brokenImages"): problem.append("brokenImages")
    if r.get("jsErrors"): problem.append("jsErrors")
    if r.get("h1Count")!=1: problem.append("h1Count")
    if r["page"]=="team":
        heights=r.get("portraitHeights",[])
        if len(heights)!=10 or max(heights,default=0)-min(heights,default=0)>3:
            problem.append("portraitHeights")
        if r.get("portraitFit")!=["contain"]*6:
            problem.append("portraitFit")
    if r["page"]=="campus":
        thumbs=r.get("campusThumbs",[])
        if len(thumbs)!=6:
            problem.append("thumbCount")
        for t in thumbs:
            src=t.get("src","").split("/")[-1]
            preview=t.get("preview","").split("/")[-1]
            normalize=lambda x: x.replace("-480.webp",".webp").replace("-800.webp",".webp").replace("-1200.webp",".webp")
            if normalize(src)!=normalize(preview):problem.append("thumbMismatch")
        depth=r.get("campusDepth",[])
        if len(depth)!=6 or any(expected_depth[i] not in (x.get("image") or "").lower() for i,x in enumerate(depth)):
            problem.append("depthMismatch")
    if problem:
        issues.append({"browser":r["browser"],"width":r["width"],"lang":r["lang"],"page":r["page"],"problems":problem,
                       "details":{k:r.get(k) for k in ("overflow","headingOutside","headerCollision","portraitHeights","campusThumbs","campusDepth","exception") if r.get(k)}})
report={"checked":len(records),"issues":len(issues),"failures":issues[:50]}
(ROOT/"v30-visual-audit.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
print(json.dumps(report,ensure_ascii=False,indent=2))
if issues:raise SystemExit(1)
