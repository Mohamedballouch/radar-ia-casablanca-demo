# ADR 0001 — Score indicatif et données d’atelier

**Statut :** accepté pour le prototype de démonstration.

## Contexte

L’équipe doit comparer des idées sans transformer des impressions initiales en promesse de ROI. Le produit doit être compréhensible sans explication technique et fonctionner sans données d’entreprise ni compte externe.

## Décision

Chaque cas reçoit quatre notes entières de 1 à 5. Le score additionne les contributions suivantes : impact métier 40 %, disponibilité des données 25 %, faible effort 20 %, faible risque 15 %. Chaque contribution est normalisée de 0 à son poids ; le résultat est arrondi sur 100. Un risque ou effort plus faible améliore le score. Le classement garde l’ordre de saisie en cas d’égalité.

Les trois exemples de départ sont étiquetés fictifs. Les notes restent en mémoire de page, sans API ni stockage. La formule et les poids sont visibles dans l’interface.

## Conséquences et limites

Le classement est reproductible et peut alimenter la discussion de l’atelier. Les poids sont arbitraires et doivent être débattus ; aucune validation de données, de coût réel, de conformité ou de faisabilité technique n’est implicite. Avant toute décision d’investissement, un responsable doit confirmer ces éléments avec les personnes concernées. Le futur brief d’arbitrage devra conserver cette réserve.
