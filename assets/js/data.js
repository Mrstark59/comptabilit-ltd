/* =========================================================
   FAUSSES DONNÉES DE DÉMO
   ---------------------------------------------------------
   Plus tard, tout ceci viendra de Supabase (rempli par le bot
   Discord pour les factures/dépenses, et par les salariés pour
   les notes de frais). Pour l'instant : données inventées.

   Les montants sont en $ et toujours positifs.
   ========================================================= */

/* --- FACTURES (les ENTRÉES d'argent) ---
   type : "magasin" (vente classique) ou "essence" (carburant)
   On sépare l'essence car tu veux un CA essence à part dans le Bilan. */
const FACTURES = [
  { id: 1, date: "2026-06-29 14:32", montant: 1850, raison: "Vente 30 packs d'eau",       salarie: "Léa Martin",   type: "magasin" },
  { id: 2, date: "2026-06-29 11:47", montant: 920,  raison: "Sandwichs midi",             salarie: "Karim Benali", type: "magasin" },
  { id: 3, date: "2026-06-29 09:15", montant: 640,  raison: "Plein essence client",       salarie: "Sofia Lopez",  type: "essence" },
  { id: 4, date: "2026-06-28 22:05", montant: 3100, raison: "Grosse commande EMS",        salarie: "Sofia Lopez",  type: "magasin" },
  { id: 5, date: "2026-06-28 18:40", montant: 1180, raison: "Carburant flotte police",    salarie: "Léa Martin",   type: "essence" },
  { id: 6, date: "2026-06-28 16:12", montant: 540,  raison: "Vente cigarettes",           salarie: "Karim Benali", type: "magasin" },
  { id: 7, date: "2026-06-27 21:40", montant: 760,  raison: "Café + viennoiseries",       salarie: "Léa Martin",   type: "magasin" },
  { id: 8, date: "2026-06-27 18:22", montant: 1280, raison: "Vente packs énergie",        salarie: "Sofia Lopez",  type: "magasin" },
  { id: 9, date: "2026-06-27 12:33", montant: 410,  raison: "Plein essence client",       salarie: "Karim Benali", type: "essence" },
];

/* --- DÉPENSES (les SORTIES d'argent) ---
   categorie : "matiere" (Matière première) ou "salaire".
   👉 Les dépenses "salaire" ne comptent PAS dans le total Dépenses du Bilan.
   "" (vide) = pas encore catégorisée par l'admin. */
const DEPENSES = [
  { id: 1, date: "2026-06-29 13:10", montant: 4200, raison: "Réappro stock soda",      salarie: "Léa Martin",   categorie: "matiere" },
  { id: 2, date: "2026-06-28 20:00", montant: 1500, raison: "Paie hebdo Karim",        salarie: "Patron",       categorie: "salaire" },
  { id: 3, date: "2026-06-28 10:55", montant: 980,  raison: "Achat matières snacks",   salarie: "Sofia Lopez",  categorie: "matiere" },
  { id: 4, date: "2026-06-27 19:30", montant: 1200, raison: "Paie hebdo Léa",          salarie: "Patron",       categorie: "salaire" },
  { id: 5, date: "2026-06-27 15:08", montant: 350,  raison: "Frais électricité",       salarie: "Patron",       categorie: "" },
  { id: 6, date: "2026-06-26 23:15", montant: 2800, raison: "Réassort complet",        salarie: "Sofia Lopez",  categorie: "matiere" },
];

/* --- NOTES DE FRAIS (déclarées par les salariés sur la tablette) ---
   statut : "attente", "validee" ou "refusee" (décidé par l'admin). */
const NOTES_FRAIS = [
  { id: 1, date: "2026-06-29 12:05", salarie: "Karim Benali", raison: "Essence véhicule perso pour livraison", montant: 85,  statut: "attente" },
  { id: 2, date: "2026-06-28 17:50", salarie: "Léa Martin",   raison: "Achat sacs de caisse",                   montant: 40,  statut: "validee" },
  { id: 3, date: "2026-06-27 14:20", salarie: "Sofia Lopez",  raison: "Repas pendant inventaire",               montant: 22,  statut: "refusee" },
];

/* Liste des salariés (filtres + déclarations). */
const SALARIES = ["Léa Martin", "Karim Benali", "Sofia Lopez", "Patron"];
