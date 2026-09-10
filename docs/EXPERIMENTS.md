# Worked experiments · Experimentos comentados

[README](../README.md)

## English

The nominal 6×4 open grid has 24 reachable cells. The deterministic route visits all 24 and returns in 24 movement steps, totaling 12 m at 0.5 m per cell. With a zero-step budget it remains at the start: one visited cell and 4.166667% reachable coverage. A wall that splits the grid yields 100% coverage of the reachable component while explicitly retaining the unreachable-cell count.

For each experiment below, run the command and compare the JSON with the committed expected report. Change one assumption at a time; keep the original input as a separate file. Status is an interpretation of this model, not physical approval.

## Português

A grade livre nominal de 6×4 tem 24 células alcançáveis. A rota determinística visita as 24 e retorna em 24 passos, totalizando 12 m a 0,5 m por célula. Com orçamento zero, permanece no início: uma célula visitada e 4,166667% de cobertura alcançável. Uma parede que divide a grade pode produzir 100% de cobertura do componente alcançável, mantendo explícita a contagem de células inalcançáveis.

Em cada experimento abaixo, execute o comando e compare o JSON com o relatório esperado versionado. Altere uma hipótese por vez e preserve a entrada original em arquivo separado. O estado é uma interpretação deste modelo, não aprovação física.

## Open training floor · Piso de treinamento livre

```sh
node scripts/analyze.mjs examples/nominal.json experiment.report.json
```

[Input / Entrada](../examples/nominal.json) · [Expected / Esperado](../examples/nominal.report.json) · `complete`

| Metric · Métrica                          | Expected value · Valor esperado |
| ----------------------------------------- | ------------------------------- |
| Reachable coverage / Cobertura alcançável | 100 %                           |
| Visited cells / Células visitadas         | 24                              |
| Movement steps / Passos de movimento      | 24                              |
| Modeled distance / Distância do modelo    | 12 m                            |

## Limited movement budget · Orçamento de movimento reduzido

```sh
node scripts/analyze.mjs examples/limited.json experiment.report.json
```

[Input / Entrada](../examples/limited.json) · [Expected / Esperado](../examples/limited.report.json) · `review-notes`

| Metric · Métrica                          | Expected value · Valor esperado |
| ----------------------------------------- | ------------------------------- |
| Reachable coverage / Cobertura alcançável | 20.833333 %                     |
| Visited cells / Células visitadas         | 5                               |
| Movement steps / Passos de movimento      | 8                               |
| Modeled distance / Distância do modelo    | 4 m                             |

- `BUDGET_LIMIT`: The greedy search stopped to preserve its modeled return budget. / A busca gulosa parou para preservar o orçamento de retorno do modelo.

## Disconnected rooms · Salas desconectadas

```sh
node scripts/analyze.mjs examples/partitioned.json experiment.report.json
```

[Input / Entrada](../examples/partitioned.json) · [Expected / Esperado](../examples/partitioned.report.json) · `review-notes`

| Metric · Métrica                          | Expected value · Valor esperado |
| ----------------------------------------- | ------------------------------- |
| Reachable coverage / Cobertura alcançável | 100 %                           |
| Visited cells / Células visitadas         | 8                               |
| Movement steps / Passos de movimento      | 8                               |
| Modeled distance / Distância do modelo    | 4 m                             |

- `UNREACHABLE_CELLS`: 12 free cells are disconnected from the start. / 12 células livres estão desconectadas do início.

## Excluded training area · Área excluída do treinamento

```sh
node scripts/analyze.mjs examples/exclusion.json experiment.report.json
```

[Input / Entrada](../examples/exclusion.json) · [Expected / Esperado](../examples/exclusion.report.json) · `complete`

| Metric · Métrica                          | Expected value · Valor esperado |
| ----------------------------------------- | ------------------------------- |
| Reachable coverage / Cobertura alcançável | 100 %                           |
| Visited cells / Células visitadas         | 20                              |
| Movement steps / Passos de movimento      | 28                              |
| Modeled distance / Distância do modelo    | 14 m                            |

## Stationary review · Revisão sem movimento

```sh
node scripts/analyze.mjs examples/stationary.json experiment.report.json
```

[Input / Entrada](../examples/stationary.json) · [Expected / Esperado](../examples/stationary.report.json) · `review-notes`

| Metric · Métrica                          | Expected value · Valor esperado |
| ----------------------------------------- | ------------------------------- |
| Reachable coverage / Cobertura alcançável | 4.166667 %                      |
| Visited cells / Células visitadas         | 1                               |
| Movement steps / Passos de movimento      | 0                               |
| Modeled distance / Distância do modelo    | 0 m                             |

- `BUDGET_LIMIT`: The greedy search stopped to preserve its modeled return budget. / A busca gulosa parou para preservar o orçamento de retorno do modelo.
