# Research scope · Escopo de pesquisa

## English

A deterministic coverage-route simulator for a supplied training-floor grid. It computes reachable cells, plans visits to new cells and reserves enough movement steps to return to the starting point.

This is a point-cell traversal model. A visited cell does not imply that a person or object was detected. Body clearance, sensor visibility, smoke, heat, moving people and terrain stability are outside the model. The movement budget is not battery capacity. The route must not be sent to a robot without a separately supported adapter and physical validation.

## Português

Um simulador determinístico de cobertura para uma grade de piso de treinamento fornecida. Calcula células alcançáveis, planeja visitas a novas células e reserva passos suficientes para retornar ao início.

Este é um modelo de percurso pontual em células. Visitar uma célula não significa detectar uma pessoa ou objeto. Espaço para o corpo, visibilidade de sensores, fumaça, calor, pessoas em movimento e estabilidade do terreno estão fora do modelo. O orçamento de passos não é capacidade de bateria. A rota exige adaptador compatível e validação física próprios antes de qualquer uso em um robô.

[Development stages / Etapas de desenvolvimento](GO2_PRO_PLAN.md)

Independent public implementation using synthetic examples. No private Évia implementation is included or required. / Implementação pública independente com exemplos sintéticos. Nenhuma implementação privada da Évia está incluída ou é necessária.
