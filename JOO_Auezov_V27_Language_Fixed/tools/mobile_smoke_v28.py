#!/usr/bin/env python3
"""Playwright smoke audit for V28 on local static server.
Usage: python tools/mobile_smoke_v28.py
"""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:8765"
ROOT = Path(__file__).resolve().parents[1]
PAGES = [
    "index", "about", "academics", "admissions", "campus", "career",
    "contacts", "news", "parents", "resources", "results",
    "student-life", "team", "wellbeing"
]
REPORT = ROOT / "v28-mobile-audit.json"
SHOTS = ROOT / "v28-audit-screenshots"
SHOTS.mkdir(exist_ok=True)
checks = []

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    for viewport_name, width, height in [("mobile", 390, 844), ("desktop", 1440, 900)]:
        context = browser.new_context(viewport={"width": width, "height": height}, device_scale_factor=1)
        for name in PAGES:
            page = context.new_page()
            errors = []
            page.on("pageerror", lambda error: errors.append(str(error)))
            url = BASE + ("/index.html?intro=off" if name == "index" else "/" + name + ".html")
            try:
                response = page.goto(url, wait_until="domcontentloaded", timeout=20000)
                page.wait_for_timeout(550)
                status = response.status if response else 0
                data = page.evaluate("""() => ({
                    scrollWidth: document.documentElement.scrollWidth,
                    innerWidth: window.innerWidth,
                    h1: document.querySelectorAll('h1').length,
                    skip: document.querySelectorAll('a.skip-link').length,
                    imagesBroken: [...document.images].filter(i => i.hasAttribute('src') && i.complete && i.naturalWidth === 0).map(i => i.src).slice(0,8),
                    title: document.title
                })""")
                overflow = max(0, data["scrollWidth"] - data["innerWidth"])
                result = {
                    "page": name, "viewport": viewport_name, "http": status,
                    "overflowPx": overflow, "h1": data["h1"], "skip": data["skip"],
                    "brokenImages": data["imagesBroken"], "jsErrors": errors[:5]
                }
                if name in ["index", "admissions", "career", "team", "campus", "contacts"]:
                    page.screenshot(path=str(SHOTS / (name + "-" + viewport_name + ".png")), full_page=False)
                if name == "admissions":
                    page.locator('#enquiryForm [name="parent"]').fill("Ата-ана Тест")
                    page.locator('#enquiryForm [name="phone"]').fill("+7 777 123 45 67")
                    page.locator('#enquiryForm [name="grade"]').select_option("8")
                    page.wait_for_timeout(200)
                    result["previewWorks"] = "Ата-ана Тест" in page.locator("#enquiryPreview").inner_text()
                    result["copyButtonExists"] = page.locator("#enquiryCopy").count() == 1
                if name == "index":
                    page.locator('[data-lang="en"]').first.evaluate("(el) => el.click()")
                    result["englishSwitchWorks"] = page.locator("html").get_attribute("lang") == "en"
                    page.locator('[data-lang="ru"]').first.evaluate("(el) => el.click()")
                    result["russianSwitchWorks"] = page.locator("html").get_attribute("lang") == "ru"
                checks.append(result)
                print(json.dumps(result, ensure_ascii=False))
            except Exception as error:
                result = {"page": name, "viewport": viewport_name, "exception": str(error)}
                checks.append(result)
                print(json.dumps(result, ensure_ascii=False))
            finally:
                page.close()
        context.close()
    browser.close()

REPORT.write_text(json.dumps(checks, ensure_ascii=False, indent=2), encoding="utf-8")
bad = [r for r in checks if r.get("exception") or r.get("http") != 200
       or r.get("overflowPx", 0) > 3 or r.get("brokenImages")
       or r.get("jsErrors") or r.get("skip") != 1
       or r.get("previewWorks") is False
       or r.get("englishSwitchWorks") is False
       or r.get("russianSwitchWorks") is False]
print("V28 MOBILE AUDIT:", len(checks), "checks,", len(bad), "issues")
if bad:
    print("ISSUES:", json.dumps(bad, ensure_ascii=False, indent=2))
    raise SystemExit(1)
