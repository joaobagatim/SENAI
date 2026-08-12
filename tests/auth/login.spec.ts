import { test, expect } from '@playwright/test';

test.describe('Autenticação', () => {

  test('deve realizar login com credenciais válidas', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('login-email').fill('qa@doutor-ie.com');
    await page.getByTestId('login-password').fill('Teste123');

    await page.getByTestId('login-submit').click();

    await expect(page.getByTestId('app')).toBeVisible();
    await expect(page.getByTestId('user-name')).toContainText('Usuario QA');
  });

  test('não deve realizar login com credenciais inválidas', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('login-email').fill('usuario@invalido.com');
    await page.getByTestId('login-password').fill('senhaerrada');

    await page.getByTestId('login-submit').click();

    await expect(page.getByTestId('login-error')).toBeVisible();
    await expect(page.getByTestId('login-screen')).toBeVisible();
  });

});