import { test, expect } from '@playwright/test';

test.describe('API - Doutor IE', () => {

  // =========================================================
  // AUTENTICAÇÃO
  // =========================================================

  test.describe('Autenticação', () => {
    /*
     * BDD-005 - Login pela API com credenciais validas
     * Dado que existem credenciais validas para autenticacao
     * Quando a API recebe uma requisicao POST /api/login com essas credenciais
     * Entao deve retornar status 200 com token, nome e email do usuario autenticado
     */
    test('deve realizar login pela API com credenciais válidas', async ({ request }) => {
      const response = await request.post('/api/login', {
        data: {
          email: 'qa@doutor-ie.com',
          password: 'Teste123'
        }
      });

      expect(response.status()).toBe(200);

      const body = await response.json();

      expect(body).toHaveProperty('token');
      expect(body).toHaveProperty('name');
      expect(body).toHaveProperty('email');

      expect(body.email).toBe('qa@doutor-ie.com');
    });


    /*
     * BDD-006 - Login pela API com credenciais invalidas
     * Dado que as credenciais informadas sao invalidas
     * Quando a API recebe uma requisicao POST /api/login com esses dados
     * Entao nao deve retornar sucesso e nao deve fornecer token de autenticacao
     */
    test('não deve realizar login pela API com credenciais inválidas', async ({ request }) => {
      const response = await request.post('/api/login', {
        data: {
          email: 'usuario@invalido.com',
          password: 'senhaErrada'
        }
      });

      // Login inválido não deve retornar resposta de sucesso
      expect(response.ok()).toBeFalsy();

      const body = await response.json();

      // Não deve fornecer token
      expect(body).not.toHaveProperty('token');
    });

  });


  // =========================================================
  // VEÍCULOS
  // =========================================================

  test.describe('Veículos', () => {
    /*
     * BDD-007 - Listagem de veiculos pela API
     * Dado que existem veiculos cadastrados
     * Quando a API recebe uma requisicao GET /api/vehicles
     * Entao deve retornar status 200, total de 8 veiculos e uma lista com os dados esperados do Chevrolet Onix
     */
    test('deve listar veículos pela API', async ({ request }) => {
      const response = await request.get('/api/vehicles');

      expect(response.status()).toBe(200);

      const body = await response.json();

      expect(body).toHaveProperty('total');
      expect(body).toHaveProperty('data');

      expect(body.total).toBe(8);
      expect(Array.isArray(body.data)).toBeTruthy();
      expect(body.data.length).toBeGreaterThan(0);

      expect(body.data[0]).toMatchObject({
        id: 1,
        brand: 'Chevrolet',
        model: 'Onix',
        year: 2022,
        engine: '1.0 Turbo'
      });
    });
    
    
    /*
     * BDD-008 - Detalhes do Chevrolet Onix pela API
     * Dado que o Chevrolet Onix possui identificador 1
     * Quando a API recebe uma requisicao GET /api/vehicles/1
     * Entao deve retornar status 200 com id, marca e modelo do Chevrolet Onix
     */
    test('deve retornar os detalhes do Chevrolet Onix', async ({ request }) => {
      const response = await request.get('/api/vehicles/1');

      expect(response.status()).toBe(200);

      const body = await response.json();

      expect(body).toHaveProperty('id', 1);
      expect(body).toHaveProperty('brand', 'Chevrolet');
      expect(body).toHaveProperty('model', 'Onix');
    });
    
    
    /*
     * BDD-009 - Especificacoes tecnicas do Chevrolet Onix pela API
     * Dado que o Chevrolet Onix possui especificacoes tecnicas cadastradas
     * Quando a API recebe uma requisicao GET /api/vehicles/1/specs
     * Entao deve retornar status 200 com torque da vela, fluido de freio, oleo do motor, tanque e intervalo de troca de oleo
     */
    test('deve retornar as especificações técnicas do Chevrolet Onix', async ({ request }) => {
      const response = await request.get('/api/vehicles/1/specs');

      expect(response.status()).toBe(200);

      const body = await response.json();

      expect(body).toHaveProperty('sparkPlugTorqueNm');
      expect(body).toHaveProperty('brakeFluid');
      expect(body).toHaveProperty('engineOil');
      expect(body).toHaveProperty('fuelTankLiters');
      expect(body).toHaveProperty('oilChangeIntervalKm');

      expect(body.engineOil).toHaveProperty('type');
      expect(body.engineOil).toHaveProperty('capacityLiters');
    });


    /*
     * BDD-010 - Limite da paginacao de veiculos
     * Dado que a listagem de veiculos aceita paginacao
     * Quando a API recebe uma requisicao GET /api/vehicles?page=1&limit=2
     * Entao deve retornar status 200, total de 8 veiculos e exatamente 2 registros na pagina
     */
    test('deve respeitar o limite informado na paginação de veículos', async ({ request }) => {
      const response = await request.get('/api/vehicles?page=1&limit=2');

      expect(response.status()).toBe(200);

      const body = await response.json();

      expect(body).toHaveProperty('total', 8);
      expect(body).toHaveProperty('data');

      expect(Array.isArray(body.data)).toBeTruthy();

      // limit=2 deve retornar exatamente 2 veículos
      expect(body.data).toHaveLength(2);
    });


    /*
     * BDD-011 - Registros diferentes entre paginas de veiculos
     * Dado que a listagem de veiculos esta paginada com limite de 2 registros
     * Quando a API recebe requisicoes para as paginas 1 e 2
     * Entao cada pagina deve retornar 2 veiculos e os ids retornados devem ser diferentes
     */
    test('deve retornar veículos diferentes entre páginas', async ({ request }) => {
      const pagina1 = await request.get('/api/vehicles?page=1&limit=2');
      const pagina2 = await request.get('/api/vehicles?page=2&limit=2');

      expect(pagina1.status()).toBe(200);
      expect(pagina2.status()).toBe(200);

      const bodyPagina1 = await pagina1.json();
      const bodyPagina2 = await pagina2.json();

      expect(bodyPagina1.data).toHaveLength(2);
      expect(bodyPagina2.data).toHaveLength(2);

      const idsPagina1 = bodyPagina1.data.map(
        (vehicle: { id: number }) => vehicle.id
      );

      const idsPagina2 = bodyPagina2.data.map(
        (vehicle: { id: number }) => vehicle.id
      );

      // As páginas devem retornar registros diferentes
      expect(idsPagina1).not.toEqual(idsPagina2);
    });


    /*
     * BDD-012 - Consistencia de especificacoes entre API e UI
     * Dado que as especificacoes do Chevrolet Onix sao retornadas pela API
     * Quando o usuario abre o manual do Chevrolet Onix pela interface
     * Entao a UI deve exibir os mesmos valores de torque, fluido de freio, oleo do motor e capacidade do tanque retornados pela API
     */
    test('BUG-07 - deve exibir na UI as mesmas especificações retornadas pela API', async ({ page, request }) => {
      test.fail(
        true,
        'BUG-07: capacidade do tanque exibida na UI diverge do valor retornado pela API'
      );

      // Obtém os dados diretamente da API
      const response = await request.get('/api/vehicles/1/specs');

      expect(response.status()).toBe(200);

      const specs = await response.json();

      // Login pela interface
      await page.goto('/');

      await page.getByTestId('login-email')
        .fill('qa@doutor-ie.com');

      await page.getByTestId('login-password')
        .fill('Teste123');

      await page.getByTestId('login-submit').click();

      // Localiza o Chevrolet Onix
      const onix = page
        .getByTestId('vehicle-card')
        .filter({ hasText: 'Chevrolet Onix' });

      await onix.getByTestId('open-vehicle').click();

      await expect(page.getByTestId('detail-title'))
        .toHaveText('Chevrolet Onix');

      // Torque da vela
      await expect(page.getByTestId('spec-spark-torque'))
        .toHaveText(`${specs.sparkPlugTorqueNm} Nm`);

      // Fluido de freio
      await expect(page.getByTestId('spec-brake-fluid'))
        .toHaveText(specs.brakeFluid);

      // Óleo do motor
      await expect(page.getByTestId('spec-oil-type'))
        .toHaveText(
          `${specs.engineOil.type} · ${specs.engineOil.capacityLiters} L`
        );

      // Capacidade do tanque
      const tanqueEsperado =
        `${String(specs.fuelTankLiters).replace('.', ',')} L`;

      await expect(page.getByTestId('spec-fuel-tank'))
        .toHaveText(tanqueEsperado);
    });

  });


  // =========================================================
  // FAVORITOS
  // =========================================================

  test.describe('Favoritos', () => {
    /*
     * BDD-013 - Adicionar e listar favorito pela API
     * Dado que existe uma sessao identificada por X-Session-Id
     * Quando a API recebe a inclusao do Chevrolet Onix nos favoritos e em seguida consulta os favoritos da mesma sessao
     * Entao o Chevrolet Onix deve estar presente na lista retornada
     */
    test('deve adicionar e listar um veículo nos favoritos pela API', async ({ request }) => {
      const sessionId = `sessao-favoritos-${Date.now()}`;

      // Adiciona Chevrolet Onix aos favoritos
      const postResponse = await request.post('/api/favorites', {
        headers: {
          'X-Session-Id': sessionId
        },
        data: {
          vehicleId: 1
        }
      });

      expect(postResponse.ok()).toBeTruthy();

      // Consulta favoritos da mesma sessão
      const getResponse = await request.get('/api/favorites', {
        headers: {
          'X-Session-Id': sessionId
        }
      });

      expect(getResponse.status()).toBe(200);

      const body = await getResponse.json();

      const favoritos = Array.isArray(body)
        ? body
        : body.data;

      expect(Array.isArray(favoritos)).toBeTruthy();
      expect(favoritos.length).toBeGreaterThan(0);

      const onixFavoritado = favoritos.some(
        (favorito: any) =>
          favorito.vehicleId === 1 ||
          favorito.id === 1 ||
          favorito.vehicle?.id === 1
      );

      expect(onixFavoritado).toBeTruthy();
    });
    
    
    /*
     * BDD-014 - Isolamento de favoritos entre sessoes
     * Dado que existem duas sessoes diferentes
     * Quando a sessao A adiciona o Chevrolet Onix aos favoritos e a sessao B consulta seus favoritos
     * Entao a sessao B nao deve visualizar o favorito criado pela sessao A
     */
    test('deve manter favoritos isolados entre sessões', async ({ request }) => {
      const sessaoA = `sessao-a-${Date.now()}`;
      const sessaoB = `sessao-b-${Date.now()}`;

      // Sessão A favorita o Chevrolet Onix
      const postResponse = await request.post('/api/favorites', {
        headers: {
          'X-Session-Id': sessaoA
        },
        data: {
          vehicleId: 1
        }
      });

      expect(postResponse.ok()).toBeTruthy();

      // Consulta favoritos da sessão A
      const responseA = await request.get('/api/favorites', {
        headers: {
          'X-Session-Id': sessaoA
        }
      });

      expect(responseA.status()).toBe(200);

      const bodyA = await responseA.json();

      const favoritosA = Array.isArray(bodyA)
        ? bodyA
        : bodyA.data;

      expect(favoritosA.length).toBeGreaterThan(0);

      // Consulta favoritos da sessão B
      const responseB = await request.get('/api/favorites', {
        headers: {
          'X-Session-Id': sessaoB
        }
      });

      expect(responseB.status()).toBe(200);

      const bodyB = await responseB.json();

      const favoritosB = Array.isArray(bodyB)
        ? bodyB
        : bodyB.data;

      const onixNaSessaoB = favoritosB.some(
        (favorito: any) =>
          favorito.vehicleId === 1 ||
          favorito.id === 1 ||
          favorito.vehicle?.id === 1
      );

      // Sessão B não deve enxergar favoritos da sessão A
      expect(onixNaSessaoB).toBeFalsy();
    });


    /*
     * BDD-015 - Remover favorito pela API
     * Dado que o Chevrolet Onix foi adicionado aos favoritos de uma sessao
     * Quando a API recebe a remocao desse veiculo e a lista da sessao e consultada novamente
     * Entao o Chevrolet Onix nao deve permanecer nos favoritos
     */
    test('deve remover um veículo dos favoritos pela API', async ({ request }) => {
      const sessionId = `sessao-remocao-${Date.now()}`;

      // Adiciona o veículo
      const postResponse = await request.post('/api/favorites', {
        headers: {
          'X-Session-Id': sessionId
        },
        data: {
          vehicleId: 1
        }
      });

      expect(postResponse.ok()).toBeTruthy();

      // Remove o veículo
      const deleteResponse = await request.delete('/api/favorites/1', {
        headers: {
          'X-Session-Id': sessionId
        }
      });

      expect(deleteResponse.ok()).toBeTruthy();

      // Consulta novamente
      const getResponse = await request.get('/api/favorites', {
        headers: {
          'X-Session-Id': sessionId
        }
      });

      expect(getResponse.status()).toBe(200);

      const body = await getResponse.json();

      const favoritos = Array.isArray(body)
        ? body
        : body.data;

      const onixFavoritado = favoritos.some(
        (favorito: any) =>
          favorito.vehicleId === 1 ||
          favorito.id === 1 ||
          favorito.vehicle?.id === 1
      );

      // O veículo removido não deve continuar nos favoritos
      expect(onixFavoritado).toBeFalsy();
    });

  });

});