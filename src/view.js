import { svg, label, esc, fmt, text } from './ui.js';
export const interpretation = {
  en: 'Coverage counts visits to reachable free grid cells. It does not model a sensor footprint, detection probability, body clearance or real rescue effectiveness. Excluded cells are never traversed; the greedy route is not a shortest coverage tour.',
  pt: 'A cobertura conta visitas a células livres alcançáveis. Não modela campo de sensores, probabilidade de detecção, espaço para o corpo ou eficácia real de salvamento. Células excluídas não são percorridas; a rota gulosa não é um circuito mínimo de cobertura.',
};
export const cursorMax = (r) => r.records.length - 1;
export function render(r, lang, cursor) {
  const size = Math.min(660 / r.grid[0].length, 220 / r.grid.length),
    left = (760 - size * r.grid[0].length) / 2,
    top = 45;
  let content = label(
    20,
    24,
    text('Grid visits and return route', 'Visitas à grade e rota de retorno', lang),
  );
  const visited = new Set(r.path.slice(0, cursor + 1).map((p) => p.join(',')));
  r.grid.forEach((row, y) =>
    row.forEach((cell, x) => {
      content += `<rect x="${left + x * size}" y="${top + y * size}" width="${size}" height="${size}" fill="${cell === 1 ? '#334155' : cell === 2 ? '#dcbaa8' : visited.has(`${x},${y}`) ? '#99d4be' : '#f1f5f9'}" stroke="#cbd5e1"/>`;
    }),
  );
  const points = r.path
    .slice(0, cursor + 1)
    .map(([x, y]) => `${left + (x + 0.5) * size},${top + (y + 0.5) * size}`)
    .join(' ');
  content += `<polyline points="${points}" fill="none" stroke="#175d63" stroke-width="2"/>`;
  const p = r.path[cursor];
  content += `<circle cx="${left + (p[0] + 0.5) * size}" cy="${top + (p[1] + 0.5) * size}" r="${Math.max(2, size * 0.18)}" fill="#912f46"/>`;
  content += label(
    20,
    289,
    text(
      'Dark: obstacle · tan: excluded · green: visited',
      'Escuro: obstáculo · bege: excluído · verde: visitado',
      lang,
    ),
  );
  return (
    svg(content, text('Search coverage grid', 'Grade de cobertura de busca', lang)) +
    `<p class="visual-note">${esc(text('Step', 'Passo', lang))} ${cursor} · [${p.join(', ')}] · ${esc(text('Reachable cells', 'Células alcançáveis', lang))}: ${r.reachableCells} · ${esc(text('Unreachable', 'Inalcançáveis', lang))}: ${r.unreachableCells}.</p>`
  );
}
