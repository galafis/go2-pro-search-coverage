# Integration · Integração

## English

This repository runs independently. Related project: [go2-pro-telemetry-replay](https://github.com/galafis/go2-pro-telemetry-replay). A shared research purpose does not imply a shared wire protocol or live device connection. Keep units, coordinate frames, timing and provenance explicit when comparing reports.

## Português

Este repositório funciona de forma independente. Projeto relacionado: [go2-pro-telemetry-replay](https://github.com/galafis/go2-pro-telemetry-replay). Um objetivo de pesquisa comum não implica protocolo compartilhado ou conexão ao vivo com dispositivos. Preserve unidades, sistemas de coordenadas, tempos e origem dos dados ao comparar relatórios.

## Reusable function · Função reutilizável

```js
import { run } from './src/engine.js';
const report = run(scenario);
```

English: `scenario` must satisfy the documented data contract. The function returns a new report without mutating the input. `run` is the validated public entry point; lower-level exported mathematical helpers assume their inputs have already been checked.

Português: `scenario` deve atender ao contrato de dados documentado. A função retorna novo relatório sem alterar a entrada. `run` é a entrada pública validada; funções matemáticas auxiliares exportadas pressupõem entradas já verificadas.

## Implemented exchange to Telemetry Replay · Troca implementada com Telemetry Replay

Clone this project and [Go2 PRO Telemetry Replay](https://github.com/galafis/go2-pro-telemetry-replay) as sibling directories. Run from this repository: / Clone este projeto e o Telemetry Replay como pastas irmãs. Execute a partir deste repositório:

```sh
node scripts/to-telemetry.mjs examples/nominal.json synthetic-trace.json 1000
node ../go2-pro-telemetry-replay/scripts/analyze.mjs synthetic-trace.json replay.report.json
```

English: The adapter samples the grid path at the supplied interval, maps cell centers to meters and uses the receiving project's public schema. It accepts only `synthetic` source scenarios. `batteryPct=100` is an explicit placeholder, not an energy model. Sample duration and implied speed must fit the receiver's limits. The coordinate frame is `local-grid`; no world-frame transform or device connection is implied. The nominal exchange produces 25 samples and 12 m of included distance.

Português: O adaptador amostra a rota no intervalo fornecido, converte centros de células em metros e usa o esquema público do receptor. Aceita apenas cenários com origem `synthetic`. `batteryPct=100` é um valor ilustrativo explícito, não um modelo de energia. Duração e velocidade implícita devem caber nos limites do receptor. O sistema de coordenadas é `local-grid`; não se pressupõe transformação global nem conexão ao dispositivo. A troca nominal produz 25 amostras e 12 m de distância incluída.
