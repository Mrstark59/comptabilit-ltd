/* =========================================================
   FAUSSES DONNÉES DE DÉMO
   ---------------------------------------------------------
   Ce fichier remplace, pour l'instant, ce que le bot Discord
   enverra plus tard dans Supabase. Chaque "opération" a la
   même forme que tes embeds :
     - type    : "entree" (argent qui rentre) ou "sortie"
     - montant : nombre en $ (toujours positif)
     - raison  : le texte de la facture
     - salarie : qui a fait l'opération
     - date    : ajoutée automatiquement (indispensable en compta)
   ========================================================= */

const FAKE_OPERATIONS = [
  { id: 1,  date: "2026-06-29 14:32", type: "entree", montant: 1850, raison: "Vente de 30 packs d'eau",        salarie: "Léa Martin" },
  { id: 2,  date: "2026-06-29 13:10", type: "sortie", montant: 4200, raison: "Réapprovisionnement stock soda", salarie: "Léa Martin" },
  { id: 3,  date: "2026-06-29 11:47", type: "entree", montant: 920,  raison: "Vente sandwichs midi",            salarie: "Karim Benali" },
  { id: 4,  date: "2026-06-28 22:05", type: "entree", montant: 3100, raison: "Grosse commande EMS",             salarie: "Sofia Lopez" },
  { id: 5,  date: "2026-06-28 19:30", type: "sortie", montant: 600,  raison: "Prime employé du mois",           salarie: "Patron" },
  { id: 6,  date: "2026-06-28 16:12", type: "entree", montant: 540,  raison: "Vente cigarettes",               salarie: "Karim Benali" },
  { id: 7,  date: "2026-06-28 10:55", type: "sortie", montant: 1500, raison: "Achat véhicule de livraison",     salarie: "Patron" },
  { id: 8,  date: "2026-06-27 21:40", type: "entree", montant: 760,  raison: "Vente café + viennoiseries",      salarie: "Léa Martin" },
  { id: 9,  date: "2026-06-27 18:22", type: "entree", montant: 1280, raison: "Vente packs énergie",             salarie: "Sofia Lopez" },
  { id: 10, date: "2026-06-27 15:08", type: "sortie", montant: 350,  raison: "Frais d'électricité magasin",     salarie: "Patron" },
  { id: 11, date: "2026-06-27 12:33", type: "entree", montant: 430,  raison: "Vente snacks",                    salarie: "Karim Benali" },
  { id: 12, date: "2026-06-26 23:15", type: "sortie", montant: 2800, raison: "Réassort stock complet",          salarie: "Sofia Lopez" },
];

/* La liste des salariés (servira plus tard au filtre + gestion). */
const FAKE_SALARIES = ["Léa Martin", "Karim Benali", "Sofia Lopez", "Patron"];
