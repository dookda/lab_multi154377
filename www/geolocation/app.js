var map = L.map("map", {
    center: [18.802808, 98.950170],
    zoom: 15
});

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {});

var province = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/th/wms?", {
    layers: "th:province_4326",
    format: "image/png",
    transparent: true
})

var basemap = {
    "osm": osm.addTo(map)
}
var overmap = {
    "จังหวัด": province.addTo(map)
}

L.control.layers(basemap, overmap).addTo(map);

map.locate({ setView: true, maxZoom: 18 })

function onLocationFound(e) {
    console.log(e.accuracy);
    var gps = L.marker(e.latlng, { draggable: true });
    gps.addTo(map).bindPopup("คุณอยู่ทที่นี่").openPopup();

    var circle = L.circle(e.latlng, { radius: e.accuracy });
    circle.addTo(map)
}

function onLocationError(e) {
    console.log(e)
}

map.on("locationfound", onLocationFound)
map.on("locationerror", onLocationError)