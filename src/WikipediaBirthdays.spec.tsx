import {
    chromium,
    expect,
    Page,
    Browser,
    BrowserContext,
} from "@playwright/test";
import {
    beforeAll,
    afterAll,
    describe,
    it,
    expect as expectVitest,
} from "vitest";

describe("WikipediaBirthdays", () => {
    let page: Page;
    let browser: Browser;
    let context: BrowserContext;

    beforeAll(async () => {
        browser = await chromium.launch();
        context = await browser.newContext();
        page = await context.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });

    it("renders page", async () => {
        await page.goto("http://localhost:5173");
        await expect(
            page.getByText("Today's Birthdays from Wikipedia")
        ).toBeVisible();
    });

    it("shows birthdays", async () => {
        await page.goto("http://localhost:5173");
        await page.getByTestId("birthday-button").click();
        await page.waitForSelector("[data-testid=birthday-list]");

        const rows = await page.$$("[data-testid=birthday-list] tbody tr");
        expectVitest(rows.length).toBeGreaterThan(0);
    });
});
