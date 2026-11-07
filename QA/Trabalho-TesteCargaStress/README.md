# Trabalho de Teste de Stress — E-sports

Disciplina: Qualidade e Teste de Software. Professor: Hugo Menezes Barra.

## Executar

Instale o Python 3.11 ou superior. No terminal, dentro desta pasta:

```powershell
python -m pip install -r requirements.txt
python -m locust -f locustfile_esports.py
```

Abra http://localhost:8089 e preencha:

| Teste | Usuários | Entrada por segundo | Duração total |
|---|---:|---:|---:|
| T1 (principal) | 50 | 5 | 180 s |
| T2 | 10 | 2 | 45 s |
| T3 | 25 | 5 | 60 s |
| T4 | 40 | 5 | 75 s |
| T5 | 60 | 5 | 90 s |
| T6 | 75 | 5 | 120 s |

Host: `https://jsonplaceholder.typicode.com`.
Selecione a aba Charts durante cada execução. Os tempos incluem a rampa de entrada.
Pare e reinicie o teste entre cenários para não misturar os resultados.

O script usa `HttpUser`, faz GET em `/users` e aplica `between(2, 4)`.
Os usuários virtuais fazem pausas: 50 usuários não significam 50 requisições simultâneas.

## Arquivos da entrega

- `Relatorio_Teste_de_Stress.pdf`: relatório para o AVA.
- `locustfile_esports.py`: código solicitado pelo professor.
- `evidencias/`: capturas reais da aba Charts.
- `resultados/`: estatísticas e relatórios exportados do Locust.

## Entrega

Repositório: https://github.com/joaobagatim/SENAI/tree/main/QA/Trabalho-TesteCargaStress

O relatório está identificado com o aluno João Victor Bagatim. Envie o PDF no
AVA. O código está nesta pasta, no repositório indicado. A versão
`Relatorio_editavel.md` permite adaptar o texto e adicionar integrantes, se necessário.
O arquivo `TRABALHO TESTE DE CARGA E STRESS - JOÃO VICTOR BAGATIM.pdf` segue
o formato visual do trabalho anterior fornecido pelo aluno.

## Referências

- Material fornecido: `Aula 11 - Teste de Stress e Requisitos Não Funcionais.pdf`.
- Enunciado: `Trabalho - Teste de Stress (Qualidade e Teste de Software) (1).pdf`.
- https://docs.locust.io/en/stable/writing-a-locustfile.html
- https://docs.locust.io/en/stable/running-without-web-ui.html
