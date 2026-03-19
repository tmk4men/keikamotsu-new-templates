import { test } from "@playwright/test";

const templates = [
  "cp-01", "cp-02", "cp-03", "cp-04", "cp-05",
  "r-01", "r-02", "r-03", "r-04", "r-05",
];

for (const id of templates) {
  test(`${id} full page screenshot`, async ({ page, context }) => {
    await context.clearCookies();
    await page.goto(`/${id}`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(3000);
    await page.screenshot({
      path: `screenshots/${id}-${test.info().project.name}.png`,
      fullPage: true,
    });
  });
}
