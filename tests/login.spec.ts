import { test, expect } from "@playwright/test";

test.describe("Login Flow", () => {
  test("login failed with invalid credentials", async ({ page }) => {
    await page.goto("/login");

    // Wait for the form to be visible
    await page.waitForSelector(".login-form");

    // Fill in phone number
    const phoneInput = page.locator(".react-tel-input input");
    await phoneInput.waitFor();
    await phoneInput.fill("20000000");

    // Fill in password
    await page.getByPlaceholder("密碼").fill("wrongpassword");

    // Click login button
    await page.click("#login-btn");

    // Expect error modal
    // The modal header is "請再試一次"
    await expect(page.getByText("請再試一次")).toBeVisible();
    await page.click("body");
  });

  test("login success", async ({ page }) => {
    const validPhone = process.env.TEST_PHONE || "valid_phone";
    const validPassword = process.env.TEST_PASSWORD || "valida_password";

    if (!process.env.TEST_PHONE) {
      test.skip(true, "No test credentials provided");
      return;
    }

    await page.goto("/login");

    // Wait for the form to be visible
    await page.waitForSelector(".login-form");

    const phoneInput = page.locator(".react-tel-input input");
    await phoneInput.waitFor();

    // // Set dial code to 852
    // await page.locator(".selected-flag").click();
    // await page
    //   .locator(".country-list .country[data-country-code='hk']")
    //   .click();

    await phoneInput.fill("");
    await phoneInput.fill(validPhone);

    await page.getByPlaceholder("密碼").fill(validPassword);
    await page.click("#login-btn");

    // Expect success modal
    await expect(page.getByText("登入成功")).toBeVisible();

    // Expect redirection to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 });
  });
});
