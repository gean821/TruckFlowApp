import { test, expect } from "@playwright/test";
import { TEST_ENV } from "./helpers/env";
import { loginAdmin, loginMotorista } from "./helpers/api";

test.describe("Smoke", () => {
  test("API: login admin retorna token", async () => {
    const token = await loginAdmin();
    expect(token).toBeTruthy();
    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3); // JWT
  });

  test("API: login motorista retorna token", async () => {
    const token = await loginMotorista();
    expect(token).toBeTruthy();
    expect(token.split(".").length).toBe(3);
  });

  test("UI: admin loga e abre tela de Agendamentos sem erros no console", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    await page.goto("/login");

    await page.getByRole("textbox", { name: "Usuário" }).fill(TEST_ENV.admin.login);
    await page.getByRole("textbox", { name: "Senha" }).fill(TEST_ENV.admin.password);
    await page.getByRole("button", { name: /acessar sistema/i }).click();

    await page.waitForURL(/\/(dashboard|visualizar|home)/i, { timeout: 15_000 });

    await page.goto("/visualizar");
    await expect(page.getByText(/Gest[ãa]o de Agendamentos/i)).toBeVisible({ timeout: 10_000 });

    // Espera o data-table assentar (loading some)
    await page.waitForTimeout(2000);

    expect(consoleErrors, `Console errors: ${consoleErrors.join("\n")}`).toEqual([]);
  });
});
