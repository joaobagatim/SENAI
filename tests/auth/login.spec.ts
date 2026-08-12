import { test, expect } from '@playwright/test';

test.describe('Autenticação', () => {
  /*
   * BDD-001 - Login com credenciais validas
   * Dado que o usuario acessa a tela de login
   * Quando informa email e senha validos e envia o formulario
   * Entao o sistema deve autenticar o usuario, exibir a aplicacao e apresentar o nome do usuario logado
   */
  test('deve realizar login com credenciais válidas', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('login-email').fill('qa@doutor-ie.com');
    await page.getByTestId('login-password').fill('Teste123');

    await page.getByTestId('login-submit').click();

    await expect(page.getByTestId('app')).toBeVisible();
    await expect(page.getByTestId('user-name')).toContainText('Usuario QA');
  });
  

  /*
   * BDD-002 - Login com credenciais invalidas
   * Dado que o usuario acessa a tela de login
   * Quando informa email e senha invalidos e envia o formulario
   * Entao o sistema deve exibir uma mensagem de erro e manter o usuario na tela de login
   */
  test('não deve realizar login com credenciais inválidas', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('login-email').fill('usuario@invalido.com');
    await page.getByTestId('login-password').fill('senhaerrada');

    await page.getByTestId('login-submit').click();

    await expect(page.getByTestId('login-error')).toBeVisible();
    await expect(page.getByTestId('login-screen')).toBeVisible();
  });

});