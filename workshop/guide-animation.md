# Atelier Casablanca — PDSF et PDO en 40 minutes

**Date :** lundi 5 octobre 2026 · **Public :** équipe mixte métier/technique · **Format :** présentation courte, démonstration commentée, questions. Ce document est le conducteur de l'animateur ; il n'est pas destiné à être lu mot pour mot sur les diapositives.

## Fiche à compléter avant de présenter

| Élément | Valeur attendue |
| --- | --- |
| Dépôt public | [Mohamedballouch/radar-ia-casablanca-demo](https://github.com/Mohamedballouch/radar-ia-casablanca-demo) |
| Issue démontrée | [#1 — Ajouter une note d'arbitrage copiable et imprimable](https://github.com/Mohamedballouch/radar-ia-casablanca-demo/issues/1) |
| Dépôt local dans Ubuntu | `/home/mohamed_ballouch/radar-ia-casablanca-demo` |
| Branche source PDO | `develop` |
| Pipeline PDO | `atelier-radar-ia` |
| Run de préparation terminé | [`20261001-183530-abd2d8d`](http://localhost:5172/runs/20261001-183530-abd2d8d/review) — quatre nœuds terminés, verdict de revue `pass` |
| Run lancé pendant l'atelier | **[ID À NOTER LE JOUR J ; PEUT ÊTRE EN COURS À 40 MIN]** |
| Pull request de démonstration | [PR #2 vers `develop`](https://github.com/Mohamedballouch/radar-ia-casablanca-demo/pull/2) — brouillon ouvert, non fusionné ; l'issue #1 reste ouverte |
| Vidéo produit MP4 | [`demo-radar-ia-produit.mp4`](https://raw.githubusercontent.com/Mohamedballouch/radar-ia-casablanca-demo/develop/workshop/videos/demo-radar-ia-produit.mp4) ; copie Ubuntu : `/home/mohamed_ballouch/radar-ia-casablanca-demo/workshop/videos/demo-radar-ia-produit.mp4` |
| Vidéo PDO MP4 de secours | [`demo-pdo-run-inspection.mp4`](https://raw.githubusercontent.com/Mohamedballouch/radar-ia-casablanca-demo/develop/workshop/videos/demo-pdo-run-inspection.mp4) — vraie capture 1600×900 du pipeline, des quatre nœuds, des sorties, du diff et de la note finale |
| Applications locales | Starter sur `http://localhost:5173` ; fonctionnalité issue du worktree du run préparé sur `http://localhost:5174` pendant la préparation. **Vérifier que les deux serveurs répondent le jour J.** |

Conserver les mêmes identifiants de dépôt, d'issue et de run sur les slides, dans le navigateur et dans ce conducteur. Le run de préparation ci-dessus est **terminé** et a été inspecté. Pendant l'atelier, annoncer clairement quand on regarde ce run préparé et quand on lance un nouveau run. La PR #2 est ouverte en brouillon : ni elle ni l'issue #1 ne doivent être présentées comme closes.

## Message à faire retenir

> « PDSF aide l'équipe à transformer une demande métier en contexte, décisions et tickets exploitables. PDO exécute un pipeline d'agents sur un dépôt choisi et laisse inspecter les étapes, les résultats et les changements. Le jugement et la publication restent humains. »

| | PDSF | PDO |
| --- | --- | --- |
| Nature | Méthode et skills installés **dans le dépôt** | Orchestrateur visuel exécuté par un daemon Ubuntu |
| Question | « Qu'allons-nous construire et selon quelles décisions ? » | « Qui fait quoi, dans quel ordre, avec quelles preuves ? » |
| Objets visibles | `AGENTS.md`, `.agents/skills/`, `CONTEXT.md`, ADR, ports des backlogs ; avec Claude, overlay `.claude/skills/` | Pipeline, nœuds, run, worktree Git isolé, entrées/sorties, terminal, diff |
| Dépendance | Peut guider un agent sans PDO | Peut exécuter des pipelines sans PDSF |
| Dans cette démo | Installation des skills et `/build-factory` en mode **scaffold** exécutés puis commités sur `develop` ; un glossaire et un ADR ont été rédigés, mais le mode **context** n'a pas encore été exécuté | Pipeline `atelier-radar-ia`, issue GitHub #1, run terminé, sorties et diff inspectés |

**Le produit démo :** « Radar des cas d'usage IA » compare trois cas *fictifs* — synthèse de rendez-vous client, recherche documentaire et tri des demandes. La grille de score explicite impact, disponibilité des données, effort et risque. La demande à implémenter ajoute une **note d'arbitrage** facile à copier et à imprimer : classement, critères, réserves et prochaine étape prudente. Ce prototype ne lit aucune donnée d'entreprise et ne décide pas à la place d'un responsable.

## Préparation hors séance — à terminer avant lundi

Ces contrôles se font **hors projection**. Ils ne remplacent pas l'authentification ; ne jamais afficher de jeton, variable secrète, fichier de configuration privé ou donnée client sur le vidéoprojecteur.

Dans **Ubuntu WSL**, avec le même utilisateur que le daemon PDO :

```bash
export RADAR_REPO='Mohamedballouch/radar-ia-casablanca-demo'
export RADAR_PATH="$HOME/radar-ia-casablanca-demo"
export RADAR_ISSUE='1'

pdo --version                 # version observée le 1/10/2026 : 1.110.0
claude --version              # version observée : Claude Code 2.1.285
gh --version                  # version observée : 2.102.0
gh auth status                # uniquement hors projection
gh repo view "$RADAR_REPO" --json url -q .url
gh issue view "$RADAR_ISSUE" --repo "$RADAR_REPO"
cd "$RADAR_PATH"
pwd
git remote -v
git status --short --branch
git branch --show-current       # attendu : develop
test -f AGENTS.md && test -f CONTEXT.md
test -d .agents/skills && test -d docs/adr
test -f "$HOME/.pdo/pipelines/atelier-radar-ia.yaml"
curl -fsS -o /dev/null -w '%{http_code}\n' http://localhost:5172/
```

Le code HTTP attendu pour la page PDO est `200`. Si PDO n'est pas lancé, vérifier son service avec `pdo service status` ; `pdo daemon` démarre une instance manuelle si aucun daemon n'utilise déjà le port 5172. Le dépôt local doit être un vrai clone Git en Ubuntu, avec `origin` pointant vers le dépôt public. La connexion `gh` sert aux opérations GitHub ; **PDO sélectionne d'abord le chemin local du dépôt**, il n'existe pas d'étape magique « lier ce dépôt GitHub ».

Lire `package.json` avant les commandes suivantes. Elles correspondent au starter Vite/Node prévu ; les lancer uniquement si les scripts `test`, `build` et `dev` sont effectivement présents :

```bash
cd "$RADAR_PATH"
npm ci
npm test
npm run build
npm run dev -- --host 0.0.0.0 --port 5173
```

Dans un second terminal, ouvrir `http://localhost:5173` pour le **starter**. Vérifier que les trois cas fictifs sont visibles et que le score se comprend sans explication technique. La [vidéo produit](https://raw.githubusercontent.com/Mohamedballouch/radar-ia-casablanca-demo/develop/workshop/videos/demo-radar-ia-produit.mp4) montre ce starter ; elle ne prouve pas la réalisation de l'issue #1. Pour montrer la **note réalisée**, utiliser `http://localhost:5174`, qui servait le worktree du run terminé pendant la préparation. Vérifier que cette page répond encore le jour J ; sinon, relancer Vite depuis le worktree indiqué dans le run, et non depuis `develop`.

Vérifier dans PDO que le pipeline `atelier-radar-ia` a **Start → Lire le ticket → Développer la fonction → Vérifier la fonction → Brief manager → End**, avec une sortie `verdict: pass` vers le brief et `verdict: fail` vers le développement, **boucle bornée à trois itérations**. Ouvrir les prompts des nœuds : les trois premiers doivent demander de consulter `AGENTS.md`, `CONTEXT.md` et les ADR **qui existent réellement**. Le `/build-factory` scaffold a été exécuté et commité sur `develop`. Un glossaire et un ADR ont été rédigés, mais le mode **context** du skill n'a pas été exécuté ; ne pas attribuer ces textes à ce mode. La lecture de ces fichiers par les nœuds PDO ne prouve pas qu'un autre skill PDSF a été exécuté. Conserver le YAML et son dossier `.prompts/` dans le dépôt **et** dans la bibliothèque d'instance `~/.pdo/pipelines/` ; le sélecteur de pipeline de PDO v1.110.0 est commun à l'instance.

Le [run de préparation](http://localhost:5172/runs/20261001-183530-abd2d8d/review) a terminé ses **quatre nœuds**. Le vérificateur a rendu `verdict: pass` ; `npm test` a passé **12/12 tests** et `npm run build` a réussi. Une QA séparée a corroboré le comportement en Chromium réel : copie dans le presse-papiers, aperçu A4, parcours clavier, ex æquo, largeur mobile et absence de requêtes externes. Montrer les sorties et le diff du run pour que le public voie l'origine de ces affirmations, et distinguer la QA séparée du verdict du nœud. Les captures montrent l'issue et le formulaire **New Run** ; le MP4 PDO montre le pipeline, les nœuds et leurs sorties, la revue du diff et l'application. Le clic **Launch** sera fait en direct pendant l'atelier ; ne pas présenter le formulaire capturé comme une deuxième exécution déjà lancée.

## Déroulé minuté — 40 minutes exactement

| Minute | À montrer / faire | Phrase utile et preuve attendue |
| --- | --- | --- |
| **00–02** | Slide d'ouverture et objectif. | « Nous partons d'un besoin simple et allons voir la trace qui relie ticket, décision, exécution et revue. » |
| **02–06** | Radar IA dans le navigateur : trois cartes, critères et scores. | Les cas sont fictifs ; demander « lequel prioriseriez-vous et pourquoi ? ». Montrer que le score a des critères lisibles, pas une valeur sortie d'un LLM sans explication. |
| **06–10** | Slide « PDSF ≠ PDO » et dossier du dépôt sur `develop` : `AGENTS.md`, `CONTEXT.md`, `docs/adr`, `.agents/skills`. | Montrer le résultat réellement commité de `/build-factory` **scaffold**. Le glossaire et l'ADR existent, mais ont été rédigés séparément ; le mode **context** du skill reste à faire. |
| **10–14** | GitHub Issue : objectif de la note, parcours et critères d'acceptation. | Faire lire deux critères métier : copier le texte et imprimer une note qui conserve le classement et les réserves. L'issue est une demande, pas une synchronisation automatique avec PDO. |
| **14–19** | PDO **Pipelines → `atelier-radar-ia`** : nœuds et branche pass/fail. | Faire nommer les rôles par le public. Montrer la sortie structurée du vérificateur et la limite de trois passages. Le pipeline est réutilisable ; il ne contient pas un dépôt GitHub fixe. |
| **19–23** | PDO **Runs → New Run** : dépôt local Ubuntu, branche source `develop`, pipeline, nom explicite, [URL du ticket #1](https://github.com/Mohamedballouch/radar-ia-casablanca-demo/issues/1) dans le prompt. | Lire à voix haute les cinq choix avant **Launch**. Nom conseillé : `Radar IA — issue #1 — note d'arbitrage`. Le chemin Git local et `origin` déterminent le dépôt ; le lien du ticket guide le nœud de lecture. |
| **23–25** | Cliquer **Launch** une fois ; relever l'ID du nouveau run. | Dire qu'une exécution peut durer plus que le temps imparti. Basculer ensuite vers le run de préparation **déjà terminé**, en l'annonçant. |
| **25–33** | Ouvrir le [run terminé `20261001-183530-abd2d8d`](http://localhost:5172/runs/20261001-183530-abd2d8d/review) : **Start**, les quatre nœuds, **Inputs / Outputs / Terminal**, **Info**, **Repositories**, **Diff**, et **YAML** si le temps le permet. | Lire les vraies sorties : résumé du ticket, changements, verdict `pass` avec `npm test` 12/12 et build réussi, brief manager. La QA Chromium séparée vérifie aussi copie, impression A4, clavier, ex æquo, mobile et absence de requêtes externes. Le diff est à examiner avant publication. |
| **33–36** | Ouvrir la note issue du run sur `http://localhost:5174` si le serveur répond ; copier puis imprimer/prévisualiser. Utiliser la PR #2 ou une capture du worktree si nécessaire. | Distinguer la comparaison du starter sur `5173` de la note ajoutée dans le worktree du run. La [PR #2](https://github.com/Mohamedballouch/radar-ia-casablanca-demo/pull/2) est ouverte en brouillon et non fusionnée. |
| **36–40** | Questions, limites et prochain essai d'équipe. | Inviter à proposer un vrai cas **sans données sensibles** à transformer d'abord en ticket clair. Réponses courtes ci-dessous. |

Si une séquence prend du retard, préserver **l'inspection des sorties et du diff** ; raccourcir la construction visuelle du pipeline et la navigation GitHub. Ne pas attendre en silence la fin d'un agent.

## Démo guidée : gestes et preuves à verbaliser

1. **Produit avant les outils.** Montrer les trois cas et demander ce que le manager voudrait recevoir pour décider. La nouvelle issue répond à cette question : une note transmissible, pas seulement un score à l'écran.
2. **PDSF dans le dépôt.** Sur `develop`, ouvrir `AGENTS.md`, `.agents/skills/` et les ports de backlog créés par `/build-factory` **scaffold**. Montrer le glossaire de `CONTEXT.md` et l'ADR existant comme des textes **rédigés séparément** ; le mode **context** du skill n'a pas été exécuté. Expliquer le chemin prévu, demande métier → conception → tickets techniques autoporteurs. L'issue #1 de la démo a été rédigée directement ; ne pas prétendre qu'elle sort des skills `/to-us`, `/to-spec` ou `/to-tickets` si ceux-ci n'ont pas été exécutés.
3. **Issue GitHub.** Montrer le titre, les critères et l'exclusion des données réelles. Dans Ubuntu, commande possible : `gh issue view "$RADAR_ISSUE" --repo "$RADAR_REPO"`. Le prompt du nœud **Lire le ticket** doit lui donner un moyen concret de résoudre cette issue ; le seul collage d'une URL n'installe pas de webhook.
4. **Pipeline PDO.** Expliquer qu'un nœud produit un artefact qui devient l'entrée du suivant. Cliquer sur la condition de revue : `pass` avance, `fail` reboucle de façon bornée. Le dernier nœud reformule pour un manager ; il n'effectue pas de déploiement.
5. **Nouveau run.** Choisir `/home/mohamed_ballouch/radar-ia-casablanca-demo` sous **Target repository**, `develop` sous **Source branch**, `atelier-radar-ia` sous **Pipeline** et l'[issue #1](https://github.com/Mohamedballouch/radar-ia-casablanca-demo/issues/1) sous **Prompt**. Ne pas coller le lien GitHub comme chemin de dépôt. Une commande CLI équivalente, à utiliser **uniquement à la place de l'UI** pour éviter un doublon :

   ```bash
   pdo run create atelier-radar-ia \
     --target-repo "$RADAR_PATH" \
     --source-branch develop \
     --harness claude \
     --name "Radar IA — issue #${RADAR_ISSUE} — note d'arbitrage" \
     --input "Implémenter https://github.com/${RADAR_REPO}/issues/${RADAR_ISSUE} ; vérifier les critères et produire une note d'arbitrage et un brief pour un manager."
   ```

6. **Inspection réelle.** Le [run de préparation terminé](http://localhost:5172/runs/20261001-183530-abd2d8d/review) a quatre nœuds achevés. Pour chacun, montrer le prompt initial, les entrées reçues, la sortie produite et le terminal en cas de question. Dans **Vérifier la fonction**, lire `verdict: pass`, les **12/12 tests** et le build réussi. Dans **Brief manager**, lire ce qui a été réellement généré. La QA en Chromium réel a corroboré séparément le presse-papiers, l'impression A4, le clavier, les ex æquo, le mobile et l'absence de requêtes externes. Dans **Repositories**, contrôler le dépôt primaire ; dans **Diff**, examiner les changements **avant archivage**. Un run vert sans lecture des preuves ne suffit pas.
7. **Publication séparée.** Expliquer que le run travaille dans une branche/worktree isolé. Il ne pousse pas automatiquement sur GitHub, n'ouvre pas de PR et ne clôt pas l'issue. Après la revue, une personne a ouvert la [PR #2 en brouillon vers `develop`](https://github.com/Mohamedballouch/radar-ia-casablanca-demo/pull/2). Elle est **ouverte, non fusionnée**, et l'issue #1 reste **ouverte**. Montrer le diff de cette PR comme une étape de validation humaine, pas une livraison déjà fusionnée.

## Réponses courtes aux questions probables

- **« Faut-il PDSF pour faire tourner PDO ? »** Non. PDO peut exécuter un pipeline sans PDSF. Dans cet exemple, PDSF a déjà installé les skills et le scaffold du dépôt ; un glossaire et un ADR ont été rédigés séparément, et le mode context du skill reste à exécuter. PDO orchestre les sessions.
- **« PDO installe-t-il PDSF tout seul ? »** Non. PDSF s'installe dans le dépôt ou par son canal plugin. Les skills et les fichiers de contexte doivent exister et être versionnés si l'équipe veut les partager. La banque de skills PDO est une autre surface de distribution ; ne pas assimiler automatiquement les deux.
- **« Quelle connexion GitHub ? »** `gh` s'authentifie dans Ubuntu pour lire/écrire les issues et PR ; le clone a son remote Git. Dans PDO, on choisit le chemin du clone. Montrer `git remote -v`, pas de token.
- **« Doit-on fournir l'URL complète du ticket ? »** Pour ce pipeline, l'URL évite l'ambiguïté. Un numéro peut suffire si le premier nœud sait lire le remote du dépôt ; une clé Jira demande un connecteur/CLI/MCP et un prompt adaptés. PDO ne récupère pas tous les tickets par défaut.
- **« Peut-on choisir un autre agent ou LLM ? »** PDO prend en charge plusieurs harnesses configurés ; cette démo utilise Claude Code authentifié dans le même Ubuntu. Le modèle/API dépend du harness réellement configuré, pas d'une clé GitHub.
- **« Un résultat pass garantit-il la qualité ? »** Non. Il signifie que ce vérificateur a rendu ce verdict sur ses critères. Lire les tests, le diff, l'interface et les limites avant de publier.
- **« Peut-on réutiliser le pipeline pour d'autres repos ? »** Oui si ses prompts et contrôles sont adaptés. Le pipeline est dans la bibliothèque de l'instance ; chaque run choisit explicitement son dépôt primaire et sa branche.
- **« Où sont les données réelles ? »** Nulle part dans cette démo. Les trois cas, scores et exemples sont fictifs ; aucun accès client, Jira d'entreprise, production ou secret ne doit être requis.

## Plans de secours sans maquiller l'état

| Incident | Repli immédiat | Ce qu'il faut dire |
| --- | --- | --- |
| Nouveau run encore en cours à la minute 25 | Ouvrir le run de préparation **terminé** et son diff ; revenir au nouveau run s'il finit. | « Le lancement est bien réel ; pour inspecter toute la chaîne dans le temps prévu, voici le run préparé et son ID. » |
| Claude Code ou son authentification indisponible | Montrer le MP4 PDO et les sorties réellement disponibles du run de préparation ; ne pas relancer plusieurs fois. | « L'agent n'est pas joignable maintenant ; les preuves enregistrées viennent du run identifié, pas d'une exécution en cours. » |
| PDO local indisponible | Ouvrir captures, MP4 et YAML versionné dans le dépôt. | « Nous montrons ici la séquence enregistrée ; aucune exécution en direct n'est en cours. » |
| GitHub ou réseau indisponible | Lire la copie du ticket prévue dans le dépôt et le contexte local ; utiliser le run préparé si la page PDO répond. | « La source GitHub est temporairement inaccessible ; l'issue affichée est la copie de démonstration. » |
| Application de la fonction sur 5174 indisponible | Ouvrir une capture de la fonction ou la PR #2, puis les sorties et tests du run ; garder la vidéo produit du starter 5173 pour l'introduction. | « La prévisualisation du worktree ne répond pas ; voici le changement en revue et les vérifications associées. » |
| Tests ou revue en échec | Montrer le terminal et le verdict ; ne pas appeler cela une réussite. | « C'est précisément ce que la revue doit rendre visible. Nous corrigeons avant toute publication. » |

**Après l'atelier :** partager le dépôt public, l'issue, les slides, le MP4 et le guide ; noter les questions auxquelles l'équipe n'a pas répondu. Proposer un second atelier technique pour créer un pipeline de A à Z et installer PDSF sur un autre dépôt, avec autorisation et données adaptées.
