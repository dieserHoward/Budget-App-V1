function formatEuro(value) {
  return value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatNumber(value, mitEuro = false) {
  const formatted = value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return mitEuro ? formatted + " €" : formatted;
}



// ------------------ Auslagerung 1.1 -- Einstellungen-Popup anzeigen
document.addEventListener("DOMContentLoaded", () => {
  const settingsIcon = document.getElementById("settings-icon");
  const popup2Overlay = document.getElementById("popup2-overlay");
  const popup2Close = document.getElementById("popup2-close");
  document.getElementById('typ-auswahl').dispatchEvent(new Event('change'));

  if (settingsIcon && popup2Overlay && popup2Close) {
    settingsIcon.addEventListener("click", () => {
      popup2Overlay.style.display = "flex";
    });

    popup2Close.addEventListener("click", () => {
      popup2Overlay.style.display = "none";
    });

    popup2Overlay.addEventListener("click", (event) => {
      if (event.target === popup2Overlay) {
        popup2Overlay.style.display = "none";
      }
    });
  }
});
// Auslagerung 1.1 Ende
// --------------------- Auslagerung 1.2 Start --- Popup zum Verwalten der Kategorien
 // was steht in dem Popup "Kategorien Verwalten in den Einstellungen" Start
const openKategoriePopupBtn = document.getElementById("open-kategorie-popup");
const kategoriePopupOverlay = document.getElementById("kategorie-popup-overlay");
const kategoriePopupClose = document.getElementById("kategorie-popup-close");

if (openKategoriePopupBtn && kategoriePopupOverlay && kategoriePopupClose) {
  openKategoriePopupBtn.addEventListener("click", () => {
    kategoriePopupOverlay.style.display = "flex";
  });

  kategoriePopupClose.addEventListener("click", () => {
    kategoriePopupOverlay.style.display = "none";
  });

  kategoriePopupOverlay.addEventListener("click", (event) => {
    if (event.target === kategoriePopupOverlay) {
      kategoriePopupOverlay.style.display = "none";
    }
  });
}

const wordInput = document.getElementById("wordInput");
const addWordBtn = document.getElementById("addWordBtn");
const typAuswahl = document.getElementById("typ-auswahl");
const kategorieListe = document.getElementById("kategorie-liste");

function renderKategorien() {
  kategorieListe.innerHTML = "";

  const gespeicherte = JSON.parse(localStorage.getItem("kategorien")) || {
    einnahme: [],
    ausgabe: [],
    investition: []
  };
  gespeicherte.einnahme = gespeicherte.einnahme || [];
  gespeicherte.ausgabe = gespeicherte.ausgabe || [];
  gespeicherte.investition = gespeicherte.investition || [];

  const typ = typAuswahl.value;

  // Variable zum Merken des aktuell gezogenen Index
  let draggedIndex = null;

  gespeicherte[typ].forEach((wort, index) => {
    const li = document.createElement("li");
    li.draggable = true;  // draggable setzen
    li.dataset.index = index; // zum Identifizieren

    const textSpan = document.createElement("span");
    textSpan.textContent = wort;
    li.appendChild(textSpan);

    // Buttons-Container und Buttons (wie vorher, nicht geändert)
    const btnContainer = document.createElement("div");
    btnContainer.style.display = "flex";
    btnContainer.style.gap = "10px";
    btnContainer.style.alignItems = "center";

    const loeschBtn = document.createElement("button");
    loeschBtn.textContent = "🗑️";
    loeschBtn.style.color = "#c00";
    loeschBtn.style.cursor = "pointer";
    loeschBtn.style.background = "none";
    loeschBtn.style.border = "none";
    loeschBtn.title = "Kategorie löschen";
    loeschBtn.addEventListener("click", () => {
      if (confirm(`Kategorie "${wort}" wirklich löschen?`)) {
        gespeicherte[typ].splice(index, 1);
        localStorage.setItem("kategorien", JSON.stringify(gespeicherte));
        renderKategorien();
      }
    });

    const editBtn = document.createElement("button");
    editBtn.textContent = "✎";
    editBtn.style.cursor = "pointer";
    editBtn.style.background = "none";
    editBtn.style.border = "none";
    editBtn.style.color = "#007bff";
    editBtn.title = "Kategorie umbenennen";
    editBtn.addEventListener("click", () => {
      // Editier-Logik hier, unverändert
      // (Du kannst hier deinen bisherigen Code reinpacken)
    });

    btnContainer.appendChild(loeschBtn);
    btnContainer.appendChild(editBtn);

    li.appendChild(btnContainer);

    // Drag & Drop Event-Listener

    li.addEventListener("dragstart", (e) => {
      draggedIndex = index;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", index);
      li.style.opacity = "0.5";
    });

    li.addEventListener("dragend", (e) => {
      draggedIndex = null;
      li.style.opacity = "1";
    });

    li.addEventListener("dragover", (e) => {
      e.preventDefault(); // Erlaubt drop
      e.dataTransfer.dropEffect = "move";
    });

    li.addEventListener("drop", (e) => {
      e.preventDefault();
      const fromIndex = draggedIndex;
      const toIndex = index;

      if (fromIndex === null || fromIndex === toIndex) return;

      // Kategorie verschieben
      const verschobeneKategorie = gespeicherte[typ].splice(fromIndex, 1)[0];
      gespeicherte[typ].splice(toIndex, 0, verschobeneKategorie);

      localStorage.setItem("kategorien", JSON.stringify(gespeicherte));
      renderKategorien();
    });

    kategorieListe.appendChild(li);
  });
}





addWordBtn.addEventListener("click", () => {
  const wort = wordInput.value.trim();
  const typ = typAuswahl.value;

  if (!wort) return;

  const gespeicherte = JSON.parse(localStorage.getItem("kategorien")) || {
    einnahme: [],
    ausgabe: [],
    investition: []
  };
  gespeicherte.einnahme = gespeicherte.einnahme || [];
gespeicherte.ausgabe = gespeicherte.ausgabe || [];
gespeicherte.investition = gespeicherte.investition || [];

  if (!gespeicherte[typ].includes(wort)) {
    gespeicherte[typ].push(wort);
    localStorage.setItem("kategorien", JSON.stringify(gespeicherte));
  }

  wordInput.value = "";
  renderKategorien();
});

typAuswahl.addEventListener("change", renderKategorien);

// Beim Öffnen des Popups gleich anzeigen
if (openKategoriePopupBtn) {
  openKategoriePopupBtn.addEventListener("click", () => {
    renderKategorien();
  });
}



// was steht in dem Popup "Kategorien Verwalten in den Einstellungen" Ende
// Auslagerung 1.2 Ende

// ------------------- Auslagerung 1.3 Start --- Formular im Popup: Eintrag hinzufügen
document.getElementById('popup-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const typ = document.getElementById('popup-typ').value;
  const betrag = parseFloat(document.getElementById('popup-betrag').value);
  const kategorie = document.getElementById('wordSelect').value;
  const datum = document.getElementById('popup-datum').value;

  if (!typ || isNaN(betrag) || !kategorie || !datum) {
    alert('Bitte alle Felder korrekt ausfüllen!');
    return;
  }

  const eintrag = { typ, betrag, kategorie, datum };

  let eintraege = JSON.parse(localStorage.getItem('eintraege')) || [];
  eintraege.push(eintrag);
  localStorage.setItem('eintraege', JSON.stringify(eintraege));
  berechneMonatsuebersicht(aktuellesDatum.getFullYear(), aktuellesDatum.getMonth());


  // ✅ Kalender aktualisieren
  if (typeof renderKalender === 'function') {
    renderKalender();
  } else {
    console.warn("renderKalender-Funktion nicht gefunden.");
  }
  // ✅ Liste aktualisieren
  if (typeof renderListe === 'function') {
    renderListe();
  } else {
    console.warn("renderListe-Funktion nicht gefunden.");
  }
  if (typeof zeichneStatistik === 'function') {
    zeichneStatistik();
  } else {
    console.warn("zeichneStatistik-Funktion nicht gefunden.");
  }

   // 👉 Monatsübersicht mit aktualisiertem Budget neu berechnen
  const heute = new Date();
  berechneMonatsuebersicht(heute.getFullYear(), heute.getMonth());

  // ✅ Tageseinträge aktualisieren, falls vorhanden
  if (typeof zeigeEintraegeProTag === 'function') {
    zeigeEintraegeProTag(datum);
  }

  // Formular zurücksetzen & Popup schließen
  document.getElementById('popup-form').reset();
  document.getElementById('popup-overlay').style.display = 'none';
});

// Auslagerung 1.3 Ende


// ============================== Kategorien sortieren Start ===========================
const sortierenPopupOverlay = document.getElementById("kategorie-sortieren-popup-overlay");
const openSortierenBtn = document.getElementById("open-kategorie-sortieren-popup");
const closeSortierenBtn = document.getElementById("kategorie-sortieren-popup-close");

let aktuelleSortierTyp = "einnahme";

// Popup öffnen
openSortierenBtn.addEventListener("click", () => {
  sortierenPopupOverlay.style.display = "flex";
  renderSortierGruppen();
});

// Popup schließen
closeSortierenBtn.addEventListener("click", () => {
  sortierenPopupOverlay.style.display = "none";
});

// Tab wechseln
document.getElementById("sort-tab-einnahme").addEventListener("click", () => {
  aktuelleSortierTyp = "einnahme";
  setTabActive("einnahme");
  renderSortierGruppen();
});

document.getElementById("sort-tab-ausgabe").addEventListener("click", () => {
  aktuelleSortierTyp = "ausgabe";
  setTabActive("ausgabe");
  renderSortierGruppen();
});

document.getElementById("sort-tab-investition").addEventListener("click", () => {
  aktuelleSortierTyp = "investition";
  setTabActive("investition");
  renderSortierGruppen();
});

function setTabActive(typ) {
  document.querySelectorAll(".sort-tab").forEach(tab => tab.classList.remove("active"));
  document.getElementById(`sort-tab-${typ}`).classList.add("active");
}

// Gruppenspeicher (nur temporär)
let gruppen = JSON.parse(localStorage.getItem("kategorieGruppen")) || {
  einnahme: [],
  ausgabe: [],
  investition: []  // <-- hinzufügen
};

gruppen.einnahme = gruppen.einnahme || [];
gruppen.ausgabe = gruppen.ausgabe || [];
gruppen.investition = gruppen.investition || [];


document.getElementById("add-group-btn").addEventListener("click", () => {
  gruppen[aktuelleSortierTyp].push({ name: "Neue Oberkategorie", items: [] });
  renderSortierGruppen();
});

// Sortiergruppen rendern
function renderSortierGruppen() {
  const container = document.getElementById("sortier-container");
  container.innerHTML = "";

  // Alle Einträge laden (Typ, Kategorie, Betrag, Datum)
  const eintraege = JSON.parse(localStorage.getItem("eintraege")) || [];

  // Kategorien aus localStorage laden (nur zum Ermitteln ungruppierter Kategorien)
  const gespeicherte = JSON.parse(localStorage.getItem("kategorien")) || { einnahme: [], ausgabe: [], investition: [] };

  // Noch nicht gruppierte Kategorien ermitteln
  const bereitsGruppiert = gruppen[aktuelleSortierTyp].flatMap(g => g.items);
  const nichtGruppiert = gespeicherte[aktuelleSortierTyp].filter(k => !bereitsGruppiert.includes(k));

  // Hilfsfunktion zum Betrag finden: Summe aller Einträge der Kategorie und des aktuellen Typs
  function findeBetrag(kategorieName) {
    return eintraege
      .filter(e => e.kategorie === kategorieName && e.typ === aktuelleSortierTyp)
      .reduce((summe, e) => summe + parseFloat(e.betrag), 0);
  }

  // Unsortiert-Gruppe
  const unsortiertGruppe = { name: "Nicht gruppiert", items: nichtGruppiert };
  const alleGruppen = [unsortiertGruppe, ...gruppen[aktuelleSortierTyp]];

  alleGruppen.forEach((gruppe, index) => {
    const div = document.createElement("div");
    div.className = "sortier-gruppe";
    div.dataset.gruppeIndex = index;

    // Header mit Titel + Löschen-Button (bei echten Gruppen)
    const header = document.createElement("div");
    header.style.position = "relative";
    header.style.marginBottom = "20px";
    header.style.height = "1.5em";

    const titel = document.createElement("h4");
    titel.style.position = "absolute";
    titel.style.left = "50%";
    titel.style.top = "50%";
    titel.style.transform = "translate(-50%, -50%)";
    titel.style.margin = "0";
    titel.style.userSelect = "text";
    titel.contentEditable = index > 0;
    titel.textContent = gruppe.name;
    header.appendChild(titel);

    if (index > 0) {
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "×";
      deleteBtn.title = "Gruppe löschen";
      deleteBtn.className = "gruppe-loeschen-btn";
      deleteBtn.style.position = "absolute";
      deleteBtn.style.top = "50%";
      deleteBtn.style.right = "0";
      deleteBtn.style.transform = "translateY(-50%)";
      deleteBtn.style.background = "transparent";
      deleteBtn.style.border = "none";
      deleteBtn.style.color = "#c00";
      deleteBtn.style.fontSize = "1.5rem";
      deleteBtn.style.cursor = "pointer";
      deleteBtn.style.userSelect = "none";

      deleteBtn.addEventListener("click", () => {
        gruppen[aktuelleSortierTyp].splice(index - 1, 1);
        localStorage.setItem("kategorieGruppen", JSON.stringify(gruppen));
        renderSortierGruppen();
      });

      header.appendChild(deleteBtn);
    }

    div.appendChild(header);

    // Gruppensumme berechnen mit der neuen Funktion
    const gruppenSumme = gruppe.items.reduce((summe, kategorieName) => {
      return summe + findeBetrag(kategorieName);
    }, 0);

    

    // Name speichern bei Verlassen des Feldes
    titel.addEventListener("blur", () => {
      const neuerName = titel.textContent.trim();
      if (index > 0 && neuerName && neuerName !== gruppe.name) {
        gruppen[aktuelleSortierTyp][index - 1].name = neuerName;
        localStorage.setItem("kategorieGruppen", JSON.stringify(gruppen));
        renderSortierGruppen();
      }
    });

    gruppe.items.forEach(item => {
      const el = document.createElement("div");
      el.className = "sortier-item";
      el.draggable = true;
      el.textContent = item;

      el.addEventListener("dragstart", e => {
        e.dataTransfer.setData("text/plain", item);
        e.dataTransfer.setData("from", index);
      });

      div.appendChild(el);
    });

    // Drag & Drop-Ziel
    div.addEventListener("dragover", e => e.preventDefault());
    div.addEventListener("drop", e => {
      const word = e.dataTransfer.getData("text/plain");
      const fromIndex = parseInt(e.dataTransfer.getData("from"));
      const toIndex = parseInt(div.dataset.gruppeIndex);

      if (fromIndex !== toIndex) {
        const fromGruppe = fromIndex === 0 ? unsortiertGruppe : gruppen[aktuelleSortierTyp][fromIndex - 1];
        const toGruppe = toIndex === 0 ? unsortiertGruppe : gruppen[aktuelleSortierTyp][toIndex - 1];

        const idx = fromGruppe.items.indexOf(word);
        if (idx > -1) {
          fromGruppe.items.splice(idx, 1);
          toGruppe.items.push(word);
          renderSortierGruppen();
        }
      }
    });

    container.appendChild(div);
  });

  localStorage.setItem("kategorieGruppen", JSON.stringify(gruppen));
}


const sortierOverlay = document.getElementById("kategorie-sortieren-popup-overlay");

// Schließen bei Klick auf Overlay
sortierOverlay.addEventListener("click", (e) => {
  if (e.target === sortierOverlay) {
    sortierOverlay.style.display = "none";
  }
});


// ===== =======Schalter für Sortiermodus
const sortierSchalter = document.getElementById("sortier-schalter");

// Initialzustand aus localStorage laden
const istSortierModus = localStorage.getItem("sortierModusAktiv") === "true";
sortierSchalter.checked = istSortierModus;

// Beim Umschalten speichern
sortierSchalter.addEventListener("change", () => {
  localStorage.setItem("sortierModusAktiv", sortierSchalter.checked);
});

// Globale Funktion, die du überall verwenden kannst
function istSortierModusAktiv() {
  return localStorage.getItem("sortierModusAktiv") === "true";
}




// ============================== Kategorien sortieren Ende ===========================



// --------------------------------- TAB SWITCHING ---
  // -------------------- ALLE TABS DEFINIEREN --------------------
const tabs = {
  kalender: {
    btn: document.getElementById("tab-kalender"),
    content: document.getElementById("tab-content-kalender"),
    onActivate: () => renderKalender()
  },
  statistik: {
    btn: document.getElementById("tab-statistik"),
    content: document.getElementById("tab-content-statistik"),
    onActivate: () => zeichneStatistik()
  },
  uebersicht: {
    btn: document.getElementById("tab-uebersicht"),
    content: document.getElementById("tab-content-uebersicht"),
    onActivate: () => zeichneMonatsuebersicht()  // falls das deine Wrapper-Funktion ist
  },
  notizen: {
    btn: document.getElementById("tab-notizen"),
    content: document.getElementById("tab-content-notizen"),
    onActivate: () => zeichneNotizen()
  }
};

// -------------------- AKTIVEN TAB WECHSELN --------------------
function activateTab(tabName) {
  Object.entries(tabs).forEach(([name, { btn, content }]) => {
    const isActive = name === tabName;
    btn.classList.toggle("active", isActive);
    content.classList.toggle("active", isActive);
  });

  // Tab-spezifische Funktion ausführen
  if (tabs[tabName].onActivate) {
    tabs[tabName].onActivate();
  }
}

// ------- Automatisch erster Tab auswählen (Kalender) -------
document.addEventListener("DOMContentLoaded", () => {
  activateTab("kalender");
});

// -------------------- EVENTLISTENER REGISTRIEREN --------------------
Object.keys(tabs).forEach(tabName => {
  tabs[tabName].btn.addEventListener("click", () => activateTab(tabName));
});


  // --- DATEN ---
  let eintraege = JSON.parse(localStorage.getItem("eintraege") || "[]");

  // Hilfsfunktion: Datum in YYYY-MM-DD String
  function formatDate(date) {
  const jahr = date.getFullYear();
  const monat = String(date.getMonth() + 1).padStart(2, '0');
  const tag = String(date.getDate()).padStart(2, '0');
  return `${jahr}-${monat}-${tag}`;
}


  // Aktueller angezeigter Monat
  let aktuellesDatum = new Date();
  aktuellesDatum.setDate(1);

  // Ausgewähltes Datum im Kalender (Standard: heute)
  let ausgewaehltesDatum = formatDate(new Date());


  //
  // DOM-Elemente
  const kalender = document.getElementById("kalender");
  const monatanzeige = document.getElementById("monatanzeige");
  const vorherigerMonatBtn = document.getElementById("vorherigerMonat");
  const naechsterMonatBtn = document.getElementById("naechsterMonat");
  const liste = document.getElementById("liste");
  const form = document.getElementById("form");
  const formTypInput = document.getElementById("typ");
  const betragInput = document.getElementById("betrag"); // main form
  const kategorieInput = document.getElementById("kategorie");
  const datumInput = document.getElementById("datum");

  // Monatsanzeige formatieren
  function zeigeMonat() {
    const options = { year: "numeric", month: "long" };
    monatanzeige.textContent = aktuellesDatum.toLocaleDateString("de-DE", options);
  }

  // Kalender rendern / Kalender generieren & darstellen
  function renderKalender() {
  kalender.innerHTML = "";
  zeigeMonat();

  const jahr = aktuellesDatum.getFullYear();
  const monat = aktuellesDatum.getMonth();
  const ersterWochentag = new Date(jahr, monat, 1).getDay();
  const startIndex = (ersterWochentag + 6) % 7;
  const tageImMonat = new Date(jahr, monat + 1, 0).getDate();
  const heuteStr = formatDate(new Date());

  // Leere Zellen vor Monatsbeginn
  for (let i = 0; i < startIndex; i++) {
    const leer = document.createElement("div");
    leer.className = "leer";
    kalender.appendChild(leer);
  }

  for (let tag = 1; tag <= tageImMonat; tag++) {
    const tagDatum = new Date(jahr, monat, tag);
    const tagDatumStr = formatDate(tagDatum);

    const tagDiv = document.createElement("div");
    tagDiv.className = "tag";

    // Markierungen
    if (tagDatumStr === heuteStr) tagDiv.classList.add("heute");
    if (tagDatumStr === ausgewaehltesDatum) tagDiv.classList.add("ausgewaehlt");

    // Datum
    const datumSpan = document.createElement("span");
    datumSpan.className = "datum";
    datumSpan.textContent = tag;
    tagDiv.appendChild(datumSpan);

    // Container für Saldo + Investition
    const saldoInvestWrapper = document.createElement("div");
    saldoInvestWrapper.className = "saldo-invest-wrapper";

    // Saldo
    const saldo = berechneSaldoFuerDatum(tagDatumStr);
    if (saldo !== 0) {
      const saldoSpan = document.createElement("div");
      saldoSpan.className = "saldo " + (saldo > 0 ? "positiv" : "negativ");
      saldoSpan.textContent = formatEuro(Math.abs(saldo));
      saldoInvestWrapper.appendChild(saldoSpan);
    }

    // Investition
    const investitionsSumme = berechneInvestitionenFuerDatum(tagDatumStr);
    if (investitionsSumme > 0) {
      const investitionSpan = document.createElement("div");
      investitionSpan.className = "investition-anzeige";
      investitionSpan.textContent = formatEuro(investitionsSumme);
      saldoInvestWrapper.appendChild(investitionSpan);
    }

    tagDiv.appendChild(saldoInvestWrapper);

    tagDiv.addEventListener("click", () => {
      ausgewaehltesDatum = tagDatumStr;
      renderKalender();
      renderListe();
      zeichneStatistik();
      datumInput.value = ausgewaehltesDatum;
      popupDatum.value = ausgewaehltesDatum;
    });

    kalender.appendChild(tagDiv);
  }

  // Leere Felder nach Monatsende
  const gesamtFelder = startIndex + tageImMonat;
  const restFelder = gesamtFelder % 7 === 0 ? 0 : 7 - (gesamtFelder % 7);
  for (let i = 0; i < restFelder; i++) {
    const leer = document.createElement("div");
    leer.className = "leer";
    kalender.appendChild(leer);
  }

  berechneMonatsuebersicht(jahr, monat);
  zeichneStatistik();
}


// Hilfsfunktion für Investitionen
function berechneInvestitionenFuerDatum(datumStr) {
  let summe = 0;

  // Normale Investitionen
  const eintraege = JSON.parse(localStorage.getItem("eintraege")) || [];
  eintraege.forEach(eintrag => {
    if (eintrag.datum === datumStr && eintrag.typ === "investition") {
      summe += parseFloat(eintrag.betrag);
    }
  });

  // Wiederkehrende Investitionen
  const wiederkehrendeEintraege = JSON.parse(localStorage.getItem("wiederkehrendeEintraege")) || [];
  const aktuellesDatum = new Date(datumStr);
  wiederkehrendeEintraege.forEach(wEintrag => {
    const startDatum = new Date(wEintrag.start);
    const endDatum = new Date(wEintrag.ende);
    if (
      wEintrag.typ === "investition" &&
      aktuellesDatum >= startDatum &&
      aktuellesDatum <= endDatum &&
      istIntervallFuerDatum(wEintrag.intervall, aktuellesDatum)
    ) {
      summe += parseFloat(wEintrag.betrag);
    }
  });

  return summe;
}


// Swipe-Funktionalität für Kalender Start
let touchStartX = 0;
let touchEndX = 0;

const kalenderElement = document.getElementById("kalender");

kalenderElement.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

kalenderElement.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeDist = touchEndX - touchStartX;
  
  if (Math.abs(swipeDist) < 50) return; // kleiner Swipe → ignorieren

  if (swipeDist < 0) {
    // Nach links gewischt → nächster Monat
    aktuellesDatum.setMonth(aktuellesDatum.getMonth() + 1);
  } else {
    // Nach rechts gewischt → vorheriger Monat
    aktuellesDatum.setMonth(aktuellesDatum.getMonth() - 1);
  }

  renderKalender();
}
// Swipe-Funktionalität für Kalender Ende


function berechneSaldoFuerDatum(datumStr) {
  let saldo = 0;

  // Normale Einträge laden
  let eintraege = JSON.parse(localStorage.getItem('eintraege')) || [];
  eintraege.forEach(eintrag => {
    if (eintrag.datum === datumStr) {
      if (eintrag.typ === 'einnahme') {
        saldo += parseFloat(eintrag.betrag);
      } else if (eintrag.typ === 'ausgabe') {
        saldo -= parseFloat(eintrag.betrag);
      }
      // 'investition' wird ignoriert
    }
  });

  // Wiederkehrende Einträge laden
  let wiederkehrendeEintraege = JSON.parse(localStorage.getItem('wiederkehrendeEintraege')) || [];
  const aktuellesDatum = new Date(datumStr);

  wiederkehrendeEintraege.forEach(wEintrag => {
    const startDatum = new Date(wEintrag.start);
    const endDatum = new Date(wEintrag.ende);
    if (aktuellesDatum >= startDatum && aktuellesDatum <= endDatum) {
      if (istIntervallFuerDatum(wEintrag.intervall, aktuellesDatum)) {
        if (wEintrag.typ === 'einnahme') {
          saldo += parseFloat(wEintrag.betrag);
        } else if (wEintrag.typ === 'ausgabe') {
          saldo -= parseFloat(wEintrag.betrag);
        }
        // 'investition' wird ignoriert
      }
    }
  });

  return saldo;
}


// Hilfsfunktion für Intervallprüfung
function istIntervallFuerDatum(intervall, datum) {
  switch (intervall) {
    case 'Monatsende':
      const letzterTag = new Date(datum.getFullYear(), datum.getMonth() + 1, 0).getDate();
      return datum.getDate() === letzterTag;

    case 'Jahresende':
      return datum.getDate() === 31 && datum.getMonth() === 11; // 31. Dezember

    case 'Wochenende':
      return datum.getDay() === 0; // Sonntag

    case 'Wochenanfang':
      return datum.getDay() === 1; // Montag

    case 'Monatsanfang':
      return datum.getDate() === 1;

    case 'Jahresanfang':
      return datum.getDate() === 1 && datum.getMonth() === 0; // 1. Januar

    default:
      return false;
  }
}



function ladeEintraege() {
  const gespeicherte = localStorage.getItem('eintraege');
  return gespeicherte ? JSON.parse(gespeicherte) : [];
}

function renderListe() {
  liste.innerHTML = "";

  // Normale Einträge laden und filtern
  const eintraege = ladeEintraege();
  const gefilterte = eintraege.filter(e => e.datum === ausgewaehltesDatum);

  // Wiederkehrende Einträge laden
  const wiederkehrendeEintraege = JSON.parse(localStorage.getItem('wiederkehrendeEintraege')) || [];

  // Datum als Date-Objekt für Prüfung
  const aktuellesDatum = new Date(ausgewaehltesDatum);

  // Wiederkehrende Einträge für diesen Tag filtern (intervall + start/ende prüfen)
  const gefilterteWiederkehrende = wiederkehrendeEintraege.filter(wEintrag => {
    const startDatum = new Date(wEintrag.start);
    const endDatum = new Date(wEintrag.ende);
    if (aktuellesDatum >= startDatum && aktuellesDatum <= endDatum) {
      return istIntervallFuerDatum(wEintrag.intervall, aktuellesDatum);
    }
    return false;
  });

  // Falls keine Einträge
  if (gefilterte.length === 0 && gefilterteWiederkehrende.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Keine Einträge für diesen Tag.";
    liste.appendChild(li);
    return;
  }

  const farben = {
    einnahme: "green",
    ausgabe: "red",
    investition: "#6f42c1"
  };

  const vorzeichenMap = {
    einnahme: "+ ",
    ausgabe: "- ",
    investition: "• "
  };

  // Normale Einträge rendern
  gefilterte.forEach((eintrag) => {
    const li = document.createElement("li");

    const inhaltDiv = document.createElement("div");
    inhaltDiv.className = "eintrag-zeile";

    const betragSpan = document.createElement("span");
    betragSpan.className = "betrag";

    const vorzeichen = vorzeichenMap[eintrag.typ] || "";
    const betragFormatted = formatNumber(parseFloat(eintrag.betrag), true);
    betragSpan.textContent = `${vorzeichen}${betragFormatted}`;
    betragSpan.style.color = farben[eintrag.typ] || "black";

    const kategorieSpan = document.createElement("span");
    kategorieSpan.className = "kategorie";
    kategorieSpan.textContent = eintrag.kategorie;
    kategorieSpan.style.color = betragSpan.style.color;

    inhaltDiv.appendChild(betragSpan);
    inhaltDiv.appendChild(kategorieSpan);

    const loeschBtn = document.createElement("button");
    loeschBtn.textContent = "X";
    loeschBtn.title = "Eintrag löschen";

    loeschBtn.addEventListener("click", () => {
      if (confirm("Möchten Sie diesen Eintrag wirklich löschen?")) {
        const alleEintraege = ladeEintraege();
        const indexOriginal = alleEintraege.findIndex(e =>
          e.typ === eintrag.typ &&
          e.betrag === eintrag.betrag &&
          e.kategorie === eintrag.kategorie &&
          e.datum === eintrag.datum
        );

        if (indexOriginal !== -1) {
          alleEintraege.splice(indexOriginal, 1);
          localStorage.setItem('eintraege', JSON.stringify(alleEintraege));
          berechneMonatsuebersicht(aktuellesDatum.getFullYear(), aktuellesDatum.getMonth());
          renderKalender();
          renderListe();
          zeichneStatistik();
        }
      }
    });

    li.appendChild(inhaltDiv);
    li.appendChild(loeschBtn);
    liste.appendChild(li);
  });



  // Wiederkehrende Einträge rendern (ohne Löschen-Button, da diese anders verwaltet werden)
  // Wiederkehrende Einträge rendern (ohne Löschen-Button)
// Wiederkehrende Einträge rendern (ohne Löschen-Button)


gefilterteWiederkehrende.forEach((eintrag) => {
  const li = document.createElement("li");

  const farbe = farben[eintrag.typ] || "black";
  const vorzeichen = vorzeichenMap[eintrag.typ] || "";

  // Betrag
  const betragSpan = document.createElement("span");
  betragSpan.textContent = `${vorzeichen}${parseFloat(eintrag.betrag).toFixed(2).replace(".", ",")} €`;
  betragSpan.className = "betrag";
  betragSpan.style.color = farbe;

  // Kategorie
  const kategorieSpan = document.createElement("span");
  kategorieSpan.textContent = eintrag.kategorie;
  kategorieSpan.className = "kategorie";
  kategorieSpan.style.color = farbe;

  // Container
  const zeile = document.createElement("div");
  zeile.className = "eintrag-zeile";
  zeile.appendChild(betragSpan);
  zeile.appendChild(kategorieSpan);

  li.appendChild(zeile);
  liste.appendChild(li);
});



}



  // Einträge in localStorage speichern
  function speichereEintraege() {
    localStorage.setItem("eintraege", JSON.stringify(eintraege));
  }
  berechneMonatsuebersicht(aktuellesDatum.getFullYear(), aktuellesDatum.getMonth());

  renderKalender();
renderListe(); // aktualisiert Liste sofort
zeichneStatistik();

  // Formular absenden: neuen Eintrag hinzufügen
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const typ = formTypInput.value;
    const betrag = parseFloat(betragInput.value.replace(",", "."));
    const kategorie = kategorieInput.value;
    const datum = datumInput.value;

    if (!datum) {
      alert("Bitte ein gültiges Datum eingeben.");
      return;
    }
    if (isNaN(betrag) || betrag <= 0) {
      alert("Bitte einen gültigen Betrag größer 0 eingeben.");
      return;
    }

    eintraege.push({ typ, betrag, kategorie, datum });
    speichereEintraege();
    berechneMonatsuebersicht(aktuellesDatum.getFullYear(), aktuellesDatum.getMonth());

    

    // Wenn Eintrag für aktuellen Monat/datum, Kalender + Liste updaten
    if (datum.startsWith(aktuellesDatum.getFullYear() + "-" + String(aktuellesDatum.getMonth() + 1).padStart(2, "0"))) {
      renderKalender();
    }

    if (datum === ausgewaehltesDatum) {
      renderListe();
    }

    if (datum === ausgewaehltesDatum) {
      zeichneStatistik();
    }

    // Formular zurücksetzen
    form.reset();

    // Datum im Formular auf aktuell ausgewähltes Datum setzen
    datumInput.value = ausgewaehltesDatum;
  });

  // Monatsnavigation
  vorherigerMonatBtn.addEventListener("click", () => {
    aktuellesDatum.setMonth(aktuellesDatum.getMonth() - 1);
    renderKalender();
    // Nach Monatswechsel ggf. ausgewähltes Datum anpassen:
    if (!ausgewaehltesDatum.startsWith(aktuellesDatum.getFullYear() + "-" + String(aktuellesDatum.getMonth() + 1).padStart(2, "0"))) {
      ausgewaehltesDatum = formatDate(aktuellesDatum);
      renderListe();
    }
  });
  naechsterMonatBtn.addEventListener("click", () => {
    aktuellesDatum.setMonth(aktuellesDatum.getMonth() + 1);
    renderKalender();
    if (!ausgewaehltesDatum.startsWith(aktuellesDatum.getFullYear() + "-" + String(aktuellesDatum.getMonth() + 1).padStart(2, "0"))) {
      ausgewaehltesDatum = formatDate(aktuellesDatum);
      renderListe();
    }
  });

  // Formular-Datum initial auf heute
  datumInput.value = ausgewaehltesDatum;

  



  // Initial rendern
  renderKalender();
  renderListe();
  zeichneStatistik();

  // Plus-Button & Popup

const plusButton = document.getElementById("plus-button");
const popupOverlay = document.getElementById("popup-overlay");
const popupClose = document.getElementById("popup-close");



// Popup schließen
popupClose.addEventListener("click", () => {
  popupOverlay.style.display = "none";
});



popupClose.addEventListener("click", () => {
  popupOverlay.style.display = "none";
});
  // Popup command ende (schließen, wenn außerhalb geklickt)

// --- POPUP-FORMULAR VERARBEITEN ---
const popupForm = document.getElementById("popup-form");
const popupTyp = document.getElementById("popup-typ");
const popupBetrag = document.getElementById("popup-betrag");
const popupKategorie = document.getElementById("popup-kategorie");
const popupDatum = document.getElementById("popup-datum");

popupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const typ = popupTyp.value;
  const betrag = parseFloat(popupBetrag.value.replace(",", "."));
  const kategorie = popupKategorie.value;
  const datum = popupDatum.value;

  if (!datum) {
    alert("Bitte ein gültiges Datum eingeben.");
    return;
  }
  if (isNaN(betrag) || betrag <= 0) {
    alert("Bitte einen gültigen Betrag größer 0 eingeben.");
    return;
  }

  eintraege.push({ typ, betrag, kategorie, datum });
  speichereEintraege();
  berechneMonatsuebersicht(aktuellesDatum.getFullYear(), aktuellesDatum.getMonth());

  if (datum.startsWith(aktuellesDatum.getFullYear() + "-" + String(aktuellesDatum.getMonth() + 1).padStart(2, "0"))) {
    renderKalender();
  }

  if (datum === ausgewaehltesDatum) {
    renderListe();
  }

  if (datum === ausgewaehltesDatum) {
    zeichneStatistik();
  }

  popupForm.reset();
  popupOverlay.style.display = "none";
});

// Popup schließen, wenn außerhalb geklickt
popupOverlay.addEventListener("click", (e) => {
  if (e.target === popupOverlay) {
    popupOverlay.style.display = "none";
  }
});
// --- fertig Plus-Button Popup ---
// --- fertig Popup ---


// --- Typ-Button-Auswahl (Einzahlung/Auszahlung) ---
const typButtons = document.querySelectorAll('.typ-btn');
const typInput = document.getElementById('popup-typ');

const einnahmeKategorien = ["Besoldung", "Eltern Zuschuss", "Zinsen TR"];
const ausgabeKategorien = ["Einkauf", "Transport", "Freizeit", "Büro", "Urlaub", "Gehalt", "Sonstiges"];

function aktualisiereKategorien(kategorien) {
  popupKategorie.innerHTML = '<option value="">-- Wählen --</option>';
  kategorien.forEach(kat => {
    const option = document.createElement("option");
    option.textContent = kat;
    option.value = kat;
    popupKategorie.appendChild(option);
  });
}

typButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Alle Buttons zurücksetzen
    typButtons.forEach(b => b.classList.remove('active'));

    // Aktiven Button hervorheben
    btn.classList.add('active');

    // Wert in verstecktem Input speichern
    const typ = btn.dataset.typ;
    typInput.value = typ;

    // Kategorie-Liste aktualisieren
    if (typ === "einnahme") {
      aktualisiereKategorien(einnahmeKategorien);
    } else {
      aktualisiereKategorien(ausgabeKategorien);
    }
  });
});

// Optional: Standard-Auswahl setzen, OHNE echten Klick (damit Popup geschlossen bleibt)
// ❌ Das überschreibt deine korrekte Standard-Auswahl wieder zurück auf "einnahme"
// if (typButtons.length > 0) {
//   typButtons.forEach(b => b.classList.remove('active'));
//   typButtons[0].classList.add('active');
//   popupTypInput.value = typButtons[0].dataset.typ;
//   aktualisiereKategorien(ausgabeKategorien);
// }
function berechneMonatsuebersicht(jahr, monat) {
  let einnahmenGesamt = 0;
  let ausgabenGesamt = 0;
  let ausgabenNurNormal = 0;

  const eintraege = JSON.parse(localStorage.getItem("eintraege")) || [];

  eintraege.forEach(eintrag => {
    const eintragsDatum = new Date(eintrag.datum);
    if (eintragsDatum.getFullYear() === jahr && eintragsDatum.getMonth() === monat) {
      if (eintrag.typ === "einnahme") {
        einnahmenGesamt += parseFloat(eintrag.betrag);
      } else if (eintrag.typ === "ausgabe") {
        ausgabenGesamt += parseFloat(eintrag.betrag);
        ausgabenNurNormal += parseFloat(eintrag.betrag); // Nur normale Ausgaben für Budget
      }
    }
  });

  const wiederkehrendeEintraege = JSON.parse(localStorage.getItem("wiederkehrendeEintraege")) || [];
  const tageImMonat = new Date(jahr, monat + 1, 0).getDate();

  for (let tag = 1; tag <= tageImMonat; tag++) {
    const datum = new Date(jahr, monat, tag);

    wiederkehrendeEintraege.forEach(wEintrag => {
      const startDatum = new Date(wEintrag.start);
      const endDatum = new Date(wEintrag.ende);

      if (datum >= startDatum && datum <= endDatum) {
        if (istIntervallFuerDatum(wEintrag.intervall, datum)) {
          const betrag = parseFloat(wEintrag.betrag);
          if (wEintrag.typ === "einnahme") {
            einnahmenGesamt += betrag;
          } else if (wEintrag.typ === "ausgabe") {
            ausgabenGesamt += betrag;
            // KEINE Hinzufügung zu ausgabenNurNormal!
          }
        }
      }
    });
  }

function formatEuro(value) {
  return value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

// Monatsspezifisches Budget aus localStorage holen
const budgetKey = `budget-${jahr}-${monat + 1}`;
const userBudgetText = localStorage.getItem(budgetKey);
const userBudget = parseFloat(userBudgetText) || 0;

const monatlichesBudget = userBudget - ausgabenNurNormal;

document.getElementById("monat-einnahmen").textContent = formatEuro(einnahmenGesamt);
document.getElementById("monat-ausgaben").textContent = formatEuro(ausgabenGesamt);
document.getElementById("monat-budget").textContent = formatEuro(monatlichesBudget);

const saldoElement = document.getElementById("monat-saldo");
if (saldoElement) {
  const saldo = einnahmenGesamt - ausgabenGesamt;
  saldoElement.textContent = formatEuro(saldo);
  saldoElement.classList.remove("positiv", "negativ");
  saldoElement.classList.add(saldo >= 0 ? "positiv" : "negativ");
}


  // Budget-Slider
  const heute = new Date();
  const aktuellerMonat = heute.getMonth();
  const aktuellesJahr = heute.getFullYear();

  const ausgabenProzent = userBudget > 0 ? (ausgabenNurNormal / userBudget) * 100 : 0;
  const fillElement = document.getElementById("budget-bar-fill");
  fillElement.style.width = Math.min(ausgabenProzent, 100) + "%";

  const zeitMarker = document.getElementById("budget-time-marker");

  if (monat === aktuellerMonat && jahr === aktuellesJahr) {
    const aktuellerTag = heute.getDate();
    const zeitFortschrittProzent = (aktuellerTag / tageImMonat) * 100;
    zeitMarker.style.left = `${Math.min(zeitFortschrittProzent, 100)}%`;

    if (ausgabenProzent <= zeitFortschrittProzent) {
      fillElement.style.backgroundColor = "#a8e6a1"; // hellgrün
    } else {
      fillElement.style.backgroundColor = "#f6a6a6"; // hellrot
    }
  } else {
    zeitMarker.style.left = `100%`;
    fillElement.style.backgroundColor = ausgabenProzent <= 100 ? "#a8e6a1" : "#f6a6a6";
  }
}


// Textanzeige aktualisieren wie viel % ausgegeben wurde vom Budget
// const textanzeige = document.getElementById("budget-stand-text");
// textanzeige.textContent = `${ausgaben.toFixed(2)} € von ${userBudget.toFixed(2)} € ausgegeben`;




// === Budget-Verwaltungs Popup Start ===

// == Monatsnavigation und Budgetanzeige ==
let aktuellesJahr = new Date().getFullYear();
let aktuellerMonat = new Date().getMonth(); // 0-basiert (0 = Januar)

const monatAnzeige = document.getElementById('monat-anzeige');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');

// DOM-Elemente
const budgetOverlay = document.getElementById('budget-popup-overlay');
const openBudgetBtn = document.getElementById('open-budget-popup');
const closeBudgetBtn = document.getElementById('budget-close');
const saveBudgetBtn = document.getElementById('save-budget');
const clearBudgetBtn = document.getElementById('clear-budget');
const budgetInput = document.getElementById('budget-input');

// Hilfsfunktionen
function formatMonat(jahr, monat) {
  return new Date(jahr, monat).toLocaleDateString("de-DE", { month: "long", year: "numeric" });
}

function getBudgetKey(jahr, monat) {
  return `budget-${jahr}-${monat + 1}`;
}

// Budget und Monatsdaten laden
function ladeBudgetUndWerte(jahr, monat) {
  const budgetKey = getBudgetKey(jahr, monat);
  const gespeichertesBudget = localStorage.getItem(budgetKey);
  budgetInput.value = gespeichertesBudget || '';
  monatAnzeige.textContent = formatMonat(jahr, monat);

  const wiederkehrendeEintraege = JSON.parse(localStorage.getItem("wiederkehrendeEintraege")) || [];
  const eintraege = JSON.parse(localStorage.getItem("eintraege")) || [];

  let wkEinnahmen = 0;
  let wkAusgaben = 0;
  let wkInvestitionen = 0;
  let zusatzEinnahmen = 0;
  let manuelleInvestitionen = 0;

  const tageImMonat = new Date(jahr, monat + 1, 0).getDate();

  // Wiederkehrende Einträge durchlaufen
  for (let tag = 1; tag <= tageImMonat; tag++) {
    const datum = new Date(jahr, monat, tag);
    wiederkehrendeEintraege.forEach(wEintrag => {
      const startDatum = new Date(wEintrag.start);
      const endDatum = new Date(wEintrag.ende);
      if (datum >= startDatum && datum <= endDatum && istIntervallFuerDatum(wEintrag.intervall, datum)) {
        const betrag = parseFloat(wEintrag.betrag);
        if (wEintrag.typ === "einnahme") {
          wkEinnahmen += betrag;
        } else if (wEintrag.typ === "ausgabe") {
          wkAusgaben += betrag;
        } else if (wEintrag.typ === "investition") {
          wkInvestitionen += betrag;
        }
      }
    });
  }

  // Manuelle Einträge durchlaufen
  eintraege.forEach(eintrag => {
    const eintragsDatum = new Date(eintrag.datum);
    if (eintragsDatum.getFullYear() === jahr && eintragsDatum.getMonth() === monat) {
      const betrag = parseFloat(eintrag.betrag);
      if (eintrag.typ === 'einnahme') {
        zusatzEinnahmen += betrag;
      } else if (eintrag.typ === 'investition') {
        manuelleInvestitionen += betrag;
      }
    }
  });

  const investitionen = wkInvestitionen + manuelleInvestitionen;
  const vorgeschlagen = (wkEinnahmen + zusatzEinnahmen) - (wkAusgaben + investitionen);

  // Werte im DOM anzeigen
  document.getElementById("wk-ausgaben").textContent = wkAusgaben.toFixed(2) + " €";
  document.getElementById("wk-einnahmen").textContent = wkEinnahmen.toFixed(2) + " €";
  document.getElementById("zusatz-einnahmen").textContent = zusatzEinnahmen.toFixed(2) + " €";
  document.getElementById("investition").textContent = investitionen.toFixed(2) + " €";
  document.getElementById("vorgeschlagenes-budget").textContent = vorgeschlagen.toFixed(2) + " €";
}

// Monat vor/zurück wechseln
prevMonthBtn.addEventListener('click', () => {
  aktuellerMonat--;
  if (aktuellerMonat < 0) {
    aktuellerMonat = 11;
    aktuellesJahr--;
  }
  ladeBudgetUndWerte(aktuellesJahr, aktuellerMonat);
});

nextMonthBtn.addEventListener('click', () => {
  aktuellerMonat++;
  if (aktuellerMonat > 11) {
    aktuellerMonat = 0;
    aktuellesJahr++;
  }
  ladeBudgetUndWerte(aktuellesJahr, aktuellerMonat);
});

// === Popup-Handling ===

// Öffnet das Budget-Popup
if (openBudgetBtn) {
  openBudgetBtn.addEventListener('click', () => {
    const heute = new Date();
    aktuellesJahr = heute.getFullYear();
    aktuellerMonat = heute.getMonth();
    ladeBudgetUndWerte(aktuellesJahr, aktuellerMonat);
    budgetOverlay.classList.remove('hidden');
  });
}

// Popup schließen
if (closeBudgetBtn) {
  closeBudgetBtn.addEventListener('click', () => {
    budgetOverlay.classList.add('hidden');
  });
}

// Popup durch Klick außerhalb schließen
budgetOverlay.addEventListener('click', (e) => {
  if (e.target === budgetOverlay) {
    budgetOverlay.classList.add('hidden');
  }
});

// Budget speichern
saveBudgetBtn.addEventListener('click', () => {
  const value = budgetInput.value.trim();
  if (value && !isNaN(value) && Number(value) > 0) {
    const key = getBudgetKey(aktuellesJahr, aktuellerMonat);
    localStorage.setItem(key, value);
    alert(`Budget für ${formatMonat(aktuellesJahr, aktuellerMonat)} gespeichert: ${value} €`);
    budgetOverlay.classList.add('hidden');
    berechneMonatsuebersicht(aktuellesJahr, aktuellerMonat);
  } else {
    alert('Bitte gib ein gültiges Budget ein.');
  }
});

// Budget löschen
if (clearBudgetBtn) {
  clearBudgetBtn.addEventListener('click', () => {
    const key = getBudgetKey(aktuellesJahr, aktuellerMonat);
    localStorage.removeItem(key);
    budgetInput.value = '';
    alert(`Budget für ${formatMonat(aktuellesJahr, aktuellerMonat)} wurde gelöscht.`);
    ladeBudgetUndWerte(aktuellesJahr, aktuellerMonat); // Anzeigen aktualisieren
  });
}

// Budget übernehmen Button
const uebernehmeBtn = document.getElementById('uebernehme-vorgeschlagenes-budget');

if (uebernehmeBtn) {
  uebernehmeBtn.addEventListener('click', () => {
    const vorgeschlagenText = document.getElementById("vorgeschlagenes-budget").textContent;
    const betrag = parseFloat(vorgeschlagenText.replace("€", "").replace(",", ".").trim());
    
    if (!isNaN(betrag)) {
      budgetInput.value = betrag.toFixed(2);
    } else {
      alert("Das vorgeschlagene Budget konnte nicht übernommen werden.");
    }
  });
}


// == Neuer Button für Sparen berücksichtigen ==
// Funktion, um die gespeicherten Sparsummen zu laden (alle drei addieren)
function getGesamtSparsumme() {
  const daten = JSON.parse(localStorage.getItem("sparquoten")) || {};
  const kurz = parseFloat(daten.kurzSumme) || 0;
  const mittel = parseFloat(daten.mittelSumme) || 0;
  const lang = parseFloat(daten.langSumme) || 0;
  return kurz + mittel + lang;
}

// Bestehenden Button EventListener bleibt erhalten:


// Neuer Button EventListener
const minusSparenBtn = document.getElementById('uebernehme-budget-minus-sparen');
if (minusSparenBtn) {
  minusSparenBtn.addEventListener('click', () => {
    const vorgeschlagenText = document.getElementById("vorgeschlagenes-budget").textContent;
    const vorgeschlagenesBudget = parseFloat(vorgeschlagenText.replace("€", "").replace(",", ".").trim());
    const gesamtSparsumme = getGesamtSparsumme();

    if (!isNaN(vorgeschlagenesBudget)) {
      const neuesBudget = vorgeschlagenesBudget - gesamtSparsumme;
      budgetInput.value = neuesBudget.toFixed(2);
    } else {
      alert("Das vorgeschlagene Budget konnte nicht übernommen werden.");
    }
  });
}





// =========== Budget-Verwaltungs Popup Ende

// Aktualisierungsbutton für Seite im Titel Start
document.getElementById('refresh-icon').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    location.reload();
  }
});
// Aktualisierungsbutton für Seite im Titel Ende


// Virtuelle Tastatur für mobile Geräte Start
// Virtuelle Tastatur für mobile Geräte Start
let activeInput = null;
let activeKeyboard = null;

function setupKeyboard(inputId, keyboardId) {
  const input = document.getElementById(inputId);
  const keyboard = document.getElementById(keyboardId);
  const vkButtons = keyboard.querySelectorAll(".vk-btn");

  input.addEventListener("click", () => {
    activeInput = input;
    activeKeyboard = keyboard;
    keyboard.style.display = "block";
  });

  vkButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      if (!activeInput) return;

      if (btn.id === "vk-ok") {
        activeKeyboard.style.display = "none";
        activeInput.blur();
        activeInput = null;
        activeKeyboard = null;
        return;
      }

      if (btn.id === "vk-backspace") {
        activeInput.value = activeInput.value.slice(0, -1);
        return;
      }

      if (btn.id === "vk-equal") {
        try {
          let expr = activeInput.value
            .replace(/×/g, "*")
            .replace(/÷/g, "/")
            .replace(/,/g, ".");

          let result = Function(`"use strict"; return (${expr})`)();

          if (typeof result === "number" && !isNaN(result)) {
            activeInput.value = result.toFixed(2).replace(".", ",");
          }
        } catch (e) {
          alert("Ungültiger Ausdruck");
        }
        return;
      }

      activeInput.value += btn.textContent;
    });
  });

  // Schließen, wenn außerhalb geklickt
  document.addEventListener("click", (e) => {
    if (activeKeyboard && !activeKeyboard.contains(e.target) && e.target !== activeInput) {
      activeKeyboard.style.display = "none";
      activeInput = null;
      activeKeyboard = null;
    }
  });
}

// Setup für altes Popup
setupKeyboard("popup-betrag", "virtual-keyboard");
// Setup für neues Popup
setupKeyboard("wiederkehrende-betrag", "vk-wiederkehrende");

// Virtuelle Tastatur für mobile Geräte Ende

// Virtuelle Tastatur für mobile Geräte Ende


// ========================= Wiederkehrende Zahlungen Popup Start =========================
document.addEventListener("DOMContentLoaded", () => {
  const popupOverlay = document.getElementById("wiederkehrende-popup-overlay");
  const openBtn = document.getElementById("open-wiederkehrende-popup");
  const closeBtn = document.getElementById("wiederkehrende-close");
  const form = document.getElementById("wiederkehrende-form");
  const liste = document.getElementById("wiederkehrende-liste");
  const eintraegeOverlay = document.getElementById("eintraege-popup-overlay");
  const showEintraegeBtn = document.getElementById("show-eintraege-btn");
  const eintraegeCloseBtn = document.getElementById("eintraege-close");

  const typButtons = document.querySelectorAll(".typ-btn");
  const typInput = document.getElementById("wiederkehrende-typ");

  const wiederkehrendeInput = document.getElementById("wiederkehrende-betrag");
  const kategorieSelect = document.getElementById("wiederkehrende-kategorie");

  let eintraege = [];
  let bearbeiteIndex = null;

  

  // Hilfsfunktion für Dropdown
  function updateKategorieDropdown(selectId, typ) {
  const select = document.getElementById(selectId);
  select.innerHTML = '';

  const gespeicherte = JSON.parse(localStorage.getItem("kategorien")) || {
    einnahme: [],
    ausgabe: [],
    investition: []
  };

  const kategorieListe = gespeicherte[typ] || [];

  if (kategorieListe.length === 0) {
    const option = document.createElement('option');
    option.text = 'Keine Kategorien verfügbar';
    option.disabled = true;
    option.selected = true;
    select.add(option);
    return;
  }

  const defaultOption = document.createElement('option');
  defaultOption.text = 'Bitte wählen';
  defaultOption.disabled = true;
  defaultOption.selected = true;
  select.add(defaultOption);

  kategorieListe.forEach(word => {
    const option = document.createElement('option');
    option.text = word;
    select.add(option);
  });
}



  // Daten aus localStorage laden
  const gespeicherte = localStorage.getItem("wiederkehrendeEintraege");
  if (gespeicherte) {
    eintraege = JSON.parse(gespeicherte);
    renderEintraege();
  }

  // Typ Buttons EventListener
  typButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const typ = btn.dataset.typ;
      typInput.value = typ;

      typButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      updateKategorieDropdown("wiederkehrende-kategorie", typ);
    });
  });

  openBtn?.addEventListener("click", () => {
    popupOverlay.classList.remove("hidden");
    resetForm();

    // Standard-Typ setzen
    const defaultTyp = "einnahme";
    typInput.value = defaultTyp;

    typButtons.forEach(b => {
      b.classList.toggle("active", b.dataset.typ === defaultTyp);
    });

    updateKategorieDropdown("wiederkehrende-kategorie", defaultTyp);
  });

  closeBtn.addEventListener("click", () => {
    popupOverlay.classList.add("hidden");
    resetForm();
  });

  popupOverlay.addEventListener("click", (event) => {
    if (!event.target.closest(".popup")) {
      popupOverlay.classList.add("hidden");
      resetForm();
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const typ = typInput.value;
    const betrag = wiederkehrendeInput.value;
    const intervall = document.getElementById("wiederkehrende-intervall").value;
    const start = document.getElementById("wiederkehrende-start").value;
    const ende = document.getElementById("wiederkehrende-ende").value;
    const kategorie = kategorieSelect.value;

    if (!typ) {
      alert("Bitte Typ auswählen!");
      return;
    }
    if (!betrag) {
      alert("Bitte Betrag eingeben!");
      return;
    }
    if (!kategorie) {
      alert("Bitte Kategorie eingeben!");
      return;
    }

    const eintrag = { typ, betrag, intervall, start, ende, kategorie };

    if (bearbeiteIndex !== null) {
      eintraege[bearbeiteIndex] = eintrag;
      bearbeiteIndex = null;
    } else {
      eintraege.push(eintrag);
    }

    speichereEintraege();
    renderEintraege();
    resetForm();
  });

  function resetForm() {
    form.reset();
    typButtons.forEach(b => b.classList.remove("active"));
    typInput.value = "";
    kategorieSelect.innerHTML = '<option disabled selected>Kategorie wählen</option>';
    bearbeiteIndex = null;
  }

  function speichereEintraege() {
    localStorage.setItem("wiederkehrendeEintraege", JSON.stringify(eintraege));
  }

  function renderEintraege() {
    liste.innerHTML = "";
    eintraege.forEach((eintrag, index) => {
      const li = document.createElement("li");
      li.textContent = `${eintrag.typ}: ${eintrag.betrag} €, ${eintrag.kategorie}, ${eintrag.intervall}, von ${eintrag.start} bis ${eintrag.ende}`;
      liste.appendChild(li);
    });
  }





// Übersicht wiederkehrende Zahlungen
function renderEintraege() {
  liste.innerHTML = "";

  eintraege.forEach((eintrag, index) => {
  const li = document.createElement("li");

  // Farbzuweisung nach Typ
  if (eintrag.typ === "einnahme") {
    li.style.backgroundColor = "#d4f7d4"; // grün
  } else if (eintrag.typ === "ausgabe") {
    li.style.backgroundColor = "#f7d4d4"; // rot
  } else if (eintrag.typ === "investition") {
    li.style.backgroundColor = "#e6d4f7"; // lila
  }

  li.style.borderRadius = "6px";
  li.style.marginBottom = "8px";
  li.style.padding = "10px 15px";
  li.style.display = "flex";
  li.style.justifyContent = "space-between";
  li.style.alignItems = "center";

  // Linke Seite: Text in Grid mit 2 Spalten
  const container = document.createElement("div");
  container.style.display = "grid";
  container.style.gridTemplateColumns = "120px auto";
  container.style.rowGap = "6px";
  container.style.columnGap = "12px";

  function addRow(label, wert) {
    const labelDiv = document.createElement("div");
    labelDiv.textContent = label;
    labelDiv.style.fontWeight = "bold";
    labelDiv.style.textAlign = "left";

    const wertDiv = document.createElement("div");
    wertDiv.textContent = wert;
    wertDiv.style.textAlign = "left";

    container.appendChild(labelDiv);
    container.appendChild(wertDiv);
  }

  addRow("Kategorie:", eintrag.kategorie);
  addRow("Betrag:", parseFloat(eintrag.betrag).toFixed(2).replace(".", ",") + " €");
  addRow("Intervall:", eintrag.intervall);
  addRow("Zeitraum:", `${eintrag.start} bis ${eintrag.ende}`);

  // Rechte Seite: Buttons
  const buttonsDiv = document.createElement("div");
  buttonsDiv.style.display = "flex";
  buttonsDiv.style.flexDirection = "column";
  buttonsDiv.style.gap = "6px";

  const editBtn = document.createElement("button");
  editBtn.textContent = "✏️";
  editBtn.title = "Bearbeiten";
  editBtn.style.width = "32px";
  editBtn.style.height = "32px";
  editBtn.style.cursor = "pointer";
  editBtn.style.marginRight = "7px";
  editBtn.addEventListener("click", () => {
    ladeEintragZurBearbeitung(index);
    document.getElementById("eintraege-popup-overlay").classList.add("hidden");
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️";
  deleteBtn.title = "Löschen";
  deleteBtn.style.width = "32px";
  deleteBtn.style.height = "32px";
  deleteBtn.style.cursor = "pointer";
  deleteBtn.style.marginRight = "7px";
  deleteBtn.addEventListener("click", () => {
    eintraege.splice(index, 1);
    speichereEintraege();
    renderEintraege();
  });

  buttonsDiv.appendChild(editBtn);
  buttonsDiv.appendChild(deleteBtn);

  li.appendChild(container);
  li.appendChild(buttonsDiv);

  liste.appendChild(li);
});

}





  function ladeEintragZurBearbeitung(index) {
  const eintrag = eintraege[index];
  typInput.value = eintrag.typ;

  typButtons.forEach(b => {
    if (b.dataset.typ === eintrag.typ) {
      b.classList.add("active");
    } else {
      b.classList.remove("active");
    }
  });

  wiederkehrendeInput.value = eintrag.betrag;
  document.getElementById("wiederkehrende-intervall").value = eintrag.intervall;
  document.getElementById("wiederkehrende-start").value = eintrag.start;
  document.getElementById("wiederkehrende-ende").value = eintrag.ende;
  document.getElementById("wiederkehrende-kategorie").value = eintrag.kategorie || "";

  bearbeiteIndex = index;
}


  function resetForm() {
    form.reset();
    bearbeiteIndex = null;
    typInput.value = "";
    typButtons.forEach(b => b.classList.remove("active"));
    wiederkehrendeInput.value = "";
  }

  function speichereEintraege() {
    localStorage.setItem("wiederkehrendeEintraege", JSON.stringify(eintraege));
  }

// Button zum Öffnen der gespeicherten Einträge Popup
  showEintraegeBtn.addEventListener("click", () => {
    eintraegeOverlay.classList.remove("hidden");
  });

  // Schließen-Button im Einträge-Popup
  eintraegeCloseBtn.addEventListener("click", () => {
    eintraegeOverlay.classList.add("hidden");
  });

  // Popup schließen, wenn außerhalb geklickt wird - für gespeicherte Einträge Popup
  eintraegeOverlay.addEventListener("click", (event) => {
    if (!event.target.closest(".popup")) {
      eintraegeOverlay.classList.add("hidden");
    }
  });

  // Popup schließen, wenn außerhalb geklickt wird - für Haupt-Popup
  popupOverlay.addEventListener("click", (event) => {
    if (!event.target.closest(".popup")) {
      popupOverlay.classList.add("hidden");
      resetForm();
    }
  });

  // Virtuelle Tastatur-Logik (falls du noch brauchst)
  wiederkehrendeInput.addEventListener("click", () => {
    // Setze activeInput etc., zeige Tastatur
    vk.style.display = "block";
  });
});



// ========================= Wiederkehrende Zahlungen Popup Ende =========================






// ========================= Statistik-Tab Start =========================

// ------------------ Monats / Jahresauswahl für Statistik Start
const statistikAnzeige = document.getElementById('zeitraum-anzeige');
const statistikZurueck = document.getElementById('zeitraum-zurueck');
const statistikVor = document.getElementById('zeitraum-vor');

const statEinnahmen = document.getElementById('stat-einnahmen');
const statAusgaben = document.getElementById('stat-ausgaben');
const statBudget = document.getElementById('stat-budget');

let statistikDatum = new Date(); // Nur für Statistik-Tab
let statistikModus = 'monat';    // 'woche', 'monat', 'jahr'

// Button-Auswahl (statt Select)
const zeitraumButtons = document.querySelectorAll('.zeitraum-button');

zeitraumButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Visuelle Hervorhebung
    zeitraumButtons.forEach(b => b.classList.remove('active'));
    button.classList.add('active');

    // Modus setzen und Statistik aktualisieren
    statistikModus = button.dataset.modus;
    aktualisiereStatistik();
  });
});

// Datumstext aktualisieren
function updateStatistikAnzeige() {
  if (statistikModus === 'jahr') {
    statistikAnzeige.textContent = statistikDatum.getFullYear();
  } else if (statistikModus === 'monat') {
    statistikAnzeige.textContent = statistikDatum.toLocaleString('de-DE', {
      month: 'long', year: 'numeric'
    });
  } else if (statistikModus === 'woche') {
    const start = new Date(statistikDatum);
    const end = new Date(statistikDatum);
    start.setDate(start.getDate() - start.getDay() + 1); // Montag
    end.setDate(start.getDate() + 6); // Sonntag
    statistikAnzeige.textContent = `${start.toLocaleDateString('de-DE')} – ${end.toLocaleDateString('de-DE')}`;
  }
}

// Hauptfunktion zum Aktualisieren
function aktualisiereStatistik() {
  updateStatistikAnzeige();
  const eintraege = ladeStatistikDaten(statistikModus, statistikDatum);
  const werte = berechneStatistik(eintraege);

  // Anzeige aktualisieren
  statEinnahmen.textContent = `${werte.einnahmen.toFixed(2)} €`;
  statAusgaben.textContent = `${werte.ausgaben.toFixed(2)} €`;
  statBudget.textContent = `${werte.budget.toFixed(2)} €`;

  ladeStatistikGraph();
}




// Navigation rückwärts
statistikZurueck.addEventListener('click', () => {
  if (statistikModus === 'jahr') {
    statistikDatum.setFullYear(statistikDatum.getFullYear() - 1);
  } else if (statistikModus === 'monat') {
    statistikDatum.setMonth(statistikDatum.getMonth() - 1);
  } else if (statistikModus === 'woche') {
    statistikDatum.setDate(statistikDatum.getDate() - 7);
  }
  aktualisiereStatistik();
});

// Navigation vorwärts
statistikVor.addEventListener('click', () => {
  if (statistikModus === 'jahr') {
    statistikDatum.setFullYear(statistikDatum.getFullYear() + 1);
  } else if (statistikModus === 'monat') {
    statistikDatum.setMonth(statistikDatum.getMonth() + 1);
  } else if (statistikModus === 'woche') {
    statistikDatum.setDate(statistikDatum.getDate() + 7);
  }
  aktualisiereStatistik();
});

aktualisiereStatistik(); // Initialer Aufruf

// ------------------ Monats / Jahresauswahl für Statistik Ende

// ------------------ Funktion für Laden der Daten je nach Sliderauswahl Start


function ladeStatistikGraph() {
  const daten = ladeDatenNachZeitraum(statistikDatum, statistikModus); // Zeitraum beachten
  const gruppenData = JSON.parse(localStorage.getItem("kategorieGruppen")) || { einnahme: [], ausgabe: [] };

  switch (aktiverChartIndex) {
    case 0:
      const gruppenSummen = getGruppenSummenAusEinnahmen(daten.einnahmen, gruppenData);
      renderEinnahmenGraph(gruppenSummen);
      break;
    case 1:
      // renderBudgetGraph(...) später hinzufügen
      break;
    case 2:
      // renderAusgabenGraph(...) später hinzufügen
      break;
  }
}

updateStatistikAnzeige();
ladeStatistikGraph(); // neu

// ------------------ Funktion für Laden der Daten je nach Sliderauswahl Ende











// Beispiel für ladeStatistikGraph mit Aufruf renderEinnahmenGraph


// Event-Listener für Zeitraum-Buttons
document.querySelectorAll('.zeitraum-button').forEach(btn => {
  btn.addEventListener('click', () => {
    statistikModus = btn.getAttribute('data-modus');

    document.querySelectorAll('.zeitraum-button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    updateStatistikAnzeige();
    ladeStatistikGraph();
  });
});

// Update-Zeitanzeige (monatlich, wöchentlich, jährlich)
function updateStatistikAnzeige() {
  const anzeige = document.getElementById('zeitraum-anzeige');

  if (statistikModus === 'jahr') {
    anzeige.textContent = statistikDatum.getFullYear();
  } else if (statistikModus === 'monat') {
    anzeige.textContent = statistikDatum.toLocaleString('de-DE', { month: 'long', year: 'numeric' });
  } else if (statistikModus === 'woche') {
    const start = new Date(statistikDatum);
    start.setDate(start.getDate() - start.getDay() + 1);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    anzeige.textContent = `${start.toLocaleDateString('de-DE')} – ${end.toLocaleDateString('de-DE')}`;
  }
}

// Navigation Buttons (Zurück / Vor)
document.getElementById('zeitraum-zurueck').addEventListener('click', () => {
  if (statistikModus === 'jahr') {
    statistikDatum.setFullYear(statistikDatum.getFullYear() - 1);
  } else if (statistikModus === 'monat') {
    statistikDatum.setMonth(statistikDatum.getMonth() - 1);
  } else if (statistikModus === 'woche') {
    statistikDatum.setDate(statistikDatum.getDate() - 7);
  }
  updateStatistikAnzeige();
  ladeStatistikGraph();
});
document.getElementById('zeitraum-vor').addEventListener('click', () => {
  if (statistikModus === 'jahr') {
    statistikDatum.setFullYear(statistikDatum.getFullYear() + 1);
  } else if (statistikModus === 'monat') {
    statistikDatum.setMonth(statistikDatum.getMonth() + 1);
  } else if (statistikModus === 'woche') {
    statistikDatum.setDate(statistikDatum.getDate() + 7);
  }
  updateStatistikAnzeige();
  ladeStatistikGraph();
});

// Initial
updateStatistikAnzeige();
ladeStatistikGraph();


// Statistik 1

// STATISTIK: Balkendiagramm mit Canvas
  function zeichneStatistik() {
  const canvas = document.getElementById("chart");
  const ctx = canvas.getContext("2d");

  // Einträge & Gruppen aus localStorage laden
  const eintraege = JSON.parse(localStorage.getItem("eintraege")) || [];
  const gruppen = JSON.parse(localStorage.getItem("kategorieGruppen")) || { einnahme: [], ausgabe: [] };
  const aktuelleTyp = "einnahme"; // oder "ausgabe", je nach Tab

  const gruppenListe = gruppen[aktuelleTyp];

  // Gruppen-Daten berechnen: Summe aller Einträge in den Gruppenkategorien
  const gruppenMitSummen = gruppenListe.map(gruppe => {
    const summe = gruppe.items.reduce((acc, kategorieName) => {
      const kategorieSumme = eintraege
        .filter(e => e.kategorie === kategorieName && e.typ === aktuelleTyp)
        .reduce((sum, e) => sum + parseFloat(e.betrag), 0);
      return acc + kategorieSumme;
    }, 0);
    return { name: gruppe.name, summe };
  }).filter(gr => gr.summe > 0);

  // Falls keine Daten vorhanden
  if (gruppenMitSummen.length === 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "16px Arial";
    ctx.fillText("Keine Daten vorhanden", 10, 50);
    return;
  }

  // Gesamtsumme berechnen
  const gesamt = gruppenMitSummen.reduce((sum, g) => sum + g.summe, 0);

  // Farben
  const farben = ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];

  // Kreis-Parameter
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = Math.min(canvas.width, canvas.height) / 2 - 50;

  let startWinkel = 0;
  gruppenMitSummen.forEach((gruppe, i) => {
    const anteil = gruppe.summe / gesamt;
    const endWinkel = startWinkel + anteil * 2 * Math.PI;

    // Segment zeichnen
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startWinkel, endWinkel);
    ctx.closePath();
    ctx.fillStyle = farben[i % farben.length];
    ctx.fill();

    // Beschriftung
    const mittelWinkel = (startWinkel + endWinkel) / 2;
    const textX = cx + Math.cos(mittelWinkel) * (radius + 20);
    const textY = cy + Math.sin(mittelWinkel) * (radius + 20);
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(gruppe.name, textX, textY);

    startWinkel = endWinkel;
  });
}



document.querySelectorAll(".zeitraum-button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".zeitraum-button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    aktuellerModus = btn.dataset.modus;
    aktuellerZeitIndex = 0;  // Reset bei Moduswechsel
    aktualisiereZeitraumAnzeige();
    ladeStatistikGraph();
    berechneUndZeigeUeberschuss(zeitraumStart, zeitraumEnde);

  });
});

document.getElementById("zeitraum-zurueck").addEventListener("click", () => {
  aktuellerZeitIndex--;
  aktualisiereZeitraumAnzeige();
  ladeStatistikGraph();
  berechneUndZeigeUeberschuss(zeitraumStart, zeitraumEnde);

});

document.getElementById("zeitraum-vor").addEventListener("click", () => {
  aktuellerZeitIndex++;
  aktualisiereZeitraumAnzeige();
  ladeStatistikGraph();
  berechneUndZeigeUeberschuss(zeitraumStart, zeitraumEnde);

});




// ========================= Statistik-Tab Ende =========================

// ========================= Übersicht-Tab Start =========================



// ========================= Übersicht-Tab Ende =========================

// ========================= Sparer-Verwaltung Start =========================
document.getElementById("open-sparer-popup").addEventListener("click", function() {
  document.getElementById("sparen-popup-overlay").style.display = "block";
});

document.getElementById("sparen-popup-close").addEventListener("click", function() {
  document.getElementById("sparen-popup-overlay").style.display = "none";
});

document.getElementById("sparen-speichern").addEventListener("click", function() {
  const kurzSumme = document.getElementById("kurz-summe").value;
  const kurzQuote = document.getElementById("kurz-quote").value;
  const mittelSumme = document.getElementById("mittel-summe").value;
  const mittelQuote = document.getElementById("mittel-quote").value;
  const langSumme = document.getElementById("lang-summe").value;
  const langQuote = document.getElementById("lang-quote").value;

  // Beispiel-Logging – hier kannst du deine eigene Speicherlogik einbauen
  console.log("Kurzfristig:", kurzSumme, "€ oder", kurzQuote, "%");
  console.log("Mittelfristig:", mittelSumme, "€ oder", mittelQuote, "%");
  console.log("Langfristig:", langSumme, "€ oder", langQuote, "%");

  alert("Sparquoten gespeichert!");

  document.getElementById("sparen-popup-overlay").style.display = "none";
});

// ========================= Sparer-Verwaltung Ende =========================

