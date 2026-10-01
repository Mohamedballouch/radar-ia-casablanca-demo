import test from 'node:test';
import assert from 'node:assert/strict';
import { buildBrief, displayName, rankWithTies } from '../src/brief.js';
import { EXAMPLES } from '../src/scoring.js';

const examples = () => EXAMPLES.map((item) => ({ ...item }));

test('the brief of the workshop examples names the leader, all scores and the leader ratings', () => {
  const brief = buildBrief(examples());

  assert.match(brief, /^Note d’arbitrage · Radar IA\n/);
  assert.match(brief, /Données fictives · score indicatif/);
  assert.match(brief, /Candidat prioritaire : Synthèse des rendez-vous clients \(81\/100\)/);
  assert.match(brief, /1\. Synthèse des rendez-vous clients — 81\/100/);
  assert.match(brief, /2\. Recherche documentaire interne — 70\/100/);
  assert.match(brief, /3\. Tri des demandes entrantes — 48\/100/);
  assert.match(brief, /Impact métier : 4\/5/);
  assert.match(brief, /Données disponibles : 5\/5/);
  assert.match(brief, /Effort de réalisation : 2\/5/);
  assert.match(brief, /Risque de mise en œuvre : 2\/5/);
  assert.doesNotMatch(brief, /ex æquo/i);
});

test('the brief explains the weights and keeps the workshop caveat and next step', () => {
  const brief = buildBrief(examples());

  assert.match(brief, /Impact métier : 40 % \(note élevée = meilleur score\)/);
  assert.match(brief, /Données disponibles : 25 % \(note élevée = meilleur score\)/);
  assert.match(brief, /Effort de réalisation : 20 % \(note faible = meilleur score\)/);
  assert.match(brief, /Risque de mise en œuvre : 15 % \(note faible = meilleur score\)/);
  assert.match(brief, /ni un ROI ni une décision d’investissement/);
  assert.match(brief, /Prochaine étape : vérifier les données disponibles et les risques avec le métier avant toute décision\./);
});

test('a tie at the top is reported without inventing a certain winner', () => {
  const items = [
    { id: 'a', name: 'Alpha', impact: 3, data: 3, effort: 3, risk: 3 },
    { id: 'b', name: 'Bêta', impact: 3, data: 3, effort: 3, risk: 3 },
    { id: 'c', name: 'Gamma', impact: 1, data: 1, effort: 5, risk: 5 },
  ];
  const brief = buildBrief(items);

  assert.match(brief, /Ex æquo en tête : Alpha et Bêta \(50\/100\)/);
  assert.match(brief, /aucun gagnant certain/);
  assert.doesNotMatch(brief, /Candidat prioritaire :/);
  assert.match(brief, /1\. Alpha — 50\/100 \(ex æquo\)/);
  assert.match(brief, /1\. Bêta — 50\/100 \(ex æquo\)/);
  assert.match(brief, /3\. Gamma — 0\/100/);
  assert.match(brief, /Notes de Alpha :/);
  assert.match(brief, /Notes de Bêta :/);
});

test('ties below the top share their rank', () => {
  const items = [
    { id: 'a', name: 'Alpha', impact: 5, data: 5, effort: 1, risk: 1 },
    { id: 'b', name: 'Bêta', impact: 3, data: 3, effort: 3, risk: 3 },
    { id: 'c', name: 'Gamma', impact: 3, data: 3, effort: 3, risk: 3 },
  ];
  assert.deepEqual(rankWithTies(items).map(({ id, rank, tied }) => [id, rank, tied]), [
    ['a', 1, false],
    ['b', 2, true],
    ['c', 2, true],
  ]);
  const brief = buildBrief(items);
  assert.match(brief, /Candidat prioritaire : Alpha \(100\/100\)/);
  assert.match(brief, /2\. Gamma — 50\/100 \(ex æquo\)/);
});

test('changing a rating updates the brief: more available data puts the document search first', () => {
  const items = examples();
  items.find(({ id }) => id === 'recherche').data = 5;
  const brief = buildBrief(items);

  assert.match(brief, /Candidat prioritaire : Recherche documentaire interne \(83\/100\)/);
  assert.match(brief, /1\. Recherche documentaire interne — 83\/100/);
  assert.match(brief, /2\. Synthèse des rendez-vous clients — 81\/100/);
  assert.match(brief, /Données disponibles : 5\/5/);
  assert.match(brief, /Impact métier : 5\/5/);
});

test('a renamed or emptied case is reflected in the brief', () => {
  const items = examples();
  items[0].name = 'Comptes rendus de visite';
  assert.match(buildBrief(items), /Candidat prioritaire : Comptes rendus de visite \(81\/100\)/);
  items[0].name = '   ';
  assert.match(buildBrief(items), /Candidat prioritaire : Cas d’usage sans nom \(81\/100\)/);
  assert.equal(displayName('  Tri  '), 'Tri');
});

test('building the brief does not mutate the input', () => {
  const items = examples();
  buildBrief(items);
  assert.deepEqual(items, EXAMPLES);
});
