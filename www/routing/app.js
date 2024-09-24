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
var start;
var end;
function onLocationFound(e) {
    // console.log(e);
    start = e.latlng;
    var gps = L.marker(e.latlng, { draggable: true });
    gps.addTo(map).bindPopup("คุณอยู่ที่นี่").openPopup();

    var circle = L.circle(e.latlng, { radius: e.accuracy });
    circle.addTo(map)
    start = e.latlng;
}

function onLocationError(e) {
    console.log(e)
}

map.on("locationfound", onLocationFound)
map.on("locationerror", onLocationError)

map.on("click", (e) => {
    removeLayer();
    // console.log(e.latlng);
    end = e.latlng
    L.marker(e.latlng, { name: 'dang' })
        .addTo(map)
        .bindPopup("<button class='btn btn-success' onclick='getRoute()' >ค้นหาเส้นทาง</button>")

    console.log(start, end);
})

function getRoute() {
    window.open(`https://www.google.com/maps/dir/${start.lat},${start.lng}/${end.lat},${end.lng}`, '_blank')
}

function removeLayer() {
    map.eachLayer((i) => {
        // console.log(i);
        if (i.options.name == 'dang') {
            map.removeLayer(i)
        }
    })
}