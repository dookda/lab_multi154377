var map = L.map('map', {
    center: [18.802801, 98.950266],
    zoom: 15
});

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {});
var gmap = L.tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {})
var gsat = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {})
var cm_amphoe = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/CM/wms?", {
    layers: 'CM:amphoe_cm',
    format: 'image/png',
    transparent: true,
    // attribution: "Weather data © 2012 IEM Nexrad"
});

var baseMaps = {
    "แผนที่ osm": osm,
    "แผนที่ gmap": gmap,
    "แผนที่ภาพจากดาวเทียม": gsat.addTo(map)
}

var fc = L.featureGroup()

var overlayMaps = {
    "ขอบเขตอำเภอ": cm_amphoe.addTo(map),
    "หัวใจ": fc
}

L.control.layers(baseMaps, overlayMaps).addTo(map)
L.control.scale().addTo(map)

var style = {
    color: 'red',
    fillColor: '#A2CA71',
    opacity: 0.5
}
var poly = L.geoJSON(polygon, style).addTo(fc)

var vill = L.geoJSON(village, {}).addTo(fc)

map.on('click', (event) => {
    console.log(event.latlng)
    document.getElementById("mapClick").value = event.latlng
})

map.on('zoomend', (event) => {
    document.getElementById("mapZoom").value = map.getZoom()
})

map.on('moveend', () => {
    let center = map.getCenter();
    let bounds = map.getBounds();
    console.log(center.lat, center.lng);
    console.log(bounds);

    document.getElementById("mapCenter").value = (center.lat).toFixed(2) + ", " + (center.lng).toFixed(2);
})

let myIcon = L.icon({
    iconUrl: './gps.png',
    iconSize: [36, 36],
    iconAnchor: [13, 32],
    popupAnchor: [7, -25]
})

let marker = L.marker([18.802801, 98.950266], { icon: myIcon, draggable: true })
    .addTo(map)
    .bindPopup("hello  :) <br> geo cmu <br> <img src='./happy-face.png' width='60px'>")

marker.on('dragend', (e) => {
    console.log(e.target.getLatLng())
    const latLng = e.target.getLatLng()
    document.getElementById("markerDrop").value = (latLng.lat).toFixed(2) + ", " + (latLng.lng).toFixed(2)
})