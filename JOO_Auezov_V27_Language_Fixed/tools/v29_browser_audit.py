#!/usr/bin/env python3
"""Browser matrix: Chromium Android emulation, WebKit iPhone emulation,
Firefox desktop, Chromium desktop. Also runs axe-core WCAG audit.
Not a substitute for testing on physical devices or real user CWV.
"""
from __future__ import annotations

import json
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
BASE = "http://127.0.0.1:8765"
AXE = Path("node_modules/axe-core/axe.min.js")
PAGES = ["index", "about", "academics", "admissions", "campus", "career", "contacts", "news", "parents", "resources", "results", "student-life", "team", "wellbeing"]
REPORT = ROOT / "v29-browser-audit.json"
checks = []
axe_findings = []
with sync_playwright() as p:
    modes = [
        ("android-chromium", p.chromium, dict(viewport={"width": 393, "height": 851}, device_scale_factor=2.75, is_mobile=True, has_touch=True, reduced_motion="reduce")),
        ("iphone-webkit", p.webkit, dict(viewport={"width": 390, "height": 844}, device_scale_factor=3, is_mobile=True, has_touch=True, reduced_motion="reduce")),
        ("firefox-desktop", p.firefox, dict(viewport={"width": 1366, "height": 900}, reduced_motion="reduce")),
        ("chromium-desktop", p.chromium, dict(viewport={"width": 1440, "height": 900}, reduced_motion="reduce")),
    ]
    for label, engine, opts in modes:
        browser = engine.launch(headless=True)
        context = browser.new_context(**opts)
        for lang in ("kk", "ru", "en"):
            for name in PAGES:
                path = ("" if lang == "kk" else lang + "/") + name + ".html"
                page = context.new_page()
                errors = []
                page.on("pageerror", lambda error: errors.append(str(error)))
                record = {"browser": label, "lang": lang, "page": name}
                try:
                    response = page.goto(BASE + "/" + path + "?intro=off", wait_until="domcontentloaded", timeout=30000)
                    page.wait_for_timeout(220)
                    record["http"] = response.status if response else 0
                    record.update(page.evaluate("""() => ({
                        langActual: document.documentElement.lang,
                        overflowPx: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
                        h1: document.querySelectorAll('h1').length,
                        skip: document.querySelectorAll('a.skip-link').length,
                        canonical: document.querySelector('link[rel=canonical]')?.href,
                        alternate: document.querySelectorAll('link[rel=alternate][hreflang]').length,
                        brokenImages: [...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).map(i => i.getAttribute('src')).slice(0,5)
                    })"""))
                    record["jsErrors"] = errors[:5]
                    if name == "admissions":
                        form = page.locator("#enquiryForm")
                        record["netlifyForm"] = form.get_attribute("data-netlify") == "true"
                        record["consent"] = form.locator('[name="consent"]').count() == 1
                        record["formTranslation"] = (form.locator("label > span").first.inner_text().strip() ==
                            {"kk": "АТЫ-ЖӨНІ", "ru": "ИМЯ И ФАМИЛИЯ", "en": "FULL NAME"}[lang])
                        record["gradeTranslation"] = (form.locator('select[name="grade"] option').first.inner_text().strip() ==
                            {"kk": "Сыныпты таңдаңыз", "ru": "Выберите класс", "en": "Choose a grade"}[lang])
                    if name == "index":
                        record["languageNav"] = page.locator('[data-lang="en"]').count() > 0
                    if AXE.is_file() and lang == "kk" and (label == "chromium-desktop" or (label == "android-chromium" and name in ("index", "admissions", "team"))):
                        page.add_script_tag(path=str(AXE))
                        result = page.evaluate("""async () => await axe.run(document, {
                            runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']}
                        })""")
                        axe_findings.append({"browser": label, "page": name,
                            "violations": [{"id": v["id"], "impact": v["impact"], "nodes": len(v["nodes"]),
                                            "description": v["description"], "targets": [{"selector": n["target"], "html": n["html"][:220]} for n in v["nodes"][:6]]} for v in result["violations"]]})
                    checks.append(record)
                except Exception as exc:
                    record["exception"] = str(exc)
                    checks.append(record)
                finally:
                    page.close()
        context.close()
        browser.close()
REPORT.write_text(json.dumps({"checks": checks, "axe": axe_findings}, ensure_ascii=False, indent=2), encoding="utf-8")
bad = [x for x in checks if x.get("exception") or x.get("http") != 200
       or x.get("langActual") != x["lang"] or x.get("overflowPx", 0) > 3
       or x.get("h1") != 1 or x.get("skip") != 1 or x.get("alternate") != 4
       or x.get("brokenImages") or x.get("jsErrors") or x.get("netlifyForm") is False
       or x.get("consent") is False or x.get("formTranslation") is False
       or x.get("gradeTranslation") is False]
print(json.dumps({"tested": len(checks), "functionalIssues": len(bad),
                  "issues": bad[:25], "axe": axe_findings}, ensure_ascii=False, indent=2))
if bad:
    raise SystemExit(1)
