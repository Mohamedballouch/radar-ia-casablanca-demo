# Radar IA · démonstration Casablanca

Un mini-produit local, en français, pour comparer trois idées d’automatisation au cours d’un atelier. Les trois exemples sont **fictifs**. L’application ne contacte aucune API, ne stocke aucune donnée et ne décide pas à la place de l’équipe.

## Ce que montre la première version

- Trois cas d’usage modifiables : synthèse des rendez-vous clients, recherche documentaire interne, tri des demandes entrantes.
- Quatre notes de 1 à 5 par cas : impact métier, disponibilité des données, effort de réalisation et risque.
- Un classement qui change immédiatement lorsque l’on modifie une hypothèse.
- Un calcul et des pondérations visibles, un bouton pour rétablir les exemples.
- Un **brief d’arbitrage** (note en français) qui reflète l’état courant : cas en tête ou ex æquo signalés, scores des trois cas, notes du candidat prioritaire, pondérations, mention « Données fictives · score indicatif » et prochaine étape. Boutons **Copier la note** (presse-papiers, avec message de confirmation ou d’échec) et **Imprimer / enregistrer en PDF** (impression du navigateur, feuille A4 sans les contrôles). Rien n’est envoyé à un service externe.

Captures du socle : [vue complète sur ordinateur](docs/assets/radar-baseline-desktop.png) et [vue mobile](docs/assets/radar-baseline-mobile.png).

## Démarrer dans Ubuntu / WSL

Node.js 24 est recommandé. Si `node` n’est pas trouvé dans un shell non interactif, charger nvm d’abord :

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
nvm use 24
npm ci
npm run dev
```

Ouvrir <http://localhost:5173>. PDO fonctionne séparément sur <http://localhost:5172>.

Pour vérifier le produit :

```bash
npm test
npm run build
```

## Démonstration métier en cinq minutes

1. **Modifier un critère** : présenter les trois cartes (notes fictives), puis passer « Données disponibles » de *Recherche documentaire interne* de 3 à 5 (curseur à la souris ou flèches du clavier).
2. **Observer le classement** : le cas passe de 70 à 83/100 et prend la tête devant *Synthèse des rendez-vous clients* (81/100). Ouvrir la formule pour discuter des poids 40/25/20/15.
3. **Copier la note** : dans « Brief d’arbitrage », cliquer sur *Copier la note* ; le message « Note copiée dans le presse-papiers » confirme la copie. Coller le texte dans un message : il décrit la comparaison courante, signale les ex æquo et rappelle que le score n’est ni un ROI ni une décision.
4. **Imprimer ou enregistrer en PDF** : cliquer sur *Imprimer / enregistrer en PDF* ; l’aperçu A4 ne montre que la note, sans curseurs ni boutons. Choisir « Enregistrer au format PDF » pour la transmettre.
5. Cliquer sur *Réinitialiser les exemples* : le classement (81/70/48) et la note reviennent aux trois exemples fictifs.

## Où interviennent PDSF et PDO ?

**PDSF** fournit dans ce dépôt des skills de méthode : cadrage métier, conception, tickets techniques, implémentation et contrôle. Les skills ont été installés depuis le checkout local dans `.agents/skills/`, avec les liens Claude Code dans `.claude/skills` et `CLAUDE.md`. Le mode *scaffold* de `/build-factory` a été exécuté sur la branche `develop` : il a câblé le backlog métier local, les GitHub Issues comme backlog technique, les cinq états de triage et les documents de méthode sous `docs/agents/`. Le dépôt contient déjà le glossaire [`CONTEXT.md`](CONTEXT.md) et une décision de conception [`docs/adr/0001-score-indicatif.md`](docs/adr/0001-score-indicatif.md). Le mode *context* de `/build-factory`, qui approfondit le domaine avec l’équipe, reste un travail ultérieur ; ne pas présenter ce premier cadrage comme une analyse métier exhaustive.

**PDO** est l’orchestrateur local de l’exécution. Choisir le chemin de ce dépôt comme **Target repository** dans New Run, puis un pipeline comme `atelier-radar-ia`. L’issue GitHub complète ira dans le prompt du run. PDO crée un worktree isolé, exécute les nœuds, conserve leurs sorties et permet d’inspecter le terminal, les contrôles et le Diff. Une exécution locale ne publie pas automatiquement le résultat sur GitHub.

## Décision de calcul

Le score indicatif (0–100) vaut :

```text
40 × (impact − 1) / 4
+ 25 × (données − 1) / 4
+ 20 × (5 − effort) / 4
+ 15 × (5 − risque) / 4
```

Il est arrondi à l’entier le plus proche. Un score plus élevé indique une hypothèse plus favorable **dans ce modèle**, et non un ROI, une prévision ou une validation de faisabilité. Une égalité conserve l’ordre initial. Voir l’ADR pour les limites.

## Structure

```text
index.html               interface
src/main.js              interactions et affichage
src/scoring.js           fonction de score et classement
src/brief.js             note d’arbitrage (texte pur, ex æquo)
src/style.css            présentation et mise en page mobile
tests/scoring.test.js    tests déterministes du score
tests/brief.test.js      tests déterministes de la note d’arbitrage
CONTEXT.md               vocabulaire de l’atelier
docs/adr/                décisions de conception
.agents/skills/          skills PDSF installés dans le dépôt
docs/agents/             choix de méthode créés par /build-factory
docs/business-backlog/   backlog métier local
workshop/pipeline/        définition du pipeline PDO de l’atelier
```
