import './style.css';
import { CRITERIA, EXAMPLES, scoreUseCase } from './scoring.js';
import { buildBrief, displayName, leaderSummary, rankWithTies } from './brief.js';

const cards = document.querySelector('#cards');
const ranking = document.querySelector('#ranking');
const leader = document.querySelector('#leader');
const resetButton = document.querySelector('#reset');
const briefText = document.querySelector('#brief-text');
const briefStatus = document.querySelector('#brief-status');
const copyButton = document.querySelector('#copy-brief');
const printButton = document.querySelector('#print-brief');
let useCases = EXAMPLES.map((item) => ({ ...item }));

function renderBrief() {
  briefText.textContent = buildBrief(useCases);
  // A previous "copied" message no longer describes the current note.
  if (briefStatus.textContent) briefStatus.textContent = '';
}

function renderRanking() {
  const sorted = rankWithTies(useCases);
  ranking.replaceChildren();

  sorted.forEach((item) => {
    const row = document.createElement('li');
    row.className = 'ranking-row';
    if (item.rank === 1) row.classList.add('is-first');

    const heading = document.createElement('div');
    heading.className = 'ranking-row__heading';

    const name = document.createElement('span');
    name.textContent = `${item.rank}. ${displayName(item.name)}${item.tied ? ' (ex æquo)' : ''}`;
    const score = document.createElement('strong');
    score.textContent = `${item.score}/100`;
    heading.append(name, score);

    const track = document.createElement('div');
    track.className = 'ranking-row__track';
    track.setAttribute('aria-hidden', 'true');
    const bar = document.createElement('span');
    bar.style.width = `${item.score}%`;
    track.append(bar);
    row.append(heading, track);
    ranking.append(row);
  });

  leader.textContent = `${leaderSummary(sorted)}, selon ces hypothèses.`;
  renderBrief();
}

function renderCards() {
  cards.replaceChildren();

  useCases.forEach((item, index) => {
    const card = document.createElement('article');
    card.className = 'case-card';

    const header = document.createElement('div');
    header.className = 'case-card__header';
    const badge = document.createElement('span');
    badge.className = 'case-card__number';
    badge.textContent = `0${index + 1}`;
    const score = document.createElement('span');
    score.className = 'case-card__score';
    score.textContent = `${scoreUseCase(item)}/100`;
    score.setAttribute('aria-label', `Score : ${scoreUseCase(item)} sur 100`);
    header.append(badge, score);

    const nameLabel = document.createElement('label');
    nameLabel.className = 'name-field';
    nameLabel.textContent = 'Cas d’usage';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.maxLength = 72;
    nameInput.value = item.name;
    nameInput.setAttribute('aria-label', `Nom du cas d’usage ${index + 1}`);
    nameInput.addEventListener('input', () => {
      item.name = nameInput.value;
      renderRanking();
    });
    nameLabel.append(nameInput);
    card.append(header, nameLabel);

    CRITERIA.forEach((criterion) => {
      const field = document.createElement('div');
      field.className = 'criterion';
      const label = document.createElement('label');
      const id = `${item.id}-${criterion.key}`;
      label.htmlFor = id;
      label.textContent = criterion.label;
      const value = document.createElement('output');
      value.htmlFor = id;
      value.textContent = `${item[criterion.key]}/5`;
      const range = document.createElement('input');
      range.id = id;
      range.type = 'range';
      range.min = '1';
      range.max = '5';
      range.step = '1';
      range.value = String(item[criterion.key]);
      range.setAttribute('aria-valuetext', `${item[criterion.key]} sur 5`);
      range.addEventListener('input', () => {
        item[criterion.key] = Number(range.value);
        value.textContent = `${range.value}/5`;
        range.setAttribute('aria-valuetext', `${range.value} sur 5`);
        const updated = scoreUseCase(item);
        score.textContent = `${updated}/100`;
        score.setAttribute('aria-label', `Score : ${updated} sur 100`);
        renderRanking();
      });
      const hint = document.createElement('small');
      hint.textContent = criterion.hint;
      field.append(label, value, range, hint);
      card.append(field);
    });

    cards.append(card);
  });
  renderRanking();
}

copyButton.addEventListener('click', async () => {
  const text = buildBrief(useCases);
  briefStatus.textContent = '';
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(text);
    briefStatus.textContent = 'Note copiée dans le presse-papiers.';
  } catch {
    briefStatus.textContent = 'Copie impossible : le navigateur refuse l’accès au presse-papiers. Sélectionnez le texte de la note ci-dessous et copiez-le avec Ctrl+C.';
  }
});

printButton.addEventListener('click', () => window.print());

resetButton.addEventListener('click', () => {
  useCases = EXAMPLES.map((item) => ({ ...item }));
  renderCards();
});

renderCards();
