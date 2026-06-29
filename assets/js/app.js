/* =========================================================
   LOGIQUE DE L'APPLICATION (maquette)
   Données factices, modifications non sauvegardées (Supabase plus tard).
   ========================================================= */

const ROLE = sessionStorage.getItem("demo_role") || "patron";
const ROLE_LABEL = { patron: "Patron / Admin", comptable: "Comptable", salarie: "Salarié" };
const SALARIE_CONNECTE = "Karim Benali";

/* Identité en haut */
document.getElementById("userName").textContent =
  ROLE === "salarie" ? SALARIE_CONNECTE : "Compte " + ROLE_LABEL[ROLE];
const pill = document.getElementById("rolePill");
pill.textContent = ROLE_LABEL[ROLE];
pill.classList.add(ROLE);

const fmt = n => Math.round(n).toLocaleString("fr-FR") + " $";
const STATUT = {
  attente: { txt: "En attente", cls: "warn" },
  validee: { txt: "Validée",   cls: "ok" },
  refusee: { txt: "Refusée",   cls: "ko" },
};

/* =========================================================
   NAVIGATION (menu de gauche)
   ========================================================= */
const app = document.getElementById("app");
const navItems = document.querySelectorAll(".nav-item");
function afficherPage(nom, titre) {
  document.querySelectorAll(".page").forEach(p => p.hidden = true);
  document.getElementById("page-" + nom).hidden = false;
  navItems.forEach(b => b.classList.toggle("active", b.dataset.page === nom));
  if (titre) document.getElementById("pageTitle").textContent = titre;
  app.classList.remove("menu-open"); // referme le menu sur mobile
}
navItems.forEach(b =>
  b.addEventListener("click", () => afficherPage(b.dataset.page, b.dataset.title)));

/* Replier / déplier le groupe "Comptabilité" */
const comptaParent = document.getElementById("comptaParent");
const comptaSub = document.getElementById("comptaSub");
comptaParent.addEventListener("click", () => {
  const ouvert = comptaParent.classList.toggle("open");
  comptaSub.style.display = ouvert ? "" : "none";
});

/* Menu coulissant sur mobile */
document.getElementById("openSide").addEventListener("click", () => app.classList.add("menu-open"));
document.getElementById("closeSide").addEventListener("click", () => app.classList.remove("menu-open"));
document.getElementById("backdrop").addEventListener("click", () => app.classList.remove("menu-open"));

/* =========================================================
   RÔLES : un salarié ne voit que "Notes de frais"
   ========================================================= */
if (ROLE === "salarie") {
  ["bilan", "factures", "depenses"].forEach(p =>
    document.querySelector(`.nav-item[data-page="${p}"]`).style.display = "none");
  afficherPage("notes", "Notes de frais");
} else {
  afficherPage("bilan", "Tableau de bord");
}

/* =========================================================
   BILAN — totaux + solde courant
   ========================================================= */
let soldeMasque = false;
function rendreBilan() {
  const caFactures = FACTURES.filter(f => f.type === "magasin").reduce((s, f) => s + f.montant, 0);
  const caEssence  = FACTURES.filter(f => f.type === "essence").reduce((s, f) => s + f.montant, 0);
  const depHorsSalaire = DEPENSES.filter(d => d.categorie !== "salaire").reduce((s, d) => s + d.montant, 0);
  const depToutes  = DEPENSES.reduce((s, d) => s + d.montant, 0);
  const benefice   = caFactures + caEssence - depHorsSalaire;
  /* Le solde courant = tout ce qui rentre - tout ce qui sort (salaires inclus). */
  const solde = caFactures + caEssence - depToutes;

  document.getElementById("caFactures").textContent    = fmt(caFactures);
  document.getElementById("caEssence").textContent     = fmt(caEssence);
  document.getElementById("totalDepenses").textContent = fmt(depHorsSalaire);
  document.getElementById("benefice").textContent      = fmt(benefice);
  document.getElementById("soldeValue").textContent    = soldeMasque ? "•••••• $" : fmt(solde);
}

/* Bouton Masquer / Afficher le solde */
document.getElementById("toggleSolde").addEventListener("click", e => {
  soldeMasque = !soldeMasque;
  e.currentTarget.textContent = soldeMasque ? "👁 Afficher" : "🙈 Masquer";
  rendreBilan();
});
document.getElementById("refreshSolde").addEventListener("click", rendreBilan);

/* Sélecteur de semaine (cosmétique pour la maquette) */
let semaine = 27;
function majSemaine() { document.getElementById("weekNum").textContent = "W" + semaine; }
document.getElementById("weekPrev").addEventListener("click", () => { if (semaine > 1) { semaine--; majSemaine(); } });
document.getElementById("weekNext").addEventListener("click", () => { if (semaine < 52) { semaine++; majSemaine(); } });

/* =========================================================
   FACTURES
   ========================================================= */
function rendreFactures() {
  const rech = (document.getElementById("rechFactures").value || "").toLowerCase();
  const type = document.getElementById("filtreTypeFacture").value;
  let liste = FACTURES.slice();
  if (rech) liste = liste.filter(f => f.raison.toLowerCase().includes(rech));
  if (type !== "tous") liste = liste.filter(f => f.type === type);

  const tb = document.getElementById("tbodyFactures");
  tb.innerHTML = liste.length ? "" : '<tr><td colspan="5" class="empty">Aucune facture.</td></tr>';
  liste.forEach(f => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="date">${f.date}</td>
      <td><span class="tag ${f.type === "essence" ? "blue" : "in"}">
        ${f.type === "essence" ? "⛽ Essence" : "🏪 Magasin"}</span></td>
      <td class="montant in">+ ${fmt(f.montant)}</td>
      <td class="raison">${f.raison}</td>
      <td class="salarie">${f.salarie}</td>`;
    tb.appendChild(tr);
  });
  document.getElementById("countFactures").textContent =
    liste.length + " facture" + (liste.length > 1 ? "s" : "");
}

/* =========================================================
   DÉPENSES — catégorie par menu déroulant
   ========================================================= */
function rendreDepenses() {
  const rech = (document.getElementById("rechDepenses").value || "").toLowerCase();
  const cat = document.getElementById("filtreCategorie").value;
  let liste = DEPENSES.slice();
  if (rech) liste = liste.filter(d => d.raison.toLowerCase().includes(rech));
  if (cat !== "tous") liste = liste.filter(d => d.categorie === cat);

  const tb = document.getElementById("tbodyDepenses");
  tb.innerHTML = liste.length ? "" : '<tr><td colspan="5" class="empty">Aucune dépense.</td></tr>';
  liste.forEach(d => {
    const tr = document.createElement("tr");
    const estSalaire = d.categorie === "salaire";
    tr.innerHTML = `
      <td class="date">${d.date}</td>
      <td class="montant out">− ${fmt(d.montant)}</td>
      <td class="raison">${d.raison}</td>
      <td class="salarie">${d.salarie}</td>
      <td>
        <select class="cat-select ${estSalaire ? "is-salaire" : ""}" data-id="${d.id}">
          <option value=""        ${d.categorie === ""        ? "selected" : ""}>À catégoriser</option>
          <option value="matiere" ${d.categorie === "matiere" ? "selected" : ""}>Matière première</option>
          <option value="salaire" ${d.categorie === "salaire" ? "selected" : ""}>Salaire (exclu du Bilan)</option>
        </select>
      </td>`;
    tb.appendChild(tr);
  });
  tb.querySelectorAll(".cat-select").forEach(sel => {
    sel.addEventListener("change", () => {
      DEPENSES.find(d => d.id === Number(sel.dataset.id)).categorie = sel.value;
      rendreDepenses();
      rendreBilan();
    });
  });
  document.getElementById("countDepenses").textContent =
    liste.length + " dépense" + (liste.length > 1 ? "s" : "");
}

/* =========================================================
   NOTES DE FRAIS
   ========================================================= */
function rendreNotes() {
  let liste = NOTES_FRAIS.slice();
  if (ROLE === "salarie") liste = liste.filter(n => n.salarie === SALARIE_CONNECTE);

  document.getElementById("notesSub").textContent = ROLE === "salarie"
    ? "Déclare tes frais ici. L'administration les validera."
    : "Notes déclarées par les salariés. À valider ou refuser.";

  const tb = document.getElementById("tbodyNotes");
  tb.innerHTML = liste.length ? "" : '<tr><td colspan="5" class="empty">Aucune note de frais.</td></tr>';
  liste.forEach(n => {
    const s = STATUT[n.statut];
    const actions = (ROLE !== "salarie" && n.statut === "attente")
      ? `<div class="mini-actions">
           <button class="mini ok" data-id="${n.id}" data-do="validee">✔</button>
           <button class="mini ko" data-id="${n.id}" data-do="refusee">✗</button>
         </div>` : "";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="date">${n.date}</td>
      <td class="salarie">${n.salarie}</td>
      <td class="raison">${n.raison}</td>
      <td class="montant out">${fmt(n.montant)}</td>
      <td><span class="statut ${s.cls}">${s.txt}</span> ${actions}</td>`;
    tb.appendChild(tr);
  });
  tb.querySelectorAll(".mini").forEach(btn => {
    btn.addEventListener("click", () => {
      NOTES_FRAIS.find(n => n.id === Number(btn.dataset.id)).statut = btn.dataset.do;
      rendreNotes();
    });
  });
}

document.getElementById("ajouterNote").addEventListener("click", () => {
  const raison = document.getElementById("noteRaison").value.trim();
  const montant = Number(document.getElementById("noteMontant").value);
  if (!raison || !montant) { alert("Indique une raison et un montant."); return; }
  NOTES_FRAIS.unshift({
    id: Date.now(), date: "2026-06-29 (maintenant)",
    salarie: ROLE === "salarie" ? SALARIE_CONNECTE : "Patron",
    raison, montant, statut: "attente",
  });
  document.getElementById("noteRaison").value = "";
  document.getElementById("noteMontant").value = "";
  rendreNotes();
});

/* =========================================================
   Filtres + premier rendu
   ========================================================= */
["rechFactures", "filtreTypeFacture"].forEach(id =>
  document.getElementById(id).addEventListener("input", rendreFactures));
["rechDepenses", "filtreCategorie"].forEach(id =>
  document.getElementById(id).addEventListener("input", rendreDepenses));

document.getElementById("logout").addEventListener("click", () => {
  sessionStorage.removeItem("demo_role");
  window.location.href = "index.html";
});

rendreBilan();
rendreFactures();
rendreDepenses();
rendreNotes();
