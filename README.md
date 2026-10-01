# Radar IA · démonstration Casablanca

Un mini-produit local, en français, pour comparer trois idées d’automatisation au cours d’un atelier. Les trois exemples sont **fictifs**. L’application ne contacte aucune API, ne stocke aucune donnée et ne décide pas à la place de l’équipe.

## Ce que montre la première version

- Trois cas d’usage modifiables : synthèse des rendez-vous clients, recherche documentaire interne, tri des demandes entrantes.
- Quatre notes de 1 à 5 par cas : impact métier, disponibilité des données, effort de réalisation et risque.
- Un classement qui change immédiatement lorsque l’on modifie une hypothèse.
- Un calcul et des pondérations visibles, un bouton pour rétablir les exemples.

Le **brief d’arbitrage à copier et imprimer** constitue la prochaine tranche fonctionnelle à réaliser pendant la démonstration PDO. Il n’est pas présent dans cette première version.

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

1. Présenter les trois cartes et rappeler que les notes sont fictives.
2. Montrer le classement initial et ouvrir la formule.
3. Augmenter l’effort du premier cas ou réduire sa disponibilité des données : le classement réagit.
4. Discuter avec l’équipe : les poids 40/25/20/15 correspondent-ils à notre contexte ?
5. Revenir aux exemples, puis annoncer l’amélioration du ticket : produire un brief transmissible à un manager.

## Où interviennent PDSF et PDO ?

**PDSF** fournit dans ce dépôt des skills de méthode : cadrage métier, conception, tickets techniques, implémentation et contrôle. Les skills ont été installés depuis le checkout local dans `.agents/skills/`, avec les liens Claude Code dans `.claude/skills` et `CLAUDE.md`. Le dépôt contient un premier glossaire [`CONTEXT.md`](CONTEXT.md) et une décision de conception [`docs/adr/0001-score-indicatif.md`](docs/adr/0001-score-indicatif.md). **`/build-factory` n’a pas encore été exécuté** : les deux backlogs et le contexte fondateur restent à câbler avec l’équipe. Ne pas présenter cette installation comme une factory complète.

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
src/style.css            présentation et mise en page mobile
tests/scoring.test.js    tests déterministes
CONTEXT.md               vocabulaire de l’atelier
docs/adr/                décisions de conception
.agents/skills/          skills PDSF installés dans le dépôt
```
