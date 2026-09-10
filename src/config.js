export default {
  slug: 'go2-pro-search-coverage',
  title: 'Go2 PRO Search Coverage',
  color: '#236f70',
  group: 'Unitree Go2 PRO',
  tagline: {
    en: 'Rehearse a search route with explicit coverage and a return budget.',
    pt: 'Ensaie uma rota de busca com cobertura explícita e orçamento de retorno.',
  },
  description:
    'EN: Rehearse a search route with explicit coverage and a return budget. PT: Ensaie uma rota de busca com cobertura explícita e orçamento de retorno.',
  topics: [
    'unitree-go2',
    'robotics',
    'research-prototype',
    'bilingual',
    'javascript',
    'search-and-rescue',
    'coverage-planning',
    'pathfinding',
  ],
  setting: {
    key: 'maxSteps',
    label: {
      en: 'Movement budget (steps)',
      pt: 'Orçamento de movimento (passos)',
    },
    min: 0,
    max: 10000,
    step: 1,
  },
  default: 120,
};
