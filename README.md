# Comptabilité LTD — Serveur FiveM RP

Site web qui affiche la comptabilité (entrées / sorties d'argent) d'une entreprise
d'un serveur **FiveM RP**. Les opérations sont écrites dans Discord sous forme de
**logs embed**, lues par un **bot**, stockées dans **Supabase**, puis affichées ici.

## 🧩 Comment ça marche (l'idée générale)

```
Discord (logs embed)  ─▶  Bot (lit l'embed)  ─▶  Supabase (base de données)  ─▶  Site web (affiche)
```

Un site HTML seul ne peut pas « recevoir » les messages du bot : il faut une base de
données au milieu (**Supabase**) où le bot dépose les données et où le site vient les lire.

## 📋 Données suivies (correspond aux embeds Discord)

| Champ    | Description                                  |
|----------|----------------------------------------------|
| Type     | `entrée` (argent qui rentre) ou `sortie`     |
| Montant  | Montant de l'opération en $                  |
| Raison   | Le motif de la facture                       |
| Salarié  | Qui a réalisé l'opération                    |
| Date     | Ajoutée automatiquement                      |

## 👥 Rôles (qui voit quoi)

- **Patron / Admin** : voit tout + gestion des salariés et des rangs.
- **Comptable** : voit tout (totaux + solde), sans la gestion.
- **Salarié** : voit uniquement ses propres opérations, sans le solde global.

## 🗺️ Feuille de route

- [x] **Étape 1 — Maquette visuelle** *(fait)* : pages HTML/CSS/JS avec **fausses données**
      pour caler le design et le concept de rôles. Rien n'est connecté ni sécurisé.
- [ ] **Étape 2 — Supabase** : créer la base de données + la vraie connexion (Auth) et les rangs.
- [ ] **Étape 3 — Bot Discord (Python)** : lire les embeds du channel et les envoyer dans Supabase.
- [ ] **Étape 4 — Branchement réel** : le site lit les vraies données + sécurité par rang (RLS),
      et l'espace de gestion des comptes pour le patron.

## 🚀 Voir la maquette (Étape 1)

Ouvre simplement `index.html` dans ton navigateur, choisis un rôle, et explore.
Plus tard, le site sera publié en ligne via **GitHub Pages**.

## 📁 Structure des fichiers

```
index.html          → écran de connexion (démo : choix du rôle)
dashboard.html      → tableau de bord (totaux + tableau des opérations)
assets/css/style.css→ tout le design (couleurs en haut du fichier)
assets/js/data.js   → fausses données (remplacées plus tard par Supabase)
assets/js/app.js    → logique d'affichage, filtres et gestion des rôles
```

> ⚠️ État actuel : **maquette de démonstration**. Les chiffres sont inventés et la
> « connexion » ne fait que choisir un rôle pour visualiser le rendu.
