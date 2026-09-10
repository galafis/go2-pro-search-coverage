import test from 'node:test';
import assert from 'node:assert/strict';
import { run, shortestPath, toTelemetry } from '../src/engine.js';
const scenario = (extra = {}) => ({
  schemaVersion: 1,
  scenarioId: 'test',
  source: 'synthetic',
  grid: [
    [0, 0, 0],
    [0, 0, 0],
  ],
  start: [0, 0],
  cellSizeM: 0.5,
  maxSteps: 20,
  coordinateFrame: 'local-grid',
  ...extra,
});
test('open 3x2 grid covers all six cells and returns within budget', () => {
  const r = run(scenario());
  assert.equal(r.reachableCells, 6);
  assert.equal(r.unvisitedReachableCells, 0);
  assert.equal(r.returned, true);
  assert.deepEqual(r.path.at(-1), [0, 0]);
});
test('zero budget stays at start and reports one visited cell', () => {
  const r = run(scenario({ maxSteps: 0 }));
  assert.equal(r.path.length, 1);
  assert.equal(r.metrics[1].value, 1);
});
test('one movement step cannot fund an outbound and return trip', () =>
  assert.equal(run(scenario({ maxSteps: 1 })).path.length, 1));
test('two movement steps visit a neighbor and return', () => {
  const r = run(scenario({ maxSteps: 2 }));
  assert.deepEqual(r.path, [
    [0, 0],
    [1, 0],
    [0, 0],
  ]);
  assert.equal(r.budgetRemainingSteps, 0);
});
test('disconnected free cells remain explicitly unreachable', () => {
  const r = run(
    scenario({
      grid: [
        [0, 1, 0],
        [0, 1, 0],
      ],
    }),
  );
  assert.equal(r.reachableCells, 2);
  assert.equal(r.unreachableCells, 2);
  assert.equal(r.metrics[0].value, 100);
});
test('excluded cells are never entered', () => {
  const s = scenario({
    grid: [
      [0, 2, 0],
      [0, 0, 0],
    ],
  });
  assert.ok(run(s).path.every(([x, y]) => s.grid[y][x] === 0));
});
test('BFS has deterministic east-first shortest paths', () =>
  assert.deepEqual(
    shortestPath(
      [
        [0, 0],
        [0, 0],
      ],
      [0, 0],
      (p) => p[0] === 1 && p[1] === 1,
    ),
    [
      [0, 0],
      [1, 0],
      [1, 1],
    ],
  ));
test('blocked target has no path', () =>
  assert.equal(
    shortestPath(
      [
        [0, 1],
        [1, 0],
      ],
      [0, 0],
      (p) => p[0] === 1 && p[1] === 1,
    ),
    null,
  ));
test('cell size changes distance without changing grid path', () => {
  const a = run(scenario()),
    b = run(scenario({ cellSizeM: 1 }));
  assert.deepEqual(a.path, b.path);
  assert.equal(b.metrics[3].value, a.metrics[3].value * 2);
});
test('many obstacle maps preserve adjacency, return and budget', () => {
  for (let seed = 1; seed <= 40; seed++) {
    const grid = Array.from({ length: 5 }, (_, y) =>
      Array.from({ length: 6 }, (_, x) => ((x * 13 + y * 17 + seed * 11) % 7 === 0 ? 1 : 0)),
    );
    grid[0][0] = 0;
    const s = scenario({ grid, maxSteps: seed }),
      r = run(s);
    assert.ok(r.path.length - 1 <= seed);
    assert.deepEqual(r.path.at(-1), s.start);
    r.path.forEach((p, i) => {
      assert.equal(grid[p[1]][p[0]], 0);
      if (i) assert.equal(Math.abs(p[0] - r.path[i - 1][0]) + Math.abs(p[1] - r.path[i - 1][1]), 1);
    });
  }
});
test('rejects ragged grid, blocked start and fractional budgets', () => {
  for (const extra of [{ grid: [[0], [0, 0]] }, { grid: [[1]] }, { maxSteps: 1.5 }])
    assert.throws(() => run(scenario(extra)));
});
test('synthetic telemetry preserves route coordinates and timestamps', () => {
  const t = toTelemetry(scenario(), 1000);
  assert.equal(t.samples[0].atMs, 0);
  assert.equal(t.samples[1].xM, 0.75);
  assert.equal(t.samples[1].batteryPct, 100);
  assert.equal(t.source, 'synthetic');
});
test('telemetry export rejects manual provenance and receiver bounds', () => {
  assert.throws(() => toTelemetry(scenario({ source: 'manual' })), { code: 'SYNTHETIC_EXPORT' });
  assert.throws(() => toTelemetry(scenario(), 1), { code: 'EXCHANGE_LIMIT' });
});
test('single free cell is complete at zero movement', () => {
  const r = run(scenario({ grid: [[0]], maxSteps: 0 }));
  assert.equal(r.status, 'complete');
  assert.equal(r.metrics[0].value, 100);
});
