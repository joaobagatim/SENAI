# Teste Técnico QA — Doutor-IE

Projeto desenvolvido para o desafio técnico de **Quality Assurance do Doutor-IE**, contemplando testes exploratórios, automação E2E com Playwright, validação das regras de negócio do módulo de revisões e testes de API.

A aplicação utilizada nos testes é executada localmente em:

```text
http://localhost:3000
```

## Tecnologias utilizadas

* Playwright
* TypeScript
* Node.js
* Git
* Chrome DevTools

## Estrutura do projeto

```text
.
├── tests/
│   ├── api
│   │   └── api.spec.ts
│   ├── auth
│   │   └── login.spec.ts
│   ├── revisions
│   │   └── revisions.spec.ts
│   └── vehicles
│       └── vehicles.spec.ts 
│
├── playwright.config.ts
├── RELATORIO-DE-BUGS.md
├── DIARIO-DE-IA.md
├── README.md
├── package.json
├── package-lock.json
├── image-1.png
├── image-2.png
├── image-3.png
├── image-4.png
├── image-5.png
└── image.png
```

## Pré-requisitos

Para executar os testes automatizados é necessário ter instalado:

* Node.js
* npm
* Playwright

A aplicação de testes do Doutor-IE deve estar em execução antes de iniciar a automação.

## Instalação do projeto

Após clonar o repositório, acesse a pasta do projeto:

```bash
cd nome-do-repositorio
```

Instale as dependências:

```bash
npm install
```

Caso os navegadores do Playwright ainda não estejam instalados:

```bash
npx playwright install
```

## Executando a aplicação Doutor-IE

Antes de executar os testes, inicie o executável fornecido no desafio técnico.

### Windows

Execute:

```text
Doutor-IE-QA-test-win-x64.exe
```

Caso o Windows SmartScreen seja exibido, selecione:

```text
Mais informações → Executar assim mesmo
```

### Linux

```bash
chmod +x ./Doutor-IE-QA-test-linux-x64
./Doutor-IE-QA-test-linux-x64
```

### macOS

Utilize a versão correspondente ao processador da máquina (`arm64` ou `x64`).

Exemplo para Apple Silicon:

```bash
chmod +x ./Doutor-IE-QA-test-macos-arm64
xattr -d com.apple.quarantine ./Doutor-IE-QA-test-macos-arm64
./Doutor-IE-QA-test-macos-arm64
```

Após iniciar, a aplicação deve estar disponível em:

```text
http://localhost:3000
```

Mantenha o executável aberto durante toda a execução dos testes.

## Executando os testes

### Executar toda a suíte

```bash
npx playwright test
```

### Executar utilizando o Playwright UI Mode

```bash
npx playwright test --ui
```

Essa foi uma das principais formas utilizadas durante o desenvolvimento e investigação dos cenários, pois permite acompanhar a execução de cada etapa do teste.

### Executar com o navegador visível

```bash
npx playwright test --headed
```

### Executar somente os testes de API

```bash
npx playwright test tests/api.spec.ts
```

### Executar somente os testes de revisões

```bash
npx playwright test tests/revisions.spec.ts
```

### Executar um teste específico

Exemplo:

```bash
npx playwright test tests/api.spec.ts -g "deve listar veículos"
```

## Cobertura dos testes

### Autenticação

Foram automatizados cenários de:

* login com credenciais válidas;
* login com credenciais inválidas;
* autenticação pela API.

### Catálogo e veículos

Foram validados:

* carregamento do catálogo;
* abertura do manual de um veículo;
* busca sem resultados;
* informações do veículo;
* detalhes e especificações técnicas;
* paginação da API.

### Favoritos

Foram automatizados cenários de:

* favoritar um veículo pela interface;
* validar o contador de favoritos;
* acessar a tela de favoritos;
* adicionar favorito pela API;
* listar favoritos;
* remover favorito;
* validar isolamento entre sessões através do header `X-Session-Id`.

### Fluxo E2E principal

Foi automatizado o fluxo:

```text
Login → Catálogo → Abrir manual → Voltar ao catálogo → Favoritar veículo → Validar favoritos
```

## Regras de negócio — Revisões

Foram automatizadas as regras **RN01 a RN06** utilizando cenários positivos, negativos, análise de valores-limite, particionamento de equivalência e transição de estados.

### RN01 — Quilometragem

Foram testados:

```text
Campo vazio
-1
0
999999
1000000
1.5
```

Os testes verificam:

* obrigatoriedade;
* limite mínimo;
* limite máximo;
* aceitação apenas de números inteiros.

### RN02 — Data

Foram testados:

* campo obrigatório;
* data válida;
* data futura.

### RN03 — Tipo da revisão

Foram validados:

* campo obrigatório;
* Preventiva;
* Corretiva;
* Inspeção.

### RN04 — Troca de óleo

Foram testados:

* obrigatoriedade do tipo do óleo;
* obrigatoriedade da quantidade;
* quantidade igual a `0`;
* quantidade igual a `0.1`;
* quantidade igual a `10`;
* quantidade igual a `10.1`.

### RN05 — Observações

Foram testados:

* campo vazio;
* exatamente 300 caracteres;
* 301 caracteres.

Também foi validado se o sistema realiza ou não truncamento silencioso do conteúdo.

### RN06 — Estados e histórico

Foram testados:

* criação de rascunho incompleto;
* edição de rascunho;
* alteração e salvamento de rascunho;
* impossibilidade esperada de editar revisão concluída;
* tentativa de retornar revisão concluída para rascunho;
* ordenação das revisões mais recentes primeiro.

## Testes de API

Além dos testes obrigatórios de interface, foi adicionada uma camada de testes de API como diferencial.

Foram validados os endpoints relacionados a:

### Autenticação

```text
POST /api/login
```

Cenários:

* credenciais válidas;
* credenciais inválidas;
* estrutura básica da resposta.

### Veículos

```text
GET /api/vehicles
GET /api/vehicles/:id
GET /api/vehicles/:id/specs
```

Foram validados:

* status HTTP;
* estrutura da resposta;
* quantidade de veículos;
* detalhes de veículo;
* especificações;
* paginação;
* retorno de registros diferentes entre páginas.

### Favoritos

```text
GET /api/favorites
POST /api/favorites
DELETE /api/favorites/:id
```

Foram validados:

* inclusão;
* consulta;
* remoção;
* isolamento entre diferentes valores de `X-Session-Id`.

### Revisões

```text
GET /api/vehicles/:id/revisions
POST /api/vehicles/:id/revisions
```

Foi validado o fluxo de criação de uma revisão válida e sua posterior presença no histórico.

## Validação de consistência entre API e UI

Também foi criado um teste que consulta as especificações técnicas diretamente pela API e compara os dados com os valores apresentados no manual do mesmo veículo pela interface.

Esse cenário permitiu identificar uma inconsistência entre a capacidade do tanque retornada pelo backend e o valor apresentado ao usuário na UI.

## Bugs encontrados

Durante os testes exploratórios e automatizados foram documentados os seguintes defeitos:

```text
BUG-01 — Busca sem resultados não apresenta mensagem de estado vazio
BUG-02 — Quilometragem fora dos limites permitidos pode ser aceita
BUG-03 — Revisão pode ser concluída com data futura
BUG-04 — Campos obrigatórios da troca de óleo não são corretamente validados
BUG-05 — Observações acima de 300 caracteres podem ser aceitas
BUG-06 — Revisão concluída pode ser editada e retornar para rascunho
BUG-07 — Capacidade do tanque exibida na UI diverge da API
```

Os detalhes, passos para reprodução, resultados esperados, resultados obtidos e evidências estão disponíveis em:

```text
RELATORIO-DE-BUGS.md
```

Alguns testes automatizados foram utilizados propositalmente para evidenciar comportamentos que divergem das regras de negócio. Esses cenários estão relacionados aos bugs documentados no relatório.

## Evidências e investigação

Durante a análise foram utilizadas diferentes formas de validação:

* execução manual dos fluxos;
* Playwright UI Mode;
* screenshots;
* inspeção do DOM pelo Chrome DevTools;
* análise dos atributos `data-testid`;
* análise das mensagens de erro;
* histórico de revisões;
* respostas reais da API;
* comparação entre backend e interface.

Sempre que um teste automatizado apresentou um resultado inesperado, o comportamento foi reproduzido manualmente antes de ser registrado como defeito.

## Uso de IA

A IA foi utilizada como ferramenta de apoio durante algumas etapas do desafio, principalmente para discussão de cenários, revisão de automações e organização da documentação.

Os testes foram executados, analisados e validados diretamente por mim na aplicação.

O processo de utilização, validação das sugestões, erros identificados nas respostas da IA e decisões tomadas durante o desenvolvimento estão documentados em:

```text
DIARIO-DE-IA.md
```

## Relatório de bugs

O relatório completo pode ser encontrado em:

```text
RELATORIO-DE-BUGS.md
```

Ele contém os defeitos identificados durante os testes exploratórios e automatizados, seguindo o padrão:

```text
Título
Severidade
Local
Passos para reproduzir
Resultado esperado
Resultado obtido
Evidência
```

## Observações

Os dados de favoritos e revisões são mantidos em memória pela aplicação de testes.

Ao reiniciar o executável do Doutor-IE, esses dados são apagados. Por esse motivo, os testes utilizam dados controlados e, nos cenários de API que envolvem sessão, identificadores próprios através do header:

```text
X-Session-Id
```

## Autor

**João Victor Bagatim**
