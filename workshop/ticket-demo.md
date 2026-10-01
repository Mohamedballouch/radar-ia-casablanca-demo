# Ajouter une note d’arbitrage copiable et imprimable

## Besoin métier

En tant que responsable d’équipe, je veux partager une synthèse courte de la comparaison des cas d’usage IA afin de lancer une discussion d’arbitrage. Le score du Radar IA reste un **repère d’atelier**, pas une décision d’investissement ni une promesse de retour sur investissement.

## Contexte

L’application compare déjà trois cas fictifs avec quatre critères notés de 1 à 5 : impact métier, disponibilité des données, effort de mise en œuvre et risque. Le classement et ses pondérations sont visibles. La nouvelle note doit refléter les valeurs courantes de l’écran, y compris après une modification pendant l’atelier.

## Critères d’acceptation

1. Un bouton **Copier la note** crée un texte en français dans le presse-papiers. Un message accessible confirme la copie ou explique clairement son échec.
2. La note cite le premier cas du classement, son score sur 100, les scores des trois cas et les quatre notes du candidat prioritaire. Elle explique les pondérations utilisées par l’application et signale les ex æquo sans inventer un gagnant certain.
3. La note comporte la mention **« Données fictives · score indicatif »** et une prochaine étape concrète : vérifier les données disponibles et les risques avec le métier avant toute décision.
4. Un bouton **Imprimer / enregistrer en PDF** utilise l’impression du navigateur. La feuille imprimée est lisible sur A4, présente la note sans les contrôles de saisie et n’envoie aucune donnée à un service externe.
5. Après avoir modifié un nom ou une note, le classement et la note copiée/imprimée reflètent immédiatement la nouvelle comparaison. **Réinitialiser** revient aux trois exemples fictifs.
6. Le parcours fonctionne au clavier et à largeur mobile. Ajouter des tests déterministes pour la génération de la note, les ex æquo et au moins un changement de saisie ; `npm test` et `npm run build` doivent réussir.
7. Mettre à jour le README avec une démonstration de cinq minutes : modifier un critère → observer le classement → copier la note → imprimer ou enregistrer en PDF.

## Parcours de recette

Ouvrir Radar IA, augmenter la disponibilité des données de « Recherche documentaire », observer son nouveau rang, copier la note, vérifier que le texte décrit l’état courant, puis ouvrir l’aperçu d’impression. Recommencer après **Réinitialiser**.

## Hors périmètre

Comptes utilisateurs, base de données, connexion à Jira, appels LLM, données réelles de clients, recommandation d’investissement automatique.

## Consigne de livraison pour la démo PDO

Implémenter sur le dépôt cible sélectionné dans PDO. Le pipeline lit ce ticket via `gh`, développe la fonction, lance tests et build, effectue une revue indépendante, puis produit un brief en français. Ne pas publier automatiquement de PR ni fermer ce ticket : la revue humaine suit le run.
