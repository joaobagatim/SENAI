import { test, expect } from '@playwright/test';

test.describe('API - Doutor IE', () => {

  // =========================================================
  // AUTENTICAÇÃO
  // =========================================================

  test.describe('Autenticação', () => {

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


    test('deve retornar os detalhes do Chevrolet Onix', async ({ request }) => {
      const response = await request.get('/api/vehicles/1');

      expect(response.status()).toBe(200);

      const body = await response.json();

      expect(body).toHaveProperty('id', 1);
      expect(body).toHaveProperty('brand', 'Chevrolet');
      expect(body).toHaveProperty('model', 'Onix');
    });


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