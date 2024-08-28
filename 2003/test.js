var map = L.map("map", {
    center: [18.802808, 98.950170],
    zoom: 12
})
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '<a href="https://www.openstreetmap.org">OpenStreetMap</a>'
})
var province = L.tileLayer.wms('https://rti2dss.com:8443/geoserver/th/wms?', {
    layers: "th:province_4326",
    format: "image/png",
    transparent: true
})
var baseMap = {
    "OpenStreetMap": osm.addTo(map)
}
var overlayMap = {
    "province": province.addTo(map)
}
L.control.layers(baseMap, overlayMap).addTo(map)

$.get("./test.geojson").done((r) => {
    console.log(r)
    L.marker([r.geometry.coordinates[1], r.geometry.coordinates[0]]).addTo(map)
})