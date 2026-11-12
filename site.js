/* Gemeinsame Helfer für alle Seiten – funktioniert auch ohne localStorage */
(function () {
  "use strict";

  // ---- Abhak-Listen (ul.todo mit data-id) ----
  var KEY = "romreise.todo.v1", st = {}, ok = true;
  try { st = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { ok = false; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }

  function updateCounters() {
    document.querySelectorAll("[data-count-for]").forEach(function (el) {
      var box = document.getElementById(el.getAttribute("data-count-for"));
      if (!box) return;
      var all = box.querySelectorAll("input[type=checkbox]"), n = 0;
      all.forEach(function (c) { if (c.checked) n++; });
      el.textContent = n + " von " + all.length + " " + (el.getAttribute("data-label") || "erledigt");
    });
  }

  document.querySelectorAll("ul.todo input[type=checkbox][data-id]").forEach(function (cb) {
    var id = cb.getAttribute("data-id");
    cb.checked = !!st[id];
    cb.addEventListener("change", function () {
      if (cb.checked) st[id] = 1; else delete st[id];
      save(); updateCounters();
    });
  });
  updateCounters();
  if (!ok) document.querySelectorAll(".storage-hint").forEach(function (h) {
    h.textContent = "Hinweis: Speichern ist in diesem Browser nicht möglich – Häkchen gehen beim Neuladen verloren.";
  });

  // ---- Countdown bis Abflug ----
  var cd = document.getElementById("countdown");
  if (cd) {
    var dep = new Date("2026-12-27T07:15:00+01:00").getTime();
    var back = new Date("2027-01-05T18:35:00+01:00").getTime();
    var now = Date.now();
    var sub = document.getElementById("countdown-sub");
    if (now < dep) {
      var days = Math.ceil((dep - now) / 86400000);
      cd.textContent = days === 1 ? "Morgen!" : "Noch " + days + " Tage";
      if (sub) sub.textContent = days > 30 ? "Genug Zeit, um Gelato-Sorten auswendig zu lernen." :
        days > 7 ? "Langsam die Koffer vom Dachboden holen." : "Packlisten-Alarm! 🧳";
    } else if (now < back) {
      cd.textContent = "Ciao Roma!";
      if (sub) sub.textContent = "Ihr seid mittendrin. Viel Spaß – und Gehörschutz nicht vergessen!";
    } else {
      cd.textContent = "Grazie, Roma!";
      if (sub) sub.textContent = "Die Reise ist vorbei. Zeit für die Fotos.";
    }
  }

  // ---- Zeitplan: Tag per Link (#tag-28) direkt aufklappen ----
  function openHash() {
    if (!location.hash) return;
    var el = document.getElementById(location.hash.slice(1));
    if (el && el.tagName === "DETAILS") el.open = true;
  }
  openHash();
  window.addEventListener("hashchange", openHash);

  // ---- Alle aufklappen / zuklappen ----
  document.querySelectorAll("[data-open-all]").forEach(function (b) {
    b.addEventListener("click", function () {
      var open = b.getAttribute("data-open-all") === "1";
      document.querySelectorAll(b.getAttribute("data-target") || "details").forEach(function (d) { d.open = open; });
    });
  });
  document.querySelectorAll("[data-print]").forEach(function (b) {
    b.addEventListener("click", function () { window.print(); });
  });

  // ---- Drucken: alles aufklappen, danach Zustand wiederherstellen ----
  var before = null;
  window.addEventListener("beforeprint", function () {
    var ds = document.querySelectorAll("details");
    before = Array.prototype.map.call(ds, function (d) { return d.open; });
    ds.forEach(function (d) { d.open = true; });
  });
  window.addEventListener("afterprint", function () {
    if (!before) return;
    document.querySelectorAll("details").forEach(function (d, i) { d.open = before[i]; });
    before = null;
  });
})();
