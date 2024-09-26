var map = L.map("map", {
    center: [18.78785492228646, 98.9861297607422],
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

map.on('click', (e) => {
    console.log(e.latlng);
    removeLayer();
    L.circle(e.latlng, { radius: 1000, name: "hp" }).addTo(map);
    let myIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/128/9131/9131546.png',
        iconSize: [36, 36],
        iconAnchor: [13, 32],
        popupAnchor: [7, -25]
    })

    L.marker(e.latlng, { icon: myIcon, name: "hp" }).addTo(map)
    axios.get(`/getdwithin/${e.latlng.lat}/${e.latlng.lng}/1000`)
        .then((res) => {
            const points = res.data.map(i => turf.point([i.lng, i.lat]));
            const targetPoint = turf.point([e.latlng.lng, e.latlng.lat]);
            var nearest = turf.nearestPoint(targetPoint, turf.featureCollection(points));
            L.geoJSON(nearest.geometry, { name: "hp" })
                .addTo(map)
                .bindPopup('ใกล้ที่สุด').openPopup();

            res.data.forEach(i => {
                L.geoJSON(JSON.parse(i.json), { name: "hp" })
                    .addTo(map)
                    .bindPopup(i.name);
            })
            console.log(res);
        });
})

function removeLayer() {
    map.eachLayer((layer) => {
        if (layer.options.name == 'hp') {
            map.removeLayer(layer);
        }
    });
}

