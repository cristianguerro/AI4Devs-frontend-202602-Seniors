/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from "@playwright/test";

const positionsResponse = [
  { id: 1, title: "Senior Backend Engineer", manager: "John Doe", deadline: "2024-12-31", status: "Abierto" },
  { id: 2, title: "Junior Android Engineer", manager: "Jane Smith", deadline: "2024-11-15", status: "Contratado" },
];

test.describe("Positions backend wiring", () => {
  test("renders positions from mocked API and navigates to process detail", async ({ page }) => {
    await page.route("**/positions", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(positionsResponse),
      });
    });

    await page.goto("/positions");

    await expect(page.getByText("Senior Backend Engineer")).toBeVisible();
    await expect(page.getByText("Junior Android Engineer")).toBeVisible();
    await expect(page.getByText("Manager:")).toBeVisible();
    await expect(page.getByText("Deadline:")).toBeVisible();

    await page.getByRole("link", { name: "Ver proceso" }).first().click();
    await expect(page).toHaveURL(/\/positions\/1\/process$/);
  });

  test("shows alert when API fails", async ({ page }) => {
    await page.route("**/positions", async (route) => {
      await route.fulfill({ status: 500, body: "server error" });
    });

    await page.goto("/positions");

    await expect(page.getByRole("alert")).toBeVisible();
  });

  test("is usable on mobile viewport", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();

    await page.route("**/positions", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(positionsResponse),
      });
    });

    await page.goto("http://localhost:3000/positions");

    await expect(page.getByRole("heading", { name: "Posiciones" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Ver proceso" }).first()).toBeVisible();

    await context.close();
  });
});
