# Diário de uso de IA

Durante a realização deste teste técnico, utilizei o ChatGPT como ferramenta de apoio em alguns momentos do processo, principalmente para estruturar ideias de automação, revisar cenários de teste e organizar a documentação dos bugs encontrados.

A execução dos testes, análise dos comportamentos da aplicação, investigação das falhas e validação dos resultados foram realizadas por mim diretamente na aplicação, utilizando Playwright, DevTools, análise das respostas da API e testes manuais.

A IA foi utilizada como apoio complementar, e não como substituição da análise de QA.

## Prompts-chave utilizados

Alguns dos prompts e perguntas que mais contribuíram durante o desenvolvimento foram:

* "Como posso estruturar um teste de login com Playwright?"
* "Quais valores-limite são interessantes para validar a RN01?"
* "Esse teste falhou com `revision-error` hidden. Como posso investigar se é um bug ou problema no teste?"
* "Como posso melhorar esse locator no Playwright?"
* "Como comparar os dados retornados pela API com os valores apresentados na UI?"
* "Documente esse bug no formato solicitado pelo desafio."
* "Quais outros testes de API poderiam agregar valor ao projeto?"
* "Ao finalizar o trabalho, transforme os cenários testados em BDD utilizando Dado, Quando e Então."

## Onde a IA ajudou bem

A IA foi útil principalmente como apoio na organização do projeto e na discussão de possíveis cenários de teste.

Na automação com Playwright, utilizei algumas sugestões para estruturar os testes, porém os cenários foram executados e analisados individualmente por mim. Sempre que necessário, alterei os testes de acordo com o comportamento real observado na aplicação.

Também utilizei técnicas de teste como:

* análise de valores-limite;
* particionamento de equivalência;
* transição de estados;
* cenários positivos e negativos;
* comparação entre API e interface.

Na RN01, por exemplo, foram testados manualmente e por automação valores como:

* campo vazio;
* `-1`;
* `0`;
* `999999`;
* `1000000`;
* `1.5`.

A partir da execução desses cenários, identifiquei que a aplicação validava corretamente alguns casos, mas permitia concluir revisões com valores fora dos limites estabelecidos.

Outro ponto em que a IA ajudou foi na organização dos bugs encontrados no formato solicitado pelo desafio, facilitando a padronização do `RELATORIO-DE-BUGS.md`.

Ao final do trabalho, também utilizei a IA para transformar os cenários já executados e validados em uma documentação no formato BDD. Nesse momento, os testes já estavam concluídos e os resultados já haviam sido analisados por mim. A IA foi utilizada apenas para organizar cada cenário utilizando a estrutura:

```text
Dado que...
Quando...
Então...
```

Essa etapa teve como objetivo melhorar a legibilidade da documentação e deixar mais claro o comportamento esperado de cada cenário testado.

## Testes e análises realizados por mim

Durante o desafio, além da automação, realizei a navegação e validação manual da aplicação para entender o comportamento de cada funcionalidade.

Entre as análises realizadas diretamente por mim estiveram:

* execução manual dos fluxos de login;
* navegação pelo catálogo e pelos manuais;
* testes de busca;
* inclusão e remoção de favoritos;
* criação e edição de revisões;
* validação dos estados de rascunho e concluído;
* testes dos limites dos campos;
* conferência do histórico de revisões;
* inspeção de elementos pelo DevTools;
* análise de mensagens de erro;
* comparação entre respostas da API e informações exibidas na UI;
* execução e análise dos testes no Playwright UI Mode.

Os resultados sugeridos ou discutidos com a IA só foram considerados após serem reproduzidos e confirmados por mim na aplicação.

## Onde a IA errou ou fez suposições incorretas

Um exemplo ocorreu no primeiro teste de listagem de veículos pela API.

Inicialmente foi considerado que:

```text
GET /api/vehicles
```

retornaria diretamente um array.

O teste foi inicialmente estruturado com:

```ts
expect(Array.isArray(body)).toBeTruthy();
```

Ao executar o teste, analisei a resposta real da API e identifiquei que o contrato era:

```json
{
  "total": 8,
  "data": [
    ...
  ]
}
```

A partir dessa análise, ajustei o teste para validar corretamente `body.total` e `body.data`.

Outro caso ocorreu durante a validação da RN06.

Um primeiro locator utilizado para localizar uma revisão concluída não estava selecionando corretamente o elemento desejado. O teste passou, mesmo eu já tendo observado manualmente que revisões concluídas exibiam o botão **Editar**.

Como o resultado automatizado não correspondia ao comportamento observado por mim na interface, investiguei o locator e alterei o teste para garantir que o registro correto estivesse sendo encontrado.

Foi adicionada a validação:

```ts
await expect(revisaoConcluida).toHaveCount(1);
```

e posteriormente:

```ts
await expect(botaoEditar).toHaveCount(0);
```

O novo teste retornou:

```text
Expected: 0
Received: 1
```

Confirmando o comportamento que eu já havia identificado durante a análise manual.

Em seguida, validei também que uma revisão concluída podia ser editada e retornar ao estado de rascunho.

## Como validei as sugestões da IA

Nenhuma sugestão foi considerada automaticamente correta.

Sempre que um cenário era proposto, eu executava o teste e verificava se o comportamento correspondia à regra de negócio.

Quando um teste falhava, procurei identificar se a causa estava:

* na aplicação;
* no código do teste;
* no locator utilizado;
* na massa de dados;
* ou em alguma suposição incorreta sobre o funcionamento do sistema.

Para isso, utilizei:

* Playwright UI Mode;
* DevTools do navegador;
* inspeção do DOM;
* logs de execução;
* respostas reais da API;
* histórico de revisões;
* testes manuais;
* screenshots como evidência.

Um exemplo foi o cenário de busca sem resultados.

Ao pesquisar por `"Ferrari"`, observei manualmente que todos os cards desapareciam, porém nenhuma mensagem era exibida.

Pelo DevTools, localizei o elemento:

```html
data-testid="empty-state"
```

que continha a mensagem:

```text
Nenhum veículo encontrado.
```

Porém, o elemento permanecia com o atributo `hidden`.

A análise manual confirmou que o problema estava no comportamento da aplicação.

## Uso da IA na documentação em BDD

Após finalizar a execução, análise e validação dos testes, utilizei a IA para me auxiliar na transformação dos cenários já testados em documentação no formato **BDD (Behavior-Driven Development)**.

Nesse momento, os testes já haviam sido executados e seus resultados já estavam validados por mim. A IA foi utilizada somente para organizar os cenários de maneira mais clara e padronizada utilizando:

```text
Dado que...
Quando...
Então...
```

Os cenários BDD foram elaborados com base nos testes que já haviam sido realizados, incluindo:

* autenticação;
* catálogo;
* busca;
* favoritos;
* fluxo principal E2E;
* regras RN01 a RN06;
* testes de API.

Após a geração do BDD, revisei os textos para garantir que cada cenário representasse corretamente o comportamento que havia sido testado durante o desafio.

Não foram adicionados no BDD resultados ou comportamentos que não tivessem sido previamente executados ou analisados.

## Decisões tomadas contra sugestões da IA

Em determinado momento, foi sugerido aumentar ainda mais a cobertura de API, reproduzindo diretamente pela API todos os bugs encontrados nas RN01–RN06.

Optei por não seguir essa sugestão.

O próprio desafio informa que os testes de API são um diferencial, e não um requisito obrigatório. Como eu já havia criado testes de:

* autenticação;
* listagem de veículos;
* detalhes;
* especificações;
* paginação;
* favoritos;
* isolamento dos favoritos por sessão;
* criação de revisão;
* comparação entre API e UI;

considerei que a cobertura de API já demonstrava de forma suficiente o conhecimento necessário.

Preferi utilizar o tempo restante para revisar a automação, melhorar a documentação, estruturar os cenários em BDD e organizar a entrega.

## Principais aprendizados

A IA ajudou principalmente como ferramenta de apoio para acelerar algumas etapas, levantar possibilidades de cenários, revisar a estrutura dos testes e organizar a documentação.

Porém, a parte mais importante do processo continuou sendo a análise do comportamento real da aplicação.

Durante o desafio, algumas das descobertas mais relevantes aconteceram justamente quando o resultado de um teste não correspondia ao que eu havia observado manualmente. Nesses casos, foi necessário investigar, revisar o teste e confirmar o comportamento antes de registrar um bug.

O uso da IA na criação do BDD também foi realizado somente após os cenários já terem sido executados e validados, servindo como apoio para organizar e documentar melhor o trabalho já realizado.

Por isso, utilizei a IA como apoio à produtividade e à organização, mantendo a execução dos testes, investigação das evidências e decisão final sobre os defeitos encontrados sob minha própria análise de QA.
