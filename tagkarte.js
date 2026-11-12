/* Tageskarten im Zeitplan: fest eingezeichnete Fußroute pro Tag (Daten in routen.js) */
(function () {
  "use strict";
  if (typeof L === "undefined" || !window.ROUTEN) return;

  var COL = { "27": "#e4572e", "28": "#8e44ad", "29": "#c0392b", "30": "#16a085", "31": "#2f7da8",
              "1": "#d4a017", "2": "#d35400", "3": "#27ae60", "4": "#34495e", "5": "#e84393" };
  var EVENING = "#1f2a44";

  function pin(html, color, cls) {
    return L.divIcon({ className: "pin-wrap", html: '<span class="pin ' + (cls || "") + '" style="--c:' + color + '">' + html + "</span>",
                       iconSize: [34, 34], iconAnchor: [17, 17], popupAnchor: [0, -16] });
  }

  function build(box) {
    if (box._map) { box._map.invalidateSize(); return; }
    var day = box.getAttribute("data-day");
    var segs = window.ROUTEN[day];
    if (!segs) return;
    var map = L.map(box, { scrollWheelZoom: false, tap: true });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var bounds = [], n = 0;
    segs.forEach(function (seg, si) {
      var evening = si > 0;
      var color = evening ? EVENING : (COL[day] || "#d9572b");
      L.polyline(seg.line, { color: "#fff", weight: 9, opacity: .9 }).addTo(map);
      L.polyline(seg.line, { color: color, weight: 5, opacity: .95, dashArray: evening ? "8 9" : null }).addTo(map);
      seg.line.forEach(function (p) { bounds.push(p); });
      var seen = {};
      seg.marks.forEach(function (m) {
        var key = m.lat + "," + m.lng;
        if (seen[key]) return;           // Start = Ende nur einmal zeigen
        seen[key] = 1;
        var html, cls;
        if (m.k === "s") { html = m.e; cls = "stop"; }
        else { n++; html = '<b class="num">' + n + "</b>" + m.e; cls = "num-pin"; }
        L.marker([m.lat, m.lng], { icon: pin(html, color, cls), title: m.n })
          .bindPopup("<strong>" + (m.k === "s" ? "" : n + ". ") + m.e + " " + m.n + "</strong>")
          .addTo(map);
      });
    });
    map.fitBounds(L.latLngBounds(bounds), { padding: [24, 24] });
    box._map = map;
  }

  document.querySelectorAll("details.day").forEach(function (d) {
    var box = d.querySelector(".daymap");
    if (!box) return;
    if (d.open) build(box);
    d.addEventListener("toggle", function () { if (d.open) setTimeout(function () { build(box); }, 30); });
  });
})();
