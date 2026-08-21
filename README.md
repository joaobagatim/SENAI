# Trabalho I – Qualidade e Teste de Software

**Disciplina:** Qualidade e Teste de Software
**Professor:** Hugo Menezes Barra
**Aluno:** João Victor Bagatim
**Semestre:** 2026.2

## Sobre o projeto

Este projeto implementa e valida o componente **CarrinhoDeCompras** de um sistema de e-commerce, aplicando os conceitos da **ISO/IEC 25010** por meio de testes unitários automatizados com **pytest**.

O objetivo é garantir que as regras de negócio do checkout sejam executadas corretamente, incluindo descontos progressivos, cálculo de frete, tratamento de exceções e validação de valores limite.

## Estrutura do projeto

```text
Trabalho_I_QA/
├── carrinho.py          # Implementação do carrinho de compras
├── test_carrinho.py     # Suíte de testes unitários
└── README.md            # Documentação do projeto
```

## Regras de negócio implementadas

* Desconto de **10%** para compras a partir de **R$ 100,00**.
* Desconto de **20%** para compras a partir de **R$ 500,00**.
* **Frete grátis** para compras a partir de **R$ 200,00**.
* Frete fixo de **R$ 20,00** para valores inferiores a R$ 200,00.
* O sistema lança `ValueError` quando:

  * um item possui preço igual ou menor que zero;
  * tenta-se finalizar um carrinho vazio.

## Cenários de teste

A suíte de testes cobre todos os requisitos solicitados no trabalho.

| Cenário                   | Validação |
| ------------------------- | --------- |
| Compra sem desconto       | ✅         |
| Limite de R$ 99,99        | ✅         |
| Limite de R$ 100,00       | ✅         |
| Limite de R$ 499,99       | ✅         |
| Limite de R$ 500,00       | ✅         |
| Frete em R$ 199,99        | ✅         |
| Frete grátis em R$ 200,00 | ✅         |
| Preço negativo            | ✅         |
| Preço zero                | ✅         |
| Carrinho vazio            | ✅         |

## Tecnologias utilizadas

* Python 3.14
* Pytest 9.x

## Como executar

### 1. Instalar o Pytest

```bash
pip install pytest
```

### 2. Executar os testes

No Windows (PowerShell):

```bash
py -m pytest -v
```

Ou, em outros ambientes:

```bash
python -m pytest -v
```

## Resultado esperado

Após executar os testes, deverá aparecer uma saída semelhante a:

```text
============================= test session starts =============================
collected 10 items

test_carrinho.py::test_compra_sem_desconto PASSED
test_carrinho.py::test_limite_9999 PASSED
test_carrinho.py::test_limite_100 PASSED
test_carrinho.py::test_limite_49999 PASSED
test_carrinho.py::test_limite_500 PASSED
test_carrinho.py::test_frete_19999 PASSED
test_carrinho.py::test_frete_200 PASSED
test_carrinho.py::test_preco_negativo PASSED
test_carrinho.py::test_preco_zero PASSED
test_carrinho.py::test_carrinho_vazio PASSED

============================= 10 passed =============================
```

## Aplicação da ISO/IEC 25010

O projeto demonstra, na prática, três características da norma estudada na disciplina:

* **Adequação Funcional:** valida corretamente descontos, frete e cálculo do total.
* **Confiabilidade:** trata entradas inválidas por meio de exceções (`ValueError`).
* **Manutenibilidade:** a suíte automatizada permite futuras alterações sem comprometer as regras já implementadas.

## Autor

**João Victor Bagatim**
