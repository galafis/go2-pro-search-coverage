# Data contract · Contrato de dados

[README](../README.md) · [JSON Schema](../schemas/scenario.schema.json)

## Envelope

| Field · Campo   | Contract · Contrato                                                                                                                                                           |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `schemaVersion` | Exactly 1 / Exatamente 1                                                                                                                                                      |
| `scenarioId`    | 1–64 lowercase letters, digits, dashes or underscores; first character alphanumeric / 1–64 letras minúsculas, dígitos, hífens ou sublinhados; primeiro caractere alfanumérico |
| `source`        | `synthetic` or `manual`; manual is not verified measurement provenance / `synthetic` ou `manual`; manual não comprova origem medida                                           |

## Domain fields · Campos do domínio

| Field · Campo     | English                                                                                            | Português                                                                                       |
| ----------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `grid`            | Rectangular grid: 0 free, 1 blocked, 2 excluded; 1–30 rows and columns.                            | Grade retangular: 0 livre, 1 bloqueada, 2 excluída; 1–30 linhas e colunas.                      |
| `start`           | Zero-based [column,row], inside a free cell.                                                       | [coluna,linha] a partir de zero, em célula livre.                                               |
| `cellSizeM`       | Distance between adjacent cell centers, in meters.                                                 | Distância entre centros de células adjacentes, em metros.                                       |
| `maxSteps`        | Integer movement budget, including the return, from 0 to 10,000.                                   | Orçamento inteiro de movimento, incluindo retorno, de 0 a 10.000.                               |
| `coordinateFrame` | Must be local-grid. Cell centers are converted to planar coordinates by adding 0.5 before scaling. | Deve ser local-grid. Centros são convertidos em coordenadas planas somando 0,5 antes da escala. |

## Nested fields and bounds · Campos aninhados e limites

| Path · Caminho    | Type / bounds · Tipo / limites |
| ----------------- | ------------------------------ |
| `schemaVersion`   | constant 1                     |
| `scenarioId`      | string                         |
| `source`          | synthetic / manual             |
| `grid`            | array [1–30 items / itens]     |
| `start`           | array [2–2 items / itens]      |
| `cellSizeM`       | number [0.01, 100]             |
| `maxSteps`        | integer [0, 10000]             |
| `coordinateFrame` | constant local-grid            |

## Semantic checks · Verificações semânticas

English: The schema checks shape and scalar bounds. The engine additionally checks relationships such as unique identities, references, geometry consistency, non-overlapping windows or non-degenerate fits, as applicable. Unknown fields are rejected at object boundaries. Numbers must be finite. Validation occurs before analysis and imported inputs are limited to 1 MB in both interfaces.

Português: O esquema verifica estrutura e limites escalares. O mecanismo também verifica relações como identidades únicas, referências, consistência geométrica, janelas sem sobreposição ou ajustes não degenerados, conforme o domínio. Campos desconhecidos são rejeitados nos objetos. Números devem ser finitos. A validação ocorre antes da análise e entradas importadas são limitadas a 1 MB em ambas as interfaces.

## Report · Relatório

`schemaVersion`, `analysisVersion`, `projectId`, `scenarioId`, `source`, `status`, `metrics`, `findings` and `records` form the shared envelope. Project-specific fields retain the detailed calculation. Numeric results are exported as numbers; localization affects only display. Many presentation values are rounded to six decimal places; a rounded zero does not establish exact physical agreement.

`schemaVersion`, `analysisVersion`, `projectId`, `scenarioId`, `source`, `status`, `metrics`, `findings` e `records` formam o envelope comum. Campos específicos preservam o cálculo detalhado. Resultados numéricos são exportados como números; localização afeta apenas a exibição. Muitos valores de apresentação são arredondados a seis casas decimais; zero arredondado não comprova concordância física exata.

| Status                           | Meaning · Significado                                               | CLI exit · Saída |
| -------------------------------- | ------------------------------------------------------------------- | ---------------- |
| `complete`                       | No model findings / Sem achados no modelo                           | 0                |
| `review-notes`                   | Informational or warning findings / Informações ou avisos           | 0                |
| `review-required`                | At least one error-level finding / Ao menos um achado de nível erro | 2                |
| Invalid input / Entrada inválida | No new report / Sem novo relatório                                  | 1                |
