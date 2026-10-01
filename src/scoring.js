export const EXAMPLES = [
  { id: 'rencontres', name: 'Synthèse des rendez-vous clients', impact: 4, data: 5, effort: 2, risk: 2 },
  { id: 'recherche', name: 'Recherche documentaire interne', impact: 5, data: 3, effort: 3, risk: 3 },
  { id: 'demandes', name: 'Tri des demandes entrantes', impact: 3, data: 4, effort: 4, risk: 4 },
];

export const CRITERIA = [
  { key: 'impact', label: 'Impact métier', hint: '5 = impact élevé', weight: 40 },
  { key: 'data', label: 'Données disponibles', hint: '5 = données prêtes', weight: 25 },
  { key: 'effort', label: 'Effort de réalisation', hint: '1 = effort faible', weight: 20 },
  { key: 'risk', label: 'Risque de mise en œuvre', hint: '1 = risque faible', weight: 15 },
];

function rating(value, key) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1 || number > 5) {
    throw new RangeError(`${key} doit être une note entière entre 1 et 5`);
  }
  return number;
}

// Every criterion contributes 0–100 points according to its visible weight.
// Lower effort and risk receive higher contributions; this is a workshop heuristic.
export function scoreUseCase(useCase) {
  const impact = rating(useCase.impact, 'impact');
  const data = rating(useCase.data, 'data');
  const effort = rating(useCase.effort, 'effort');
  const risk = rating(useCase.risk, 'risk');

  return Math.round(
    40 * (impact - 1) / 4 +
    25 * (data - 1) / 4 +
    20 * (5 - effort) / 4 +
    15 * (5 - risk) / 4,
  );
}

export function rankUseCases(useCases) {
  return useCases
    .map((useCase, index) => ({ ...useCase, score: scoreUseCase(useCase), originalIndex: index }))
    .sort((a, b) => b.score - a.score || a.originalIndex - b.originalIndex);
}
