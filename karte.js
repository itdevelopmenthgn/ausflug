/* Karte der Ausflugsziele (Leaflet + OpenStreetMap) */
(function () {
  "use strict";
  var el = document.getElementById("map");
  if (!el || typeof L === "undefined") return;

  var places = JSON.parse(document.getElementById("places").textContent);
  var col = window.DAYCOL || {};
  var map = L.map(el, { scrollWheelZoom: false, tap: true });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  var markers = places.map(function (p) {
    var icon = L.divIcon({
      className: "pin-wrap",
      html: '<span class="pin" style="--c:' + (col[p.d] || "#d9572b") + '">' + p.e + "</span>",
      iconSize: [34, 34], iconAnchor: [17, 17], popupAnchor: [0, -16]
    });
    var m = L.marker([p.lat, p.lng], { icon: icon, title: p.n });
    var gm = "https://www.google.com/maps/search/?api=1&query=" + p.lat + "," + p.lng;
    m.bindPopup('<strong>' + p.e + " " + p.n + '</strong><br><a href="' + p.u + '">Beschreibung</a> · <a href="' + gm + '" rel="noopener">Google Maps</a>');
    m.day = p.d;
    m.isOstia = p.lat < 41.8;
    return m;
  });

  function show(day) {
    var shown = [];
    markers.forEach(function (m) {
      var on = day === "all" ? !m.isOstia : m.day === day;
      if (on) { m.addTo(map); shown.push(m.getLatLng()); } else { map.removeLayer(m); }
    });
    if (shown.length) map.fitBounds(L.latLngBounds(shown), { padding: [30, 30], maxZoom: 16 });
    document.querySelectorAll(".map-tools [data-day]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-day") === day ? "true" : "false");
    });
  }

  document.querySelectorAll(".map-tools [data-day]").forEach(function (b) {
    b.addEventListener("click", function () { show(b.getAttribute("data-day")); });
  });

  // Direkt zu einem Tag springen: karte.html#tag-28
  var m = location.hash.match(/^#tag-(\d+)$/);
  show(m ? m[1] : "all");
})();
