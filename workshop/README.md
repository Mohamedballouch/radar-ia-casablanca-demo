# Atelier Casablanca · PDSF × PDO

**Lundi 5 octobre 2026 · 40 minutes · équipe mixte métier/technique**

Ce dossier accompagne un atelier en français autour de **Radar IA**, un petit produit fictif qui compare trois idées d'automatisation. L'objectif est de montrer un parcours vérifiable : besoin métier → ticket GitHub → méthode PDSF dans le dépôt → pipeline PDO → exécution isolée → revue → décision de publication.

## Supports prêts à présenter

- [Présentation PowerPoint](slides/atelier-pdsf-pdo-casablanca.pptx) : 13 diapositives avec notes de présentation.
- [Conducteur de 40 minutes](guide-animation.md) : séquence minute par minute, gestes de la démo, vérifications et plans de secours.
- [Vidéo du produit et du ticket](videos/demo-radar-ia-produit.mp4) : interaction réelle avec les scores, le classement et l'issue #1.
- [Vidéo PDO](videos/demo-pdo-run-inspection.mp4) : parcours réel dans le pipeline, les quatre nœuds exécutés, leurs sorties et la revue du diff.
- [Exemple de note PDF A4](examples/note-arbitrage-exemple.pdf) : résultat lisible par un manager, généré depuis la fonction livrée et vérifié sur une page.
- [Captures](screenshots/) : sélection des écrans montrés dans la présentation.

## Objets de la démonstration

- [Issue #1 — note d'arbitrage copiable et imprimable](https://github.com/Mohamedballouch/radar-ia-casablanca-demo/issues/1), toujours ouverte.
- [PR brouillon #2 — implémentation](https://github.com/Mohamedballouch/radar-ia-casablanca-demo/pull/2), ouverte et non fusionnée, vers `develop`.
- [Pipeline `atelier-radar-ia`](pipeline/atelier-radar-ia.yaml) : Start → Lire le ticket → Développer → Vérifier → Brief manager → End ; `fail` reboucle vers le développement au maximum trois fois.
- Run PDO de préparation : `20261001-183530-abd2d8d`, terminé avec verdict `pass`. Son [écran de revue](http://localhost:5172/runs/20261001-183530-abd2d8d/review) n'est accessible que sur la machine où tourne le daemon PDO.

La branche `main` garde le produit de départ ; `develop` contient le scaffold PDSF et les supports. La branche `integration/brief-arbitrage` porte la fonction réalisée par le run PDO et proposée dans la PR #2. La PR reste à relire et à fusionner par l'équipe.

Sur la machine de préparation, le starter tourne sur `http://localhost:5173` et la version du worktree du run sur `http://localhost:5174`. Ces adresses locales dépendent des serveurs démarrés dans Ubuntu ; les MP4 et captures fournissent une démonstration partageable sans ces serveurs.

## Ce que chaque produit apporte

**PDSF** fournit les skills et les règles de méthode installés dans ce dépôt (`.agents/skills/`, `AGENTS.md`, `CONTEXT.md`, `docs/adr/`, `docs/agents/`). Le mode *scaffold* de `/build-factory` a réellement été exécuté sur `develop` pour relier le backlog métier local et les GitHub Issues techniques. Le mode *context*, plus approfondi, reste à faire avec l'équipe.

**PDO** exécute le pipeline sur un clone Git local. Chaque run choisit explicitement le chemin du dépôt et sa branche source ; le lien de l'issue est transmis au premier nœud. Les entrées, sorties, terminaux, statuts et changements de fichiers restent inspectables. Le pipeline n'a pas publié automatiquement la PR ni fermé le ticket.

Radar IA ne traite **aucune donnée réelle** : les trois cas et notes sont fictifs, le score est indicatif, et l'application n'utilise ni API distante ni modèle de langage. La décision finale appartient à l'équipe.
