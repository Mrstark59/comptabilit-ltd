/* =========================================================
   LOGIQUE DE L'APPLICATION (maquette)
   ---------------------------------------------------------
   Tout fonctionne dans le navigateur avec les fausses données.
   Les modifications (catégorie d'une dépense, nouvelle note de
   frais) ne sont PAS sauvegardées : elles disparaissent si tu
   recharges la page. C'est normal — la sauvegarde viendra avec
   Supabase (Étape 2).
   ========================================================= */

/* ---- Rôle choisi à la connexion ---- */
const ROLE = sessionStorage.getItem("demo_role") || "patron";
const ROLE_LABEL = { patron: "Patron / Admin", comptable: "Comptable", salarie: "Salarié" };
const SALARIE_CONNECTE = "Karim Benali"; // simulé quand on est connecté en "salarié"

/* Identité en haut à droite */
document.getElementById("userName").textContent =
  ROLE === "salarie" ? SALARIE_CONNECTE : "Compte " + ROLE_LABEL[ROLE];
const pill = document.getElementById("rolePill");
pill.textContent = ROLE_LABEL[ROLE];
pill.classList.add(ROLE);

/* Outils d'affichage */
const fmt = n => Math.round(n).toLocaleString("fr-FR") + " $";
const CATEGORIE_LABEL = { matiere: "Matière première", salaire: "Salaire", "": "À catégoriser" };
const STATUT = {
  attente: { txt: "En attente", cls: "warn" },
  validee: { txt: "Validée",   cls: "ok" },
  refusee: { txt: "Refusée",   cls: "ko" },
};

/* =========================================================
   NAVIGATION entre les pages (menu de gauche)
   ========================================================= */
const navItems = document.querySelectorAll(".nav-item");
function afficherPage(nom) {
  document.querySelectorAll(".page").forEach(p => p.hidden = true);
  document.getElementById("page-" + nom).hidden = false;
  navItems.forEach(b => b.classList.toggle("active", b.dataset.page === nom));
}
navItems.forEach(b => b.addEventListener("click", () => afficherPage(b.dataset.page)));

/* =========================================================
   GESTION DES RÔLES (qui voit quoi)
   - salarié : ne voit que "Notes de frais" (pour déclarer)
   - comptable / patron : voient tout
   ========================================================= */
if (ROLE === "salarie") {
  ["bilan", "factures", "depenses"].forEach(p => {
    document.querySelector(`.nav-item[data-page="${p}"]`).style.display = "none";
  });
  afficherPage("notes");
} else {
  afficherPage("bilan");
}

/* =========================================================
   PAGE BILAN — calcule les totaux de la semaine
   ========================================================= */
function rendreBilan() {
  const caFactures = FACTURES.filter(f => f.type === "magasin").reduce((s, f) => s + f.montant, 0);
  const caEssence  = FACTURES.filter(f => f.type === "essence").reduce((s, f) => s + f.montant, 0);
  /* Les dépenses "salaire" sont exclues, comme demandé. */
  const depenses   = DEPENSES.filter(d => d.categorie !== "salaire").reduce((s, d) => s + d.montant, 0);
  const benefice   = caFactures + caEssence - depenses;

  document.getElementById("caFactures").textContent    = fmt(caFactures);
  document.getElementById("caEssence").textContent     = fmt(caEssence);
  document.getElementById("totalDepenses").textContent = fmt(depenses);
  document.getElementById("benefice").textContent      = fmt(benefice);
}

/* =========================================================
   PAGE FACTURES
   ========================================================= */
function rendreFactures() {
  const rech = (document.getElementById("rechFactures").value || "").toLowerCase();
  const type = document.getElementById("filtreTypeFacture").value;
  let liste = FACTURES.slice();
  if (rech) liste = liste.filter(f => f.raison.toLowerCase().includes(rech));
  if (type !== "tous") liste = liste.filter(f => f.type === type);

  const tb = document.getElementById("tbodyFactures");
  tb.innerHTML = liste.length ? "" :
    '<tr><td colspan="5" class="empty">Aucune facture.</td></tr>';
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
   PAGE DÉPENSES — avec menu déroulant de catégorie par ligne
   ========================================================= */
function rendreDepenses() {
  const rech = (document.getElementById("rechDepenses").value || "").toLowerCase();
  const cat = document.getElementById("filtreCategorie").value;
  let liste = DEPENSES.slice();
  if (rech) liste = liste.filter(d => d.raison.toLowerCase().includes(rech));
  if (cat !== "tous") liste = liste.filter(d => d.categorie === cat);

  const tb = document.getElementById("tbodyDepenses");
  tb.innerHTML = liste.length ? "" :
    '<tr><td colspan="5" class="empty">Aucune dépense.</td></tr>';
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

  /* Quand on change une catégorie : on met à jour la donnée + le Bilan. */
  tb.querySelectorAll(".cat-select").forEach(sel => {
    sel.addEventListener("change", () => {
      const dep = DEPENSES.find(d => d.id === Number(sel.dataset.id));
      dep.categorie = sel.value;
      rendreDepenses(); // rafraîchit l'apparence (salaire grisé)
      rendreBilan();    // le total du Bilan se recalcule en direct
    });
  });

  document.getElementById("countDepenses").textContent =
    liste.length + " dépense" + (liste.length > 1 ? "s" : "");
}

/* =========================================================
   PAGE NOTES DE FRAIS
   ========================================================= */
function rendreNotes() {
  /* Un salarié ne voit que SES notes ; l'admin voit tout. */
  let liste = NOTES_FRAIS.slice();
  if (ROLE === "salarie") liste = liste.filter(n => n.salarie === SALARIE_CONNECTE);

  document.getElementById("notesSub").textContent = ROLE === "salarie"
    ? "Déclare tes frais ici. L'administration les validera."
    : "Notes déclarées par les salariés. À valider ou refuser.";

  const tb = document.getElementById("tbodyNotes");
  tb.innerHTML = liste.length ? "" :
    '<tr><td colspan="5" class="empty">Aucune note de frais.</td></tr>';
  liste.forEach(n => {
    const s = STATUT[n.statut];
    /* L'admin peut valider/refuser (boutons de démo). */
    const actions = (ROLE !== "salarie" && n.statut === "attente")
      ? `<div class="mini-actions">
           <button class="mini ok"  data-id="${n.id}" data-do="validee">✔</button>
           <button class="mini ko"  data-id="${n.id}" data-do="refusee">✗</button>
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
      const note = NOTES_FRAIS.find(n => n.id === Number(btn.dataset.id));
      note.statut = btn.dataset.do;
      rendreNotes();
    });
  });
}

/* Déclaration d'une nouvelle note de frais */
document.getElementById("ajouterNote").addEventListener("click", () => {
  const raison = document.getElementById("noteRaison").value.trim();
  const montant = Number(document.getElementById("noteMontant").value);
  if (!raison || !montant) { alert("Indique une raison et un montant."); return; }
  NOTES_FRAIS.unshift({
    id: Date.now(),
    date: "2026-06-29 (maintenant)",
    salarie: ROLE === "salarie" ? SALARIE_CONNECTE : "Patron",
    raison, montant, statut: "attente",
  });
  document.getElementById("noteRaison").value = "";
  document.getElementById("noteMontant").value = "";
  rendreNotes();
});

/* =========================================================
   Branchements des filtres + premier rendu
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
