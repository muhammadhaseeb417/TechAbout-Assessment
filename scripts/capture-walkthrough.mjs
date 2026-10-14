import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const screenshotDir = path.join(root, "screenshots");
const chromePath = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const baseUrl = process.env.APP_URL || "http://127.0.0.1:3000";

await mkdir(screenshotDir, { recursive: true });
const browser = await chromium.launch({ executablePath: chromePath, headless: true });

async function capture(name, url, selector, viewport = { width: 1440, height: 1100 }, waitUntil = "domcontentloaded") {
  const page = await browser.newPage({ viewport });
  await page.goto(`${baseUrl}${url}`, { waitUntil });
  await page.locator(selector).waitFor({ state: "visible", timeout: 15_000 });
  const output = path.join(screenshotDir, `${name}.png`);
  await page.screenshot({ path: output });
  await page.close();
  console.log(`Saved ${path.relative(root, output)}`);
}

async function tabUntil(page, selector, limit = 80) {
  for (let tab = 0; tab < limit; tab += 1) {
    if (await page.locator(selector).evaluate((element) => element === document.activeElement)) return;
    await page.keyboard.press("Tab");
  }
  throw new Error(`Keyboard traversal did not reach ${selector} within ${limit} Tab presses.`);
}

try {
  await capture(
    "loading-slow",
    "/air/search?route=KHI-DXB&date=2026-11-15&pax=1&cabin=economy&simulate=slow",
    ".results-skeleton",
    { width: 1440, height: 1100 },
    "commit",
  );
  await capture(
    "empty-filters",
    "/air/search?route=KHI-DXB&date=2026-11-15&pax=1&cabin=economy&stops=nonstop&airlines=Qatar%20Airways&price=0-50000&sort=price",
    ".empty-state",
  );
  await capture(
    "error-retry",
    "/air/search?route=KHI-DXB&date=2026-11-15&pax=1&cabin=economy&stops=nonstop&airlines=Pakistan%20International%20Airlines&price=0-100000&sort=price&simulate=error",
    ".error-state",
  );
  await capture(
    "partial-results",
    "/air/search?route=KHI-DXB&date=2026-11-15&pax=1&cabin=economy&simulate=partial",
    ".partial-banner",
  );

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  await desktop.goto(`${baseUrl}/air/search?route=KHI-DXB&date=2026-11-15&pax=1&cabin=economy&simulate=ok`, { waitUntil: "domcontentloaded" });
  await desktop.locator(".results-count").waitFor({ state: "visible", timeout: 15_000 });
  await tabUntil(desktop, '.desktop-filters input[name="stops"][value="all"]');
  await desktop.keyboard.press("ArrowDown");
  const nonstopChecked = await desktop.locator('.desktop-filters input[name="stops"][value="nonstop"]').isChecked();
  if (!nonstopChecked) throw new Error("ArrowDown did not select the Nonstop radio option.");
  await desktop.keyboard.press("Tab");
  const airlineFocused = await desktop.locator('.desktop-filters input[name="airlines"][value="Pakistan International Airlines"]').evaluate((element) => element === document.activeElement);
  if (!airlineFocused) throw new Error("Tab did not move from Stops to the first airline checkbox.");
  await desktop.keyboard.press("Space");
  if (!(await desktop.locator('.desktop-filters input[name="airlines"][value="Pakistan International Airlines"]').isChecked())) {
    throw new Error("Space did not select Pakistan International Airlines.");
  }
  await tabUntil(desktop, '.desktop-filters input[name="priceMax"]');
  await desktop.keyboard.press("Control+A");
  await desktop.keyboard.type("100000");
  await tabUntil(desktop, ".desktop-filters .apply-filters");
  await desktop.keyboard.press("Enter");
  await desktop.waitForURL((url) => url.searchParams.get("stops") === "nonstop" && url.searchParams.get("price") === "0-100000", { timeout: 10_000 });
  if (new URL(desktop.url()).searchParams.get("airlines") !== "Pakistan International Airlines") {
    throw new Error("The filter form did not write the selected airline to the URL.");
  }
  await desktop.locator(".results-count").waitFor({ state: "visible", timeout: 15_000 });
  await tabUntil(desktop, ".sort-control select");
  await desktop.keyboard.press("End");
  await desktop.keyboard.press("Enter");
  await desktop.waitForURL((url) => url.searchParams.get("sort") === "departure", { timeout: 10_000 });
  await desktop.goBack();
  await desktop.waitForURL((url) => !url.searchParams.has("sort"), { timeout: 10_000 });
  const filtersSurvivedBack = await desktop.evaluate(() => {
    const params = new URLSearchParams(location.search);
    return params.get("stops") === "nonstop" && params.get("price") === "0-100000";
  });
  if (!filtersSurvivedBack) throw new Error("Browser Back did not restore the earlier URL-backed filters.");
  console.log("Desktop keyboard pass: radio arrow, airline Space, price entry, Enter to apply and native sort selection; browser Back restored the previous filter URL.");
  await desktop.close();

  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${baseUrl}/air/search?route=KHI-DXB&date=2026-11-15&pax=1&cabin=economy&simulate=ok`, { waitUntil: "domcontentloaded" });
  await page.locator(".results-count").waitFor({ state: "visible", timeout: 15_000 });
  let triggerHasFocus = false;
  for (let tab = 0; tab < 40 && !triggerHasFocus; tab += 1) {
    await page.keyboard.press("Tab");
    triggerHasFocus = await page.locator(".mobile-filter-trigger").evaluate((element) => element === document.activeElement);
  }
  if (!triggerHasFocus) throw new Error("Keyboard traversal did not reach the mobile Filters button within 40 Tab presses.");
  await page.keyboard.press("Enter");
  await page.locator(".filter-dialog[open]").waitFor({ state: "visible" });
  await page.keyboard.press("Shift+Tab");
  const focusStayedInDialog = await page.locator(".filter-dialog").evaluate((dialog) => dialog.contains(document.activeElement));
  if (!focusStayedInDialog) throw new Error("Shift+Tab moved focus outside the mobile filter dialog.");
  const keyboardShot = path.join(screenshotDir, "keyboard-filter-dialog.png");
  await page.screenshot({ path: keyboardShot });
  await page.keyboard.press("Escape");
  const focusReturnedToTrigger = await page.locator(".mobile-filter-trigger").evaluate((element) => element === document.activeElement);
  if (!focusReturnedToTrigger) throw new Error("Escape did not restore focus to the Filters button.");
  console.log(`Saved ${path.relative(root, keyboardShot)}`);
  console.log("Keyboard pass: reached Filters with Tab, opened with Enter, kept Shift+Tab focus inside, and Escape restored focus.");
  await page.close();
} finally {
  await browser.close();
}
