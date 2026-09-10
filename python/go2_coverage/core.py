"""Deterministic coverage and independent batch budgeting / Cobertura e orçamento."""

from collections import deque
from copy import deepcopy

from .contract import validate

NEIGHBORS = ((1, 0), (0, 1), (-1, 0), (0, -1))


def _route(start, accept, free):
    queue = deque([start])
    parent = {start: None}
    while queue:
        current = queue.popleft()
        if accept(current):
            path = []
            while current is not None:
                path.append(current)
                current = parent[current]
            return list(reversed(path))
        for dx, dy in NEIGHBORS:
            nxt = (current[0] + dx, current[1] + dy)
            if nxt in free and nxt not in parent:
                parent[nxt] = current
                queue.append(nxt)
    return None


def analyze(scenario):
    """Plan point-cell visits, reserving a shortest path home before each excursion."""
    s = validate(scenario)
    grid = s["grid"]
    if any(len(row) != len(grid[0]) for row in grid):
        raise ValueError("Ragged grid / Grade irregular")
    free = {(x, y) for y, row in enumerate(grid) for x, cell in enumerate(row) if cell == 0}
    start = tuple(s["start"])
    if start not in free:
        raise ValueError("Start must be a free cell / Início deve ser célula livre")
    reachable = set()
    _route(start, lambda point: reachable.add(point) or False, free)
    path, visited, phases = [start], {start}, ["start"]
    limited = False
    while visited != reachable:
        outward = _route(path[-1], lambda point: point not in visited, free)
        home = _route(outward[-1], lambda point: point == start, free)
        if len(path) - 1 + len(outward) - 1 + len(home) - 1 > s["maxSteps"]:
            limited = True
            break
        path.extend(outward[1:])
        phases.extend(["search"] * (len(outward) - 1))
        visited.update(outward)
    home = _route(path[-1], lambda point: point == start, free)
    path.extend(home[1:])
    phases.extend(["return"] * (len(home) - 1))
    visited.update(home)
    seen = set()
    records = []
    for step, (point, phase) in enumerate(zip(path, phases)):
        records.append(
            {
                "step": step,
                "x": point[0],
                "y": point[1],
                "phase": phase,
                "newVisit": point not in seen,
            }
        )
        seen.add(point)
    return {
        "scenarioId": s["scenarioId"],
        "source": s["source"],
        "path": [list(point) for point in path],
        "records": records,
        "reachableCells": len(reachable),
        "unreachableCells": len(free - reachable),
        "unvisitedReachableCells": len(reachable - visited),
        "visitedCells": len(visited),
        "steps": len(path) - 1,
        "distanceM": round((len(path) - 1) * s["cellSizeM"], 6),
        "coveragePct": round(100 * len(visited) / len(reachable), 6),
        "returned": path[-1] == start,
        "budgetRemainingSteps": s["maxSteps"] - len(path) + 1,
        "budgetLimited": limited,
    }


def budget_sweep(scenario, budgets):
    """Replan each budget independently; do not assume greedy coverage is optimal."""
    if not isinstance(budgets, list) or not 1 <= len(budgets) <= 1001:
        raise ValueError("Supply 1..1001 budgets / Informe 1..1001 orçamentos")
    rows = []
    for budget in budgets:
        candidate = deepcopy(scenario)
        candidate["maxSteps"] = budget
        result = analyze(candidate)
        rows.append(
            {
                "maxSteps": budget,
                **{
                    key: result[key]
                    for key in ("steps", "visitedCells", "coveragePct", "distanceM", "returned")
                },
            }
        )
    return rows
