import { test, expect } from '@playwright/test';


/*
 * BDD-003 - Fluxo principal de login, manual e favorito
 * Dado que o usuario esta autenticado no catalogo
 * Quando abre o manual do Chevrolet Onix, retorna ao catalogo e favorita o veiculo
 * Entao o contador de favoritos deve ser atualizado e o Chevrolet Onix deve aparecer na tela de favoritos
 */
test('deve fazer login, abrir um manual e favoritar um veículo', async ({ page }) => {
  await page.goto('/');

  // Login
  await page.getByTestId('login-email').fill('qa@doutor-ie.com');
  await page.getByTestId('login-password').fill('Teste123');
  await page.getByTestId('login-submit').click();

  await expect(page.getByTestId('catalog-view')).toBeVisible();

  // Seleciona o Chevrolet Onix
  const onix = page
    .getByTestId('vehicle-card')
    .filter({ hasText: 'Chevrolet Onix' });

  // Abre o manual
  await onix.getByTestId('open-vehicle').click();

  await expect(page.getByTestId('detail-view')).toBeVisible();
  await expect(page.getByTestId('detail-title'))
    .toHaveText('Chevrolet Onix');

  // Volta para o catálogo
  await page.getByTestId('detail-back').click();

  // Favorita o veículo
  const onixCatalogo = page
    .getByTestId('vehicle-card')
    .filter({ hasText: 'Chevrolet Onix' });

  await onixCatalogo.getByTestId('favorite-btn').click();

  // Valida contador
  await expect(page.getByTestId('favorites-count')).toHaveText('1');

  // Abre favoritos
  await page.getByTestId('nav-favorites').click();

  await expect(page.getByTestId('favorites-view')).toBeVisible();
  await expect(page.getByTestId('favorites-grid'))
    .toContainText('Chevrolet Onix');
});


// BUG 01
/*
 * BDD-004 - Busca sem resultado
 * Dado que o usuario esta autenticado no catalogo
 * Quando pesquisa por um veiculo inexistente
 * Entao o sistema deve exibir a mensagem de estado vazio e nenhum card de veiculo deve permanecer visivel
 */
test.fail('deve exibir mensagem quando a busca não encontrar veículos', async ({ page }) => {
  await page.goto('/');

  // Login
  await page.getByTestId('login-email').fill('qa@doutor-ie.com');
  await page.getByTestId('login-password').fill('Teste123');
  await page.getByTestId('login-submit').click();

  await expect(page.getByTestId('catalog-view')).toBeVisible();

  // Busca por veículo inexistente
  await page.getByTestId('search-input').fill('Ferrari');

  // Valida estado vazio
  await expect(page.getByTestId('empty-state')).toBeVisible();
  await expect(page.getByTestId('empty-state'))
    .toHaveText('Nenhum veículo encontrado.');

  // Garante que nenhum card permanece visível
  await expect(page.getByTestId('vehicle-card')).toHaveCount(0);
});