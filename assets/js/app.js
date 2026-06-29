/* =========================================================
   LOGIQUE DU TABLEAU DE BORD (maquette / démo)
   ---------------------------------------------------------
   Pour l'instant tout se passe dans le navigateur avec les
   fausses données. Plus tard, on remplacera "FAKE_OPERATIONS"
   par les vraies données lues depuis Supabase.
   ========================================================= */

/* 1) On récupère le rôle choisi sur la page de connexion.
      Il est stocké temporairement dans le navigateur. */
const ROLE = sessionStorage.getItem("demo_role") || "patron";
const ROLE_LABEL = { patron: "Patron / Admin", comptable: "Comptable", salarie: "Salarié" };

/* On simule un "salarié connecté" quand le rôle est salarié,
   pour montrer qu'il ne voit QUE ses propres opérations. */
const SALARIE_CONNECTE = "Karim Benali";

/* 2) Affichage de l'identité en haut à droite. */
const userNameEl = document.getElementById("userName");
const rolePillEl = document.getElementById("rolePill");
if (userNameEl) {
  userNameEl.textContent = ROLE === "salarie" ? SALARIE_CONNECTE : "Compte " + ROLE_LABEL[ROLE];
}
if (rolePillEl) {
  rolePillEl.textContent = ROLE_LABEL[ROLE];
  rolePillEl.classList.add(ROLE);
}

/* 3) On filtre les données selon le rôle :
      - salarié : seulement SES opérations
      - comptable / patron : tout */
function operationsVisibles() {
  if (ROLE === "salarie") {
    return FAKE_OPERATIONS.filter(op => op.salarie === SALARIE_CONNECTE);
  }
  return FAKE_OPERATIONS.slice();
}

/* 4) Remplissage du filtre "salarié" (visible pour patron/comptable). */
const filtreSalarie = document.getElementById("filtreSalarie");
if (filtreSalarie && ROLE !== "salarie") {
  FAKE_SALARIES.forEach(nom => {
    const opt = document.createElement("option");
    opt.value = nom; opt.textContent = nom;
    filtreSalarie.appendChild(opt);
  });
} else if (filtreSalarie) {
  /* Un salarié n'a pas besoin du filtre par salarié : on le cache. */
  filtreSalarie.parentElement.style.display = "none";
}

/* 5) Fonctions utilitaires d'affichage. */
function formatArgent(n) {
  return n.toLocaleString("fr-FR") + " $";
}

/* 6) Le rendu : calcule les totaux + dessine le tableau. */
function rendre() {
  let ops = operationsVisibles();

  /* --- Application des filtres de la barre d'outils --- */
  const recherche = (document.getElementById("recherche")?.value || "").toLowerCase();
  const typeFiltre = document.getElementById("filtreType")?.value || "tous";
  const salFiltre = filtreSalarie?.value || "tous";

  if (recherche) ops = ops.filter(op => op.raison.toLowerCase().includes(recherche));
  if (typeFiltre !== "tous") ops = ops.filter(op => op.type === typeFiltre);
  if (salFiltre && salFiltre !== "tous") ops = ops.filter(op => op.salarie === salFiltre);

  /* --- Calcul des totaux --- */
  let totalIn = 0, totalOut = 0;
  ops.forEach(op => { op.type === "entree" ? totalIn += op.montant : totalOut += op.montant; });
  const solde = totalIn - totalOut;

  document.getElementById("totalIn").textContent  = formatArgent(totalIn);
  document.getElementById("totalOut").textContent = formatArgent(totalOut);
  const soldeEl = document.getElementById("solde");
  soldeEl.textContent = (solde >= 0 ? "" : "-") + formatArgent(Math.abs(solde));

  /* --- Dessin du tableau --- */
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = "";
  if (ops.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty">Aucune opération à afficher.</td></tr>';
  } else {
    ops.forEach(op => {
      const tr = document.createElement("tr");
      const estEntree = op.type === "entree";
      tr.innerHTML = `
        <td class="date">${op.date}</td>
        <td>
          <span class="tag ${estEntree ? "in" : "out"}">
            ${estEntree ? "▲ Entrée" : "▼ Sortie"}
          </span>
        </td>
        <td class="montant ${estEntree ? "in" : "out"}">
          ${estEntree ? "+" : "−"} ${formatArgent(op.montant)}
        </td>
        <td class="raison">${op.raison}</td>
        <td class="salarie">${op.salarie}</td>`;
      tbody.appendChild(tr);
    });
  }

  document.getElementById("countInfo").textContent =
    ops.length + " opération" + (ops.length > 1 ? "s" : "");
}

/* 7) On gère la section réservée au patron. */
const adminBlock = document.getElementById("adminOnly");
if (adminBlock && ROLE !== "patron") adminBlock.style.display = "none";

/* La carte "Solde" n'est visible que pour patron + comptable
   (un simple salarié ne voit pas le solde global de l'entreprise). */
const soldeCard = document.getElementById("soldeCard");
if (soldeCard && ROLE === "salarie") soldeCard.style.display = "none";

/* 8) On branche les filtres pour qu'ils rafraîchissent l'affichage. */
["recherche", "filtreType", "filtreSalarie"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("input", rendre);
});

/* 9) Déconnexion = on oublie le rôle et on revient au login. */
document.getElementById("logout")?.addEventListener("click", () => {
  sessionStorage.removeItem("demo_role");
  window.location.href = "index.html";
});

/* 10) Premier rendu au chargement. */
rendre();
