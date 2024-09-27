var map = L.map("map", {
    center: [18.802808, 98.950170],
    zoom: 15
});

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {});
var Esri_WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
});
var province = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/th/wms?", {
    layers: "th:province_4326",
    format: "image/png",
    transparent: true
})

var basemap = {
    "osm": osm.addTo(map),
    "Esri_WorldTopoMap": Esri_WorldTopoMap
}
var overmap = {
    "จังหวัด": province.addTo(map)
}

L.control.layers(basemap, overmap).addTo(map);


map.on('click', (e) => {
    let myIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/128/9131/9131546.png',
        iconSize: [36, 36],
        iconAnchor: [13, 32],
        popupAnchor: [7, -25]
    })
    removeLayer()
    L.marker(e.latlng, { icon: myIcon, name: "hp" }).addTo(map)
    L.circle(e.latlng, { radius: 1000, name: "hp" }).addTo(map);
    axios.get(`/getdwithin/${e.latlng.lat}/${e.latlng.lng}/1000`)
        .then((res) => {
            res.data.forEach(i => {
                L.geoJSON(JSON.parse(i.json), { name: "hp" })
                    .addTo(map)
                    .bindPopup(i.name);
            })
        });
})

function removeLayer() {
    map.eachLayer((layer) => {
        if (layer.options.name == 'hp') {
            map.removeLayer(layer);
        }
    });
}