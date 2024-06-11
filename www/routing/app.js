var map = L.map("map", {
    // scrollWheelZoom: false,
    center: [18.802808, 98.950170],
    zoom: 15
});
//basemap
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
});

var OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
});

//overlaymap
var province = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/th/wms?", {
    layers: "th:province_4326",
    format: "image/png",
    transparent: true
})

var amphoe = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/th/wms?", {
    layers: "th:amphoe_4326",
    format: "image/png",
    transparent: true
})

var baseMap = {
    "แผนที่ OSM": osm,
    "แผนที่ OSM HOT": OpenStreetMap_HOT.addTo(map)
}

var overLaymap = {
    "ขอบเขตจังหวัด": province.addTo(map),
    "ขอบเขตอำเภอ": amphoe.addTo(map)
}

L.control.layers(baseMap, overLaymap).addTo(map)

function rmLyr() {
    map.eachLayer(lyr => {
        if (lyr.options.name == "dest") {
            map.removeLayer(lyr)
        }
    });
}

function goRoute() {
    console.log(start, end)
    window.open(
        `https://www.google.com/maps/dir/${start.lat},${start.lng}/${end.lat},${end.lng}`,
        "_blank");
}
var start = L.latLng(18.802279095186158, 98.96749412237442);
// L.marker(start, { name: "start", draggable: true }).addTo(map);

// function onLocationFound(e) {
//     console.log(e);
//     start = e.latlng;
//     var radius = e.accuracy;
//     var gps = L.marker(e.latlng, { name: "start", draggable: true });
//     gps.addTo(map).bindPopup("คุณอยู่ที่นี่").openPopup();
// }

// map.locate({ setView: true, maxZoom: 16 });
// map.on("locationfound", onLocationFound);

let route = L.Routing.control({
    waypoints: [
        start,
        L.latLng(18.802825704128704, 98.95021314578972)
    ],
    routeWhileDragging: true
}).addTo(map);

var end = null;
map.on("click", function (e) {
    rmLyr();
    end = e.latlng;
    var mk = L.marker(e.latlng, { name: "dest", draggable: true }).addTo(map)
    mk.bindPopup(`<b>หาเส้นทางมายังที่นี่ !</b><br>
        <button onclick="goRoute()">ok</button>`).openPopup();

    route.spliceWaypoints(1, 1, e.latlng);
});





