import unittest
from copy import deepcopy

from go2_coverage.core import analyze, budget_sweep
from test_contract import nominal


class CoverageTests(unittest.TestCase):
    def test_every_step_is_adjacent_and_free(self):
        s = nominal()
        result = analyze(s)
        for a, b in zip(result["path"], result["path"][1:]):
            self.assertEqual(abs(a[0] - b[0]) + abs(a[1] - b[1]), 1)
            self.assertEqual(s["grid"][b[1]][b[0]], 0)

    def test_all_budgets_preserve_return_and_bound(self):
        for budget in range(80):
            with self.subTest(budget=budget):
                s = nominal()
                s["maxSteps"] = budget
                result = analyze(s)
                self.assertLessEqual(result["steps"], budget)
                self.assertEqual(result["path"][-1], s["start"])

    def test_single_cell_and_no_movement(self):
        s = nominal()
        s.update(grid=[[0]], start=[0, 0], maxSteps=0)
        result = analyze(s)
        self.assertEqual((result["steps"], result["coveragePct"]), (0, 100))

    def test_partition_count_is_not_hidden(self):
        s = nominal()
        s.update(grid=[[0, 1, 0]], start=[0, 0])
        result = analyze(s)
        self.assertEqual((result["reachableCells"], result["unreachableCells"]), (1, 1))

    def test_ragged_grid_rejected(self):
        s = nominal()
        s["grid"] = [[0, 0], [0]]
        with self.assertRaises(ValueError):
            analyze(s)

    def test_blocked_or_out_of_bounds_start_rejected(self):
        for grid, start in (([[1]], [0, 0]), ([[0]], [1, 0])):
            s = nominal()
            s.update(grid=grid, start=start)
            with self.assertRaises(ValueError):
                analyze(s)

    def test_sweep_independent_of_order_and_input(self):
        s = nominal()
        before = deepcopy(s)
        forward = budget_sweep(s, [0, 8, 60])
        self.assertEqual(forward, list(reversed(budget_sweep(s, [60, 8, 0]))))
        self.assertEqual(s, before)

    def test_invalid_sweep_rejected(self):
        for budgets in ([], [True], [-1], [1.5]):
            with self.assertRaises(ValueError):
                budget_sweep(nominal(), budgets)
