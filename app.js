/* Rom-Reise – Packlisten mit localStorage (optional) */
(function () {
  "use strict";

  // ---------- Speicher (funktioniert auch ohne localStorage) ----------
  var KEY = "romreise.v2";
  var state = { checks: {}, names: {} };
  var storageOk = true;
  try {
    var raw = window.localStorage.getItem(KEY) || window.localStorage.getItem("romreise.v1");
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        state.checks = parsed.checks || {};
        state.names = parsed.names || {};
      }
    }
  } catch (e) { storageOk = false; }

  function save() {
    if (!storageOk) return;
    try { window.localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { storageOk = false; showStorageHint(); }
  }
  function showStorageHint() {
    var h = document.getElementById("storage-hint");
    if (h && !storageOk) h.textContent = "Hinweis: Speichern ist in diesem Browser nicht möglich – Häkchen gehen beim Neuladen verloren.";
  }

  // ---------- Personen ----------
  var people = [
    { id: "e1",  name: "Erwachsener 1", age: null, role: "adult", emoji: "🧑" },
    { id: "e2",  name: "Erwachsener 2", age: null, role: "adult", emoji: "🧑" },
    { id: "k16", name: "Kind (16 J.)",  age: 16, role: "teen",  emoji: "🧑‍🎓" },
    { id: "k13", name: "Kind (13 J.)",  age: 13, role: "teen",  emoji: "🧒" },
    { id: "k10", name: "Kind (10 J.)",  age: 10, role: "kid",   emoji: "🧒" },
    { id: "k7",  name: "Kind (7 J.)",   age: 7,  role: "kid",   emoji: "🧒" },
    { id: "k1",  name: "Kleinkind (1 J.)", age: 1, role: "baby", emoji: "👶" }
  ];
  function nameOf(p) { return state.names[p.id] || p.name; }
  function ageLabel(p) { return p.age === null ? "Erwachsen" : p.age + " " + (p.age === 1 ? "Jahr" : "Jahre"); }

  // ---------- Packlisten-Inhalte (nach der Familien-Packliste „9 Nächte“) ----------
  // Ein Eintrag ist "Text" oder ["Text", "Hinweis"].
  // Eine Gruppe ist [Titel, Einträge] – mit drittem Element true ist sie ein Vorschlag (nicht auf der Originalliste).
  var VORSCHLAG = "＋ Vorschlag (nicht auf eurer Liste)";

  function personBags(p) {
    var baby = p.role === "baby";
    var adult = p.role === "adult";
    var teen = p.role === "teen";
    var kid = p.role === "kid";

    if (baby) {
      return [
        { title: "🧳 Handgepäck-Koffer", note: "Falls die Airline fürs Kleinkind keinen eigenen Koffer erlaubt: auf die Koffer der Eltern verteilen.", groups: [
          ["Kleidung & Draußen", [
            ["Overall", "am Reisetag anziehen"],
            "Jacke",
            "Mütze",
            "Booties",
            "Schuhe"
          ]],
          [VORSCHLAG, [
            ["Bodys, Hosen, Pullis & Schlafsachen für 9 Nächte", "auf der Liste stehen nur 3 Outfits in der Wickeltasche"],
            "Handschuhe / Schal fürs Kleinkind"
          ], true]
        ]},
        { title: "🎒 Wickeltasche (tragen die Eltern)", groups: [
          ["Wickeltasche", [
            ["15 Windeln", "Nachschub im großen Koffer bzw. vor Ort kaufen"],
            "Feuchttücher",
            "Putztücher",
            ["Handdesinfektionsmittel", "≤ 100 ml, in den Flüssigkeitsbeutel"],
            ["Windschutzcreme", "≤ 100 ml"],
            "3 komplette Outfits",
            ["Essen", "Babynahrung darf über 100 ml – bei der Kontrolle vorzeigen"],
            "Wasser",
            "Milch",
            "2 Flaschen",
            "Thermobecher",
            "Spucktücher",
            "Wickelunterlage (Einweg)"
          ]],
          ["Unterwegs (kein Koffer)", [
            ["Trage", "für Ruinen, Treppen, Gedränge"],
            ["Buggy", "meist kostenlos bis zum Gate"],
            "Stillcape"
          ]],
          [VORSCHLAG, [
            ["Kinderreisepass / Personalausweis", "Pflicht auch für Babys"],
            "Krankenversicherungskarte",
            ["Kapsel-Gehörschutz für Babys", "Silvester, Neujahrsparade, Mittagsschuss"],
            "Kuscheltier / Schnuller"
          ], true]
        ]}
      ];
    }

    // Kleidung laut Liste – für alle außer dem Kleinkind
    var kleidung = [
      ["5× Unterhose", "9 Nächte → einmal waschen (Waschmittel im großen Koffer)"],
      "Socken",
      "2× Unterhemd",
      p.id === "e2" ? ["6× Still-BH", "für die stillende Person"] : null,
      "5× Pullover",
      "4× Hose",
      "1× Stoffhose",
      "Stoffjacke",
      "Schlafanzug"
    ].filter(Boolean);

    var handgepaeck = { title: "🧳 Handgepäck-Koffer", groups: [
      ["Kleidung", kleidung],
      [VORSCHLAG, [
        ["Warme Jacke", "am Reisetag anziehen"],
        ["Bequeme Schuhe mit griffiger Sohle", "Kopfsteinpflaster wird bei Regen rutschig"],
        "Mütze, Handschuhe, Schal"
      ], true]
    ]};

    var rucksack = [
      ["Ein Outfit zum Wechseln", "falls der Koffer nicht ankommt oder etwas kleckert"],
      "Snack-Box",
      ["Wasser", "Flasche leer durch die Kontrolle, danach füllen"],
      ["Kaugummi", "hilft beim Druckausgleich"],
      "Feuchttücher",
      "Tempos",
      ["Handdesinfektionsmittel", "≤ 100 ml, in den Flüssigkeitsbeutel"],
      kid || teen ? "Hörspiel / Musik" : "Musik",
      "Kopfhörer",
      "evtl. Decke",
      "evtl. Nackenkissen"
    ];
    if (kid) rucksack.push("Malheft", "Schleich-Tiere", "Autos", "Kuscheltier");
    if (adult) rucksack.push("Salami", ["Käse", "Hartkäse ist ok – Streichkäse zählt als Flüssigkeit"]);

    var vorschlag = [];
    vorschlag.push(["Personalausweis / Reisepass", "Gültigkeit prüfen"]);
    vorschlag.push("Krankenversicherungskarte (EHIC)");
    if (adult) vorschlag.push("Geldbörse, Karten, Bargeld", ["Buchungen & Tickets (Flug, Unterkunft, Kolosseum)", "offline speichern"], ["Persönliche Medikamente", "nie ins Aufgabegepäck"]);
    if (adult || teen) vorschlag.push("Handy", ["Powerbank", "NUR im Rucksack/Handgepäck, nie im großen Koffer"]);
    if (kid || teen) vorschlag.push(["Zettel mit Handynummer + Unterkunft", "in die Jackentasche"]);
    vorschlag.push(["Gehörschutz / Ohrstöpsel", "Silvester & Neujahrsparade"]);

    return [handgepaeck, { title: "🎒 Kleiner Rucksack", groups: [
      ["Rucksack", rucksack],
      [VORSCHLAG, vorschlag, true]
    ]}];
  }

  var sharedLists = [
    {
      id: "gross", emoji: "🧳", name: "Großer Koffer (gemeinsam)", sub: "Aufgabegepäck – laut eurer Liste „Koffer“",
      bags: [
        { title: "🧴 Pflege & Hygiene", groups: [
          ["Kulturbeutel", [
            ["Kulturbeutel", "hier gilt keine 100-ml-Grenze"],
            "Elektrische Zahnbürsten",
            "Bürste",
            "Make-up-Tasche"
          ]],
          ["Hygiene-Tasche", [
            "Waschmittel",
            "Spültabs",
            "Putztücher (Flasche, Boden)",
            "Sagrotan"
          ]]
        ]},
        { title: "💊 Erste-Hilfe-Tasche", groups: [
          ["Medikamente", [
            "Durchfallmittel",
            "Hustenbonbons",
            "Kopfschmerztabletten",
            ["Fiebersaft", "eine kleine Flasche auch in die Wickeltasche"],
            "Salben"
          ]],
          ["Material", [
            "Mini-Inhalator mit Salzwasser",
            "Pflaster",
            "Klammerpflaster",
            "Sprühpflaster",
            "Thermometer"
          ]]
        ]},
        { title: "🍞 Essen & Ergänzung", groups: [
          ["Portioniert", [
            "Nahrungsergänzungsmittel (portioniert)",
            "Pulvertüten (portioniert)"
          ]],
          ["Vorrat", [
            "Brotdosen",
            "Süßigkeiten",
            "Tütensuppen"
          ]]
        ]},
        { title: "👶 Kleinkind & Wetter", groups: [
          ["Kleinkind", [
            "Töpfchen",
            ["Windeln", "Vorrat – gibt es auch in jedem Supermarkt"],
            "Unterlagen",
            ["Fußsack", "für den Buggy – bei der Parade und abends wichtig"],
            "Schlafsack"
          ]],
          ["Wetter", ["Regencape"]],
          ["Technik", [
            ["Kabeltasche", "Powerbanks NICHT hier, sondern im Rucksack"],
            ["Adapter", "Italien: Typ L – Eurostecker passen meist, Schuko oft nicht"]
          ]]
        ]}
      ]
    },
    {
      id: "tag", emoji: "☀️", name: "Tagesausflug-Check", sub: "Jeden Morgen vor dem Losgehen – mit „Liste leeren“ zurücksetzen",
      bags: [
        { title: "🎒 Bevor es losgeht", groups: [
          ["Versorgung", [
            "Snack-Boxen gefüllt",
            ["Wasserflaschen gefüllt", "Trinkbrunnen (Nasoni) überall – Wasser ist trinkbar"],
            "Feuchttücher, Tempos, Handdesinfektion"
          ]],
          ["Kleinkind", [
            ["Wickeltasche aufgefüllt", "Windeln, Outfits, Essen, Milch, Flaschen"],
            "Trage und/oder Buggy mit Fußsack",
            "Stillcape"
          ]],
          ["Wetter", [
            "Regencape",
            "Mützen, Handschuhe, Schals"
          ]],
          ["Wertsachen & Sicherheit", [
            "Ausweise / Tickets für heute",
            "Geldbörse, Handys geladen + Powerbank",
            "Gehörschutz (wenn es laut wird)",
            "Treffpunkt ausgemacht"
          ]]
        ]}
      ]
    }
  ];

  // ---------- Rendering ----------
  function slug(s) {
    return s.toLowerCase().replace(/[^a-z0-9äöüß]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
  }
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "text") n.textContent = attrs[k];
      else if (k === "class") n.className = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    (children || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }

  var registry = []; // { listId, ids[], details, bar, progress }

  function renderList(container, cfg) {
    var ids = [];
    var nameSpan = el("span", { class: "name", text: cfg.name });
    if (cfg.person) {
      nameSpan.setAttribute("contenteditable", "true");
      nameSpan.setAttribute("spellcheck", "false");
      nameSpan.setAttribute("title", "Zum Umbenennen antippen");
      nameSpan.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); });
      nameSpan.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { e.preventDefault(); nameSpan.blur(); }
        e.stopPropagation();
      });
      nameSpan.addEventListener("keyup", function (e) { e.preventDefault(); });
      nameSpan.addEventListener("blur", function () {
        var v = nameSpan.textContent.trim();
        if (!v) { v = cfg.person.name; nameSpan.textContent = v; }
        if (v === cfg.person.name) delete state.names[cfg.person.id]; else state.names[cfg.person.id] = v;
        save();
        renderPeople();
      });
    }
    var progress = el("span", { class: "progress" });
    var summary = el("summary", null, [
      el("span", { class: "emoji", text: cfg.emoji, "aria-hidden": "true" }),
      el("span", { class: "ttl" }, [nameSpan, el("span", { class: "sub", text: cfg.sub })]),
      progress
    ]);
    var barFill = el("i");
    var bar = el("div", { class: "bar" }, [barFill]);
    var bagsWrap = el("div", { class: "bags" });

    cfg.bags.forEach(function (bag, bi) {
      var b = el("div", { class: "bag" }, [el("h4", { text: bag.title })]);
      if (bag.note) b.appendChild(el("p", { class: "hint", text: bag.note }));
      bag.groups.forEach(function (g) {
        var items = g[1];
        if (!items.length) return;
        b.appendChild(el("p", { class: "list-group-title" + (g[2] ? " suggest" : ""), text: g[0] }));
        var ul = el("ul");
        items.forEach(function (it) {
          var text = Array.isArray(it) ? it[0] : it;
          var note = Array.isArray(it) ? it[1] : "";
          var id = cfg.id + ":" + bi + ":" + slug(text);
          ids.push(id);
          var cb = el("input", { type: "checkbox" });
          cb.checked = !!state.checks[id];
          cb.addEventListener("change", function () {
            if (cb.checked) state.checks[id] = 1; else delete state.checks[id];
            save(); update();
          });
          var span = el("span", { text: text });
          if (note) { span.appendChild(document.createElement("br")); span.appendChild(el("span", { class: "note", text: note })); }
          ul.appendChild(el("li", null, [el("label", null, [cb, span])]));
        });
        b.appendChild(ul);
      });
      bagsWrap.appendChild(b);
    });

    var resetBtn = el("button", { type: "button", text: "Liste leeren" });
    var details = el("details", { class: "plist", id: "liste-" + cfg.id }, [
      summary, bar, bagsWrap, el("div", { class: "plist-foot" }, [resetBtn])
    ]);
    resetBtn.addEventListener("click", function () {
      if (!window.confirm("Alle Häkchen in „" + nameSpan.textContent + "“ entfernen?")) return;
      ids.forEach(function (id) { delete state.checks[id]; });
      details.querySelectorAll("input[type=checkbox]").forEach(function (c) { c.checked = false; });
      save(); update();
    });

    function update() {
      var done = ids.filter(function (id) { return state.checks[id]; }).length;
      progress.textContent = done + " / " + ids.length + (done === ids.length ? " ✓" : "");
      barFill.style.width = (ids.length ? (done / ids.length) * 100 : 0) + "%";
      details.classList.toggle("complete", done === ids.length && ids.length > 0);
    }
    update();
    registry.push({ details: details, ids: ids, update: update });
    container.appendChild(details);
  }

  function renderPeople() {
    var ul = document.getElementById("people-list");
    if (!ul) return;
    ul.innerHTML = "";
    people.forEach(function (p) {
      ul.appendChild(el("li", null, [el("span", { text: p.emoji + " " + nameOf(p) }), el("span", { text: ageLabel(p) })]));
    });
  }

  var root = document.getElementById("lists");
  root.appendChild(el("p", { class: "list-group-title", text: "Gemeinsam" }));
  sharedLists.forEach(function (l) { renderList(root, l); });
  root.appendChild(el("p", { class: "list-group-title", text: "Pro Person – Handgepäck-Koffer + Rucksack" }));
  people.forEach(function (p) {
    renderList(root, {
      id: p.id, emoji: p.emoji, name: nameOf(p), person: p,
      sub: ageLabel(p) + (p.role === "baby" ? " · Kinderwagen + Trage separat" : ""),
      bags: personBags(p)
    });
  });
  renderPeople();
  showStorageHint();

  // ---------- Werkzeuge ----------
  function setAll(open) { registry.forEach(function (r) { r.details.open = open; }); }
  document.getElementById("expand-all").addEventListener("click", function () { setAll(true); });
  document.getElementById("collapse-all").addEventListener("click", function () { setAll(false); });
  document.getElementById("print-btn").addEventListener("click", function () { window.print(); });
  document.getElementById("reset-all").addEventListener("click", function () {
    if (!window.confirm("Wirklich alle Häkchen in allen Listen entfernen? (Namen bleiben erhalten)")) return;
    state.checks = {};
    document.querySelectorAll("#lists input[type=checkbox]").forEach(function (c) { c.checked = false; });
    registry.forEach(function (r) { r.update(); });
    save();
  });

  // Beim Drucken alle Listen aufklappen, danach Zustand wiederherstellen
  var openBefore = null;
  window.addEventListener("beforeprint", function () {
    openBefore = registry.map(function (r) { return r.details.open; });
    setAll(true);
  });
  window.addEventListener("afterprint", function () {
    if (openBefore) registry.forEach(function (r, i) { r.details.open = openBefore[i]; });
    openBefore = null;
  });
})();
