import { chromium } from "playwright-core";

const exe = "/home/ubuntu/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome";
const url = process.argv[2] || "http://localhost:3000";
const out = process.argv[3] || "shot.png";
const seekFrac = process.argv[4] ? Number(process.argv[4]) : null;
const full = process.argv[5] === "full";

const browser = await chromium.launch({ executablePath: exe, args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 940 }, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: "networkidle" });

if (seekFrac != null) {
  await page.evaluate((frac) => {
    const el = document.querySelector('input[aria-label="Scrub the day"]');
    if (!el) return;
    const max = Number(el.max);
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    setter.call(el, String(Math.round(max * frac)));
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }, seekFrac);
}

await page.waitForTimeout(1100);
await page.screenshot({ path: out, fullPage: full });
await browser.close();
console.log("shot:", out);
