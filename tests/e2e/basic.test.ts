import { test, expect } from "@playwright/test";

test.describe("Before login", () => {
    test("titleが設定されている", async ({page}) => {
        await page.goto("/");
        await expect(page).toHaveTitle(/Myurion/);
    });

    test("未ログインの場合Welcomeページが表示される", async ({page}) => {
        await page.goto("/");

        const h1Text = await page.locator("h1").textContent();
        expect(h1Text).toBe("Welcome back");
    });

    test("パスキー（WebAuthn）でサインアップ => サインインできる", async ({ browserName, page }) => {
        test.skip(browserName !== "chromium", "This test runs only in Chromium");
        await page.goto("/");

        // Virtual Authenticatorを追加
        const cdpSession = await page.context().newCDPSession(page);
        await cdpSession.send("WebAuthn.enable");
        await cdpSession.send("WebAuthn.addVirtualAuthenticator", {
            options: {
                protocol: "ctap2",
                ctap2Version: "ctap2_1",
                hasUserVerification: true,
                transport: "internal",
                automaticPresenceSimulation: true,
                isUserVerified: true,
                hasResidentKey: true,
            }
        });

        cdpSession.on("WebAuthn.credentialAdded", () => {
            console.log("Credential Added!");
        });

        // サインアップする
        await page.click("#sign-up-button");
        await page.fill("#name", "Test User");
        await page.click("#terms");
        await page.click("#sign-up-submit-button");
        await page.waitForTimeout(1000);
        await page.screenshot({ path: "./signupResult.png" });
        await page.reload();

        // サインインする
        await page.click("#button-sign-in-with-passkey");

        // 自動的にリダイレクトされるので待つ
        await page.waitForTimeout(4000);
        await page.screenshot({ path: "./afterLogin.png" });

        // 成功していればサイドバーがあるはず
        expect(await page.locator("#myurion-app-sidebar").count()).toBeGreaterThan(0);
    });
});
