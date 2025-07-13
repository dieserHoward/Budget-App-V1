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
    ausgabe: []
  };

  const typ = typAuswahl.value;
  gespeicherte[typ].forEach((wort, index) => {
    const li = document.createElement("li");
    li.textContent = wort;

    const loeschBtn = document.createElement("button");
    loeschBtn.textContent = "×";
    loeschBtn.style.marginLeft = "10px";
    loeschBtn.style.color = "#c00";
    loeschBtn.style.cursor = "pointer";
    loeschBtn.style.background = "none";
    loeschBtn.style.border = "none";
    loeschBtn.addEventListener("click", () => {
      gespeicherte[typ].splice(index, 1);
      localStorage.setItem("kategorien", JSON.stringify(gespeicherte));
      renderKategorien();
    });

    li.appendChild(loeschBtn);
    kategorieListe.appendChild(li);
  });
}

addWordBtn.addEventListener("click", () => {
  const wort = wordInput.value.trim();
  const typ = typAuswahl.value;

  if (!wort) return;

  const gespeicherte = JSON.parse(localStorage.getItem("kategorien")) || {
    einnahme: [],
    ausgabe: []
  };

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

function setTabActive(typ) {
  document.querySelectorAll(".sort-tab").forEach(tab => tab.classList.remove("active"));
  document.getElementById(`sort-tab-${typ}`).classList.add("active");
}

// Gruppenspeicher (nur temporär)
let gruppen = JSON.parse(localStorage.getItem("kategorieGruppen")) || {
  einnahme: [],
  ausgabe: []
};

document.getElementById("add-group-btn").addEventListener("click", () => {
  gruppen[aktuelleSortierTyp].push({ name: "Neue Oberkategorie", items: [] });
  renderSortierGruppen();
});

// Sortiergruppen rendern
function renderSortierGruppen() {
  const container = document.getElementById("sortier-container");
  container.innerHTML = "";

  const gespeicherte = JSON.parse(localStorage.getItem("kategorien")) || { einnahme: [], ausgabe: [] };

  // Noch nicht gruppierte Kategorien ermitteln
  const bereitsGruppiert = gruppen[aktuelleSortierTyp].flatMap(g => g.items);
  const nichtGruppiert = gespeicherte[aktuelleSortierTyp].filter(k => !bereitsGruppiert.includes(k));

  // Unsortiert-Gruppe
  const unsortiertGruppe = { name: "Nicht gruppiert", items: nichtGruppiert };
  const alleGruppen = [unsortiertGruppe, ...gruppen[aktuelleSortierTyp]];

  alleGruppen.forEach((gruppe, index) => {
    const div = document.createElement("div");
    div.className = "sortier-gruppe";
    div.dataset.gruppeIndex = index;

    // Header mit Titel + Löschen-Button (bei echten Gruppen)
    // Header mit Titel + Löschen-Button (bei echten Gruppen)
const header = document.createElement("div");
header.style.position = "relative";
header.style.marginBottom = "20px";
header.style.height = "1.5em"; // fixiere Höhe für vertikale Ausrichtung

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


// ============================== Kategorien sortieren Ende ===========================



// --------------------------------- TAB SWITCHING ---
  const tabKalenderBtn = document.getElementById("tab-kalender");
  const tabStatistikBtn = document.getElementById("tab-statistik");
  const tabKalenderContent = document.getElementById("tab-content-kalender");
  const tabStatistikContent = document.getElementById("tab-content-statistik");

  tabKalenderBtn.addEventListener("click", () => {
    tabKalenderBtn.classList.add("active");
    tabStatistikBtn.classList.remove("active");
    tabKalenderContent.classList.add("active");
    tabStatistikContent.classList.remove("active");
  });
  tabStatistikBtn.addEventListener("click", () => {
    tabKalenderBtn.classList.remove("active");
    tabStatistikBtn.classList.add("active");
    tabKalenderContent.classList.remove("active");
    tabStatistikContent.classList.add("active");
    zeichneStatistik();
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

    // Innerer Aufbau: Datum + flex-container mit Saldo
    const datumSpan = document.createElement("span");
    datumSpan.className = "datum";
    datumSpan.textContent = tag;
    tagDiv.appendChild(datumSpan);

    // Flex-Container für Saldo zentriert
    const saldoContainer = document.createElement("div");
    saldoContainer.className = "saldo-container";

    const saldo = berechneSaldoFuerDatum(tagDatumStr);
    if (saldo !== 0) {
      const saldoSpan = document.createElement("span");
      saldoSpan.className = "saldo " + (saldo > 0 ? "positiv" : "negativ");
      saldoSpan.textContent = Math.abs(saldo).toFixed(2).replace(".", ",");
      saldoContainer.appendChild(saldoSpan);
    }

    tagDiv.appendChild(saldoContainer);

    tagDiv.addEventListener("click", () => {
      ausgewaehltesDatum = tagDatumStr;
      renderKalender();
      renderListe();
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


  // Saldo für Datum (Einnahmen - Ausgaben)
  function berechneSaldoFuerDatum(datumStr) {
  let saldo = 0;

  // Normale Einträge laden
  let eintraege = JSON.parse(localStorage.getItem('eintraege')) || [];
  eintraege.forEach(eintrag => {
    if(eintrag.datum === datumStr) {
      saldo += (eintrag.typ === 'einnahme' ? 1 : -1) * parseFloat(eintrag.betrag);
    }
  });

  // Wiederkehrende Einträge laden
  let wiederkehrendeEintraege = JSON.parse(localStorage.getItem('wiederkehrendeEintraege')) || [];
  
  const aktuellesDatum = new Date(datumStr);

  wiederkehrendeEintraege.forEach(wEintrag => {
    const startDatum = new Date(wEintrag.start);
    const endDatum = new Date(wEintrag.ende);
    if(aktuellesDatum >= startDatum && aktuellesDatum <= endDatum) {
      // Prüfe Intervall
      if (istIntervallFuerDatum(wEintrag.intervall, aktuellesDatum)) {
        saldo += (wEintrag.typ === 'einnahme' ? 1 : -1) * parseFloat(wEintrag.betrag);
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
      // Hilfsfunktion aus vorherigem Beispiel (istIntervallFuerDatum)
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

  // Normale Einträge rendern (wie bisher)
  gefilterte.forEach((eintrag) => {
  const li = document.createElement("li");

  const inhaltDiv = document.createElement("div");
  inhaltDiv.className = "eintrag-zeile";

  const betragSpan = document.createElement("span");
  betragSpan.className = "betrag";
  betragSpan.textContent = `${eintrag.typ === "einnahme" ? "+ " : "- "}${parseFloat(eintrag.betrag).toFixed(2).replace(".", ",")} €`;
  betragSpan.style.color = eintrag.typ === "einnahme" ? "green" : "red";

  const kategorieSpan = document.createElement("span");
  kategorieSpan.className = "kategorie";
  kategorieSpan.textContent = eintrag.kategorie;
  kategorieSpan.style.color = betragSpan.style.color; // gleiche Farbe übernehmen

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
      }
    }
  });

  li.appendChild(inhaltDiv);
  li.appendChild(loeschBtn);
  liste.appendChild(li);
});


  // Wiederkehrende Einträge rendern (ohne Löschen-Button, da diese anders verwaltet werden)
  // Wiederkehrende Einträge rendern (ohne Löschen-Button)
gefilterteWiederkehrende.forEach((eintrag) => {
  const li = document.createElement("li");

  const farbe = eintrag.typ === "einnahme" ? "green" : "red";

  // Betrag
  const betragSpan = document.createElement("span");
  betragSpan.textContent = `${eintrag.typ === "einnahme" ? "+ " : "- "}${parseFloat(eintrag.betrag).toFixed(2).replace(".", ",")} €`;
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

  // STATISTIK: Balkendiagramm mit Canvas
  function zeichneStatistik() {
    const canvas = document.getElementById("chart");
    const ctx = canvas.getContext("2d");

    // Kategorien summieren (Saldo)
    const saldoProKategorie = {};
    eintraege.forEach(eintrag => {
      const k = eintrag.kategorie;
      if (!saldoProKategorie[k]) saldoProKategorie[k] = 0;
      saldoProKategorie[k] += (eintrag.typ === "einnahme" ? 1 : -1) * eintrag.betrag;
    });

    // Daten vorbereiten
    const kategorien = Object.keys(saldoProKategorie);
    const werte = kategorien.map(k => saldoProKategorie[k]);

    // Canvas clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (kategorien.length === 0) {
      ctx.font = "16px Arial";
      ctx.fillText("Keine Daten für Statistik", 10, 50);
      return;
    }

    // Balkendiagramm Parameter
    const padding = 50;
    const balkenBreite = 40;
    const maxWert = Math.max(...werte.map(v => Math.abs(v)));

    // Y-Achse skalieren (bis maxWert + etwas Puffer)
    const maxY = maxWert * 1.1;

    // Achsen zeichnen
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    ctx.beginPath();
    // Y-Achse
    ctx.moveTo(padding, padding / 2);
    ctx.lineTo(padding, canvas.height - padding);
    // X-Achse
    ctx.lineTo(canvas.width - padding / 2, canvas.height - padding);
    ctx.stroke();

    // Y-Achsen Werte + Linien (5 Schritte)
    ctx.fillStyle = "#333";
    ctx.font = "12px Arial";
    ctx.textAlign = "right";
    for (let i = 0; i <= 5; i++) {
      const y = padding + ((canvas.height - 2 * padding) / 5) * i;
      const wert = maxY - (maxY / 5) * i;
      ctx.fillText(wert.toFixed(2) + "€", padding - 10, y + 4);

      // Hilfslinien
      ctx.strokeStyle = "#ddd";
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding / 2, y);
      ctx.stroke();
    }

    // Balken zeichnen
    ctx.textAlign = "center";
    kategorien.forEach((kategorie, i) => {
      const wert = werte[i];
      const x = padding + 60 + i * (balkenBreite + 20);
      const yNull = canvas.height - padding;
      const balkenHoehe = (wert / maxY) * (canvas.height - 2 * padding);

      // Balkenfarbe grün bei positiv, rot bei negativ
      ctx.fillStyle = wert >= 0 ? "green" : "red";
      ctx.fillRect(x, yNull - Math.max(0, balkenHoehe), balkenBreite, Math.abs(balkenHoehe));

      // Kategorie unter Balken
      ctx.fillStyle = "#000";
      ctx.font = "14px Arial";
      ctx.fillText(kategorie, x + balkenBreite / 2, yNull + 15);

      // Wert über Balken
      ctx.fillText(wert.toFixed(2) + "€", x + balkenBreite / 2, yNull - Math.abs(balkenHoehe) - 5);
    });
  }

  // Initial rendern
  renderKalender();
  renderListe();

  // Plus-Button & Popup
const plusButton = document.getElementById("plus-button");
const popupOverlay = document.getElementById("popup-overlay");
const popupClose = document.getElementById("popup-close");

plusButton.addEventListener("click", () => {
  popupDatum.value = ausgewaehltesDatum;
  popupOverlay.style.display = "flex";

  // Standardmäßig "Ausgabe" auswählen
  typButtons[1].click(); // Simuliert echten Klick → triggert komplette Logik inkl. Kategorie-Update

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

  popupForm.reset();
  popupOverlay.style.display = "none";
});

// Popup schließen, wenn außerhalb geklickt
popupOverlay.addEventListener("click", (e) => {
  if (e.target === popupOverlay) {
    popupOverlay.style.display = "none";
  }
});
// --- fertig Popup ---
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
  let einnahmen = 0;
  let ausgaben = 0;

  // Normale Einträge laden
  const eintraege = JSON.parse(localStorage.getItem("eintraege")) || [];

  eintraege.forEach(eintrag => {
    const eintragsDatum = new Date(eintrag.datum);
    if (eintragsDatum.getFullYear() === jahr && eintragsDatum.getMonth() === monat) {
      if (eintrag.typ === "einnahme") {
        einnahmen += parseFloat(eintrag.betrag);
      } else if (eintrag.typ === "ausgabe") {
        ausgaben += parseFloat(eintrag.betrag);
      }
    }
  });

  // Wiederkehrende Einträge laden
  const wiederkehrendeEintraege = JSON.parse(localStorage.getItem("wiederkehrendeEintraege")) || [];

  // Für jeden Tag im Monat prüfen, ob wiederkehrende Einträge gelten
  const tageImMonat = new Date(jahr, monat + 1, 0).getDate();

  for (let tag = 1; tag <= tageImMonat; tag++) {
    const datum = new Date(jahr, monat, tag);

    wiederkehrendeEintraege.forEach(wEintrag => {
      const startDatum = new Date(wEintrag.start);
      const endDatum = new Date(wEintrag.ende);
      if (datum >= startDatum && datum <= endDatum) {
        if (istIntervallFuerDatum(wEintrag.intervall, datum)) {
          if (wEintrag.typ === "einnahme") {
            einnahmen += parseFloat(wEintrag.betrag);
          } else if (wEintrag.typ === "ausgabe") {
            ausgaben += parseFloat(wEintrag.betrag);
          }
        }
      }
    });
  }

  // Budget aus localStorage holen
  const userBudgetText = localStorage.getItem('userBudget');
  const userBudget = parseFloat(userBudgetText) || 0;

  // Monatsbudget berechnen (Budget - Ausgaben)
  const monatlichesBudget = userBudget - ausgaben;

  // DOM aktualisieren
  document.getElementById("monat-einnahmen").textContent = einnahmen.toFixed(2) + " €";
  document.getElementById("monat-ausgaben").textContent = ausgaben.toFixed(2) + " €";
  document.getElementById("monat-budget").textContent = monatlichesBudget.toFixed(2) + " €";

  // Optional: Saldo (Einnahmen - Ausgaben)
  const saldoElement = document.getElementById("monat-saldo");
  if (saldoElement) {
    const saldo = einnahmen - ausgaben;
    saldoElement.textContent = saldo.toFixed(2) + " €";
    saldoElement.classList.remove("positiv", "negativ");
    saldoElement.classList.add(saldo >= 0 ? "positiv" : "negativ");
  }

  // Budget-Slider aktualisieren
  const heute = new Date();
  const aktuellerMonat = heute.getMonth();
  const aktuellesJahr = heute.getFullYear();

  const ausgabenProzent = userBudget > 0 ? (ausgaben / userBudget) * 100 : 0;
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
    if (ausgabenProzent <= 100) {
      fillElement.style.backgroundColor = "#a8e6a1";
    } else {
      fillElement.style.backgroundColor = "#f6a6a6";
    }
  }
}



// Textanzeige aktualisieren wie viel % ausgegeben wurde vom Budget
// const textanzeige = document.getElementById("budget-stand-text");
// textanzeige.textContent = `${ausgaben.toFixed(2)} € von ${userBudget.toFixed(2)} € ausgegeben`;




// Budget-Verwaltungs Popup Start
// === Budget Popup Logik ===

// Elemente selektieren
const budgetOverlay = document.getElementById('budget-popup-overlay');
const openBudgetBtn = document.getElementById('open-budget-popup');
const closeBudgetBtn = document.getElementById('budget-close');
const saveBudgetBtn = document.getElementById('save-budget');
const clearBudgetBtn = document.getElementById('clear-budget');
const budgetInput = document.getElementById('budget-input');

// Öffnet das Budget-Popup
if (openBudgetBtn) {
  openBudgetBtn.addEventListener('click', () => {
    const savedBudget = localStorage.getItem('userBudget');
    budgetInput.value = savedBudget || '';
    budgetOverlay.classList.remove('hidden');
  });
}

// Schließt das Budget-Popup
if (closeBudgetBtn) {
  closeBudgetBtn.addEventListener('click', () => {
    budgetOverlay.classList.add('hidden');
  });
}
// Schließt das Popup, wenn man außerhalb des Inhalts klickt
budgetOverlay.addEventListener('click', (e) => {
  if (e.target === budgetOverlay) {
    budgetOverlay.classList.add('hidden');
  }
});


// Budget speichern
saveBudgetBtn.addEventListener('click', () => {
  const value = budgetInput.value.trim();
  if (value && !isNaN(value) && Number(value) > 0) {
    localStorage.setItem('userBudget', value);
    alert(`Budget gespeichert: ${value} €`);
    budgetOverlay.classList.add('hidden');

    // HIER: Monatsübersicht aktualisieren
    const heute = new Date();
    berechneMonatsuebersicht(heute.getFullYear(), heute.getMonth());
    berechneMonatsuebersicht(aktuellesDatum.getFullYear(), aktuellesDatum.getMonth());

  } else {
    alert('Bitte gib ein gültiges Budget ein.');
  }
});


// Budget löschen
if (clearBudgetBtn) {
  clearBudgetBtn.addEventListener('click', () => {
    budgetInput.value = '';
    localStorage.removeItem('userBudget');
    alert('Budget wurde gelöscht.');
  });
}
// Budget-Verwaltungs Popup Ende

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
  const vk = document.getElementById("vk-wiederkehrende");

  let eintraege = [];
  let bearbeiteIndex = null;

  // Daten aus localStorage laden
  const gespeicherte = localStorage.getItem("wiederkehrendeEintraege");
  if (gespeicherte) {
    eintraege = JSON.parse(gespeicherte);
    renderEintraege();
  }

  // Typ Buttons EventListener
  typButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      typInput.value = btn.dataset.typ;
      typButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  openBtn?.addEventListener("click", () => {
    popupOverlay.classList.remove("hidden");
    resetForm();
  });

  closeBtn.addEventListener("click", () => {
    popupOverlay.classList.add("hidden");
    resetForm();
  });

  // Popup schließen, wenn außerhalb (auf Overlay) geklickt wird
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
  const kategorie = document.getElementById("wiederkehrende-kategorie").value.trim();

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



// Übersicht wiederkehrende Zahlungen
function renderEintraege() {
  liste.innerHTML = "";

  eintraege.forEach((eintrag, index) => {
    const li = document.createElement("li");
    li.style.backgroundColor = eintrag.typ === "einnahme" ? "#d4f7d4" : "#f7d4d4";
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

    // Rechte Seite: Buttons in vertikalem Flex-Container
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
editBtn.style.marginRight = "7px";  // Abstand rechts
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
deleteBtn.style.marginRight = "7px";  // Abstand rechts
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



