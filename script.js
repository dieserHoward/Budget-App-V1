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

    // Erster Tag des Monats (Wochentag: 0=Sonntag)
    const ersterWochentag = new Date(jahr, monat, 1).getDay();
    // Umrechnung auf Montag=0
    const startIndex = (ersterWochentag + 6) % 7;

    // Anzahl Tage im Monat
    const tageImMonat = new Date(jahr, monat + 1, 0).getDate();

    // Leerfelder vor Monatsbeginn
    for(let i = 0; i < startIndex; i++) {
      const leer = document.createElement("div");
      leer.className = "leer";
      kalender.appendChild(leer);
    }

    // Heute zum Vergleich
    const heuteStr = formatDate(new Date());

    // Tage rendern
    for(let tag=1; tag <= tageImMonat; tag++) {
      const tagDiv = document.createElement("div");
      tagDiv.className = "tag";
      const tagDatum = new Date(jahr, monat, tag);
      const tagDatumStr = formatDate(tagDatum);

      // Tagnummer anzeigen
      tagDiv.textContent = tag;

      // Markiere heute
      if(tagDatumStr === heuteStr) {
        tagDiv.classList.add("heute");
      }
      // Markiere ausgewählten Tag
      if(tagDatumStr === ausgewaehltesDatum) {
        tagDiv.classList.add("ausgewaehlt");
      }

      // Saldo für Tag berechnen
      const saldo = berechneSaldoFuerDatum(tagDatumStr);
      if(saldo !== 0) {
        const saldoSpan = document.createElement("span");
        saldoSpan.className = "saldo " + (saldo > 0 ? "positiv" : "negativ");
        saldoSpan.textContent = (saldo > 0 ? "+" : "") + saldo.toFixed(2) + " €";
        tagDiv.appendChild(document.createElement("br"));
        tagDiv.appendChild(saldoSpan);
      }

      // Klick auf Tag: auswählbar
tagDiv.addEventListener("click", () => {
  ausgewaehltesDatum = tagDatumStr;
  renderKalender();
  renderListe();

  // NEU: Datum in beide Formulare eintragen
  datumInput.value = ausgewaehltesDatum;
  popupDatum.value = ausgewaehltesDatum;

  

});



      kalender.appendChild(tagDiv);
    }

      // Leerfelder nach Monatsende, damit Raster vollständig ist (7 Spalten)
  const gesamtFelder = startIndex + tageImMonat;
  const restFelder = gesamtFelder % 7 === 0 ? 0 : 7 - (gesamtFelder % 7);
  for(let i=0; i < restFelder; i++) {
    const leer = document.createElement("div");
    leer.className = "leer";
    kalender.appendChild(leer);
  }

  // 🟢 Monatsübersicht aktualisieren
  berechneMonatsuebersicht(jahr, monat);
}

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



  // Saldo für Datum (Einnahmen - Ausgaben)
  function berechneSaldoFuerDatum(datumStr) {
  const eintraege = JSON.parse(localStorage.getItem('eintraege')) || [];
  let saldo = 0;

  eintraege.forEach(eintrag => {
    if (eintrag.datum === datumStr) {
      if (eintrag.typ === "einnahme") {
        saldo += parseFloat(eintrag.betrag);
      } else if (eintrag.typ === "ausgabe") {
        saldo -= parseFloat(eintrag.betrag);
      }
    }
  });

  return saldo;
}

function ladeEintraege() {
  const gespeicherte = localStorage.getItem('eintraege');
  return gespeicherte ? JSON.parse(gespeicherte) : [];
}

  // Liste der Einträge für ausgewählten Tag rendern
  function renderListe() {
  liste.innerHTML = "";

  const eintraege = ladeEintraege();

  const gefilterte = eintraege.filter(e => e.datum === ausgewaehltesDatum);

  if (gefilterte.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Keine Einträge für diesen Tag.";
    liste.appendChild(li);
    return;
  }

  gefilterte.forEach((eintrag, indexGefiltert) => {
    const li = document.createElement("li");

    const text = `${eintrag.typ === "einnahme" ? "+" : "-"}${eintrag.betrag.toFixed(2)} € — ${eintrag.kategorie}`;
    const spanText = document.createElement("span");
    spanText.textContent = text;
    spanText.style.color = eintrag.typ === "einnahme" ? "green" : "red";

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
      berechneMonatsuebersicht(aktuellesDatum.getFullYear(), aktuellesDatum.getMonth()); // neu
      renderKalender();
      renderListe();
    }
  }
});

    li.appendChild(spanText);
    li.appendChild(loeschBtn);
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
    const betrag = parseFloat(betragInput.value);
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
  const betrag = parseFloat(popupBetrag.value);
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

  eintraege.forEach(eintrag => {
    const eintragsDatum = new Date(eintrag.datum);
    if (eintragsDatum.getFullYear() === jahr && eintragsDatum.getMonth() === monat) {
      if (eintrag.typ === "einnahme") {
        einnahmen += eintrag.betrag;
      } else if (eintrag.typ === "ausgabe") {
        ausgaben += eintrag.betrag;
      }
    }
  });

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
  // Budget-Slider 
  // Budget und Ausgaben als Prozent
 // Annahme: 'monat' und 'jahr' sind definiert für den angezeigten Monat/Jahr
const heute = new Date();
const aktuellerMonat = heute.getMonth();
const aktuellesJahr = heute.getFullYear();

const ausgabenProzent = userBudget > 0 ? (ausgaben / userBudget) * 100 : 0;
const fillElement = document.getElementById("budget-bar-fill");
fillElement.style.width = Math.min(ausgabenProzent, 100) + "%";  // Max 100%

const zeitMarker = document.getElementById("budget-time-marker");

// Zeitlicher Fortschritt nur setzen, wenn aktueller Monat
if (monat === aktuellerMonat && jahr === aktuellesJahr) {
  const aktuellerTag = heute.getDate();
  const tageImMonat = new Date(jahr, monat + 1, 0).getDate();
  const zeitFortschrittProzent = (aktuellerTag / tageImMonat) * 100;
  zeitMarker.style.left = `${Math.min(zeitFortschrittProzent, 100)}%`;

  if (ausgabenProzent <= zeitFortschrittProzent) {
    fillElement.style.backgroundColor = "#a8e6a1"; // hellgrün
  } else {
    fillElement.style.backgroundColor = "#f6a6a6"; // hellrot
  }
} else {
  // Für andere Monate: Kein Zeitmarker (oder optional ausblenden)
  zeitMarker.style.left = `100%`; // Oder: zeitMarker.style.display = "none";

  // Grün, wenn Budget nicht überschritten, sonst rot
  if (ausgabenProzent <= 100) {
    fillElement.style.backgroundColor = "#a8e6a1"; // hellgrün
  } else {
    fillElement.style.backgroundColor = "#f6a6a6"; // hellrot
  }
}




// Textanzeige aktualisieren wie viel % ausgegeben wurde vom Budget
// const textanzeige = document.getElementById("budget-stand-text");
// textanzeige.textContent = `${ausgaben.toFixed(2)} € von ${userBudget.toFixed(2)} € ausgegeben`;

}


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
const popupBetragInput = document.getElementById("popup-betrag");
const vk = document.getElementById("virtual-keyboard");
const vkButtons = vk.querySelectorAll(".vk-btn");
const vkOk = document.getElementById("vk-ok");
const vkBackspace = document.getElementById("vk-backspace");
const vkEqual = document.getElementById("vk-equal");

// Öffne virtuelle Tastatur wenn Input fokussiert wird
popupBetragInput.addEventListener("click", () => {
  vk.style.display = "block";
});


// Buttons belegen
vkButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.id === "vk-ok") {
      vk.style.display = "none";
      popupBetragInput.blur();
      return;
    }

    if (btn.id === "vk-backspace") {
      popupBetragInput.value = popupBetragInput.value.slice(0, -1);
      return;
    }

    if (btn.id === "vk-equal") {
      try {
        // Für Berechnung: Komma zu Punkt tauschen
        let expr = popupBetragInput.value
          .replace(/×/g, "*")
          .replace(/÷/g, "/")
          .replace(/,/g, ".");

        let result = Function(`"use strict"; return (${expr})`)();

        if (typeof result === "number" && !isNaN(result)) {
          // Ergebnis als String, Punkt zurück zu Komma
          popupBetragInput.value = result.toFixed(2).replace(".", ",");
        }
      } catch (e) {
        alert("Ungültiger Ausdruck");
      }
      return;
    }

    // Beim Eingeben: Zeichen so in den Input einfügen wie sie auf Button sind (Komma bleibt Komma)
    popupBetragInput.value += btn.textContent;
  });
});
// Virtuelle Tastatur für mobile Geräte Ende

