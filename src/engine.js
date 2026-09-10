import {
  base,
  number,
  integer,
  list,
  choice,
  requireThat,
  metric,
  finding,
  report,
  round,
} from './validation.js';
const directions = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];
const key = ([x, y]) => `${x},${y}`;
export function validate(s) {
  base(s, ['grid', 'start', 'cellSizeM', 'maxSteps', 'coordinateFrame']);
  list(s.grid, 'grid', 1, 30);
  list(s.grid[0], 'row', 1, 30);
  const width = s.grid[0].length;
  s.grid.forEach((row) => {
    list(row, 'row', width, width);
    row.forEach((v) => choice(v, 'cell', [0, 1, 2]));
  });
  list(s.start, 'start', 2, 2);
  integer(s.start[0], 'start.x', 0, width - 1);
  integer(s.start[1], 'start.y', 0, s.grid.length - 1);
  requireThat(
    s.grid[s.start[1]][s.start[0]] === 0,
    'START',
    'Start must be a free cell.',
    'O início deve ser uma célula livre.',
  );
  number(s.cellSizeM, 'cellSizeM', 0.01, 100);
  integer(s.maxSteps, 'maxSteps', 0, 10000);
  choice(s.coordinateFrame, 'coordinateFrame', ['local-grid']);
  return s;
}
/** Unweighted four-neighbor BFS; east/south/west/north ties are deterministic. */
export function shortestPath(grid, start, accept) {
  const queue = [start],
    parent = new Map([[key(start), null]]);
  let target = null;
  for (let i = 0; i < queue.length; i++) {
    const p = queue[i];
    if (accept(p)) {
      target = p;
      break;
    }
    for (const [dx, dy] of directions) {
      const q = [p[0] + dx, p[1] + dy],
        k = key(q);
      if (grid[q[1]]?.[q[0]] === 0 && !parent.has(k)) {
        parent.set(k, p);
        queue.push(q);
      }
    }
  }
  if (!target) return null;
  const path = [];
  for (let p = target; p !== null; p = parent.get(key(p))) path.push(p);
  return path.reverse();
}
export function run(s) {
  validate(s);
  const start = [...s.start],
    reachable = new Set();
  shortestPath(s.grid, start, (p) => {
    reachable.add(key(p));
    return false;
  });
  const visited = new Set([key(start)]),
    path = [start],
    records = [{ step: 0, cell: start, phase: 'start', newVisit: true }],
    findings = [];
  let current = start,
    budgetLimited = false;
  const append = (p, phase) => {
    const newVisit = !visited.has(key(p));
    visited.add(key(p));
    path.push([...p]);
    records.push({ step: path.length - 1, cell: [...p], phase, newVisit });
    current = p;
  };
  while (visited.size < reachable.size) {
    const route = shortestPath(s.grid, current, (p) => !visited.has(key(p)));
    if (!route) break;
    const home = shortestPath(s.grid, route.at(-1), (p) => key(p) === key(start));
    if (path.length - 1 + route.length - 1 + home.length - 1 > s.maxSteps) {
      budgetLimited = true;
      break;
    }
    route.slice(1).forEach((p) => append(p, 'search'));
  }
  const home = shortestPath(s.grid, current, (p) => key(p) === key(start));
  home.slice(1).forEach((p) => append(p, 'return'));
  const free = s.grid.flat().filter((v) => v === 0).length,
    unreachable = free - reachable.size;
  if (budgetLimited)
    findings.push(
      finding(
        'warning',
        'BUDGET_LIMIT',
        'The greedy search stopped to preserve its modeled return budget.',
        'A busca gulosa parou para preservar o orçamento de retorno do modelo.',
      ),
    );
  if (unreachable)
    findings.push(
      finding(
        'warning',
        'UNREACHABLE_CELLS',
        `${unreachable} free cells are disconnected from the start.`,
        `${unreachable} células livres estão desconectadas do início.`,
      ),
    );
  const coverage = (visited.size / reachable.size) * 100;
  return report(
    s,
    'go2-pro-search-coverage',
    [
      metric('coveragePct', 'Reachable coverage', 'Cobertura alcançável', round(coverage), '%'),
      metric('visitedCells', 'Visited cells', 'Células visitadas', visited.size),
      metric('steps', 'Movement steps', 'Passos de movimento', path.length - 1),
      metric(
        'distanceM',
        'Modeled distance',
        'Distância do modelo',
        round((path.length - 1) * s.cellSizeM),
        'm',
      ),
    ],
    findings,
    records,
    {
      grid: s.grid.map((r) => [...r]),
      path,
      cellSizeM: s.cellSizeM,
      coordinateFrame: s.coordinateFrame,
      reachableCells: reachable.size,
      unreachableCells: unreachable,
      unvisitedReachableCells: reachable.size - visited.size,
      returned: key(current) === key(start),
      budgetRemainingSteps: s.maxSteps - path.length + 1,
    },
  );
}
/** Public generic trajectory exchange; this is not a device protocol. */
export function toTelemetry(s, samplePeriodMs = 1000) {
  integer(samplePeriodMs, 'samplePeriodMs', 1, 60000);
  const r = run(s);
  requireThat(
    s.source === 'synthetic',
    'SYNTHETIC_EXPORT',
    'This simulator export requires a synthetic source.',
    'A exportação do simulador exige origem sintética.',
  );
  const speedLimitMps = Math.max(0.01, s.cellSizeM / (samplePeriodMs / 1000) + 0.001);
  requireThat(
    speedLimitMps <= 20 && (r.path.length - 1) * samplePeriodMs <= 86400000,
    'EXCHANGE_LIMIT',
    'The generated trace exceeds the receiving project limits.',
    'O trajeto gerado excede os limites do projeto receptor.',
  );
  return {
    schemaVersion: 1,
    scenarioId: s.scenarioId,
    source: 'synthetic',
    maxGapMs: samplePeriodMs,
    speedLimitMps,
    samples: r.path.map((p, i) => ({
      atMs: i * samplePeriodMs,
      xM: (p[0] + 0.5) * s.cellSizeM,
      yM: (p[1] + 0.5) * s.cellSizeM,
      batteryPct: 100,
      quality: 'valid',
    })),
  };
}
