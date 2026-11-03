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
  /*
   * BDD-016 - RN01: Revisao sem quilometragem
   * Dado que o usuario iniciou uma revisao
   * Quando preenche data e tipo validos, deixa a quilometragem vazia e tenta concluir
   * Entao o sistema deve exibir a mensagem de validacao de quilometragem obrigatoria
   */
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
  /*
   * BDD-017 - RN01: Quilometragem negativa
   * Dado que o usuario iniciou uma revisao
   * Quando informa quilometragem -1, data e tipo validos e tenta concluir
   * Entao o sistema deve exibir erro de validacao para quilometragem abaixo do limite minimo
   */
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


  /*
   * BDD-018 - RN01: Quilometragem igual a zero
   * Dado que o usuario iniciou uma revisao
   * Quando informa quilometragem 0, data e tipo validos e conclui a revisao
   * Entao o sistema nao deve exibir erro e deve registrar a revisao concluida com 0 km
   */
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
  
  
    /*
   * BDD-019 - RN01: Quilometragem igual a 999999
   * Dado que o usuario iniciou uma revisao
   * Quando informa quilometragem 999999, data e tipo validos e conclui a revisao
   * Entao o sistema nao deve exibir erro e deve registrar a revisao concluida com 999999 km
   */
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
  /*
   * BDD-020 - RN01: Quilometragem maior que 999999
   * Dado que o usuario iniciou uma revisao
   * Quando informa quilometragem 1000000, data e tipo validos e tenta concluir
   * Entao o sistema deve exibir erro de validacao para valor acima do limite maximo
   */
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
 
 
    /*
   * BDD-021 - RN01: Quilometragem decimal
   * Dado que o usuario iniciou uma revisao
   * Quando informa quilometragem decimal 1.5, data e tipo validos e tenta concluir
   * Entao o sistema deve exibir erro porque a quilometragem deve aceitar apenas numeros inteiros
   */
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
  
  
  /*
   * BDD-022 - RN02: Revisao sem data
   * Dado que o usuario iniciou uma revisao
   * Quando preenche quilometragem e tipo validos, deixa a data vazia e tenta concluir
   * Entao o sistema deve exibir erro de validacao
   */
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
  /*
   * BDD-023 - RN02: Data futura
   * Dado que o usuario iniciou uma revisao
   * Quando informa uma data futura, quilometragem e tipo validos e tenta concluir
   * Entao o sistema deve exibir erro porque revisoes nao podem ter data futura
   */
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


  /*
   * BDD-024 - RN03: Revisao sem tipo
   * Dado que o usuario iniciou uma revisao
   * Quando preenche quilometragem e data validas, deixa o tipo sem selecao e tenta concluir
   * Entao o sistema deve exibir erro informando que o tipo da revisao e obrigatorio
   */
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
  /*
   * BDD-025 a BDD-027 - RN03: Tipos validos de revisao
   * Dado que o usuario iniciou uma revisao
   * Quando informa quilometragem, data e um tipo valido: Preventiva, Corretiva ou Inspecao
   * Entao o sistema nao deve exibir erro e deve registrar a revisao com o tipo informado
   */
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
  /*
   * BDD-028 - RN04: Troca de oleo sem tipo do oleo
   * Dado que o usuario marcou que houve troca de oleo
   * Quando preenche a quantidade de oleo, deixa o tipo do oleo vazio e tenta concluir
   * Entao o sistema deve exibir erro de validacao
   */
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
  /*
   * BDD-029 - RN04: Troca de oleo sem quantidade
   * Dado que o usuario marcou que houve troca de oleo
   * Quando preenche o tipo do oleo, deixa a quantidade vazia e tenta concluir
   * Entao o sistema deve exibir erro de validacao
   */
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
  
  
    /*
   * BDD-030 - RN04: Quantidade de oleo igual a zero
   * Dado que o usuario marcou que houve troca de oleo
   * Quando informa tipo de oleo e quantidade 0 e tenta concluir
   * Entao o sistema deve exibir erro porque a quantidade deve ser maior que zero
   */
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
 
 
    /*
   * BDD-031 - RN04: Quantidade de oleo maior que zero
   * Dado que o usuario marcou que houve troca de oleo
   * Quando informa tipo de oleo e quantidade 0.1 e conclui
   * Entao o sistema nao deve exibir erro e deve registrar a revisao concluida
   */
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
 
 
  /*
   * BDD-032 - RN04: Quantidade de oleo igual a 10 litros
   * Dado que o usuario marcou que houve troca de oleo
   * Quando informa tipo de oleo e quantidade 10 e conclui
   * Entao o sistema nao deve exibir erro e deve registrar a revisao concluida
   */
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
  
  
    /*
   * BDD-033 - RN04: Quantidade de oleo maior que 10 litros
   * Dado que o usuario marcou que houve troca de oleo
   * Quando informa tipo de oleo e quantidade 10.1 e tenta concluir
   * Entao o sistema deve exibir erro porque a quantidade maxima permitida e 10 litros
   */
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
  
  
    /*
   * BDD-034 - RN05: Revisao sem observacoes
   * Dado que o usuario iniciou uma revisao
   * Quando preenche os campos obrigatorios, deixa observacoes vazio e conclui
   * Entao o sistema nao deve exibir erro e deve registrar a revisao
   */
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
  
  
    /*
   * BDD-035 - RN05: Observacoes com exatamente 300 caracteres
   * Dado que o usuario iniciou uma revisao
   * Quando preenche observacoes com exatamente 300 caracteres e conclui
   * Entao o sistema nao deve exibir erro e deve registrar a revisao
   */
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
  /*
   * BDD-036 - RN05: Observacoes com mais de 300 caracteres
   * Dado que o usuario iniciou uma revisao
   * Quando preenche observacoes com 301 caracteres e tenta concluir
   * Entao o sistema deve exibir erro de validacao para limite maximo de observacoes
   */
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
  
  
    /*
   * BDD-037 - RN06: Salvar e editar rascunho incompleto
   * Dado que o usuario iniciou uma revisao e preencheu apenas a quilometragem
   * Quando salva como rascunho, abre o rascunho para edicao, altera a quilometragem e salva novamente
   * Entao o historico deve exibir o rascunho atualizado
   */
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
  
  
    /*
   * BDD-038 - RN06: Revisao concluida sem botao de edicao
   * Dado que o usuario concluiu uma revisao
   * Quando visualiza o registro concluido no historico
   * Entao o registro nao deve disponibilizar o botao Editar
   */
  test('RN06 - revisão concluída não deve retornar para rascunho', async ({ page }) => {
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
 
 
    /*
   * BDD-039 - RN06: Revisao concluida nao deve retornar para rascunho
   * Dado que o usuario concluiu uma revisao
   * Quando visualiza o registro concluido no historico
   * Entao o registro nao deve permitir edicao nem retornar ao estado de rascunho
   */
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
  
  
    /*
   * BDD-040 - RN06: Historico ordenado por revisoes mais recentes
   * Dado que existem duas revisoes concluidas com datas diferentes
   * Quando o usuario consulta o historico de revisoes
   * Entao a revisao mais recente deve aparecer primeiro na lista
   */
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