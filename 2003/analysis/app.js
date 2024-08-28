var map = L.map("map", {
    center: [18.80585034537436, 98.9596061077835],
    zoom: 15
});

var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
});

var basemaps = {
    "แผนที่ CartoDB": CartoDB_Positron.addTo(map)
}

var overlay = {}
L.control.layers(basemaps, overlay).addTo(map)


var points = turf.featureCollection([
    turf.point([98.95002855394502, 18.802844016761785], { name: 'คณะสังคมศาสตร์' }),
    turf.point([98.95488110296868, 18.808323272682046], { name: 'ประตูหน้ามหาวิทยาลัย' }),
    turf.point([98.9679061982553, 18.801417011704267], { name: 'แยกเมญ่า' })
]);

points.features.forEach(function (point) {
    L.marker([point.geometry.coordinates[1], point.geometry.coordinates[0]])
        .addTo(map)
        .bindPopup(point.properties.name);
});

var from = points.features[0];
var to = points.features[2];
var options = { units: 'kilometers' };

var distance = turf.distance(from, to, options);
console.log('Distance: ' + distance + ' kilometers');

var buffered = turf.buffer(from, 1, options);

let style = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

L.geoJSON(buffered, style).addTo(map);

var within = turf.pointsWithinPolygon(points, buffered);
console.log(within);
within.features.forEach(function (point) {
    L.circleMarker([point.geometry.coordinates[1], point.geometry.coordinates[0]], {
        radius: 8,
        color: 'red'
    }).addTo(map).bindPopup('Within Buffer: ' + point.properties.name);
});


