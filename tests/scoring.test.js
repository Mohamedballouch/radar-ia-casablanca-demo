import test from 'node:test';
import assert from 'node:assert/strict';
import { EXAMPLES, rankUseCases, scoreUseCase } from '../src/scoring.js';

test('the three workshop examples have an understandable initial order', () => {
  const sorted = rankUseCases(EXAMPLES);
  assert.deepEqual(sorted.map(({ id, score }) => [id, score]), [
    ['rencontres', 81],
    ['recherche', 70],
    ['demandes', 48],
  ]);
});

test('all lowest and best contributions bound the score to 0–100', () => {
  assert.equal(scoreUseCase({ impact: 1, data: 1, effort: 5, risk: 5 }), 0);
  assert.equal(scoreUseCase({ impact: 5, data: 5, effort: 1, risk: 1 }), 100);
});

test('lower effort and lower risk improve the score', () => {
  const baseline = { impact: 3, data: 3, effort: 5, risk: 5 };
  assert.ok(scoreUseCase({ ...baseline, effort: 1 }) > scoreUseCase(baseline));
  assert.ok(scoreUseCase({ ...baseline, risk: 1 }) > scoreUseCase(baseline));
});

test('ranking is stable for ties and does not mutate input', () => {
  const items = [
    { id: 'a', impact: 3, data: 3, effort: 3, risk: 3 },
    { id: 'b', impact: 3, data: 3, effort: 3, risk: 3 },
  ];
  assert.deepEqual(rankUseCases(items).map(({ id }) => id), ['a', 'b']);
  assert.equal(items[0].score, undefined);
});

test('ratings outside 1–5 are rejected instead of creating a misleading score', () => {
  assert.throws(() => scoreUseCase({ impact: 0, data: 3, effort: 3, risk: 3 }), RangeError);
  assert.throws(() => scoreUseCase({ impact: 3, data: 'x', effort: 3, risk: 3 }), RangeError);
});
