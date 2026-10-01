import { CRITERIA, rankUseCases } from './scoring.js';

export function displayName(name) {
  return name.trim() || 'Cas d’usage sans nom';
}

function joinNames(names) {
  return names.length < 2 ? names.join('') : `${names.slice(0, -1).join(', ')} et ${names.at(-1)}`;
}

// Competition ranking (1, 1, 3): equal scores share a rank so that no tie is hidden.
export function rankWithTies(useCases) {
  const sorted = rankUseCases(useCases);
  return sorted.map((item) => {
    const rank = sorted.findIndex(({ score }) => score === item.score) + 1;
    const tied = sorted.filter(({ score }) => score === item.score).length > 1;
    return { ...item, rank, tied };
  });
}

export function leaders(ranked) {
  return ranked.filter(({ rank }) => rank === 1);
}

export function leaderSummary(ranked) {
  const top = leaders(ranked);
  const score = `${top[0].score}/100`;
  if (top.length > 1) {
    return `Ex æquo en tête : ${joinNames(top.map(({ name }) => displayName(name)))} (${score}) — aucun gagnant certain`;
  }
  return `Candidat prioritaire : ${displayName(top[0].name)} (${score})`;
}

// The Brief d’arbitrage: a plain French text reflecting the current comparison.
// It keeps the ADR 0001 caveat: the score is a workshop marker, not an investment decision.
export function buildBrief(useCases, { criteria = CRITERIA } = {}) {
  const ranked = rankWithTies(useCases);
  const top = leaders(ranked);

  const lines = [
    'Note d’arbitrage · Radar IA',
    'Données fictives · score indicatif',
    '',
    `${leaderSummary(ranked)}.`,
  ];
  if (top.length > 1) {
    lines.push('Le score ne départage pas ces cas : l’arbitrage revient à l’équipe.');
  }

  lines.push('', `Classement des ${ranked.length} cas d’usage :`);
  ranked.forEach((item) => {
    lines.push(`${item.rank}. ${displayName(item.name)} — ${item.score}/100${item.tied ? ' (ex æquo)' : ''}`);
  });

  top.forEach((item) => {
    lines.push('', `Notes de ${displayName(item.name)} :`);
    criteria.forEach(({ key, label }) => lines.push(`- ${label} : ${item[key]}/5`));
  });

  lines.push('', 'Pondérations utilisées par l’application :');
  criteria.forEach(({ label, weight, lowerIsBetter }) => {
    lines.push(`- ${label} : ${weight} % (note ${lowerIsBetter ? 'faible' : 'élevée'} = meilleur score)`);
  });
  lines.push(
    'Chaque note de 1 à 5 est ramenée à une part de son poids ; le total est arrondi sur 100.',
    '',
    'Réserve : ce score est un repère d’atelier calculé à partir d’hypothèses de l’équipe. Ce n’est ni un ROI ni une décision d’investissement.',
    '',
    'Prochaine étape : vérifier les données disponibles et les risques avec le métier avant toute décision.',
  );
  return lines.join('\n');
}
