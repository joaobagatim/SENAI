import { test, expect, Page } from '@playwright/test';

async function login(page: Page) {
  await page.goto('/');

  await page.getByTestId('login-email').fill('qa@doutor-ie.com');
  await page.getByTestId('login-password').fill('Teste123');
  await page.getByTestId('login-submit').click();

  await expect(page.getByTestId('catalog-view')).toBeVisible();
}

async function abrirRevisao(page: Page) {
  const onix = page
    .getByTestId('vehicle-card')
    .filter({ hasText: 'Chevrolet Onix' });

  await onix.getByTestId('open-vehicle').click();

  await expect(page.getByTestId('detail-view')).toBeVisible();

  await page.getByTestId('start-review').click();

  await expect(page.getByTestId('revision-view')).toBeVisible();
}

test.describe('Regras de negócio - Revisões', () => {

  test('RN01 - não deve concluir revisão sem quilometragem', async ({ page }) => {
    await login(page);
    await abrirRevisao(page);

    // Preenche os outros campos obrigatórios com valores válidos
    await page.getByTestId('revision-date').fill('2026-08-01');
    await page.getByTestId('revision-type').selectOption('preventiva');

    // Quilometragem permanece vazia
    await page.getByTestId('complete-review').click();

    // Deve exibir a mensagem correta de validação
    await expect(page.getByTestId('revision-error'))
      .toContainText('Quilometragem é obrigatória');
  });

// BUG 02
  test('RN01 - não deve aceitar quilometragem negativa', async ({ page }) => {
    await login(page);
    await abrirRevisao(page);

    await page.getByTestId('revision-mileage').fill('-1');
    await page.getByTestId('revision-date').fill('2026-08-01');
    await page.getByTestId('revision-type').selectOption('preventiva');

    await page.getByTestId('complete-review').click();

    // Deve ocorrer validação para valor abaixo do limite mínimo
    await expect(page.getByTestId('revision-error')).toBeVisible();
  });

  test('RN01 - deve aceitar quilometragem igual a 0', async ({ page }) => {
    await login(page);
    await abrirRevisao(page);

    await page.getByTestId('revision-mileage').fill('0');
    await page.getByTestId('revision-date').fill('2026-08-01');
    await page.getByTestId('revision-type').selectOption('preventiva');

    await page.getByTestId('complete-review').click();

    // Não deve apresentar erro
    await expect(page.getByTestId('revision-error')).toBeHidden();

    // A revisão deve aparecer no histórico como concluída
    await expect(page.getByTestId('revision-list'))
        .toContainText('0 km');

    await expect(page.getByTestId('revision-list'))
        .toContainText('Concluída');
    });

  test('RN01 - deve aceitar quilometragem igual a 999999', async ({ page }) => {
    await login(page);
    await abrirRevisao(page);

    await page.getByTestId('revision-mileage').fill('999999');
    await page.getByTestId('revision-date').fill('2026-08-01');
    await page.getByTestId('revision-type').selectOption('preventiva');

    await page.getByTestId('complete-review').click();

    // Não deve apresentar erro
    await expect(page.getByTestId('revision-error')).toBeHidden();

    // Deve registrar a revisão no histórico
    await expect(page.getByTestId('revision-list'))
        .toContainText('999999 km');

    await expect(page.getByTestId('revision-list'))
        .toContainText('Concluída');
    });

// BUG 02
  test.fail('RN01 - não deve aceitar quilometragem maior que 999999', async ({ page }) => {
    await login(page);
    await abrirRevisao(page);

    await page.getByTestId('revision-mileage').fill('1000000');
    await page.getByTestId('revision-date').fill('2026-08-01');
    await page.getByTestId('revision-type').selectOption('preventiva');

    await page.getByTestId('complete-review').click();

    // RN01: valores acima de 999999 devem ser rejeitados
    await expect(page.getByTestId('revision-error')).toBeVisible();
    });

  test('RN01 - não deve aceitar quilometragem decimal', async ({ page }) => {
    await login(page);
    await abrirRevisao(page);

    await page.getByTestId('revision-mileage').fill('1.5');
    await page.getByTestId('revision-date').fill('2026-08-01');
    await page.getByTestId('revision-type').selectOption('preventiva');

    await page.getByTestId('complete-review').click();

    // RN01: quilometragem deve aceitar somente números inteiros
    await expect(page.getByTestId('revision-error')).toBeVisible();
    });


  test('RN02 - não deve concluir revisão sem data', async ({ page }) => {
    await login(page);
    await abrirRevisao(page);

    await page.getByTestId('revision-mileage').fill('10000');
    await page.getByTestId('revision-type').selectOption('preventiva');

    // Data permanece vazia
    await page.getByTestId('complete-review').click();

    await expect(page.getByTestId('revision-error')).toBeVisible();
    });

// BUG 03
  test.fail('RN02 - não deve aceitar data futura', async ({ page }) => {
    await login(page);
    await abrirRevisao(page);

    await page.getByTestId('revision-mileage').fill('10000');

    // Data propositalmente futura
    await page.getByTestId('revision-date').fill('2099-01-01');

    await page.getByTestId('revision-type').selectOption('preventiva');

    await page.getByTestId('complete-review').click();

    // RN02: a revisão nunca pode ter data futura
    await expect(page.getByTestId('revision-error')).toBeVisible();
    });


  test('RN03 - não deve concluir revisão sem tipo', async ({ page }) => {
    await login(page);
    await abrirRevisao(page);

    await page.getByTestId('revision-mileage').fill('10000');
    await page.getByTestId('revision-date').fill('2026-08-01');

    // Tipo permanece sem seleção
    await page.getByTestId('complete-review').click();

    await expect(page.getByTestId('revision-error')).toBeVisible();
    await expect(page.getByTestId('revision-error'))
        .toContainText('Tipo');
    });



const tiposValidos = [
  { valor: 'preventiva', texto: 'Preventiva', quilometragem: '11001' },
  { valor: 'corretiva', texto: 'Corretiva', quilometragem: '11002' },
  { valor: 'inspecao', texto: 'Inspeção', quilometragem: '11003' },
];

for (const tipo of tiposValidos) {
  test(`RN03 - deve aceitar tipo ${tipo.texto}`, async ({ page }) => {
    await login(page);
    await abrirRevisao(page);

    await page.getByTestId('revision-mileage').fill(tipo.quilometragem);
    await page.getByTestId('revision-date').fill('2026-08-01');
    await page.getByTestId('revision-type').selectOption(tipo.valor);

    await page.getByTestId('complete-review').click();

    // Um tipo válido não deve gerar erro
    await expect(page.getByTestId('revision-error')).toBeHidden();

    // Confirma que esta revisão específica foi registrada
    await expect(page.getByTestId('revision-list'))
      .toContainText(`${tipo.quilometragem} km`);

    await expect(page.getByTestId('revision-list'))
      .toContainText(tipo.texto);
  });
}

// BUG 04
  test.fail('RN04 - deve exigir tipo do óleo quando houver troca de óleo', async ({ page }) => {
    await login(page);
    await abrirRevisao(page);

    await page.getByTestId('revision-mileage').fill('12001');
    await page.getByTestId('revision-date').fill('2026-08-01');
    await page.getByTestId('revision-type').selectOption('preventiva');

    // Marca que houve troca de óleo
    await page.getByTestId('revision-oil-changed').check();

    // Deixa o tipo do óleo vazio
    await page.getByTestId('revision-oil-quantity').fill('3.5');

    await page.getByTestId('complete-review').click();

    await expect(page.getByTestId('revision-error')).toBeVisible();
    });

// BUG 04
  test.fail('RN04 - deve exigir quantidade do óleo quando houver troca de óleo', async ({ page }) => {
    await login(page);
    await abrirRevisao(page);

    await page.getByTestId('revision-mileage').fill('12002');
    await page.getByTestId('revision-date').fill('2026-08-01');
    await page.getByTestId('revision-type').selectOption('preventiva');

    await page.getByTestId('revision-oil-changed').check();

    await page.getByTestId('revision-oil-type').fill('5W-30');

    // Quantidade permanece vazia

    await page.getByTestId('complete-review').click();

    await expect(page.getByTestId('revision-error')).toBeVisible();
    });


  test('RN04 - não deve aceitar quantidade de óleo igual a 0', async ({ page }) => {
    await login(page);
    await abrirRevisao(page);

    await page.getByTestId('revision-mileage').fill('12003');
    await page.getByTestId('revision-date').fill('2026-08-01');
    await page.getByTestId('revision-type').selectOption('preventiva');

    await page.getByTestId('revision-oil-changed').check();

    await page.getByTestId('revision-oil-type').fill('5W-30');
    await page.getByTestId('revision-oil-quantity').fill('0');

    await page.getByTestId('complete-review').click();

    // RN04: quantidade deve ser maior que 0
    await expect(page.getByTestId('revision-error')).toBeVisible();
    });


  test('RN04 - deve aceitar quantidade de óleo maior que 0', async ({ page }) => {
    await login(page);
    await abrirRevisao(page);

    await page.getByTestId('revision-mileage').fill('12004');
    await page.getByTestId('revision-date').fill('2026-08-01');
    await page.getByTestId('revision-type').selectOption('preventiva');

    await page.getByTestId('revision-oil-changed').check();

    await page.getByTestId('revision-oil-type').fill('5W-30');
    await page.getByTestId('revision-oil-quantity').fill('0.1');

    await page.getByTestId('complete-review').click();

    await expect(page.getByTestId('revision-error')).toBeHidden();

    await expect(page.getByTestId('revision-list'))
        .toContainText('12004 km');

    await expect(page.getByTestId('revision-list'))
        .toContainText('Concluída');
    });


  test('RN04 - deve aceitar quantidade de óleo igual a 10 litros', async ({ page }) => {
    await login(page);
    await abrirRevisao(page);

    await page.getByTestId('revision-mileage').fill('12005');
    await page.getByTestId('revision-date').fill('2026-08-01');
    await page.getByTestId('revision-type').selectOption('preventiva');

    await page.getByTestId('revision-oil-changed').check();

    await page.getByTestId('revision-oil-type').fill('5W-30');
    await page.getByTestId('revision-oil-quantity').fill('10');

    await page.getByTestId('complete-review').click();

    await expect(page.getByTestId('revision-error')).toBeHidden();

    await expect(page.getByTestId('revision-list'))
        .toContainText('12005 km');

    await expect(page.getByTestId('revision-list'))
        .toContainText('Concluída');
    });


  test('RN04 - não deve aceitar quantidade de óleo maior que 10 litros', async ({ page }) => {
    await login(page);
    await abrirRevisao(page);

    await page.getByTestId('revision-mileage').fill('12006');
    await page.getByTestId('revision-date').fill('2026-08-01');
    await page.getByTestId('revision-type').selectOption('preventiva');

    await page.getByTestId('revision-oil-changed').check();

    await page.getByTestId('revision-oil-type').fill('5W-30');
    await page.getByTestId('revision-oil-quantity').fill('10.1');

    await page.getByTestId('complete-review').click();

    // RN04: quantidade máxima permitida é 10 L
    await expect(page.getByTestId('revision-error')).toBeVisible();
    });


  test('RN05 - deve permitir concluir revisão sem observações', async ({ page }) => {
    await login(page);
    await abrirRevisao(page);

    await page.getByTestId('revision-mileage').fill('13001');
    await page.getByTestId('revision-date').fill('2026-08-01');
    await page.getByTestId('revision-type').selectOption('preventiva');

    // Observações permanece vazio
    await page.getByTestId('complete-review').click();

    await expect(page.getByTestId('revision-error')).toBeHidden();

    await expect(page.getByTestId('revision-list'))
        .toContainText('13001 km');
    });


  test('RN05 - deve aceitar observações com exatamente 300 caracteres', async ({ page }) => {
    await login(page);
    await abrirRevisao(page);

    const observacao300 = 'A'.repeat(300);

    await page.getByTestId('revision-mileage').fill('13002');
    await page.getByTestId('revision-date').fill('2026-08-01');
    await page.getByTestId('revision-type').selectOption('preventiva');
    await page.getByTestId('revision-notes').fill(observacao300);

    await page.getByTestId('complete-review').click();

    await expect(page.getByTestId('revision-error')).toBeHidden();

    await expect(page.getByTestId('revision-list'))
        .toContainText('13002 km');
    });

// BUG 05
  test('RN05 - não deve aceitar observações com mais de 300 caracteres', async ({ page }) => {
    await login(page);
    await abrirRevisao(page);

    const observacao301 = 'A'.repeat(301);

    await page.getByTestId('revision-mileage').fill('13003');
    await page.getByTestId('revision-date').fill('2026-08-01');
    await page.getByTestId('revision-type').selectOption('preventiva');
    await page.getByTestId('revision-notes').fill(observacao301);

    // Confirma que os 301 caracteres realmente foram digitados
    await expect(page.getByTestId('revision-notes'))
        .toHaveValue(observacao301);

    await page.getByTestId('complete-review').click();

    // RN05: valores acima de 300 devem gerar validação
    await expect(page.getByTestId('revision-error')).toBeVisible();
    });
    

  test('RN06 - deve permitir salvar e editar um rascunho incompleto', async ({ page }) => {
    await login(page);
    await abrirRevisao(page);

    // Preenche apenas a quilometragem.
    // RN06 permite rascunhos incompletos.
    await page.getByTestId('revision-mileage').fill('14001');

    await page.getByTestId('save-draft').click();

    // Confirma que o rascunho foi registrado.
    await expect(page.getByTestId('revision-list'))
        .toContainText('14001 km');

    await expect(page.getByTestId('revision-list'))
        .toContainText('Rascunho');

    // Localiza o registro específico pelo texto da quilometragem
    // e sobe até o elemento que contém o botão Editar.
    const rascunho = page
        .getByText('14001 km', { exact: false })
        .locator('xpath=ancestor::*[.//button[normalize-space()="Editar"]][1]');

    await expect(rascunho).toBeVisible();

    const botaoEditar = rascunho.getByRole('button', { name: 'Editar' });

    await expect(botaoEditar).toBeVisible();

    // RN06: rascunhos devem poder ser editados.
    await botaoEditar.click();

    // Confirma que o valor voltou para o formulário.
    await expect(page.getByTestId('revision-mileage'))
        .toHaveValue('14001');

    // Edita o rascunho.
    await page.getByTestId('revision-mileage').fill('14002');

    await page.getByTestId('save-draft').click();

    // Confirma que a alteração foi salva.
    await expect(page.getByTestId('revision-list'))
        .toContainText('14002 km');
    });

  test('RN06 - revisão concluída não deve permitir edição', async ({ page }) => {
    await login(page);
    await abrirRevisao(page);

    await page.getByTestId('revision-mileage').fill('15001');
    await page.getByTestId('revision-date').fill('2026-08-01');
    await page.getByTestId('revision-type').selectOption('preventiva');

    await page.getByTestId('complete-review').click();

    // Confirma que a revisão foi realmente criada
    await expect(page.getByTestId('revision-list'))
        .toContainText('15001 km');

    await expect(page.getByTestId('revision-list'))
        .toContainText('Concluída');

    // Localiza especificamente o card criado neste teste.
    // Os registros do histórico são filhos diretos de revision-list.
    const revisaoConcluida = page
        .getByTestId('revision-list')
        .locator(':scope > *')
        .filter({ hasText: '15001 km' })
        .filter({ hasText: 'Concluída' });

    // Esta validação impede falso positivo do locator.
    await expect(revisaoConcluida).toHaveCount(1);
    await expect(revisaoConcluida).toBeVisible();

    // RN06: revisão concluída NÃO pode disponibilizar edição.
    const botaoEditar = revisaoConcluida
        .getByRole('button', { name: 'Editar' });

    await expect(botaoEditar).toHaveCount(0);
    });




  test('RN06 - revisão concluída não deve permitir edição', async ({ page }) => {
    test.fail(
        true,
        'BUG-06: revisão concluída pode ser editada e retornar a rascunho'
    );

    await login(page);
    await abrirRevisao(page);

    await page.getByTestId('revision-mileage').fill('15010');
    await page.getByTestId('revision-date').fill('2026-08-01');
    await page.getByTestId('revision-type').selectOption('preventiva');

    await page.getByTestId('complete-review').click();

    const revisaoConcluida = page
        .getByTestId('revision-list')
        .locator(':scope > *')
        .filter({ hasText: '15010 km' })
        .filter({ hasText: 'Concluída' });

    await expect(revisaoConcluida).toHaveCount(1);

    // RN06: revisão concluída não pode ser editada
    await expect(
        revisaoConcluida.getByRole('button', { name: 'Editar' })
    ).toHaveCount(0);
    });


  test('RN06 - deve exibir revisões mais recentes primeiro no histórico', async ({ page }) => {
    await login(page);
    await abrirRevisao(page);

    // Primeira revisão
    await page.getByTestId('revision-mileage').fill('16001');
    await page.getByTestId('revision-date').fill('2026-07-01');
    await page.getByTestId('revision-type').selectOption('preventiva');

    await page.getByTestId('complete-review').click();

    await expect(page.getByTestId('revision-list'))
        .toContainText('16001 km');

    // Cria uma nova revisão
    await page.getByTestId('revision-mileage').fill('16002');
    await page.getByTestId('revision-date').fill('2026-08-01');
    await page.getByTestId('revision-type').selectOption('corretiva');

    await page.getByTestId('complete-review').click();

    await expect(page.getByTestId('revision-list'))
        .toContainText('16002 km');

    // Captura os registros na ordem apresentada na tela
    const registros = page
        .getByTestId('revision-list')
        .locator(':scope > *');

    // O primeiro registro deve ser a revisão mais recente
    await expect(registros.first())
        .toContainText('16002 km');
    });
});